import _ from 'lodash';

const hasNonHumanPoweredLeg = legs =>
  legs.some(leg => leg.mode !== 'WALK' && leg.mode !== 'BIKE');
const mobileDevice = /Mobi|Android/i.test(navigator.userAgent);
export const shouldShowAppDeepLink = (config, legs) => {
  return (
    mobileDevice && hasNonHumanPoweredLeg(legs) && config.appInstallDeepLinkBase
  );
};
export const shouldShowAppEmailLink = (config, legs) => {
  return (
    !mobileDevice &&
    hasNonHumanPoweredLeg(legs) &&
    config.appInstallDeepLinkBase
  );
};
const getFrom = itinerary => {
  const firstLegFrom = _.chain(itinerary.legs)
    .first()
    .get('from')
    .value();
  if (!firstLegFrom) {
    return null;
  }
  const fromName = firstLegFrom.name;
  const latLon = `${firstLegFrom.lat},${firstLegFrom.lon}`;
  return `${fromName}::${latLon}`;
};
const getTo = itinerary => {
  const lastLegTo = _.chain(itinerary.legs)
    .last()
    .get('to')
    .value();
  if (!lastLegTo) {
    return null;
  }
  const fromName = lastLegTo.name;
  const latLon = `${lastLegTo.lat},${lastLegTo.lon}`;
  return `${fromName}::${latLon}`;
};
const getFromStartTime = itinerary => {
  return _.get(itinerary, 'legs[0].startTime');
};

function hasAllDeepLinkParams(config) {
  return [
    'appInstallDeepLinkBase',
    'routeSearchDeepLinkBase',
    'appBundleId',
    'appStoreId',
  ].every(key => config[key]);
}

export const getDeepLinkUrl = (config, itinerary) => {
  const {
    appInstallDeepLinkBase,
    routeSearchDeepLinkBase,
    appBundleId,
    appStoreId,
  } = config;
  if (!hasAllDeepLinkParams(config)) {
    throw Error('Missing deep link parameters in config');
  }
  const from = getFrom(itinerary);
  const to = getTo(itinerary);
  if (!from || !to) {
    throw Error('Could not get itinerary `from` or `to`');
  }
  const link = `${routeSearchDeepLinkBase}?from=${encodeURIComponent(
    from,
  )}&to=${encodeURIComponent(to)}&startTime=${getFromStartTime(itinerary)}`;
  // ibi = bundle id (ios), apn = bundle id (android), isi = app store id (needed to open app store in case app not installed), efr=1 = skip preview page
  const mobileParams = `ibi=${appBundleId}&apn=${appBundleId}&isi=${appStoreId}&efr=1`;
  return `${appInstallDeepLinkBase}?link=${encodeURIComponent(
    link,
  )}&${mobileParams}`;
};
