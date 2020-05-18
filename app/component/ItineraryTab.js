import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import { locationShape, routerShape } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import Icon from './Icon';
import TicketInformation from './TicketInformation';
import RouteInformation from './RouteInformation';
import ItineraryProfile from './ItineraryProfile';
import ItinerarySummary from './ItinerarySummary';
import TimeFrame from './TimeFrame';
import DateWarning from './DateWarning';
import ItineraryLegs from './ItineraryLegs';
import LegAgencyInfo from './LegAgencyInfo';
import CityBikeMarker from './map/non-tile-layer/CityBikeMarker';
import SecondaryButton from './SecondaryButton';
import { RouteAlertsQuery, StopAlertsQuery } from '../util/alertQueries';
import { getRoutes, getZones } from '../util/legUtils';
import { BreakpointConsumer } from '../util/withBreakpoint';
import ComponentUsageExample from './ComponentUsageExample';

import exampleData from './data/ItineraryTab.exampleData.json';
import {
  getFares,
  shouldShowAppDeepLink,
  shouldShowAppSMSLink,
  shouldShowFareInfo,
} from '../util/fareUtils';
import { addAnalyticsEvent } from '../util/analyticsUtils';
import SMSlinkModal from './SMSLinkModal';

const getFrom = itinerary => _.get(itinerary, 'legs[0].from.name');

const getTo = itinerary =>
  _.chain(itinerary.legs)
    .last()
    .get('to.name')
    .value();

const getFromStartTime = itinerary => _.get(itinerary, 'legs[0].startTime');

export const getDeepLinkUrl = (routeAppDeepLink, itinerary) =>
  `${routeAppDeepLink}?from=${encodeURIComponent(
    getFrom(itinerary),
  )}&to=${encodeURIComponent(getTo(itinerary))}&startTime=${getFromStartTime(
    itinerary,
  )}`;

/* eslint-disable prettier/prettier */
class ItineraryTab extends React.Component {
  static propTypes = {
    searchTime: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    itinerary: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
    location: PropTypes.object,
    focus: PropTypes.func.isRequired,
  };

  static contextTypes = {
    config: PropTypes.object.isRequired,
    router: routerShape.isRequired,
    location: locationShape.isRequired,
  };

  state = {
    lat: undefined,
    lon: undefined,
    appLinkSMSModalOpen: false,
  };

  getState = () => ({
    lat: this.state.lat || this.props.itinerary.legs[0].from.lat,
    lon: this.state.lon || this.props.itinerary.legs[0].from.lon,
  });

  handleFocus = (lat, lon) => {
    this.props.focus(lat, lon);

    return this.setState({
      lat,
      lon,
    });
  };

  printItinerary = e => {
    e.stopPropagation();

    addAnalyticsEvent({
      event: 'sendMatomoEvent',
      category: 'Itinerary',
      action: 'Print',
      name: null,
    });

    const printPath = `${this.props.location.pathname}/tulosta`;
    this.context.router.push({
      ...this.props.location,
      pathname: printPath,
    });
  };

  openInApp = e => {
    e.stopPropagation();
    window.open(getDeepLinkUrl(this.context.config.routeAppDeepLink, this.props.itinerary));
  };

  openAppSMSModal = e => {
    e.stopPropagation();
    this.setState({ appLinkSMSModalOpen: true });
  };

  render() {
    const { itinerary, searchTime } = this.props;
    const { config } = this.context;

    const fares = getFares(itinerary.fares, getRoutes(itinerary.legs), config);
    return (
      <div className="itinerary-tab">
        <BreakpointConsumer>
          {breakpoint => [
            breakpoint !== 'large' ? (
              <ItinerarySummary itinerary={itinerary} key="summary">
                <TimeFrame
                  startTime={itinerary.startTime}
                  endTime={itinerary.endTime}
                  refTime={searchTime}
                  className="timeframe--itinerary-summary"
                />
              </ItinerarySummary>
            ) : (
              <div className="itinerary-timeframe" key="timeframe">
                <DateWarning date={itinerary.startTime} refTime={searchTime} />
              </div>
            ),
            <div className="momentum-scroll itinerary-tabs__scroll" key="legs">
              <div
                className={cx('itinerary-main', {
                  'bp-large': breakpoint === 'large',
                })}
              >
                {shouldShowFareInfo(config) &&
                  fares.some(fare => fare.isUnknown) && (
                    <div className="disclaimer-container unknown-fare-disclaimer__top">
                      <div className="icon-container">
                        <Icon className="info" img="icon-icon_info" />
                      </div>
                      <div className="description-container">
                        <FormattedMessage
                          id="separate-ticket-required-disclaimer"
                          values={{
                            agencyName: get(
                              config,
                              'ticketInformation.primaryAgencyName',
                            ),
                          }}
                        />
                      </div>
                    </div>
                  )}
                <ItineraryLegs
                  fares={fares}
                  itinerary={itinerary}
                  focusMap={this.handleFocus}
                />
                <ItineraryProfile
                  itinerary={itinerary}
                  small={breakpoint !== 'large'}
                />
                {shouldShowFareInfo(config) && (
                  <TicketInformation
                    fares={fares}
                    zones={getZones(itinerary.legs)}
                    legs={itinerary.legs}
                  />
                )}
                {config.showRouteInformation && <RouteInformation />}
              </div>
              <div className="row">
                {shouldShowAppDeepLink(config, itinerary.legs) && (
                  <div style={{ flexDirection: 'row' }}>
                    <FormattedMessage id="open-in-app-mh-mobile-info" defaultMessage="You can buy the route from Matkahuolto's app."/>
                    <SecondaryButton
                      ariaLabel="open-in-app"
                      buttonName="open-in-app"
                      buttonClickAction={this.openInApp}
                      buttonIcon="icon-icon_ticket"
                    />
                  </div>
                )}
                {shouldShowAppSMSLink(config, itinerary.legs) && (
                  <div style={{ flexDirection: 'row' }}>
                    <FormattedMessage id="open-in-app-mh-desktop-info" defaultMessage="You can buy the route using Matkahuolto's mobile app."/>
                    <SecondaryButton
                      ariaLabel="open-in-app"
                      buttonName="open-in-app-send-link-to-phone"
                      buttonClickAction={this.openAppSMSModal}
                      buttonIcon="icon-icon_arrow-right"
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <SecondaryButton
                  ariaLabel="print"
                  buttonName="print"
                  buttonClickAction={e => this.printItinerary(e)}
                  buttonIcon="icon-icon_print"
                />
              </div>
              {config.showDisclaimer && (
                <div className="itinerary-disclaimer">
                  <FormattedMessage
                    id="disclaimer"
                    defaultMessage="Results are based on estimated travel times"
                  />
                </div>
              )}
            </div>,
          ]}
        </BreakpointConsumer>
        <SMSlinkModal
          open={this.state.appLinkSMSModalOpen}
          toggleVisibility={() =>
            this.setState(({ appLinkSMSModalOpen }) => ({
              appLinkSMSModalOpen: !appLinkSMSModalOpen,
            }))
          }
          itinerary={this.props.itinerary}
        />
      </div>
    );
  }
}

ItineraryTab.description = (
  <ComponentUsageExample description="with disruption">
    <div style={{ maxWidth: '528px' }}>
      <ItineraryTab
        focus={() => {}}
        itinerary={{ ...exampleData.itinerary }}
        searchTime={1553845502000}
      />
    </div>
  </ComponentUsageExample>
);
const withIntl = injectIntl(ItineraryTab);
const withIntlAndRelay = Relay.createContainer(withIntl, {
  fragments: {
    searchTime: () => Relay.QL`
      fragment on Plan {
        date
      }
    `,
    itinerary: () => Relay.QL`
      fragment on Itinerary {
        walkDistance
        duration
        startTime
        endTime
        elevationGained
        elevationLost
        fares {
          cents
          components {
            cents
            fareId
            routes {
              agency {
                gtfsId
                fareUrl
                name
              }
              gtfsId
            }
          }
          type
        }
        legs {
          mode
          ${LegAgencyInfo.getFragment('leg')}
          from {
            lat
            lon
            name
            vertexType
            bikeRentalStation {
              networks
              bikesAvailable
              ${CityBikeMarker.getFragment('station')}
            }
            stop {
              gtfsId
              code
              platformCode
              zoneId
              ${StopAlertsQuery}
            }
          }
          to {
            lat
            lon
            name
            vertexType
            bikeRentalStation {
              ${CityBikeMarker.getFragment('station')}
            }
            stop {
              gtfsId
              code
              platformCode
              zoneId
              ${StopAlertsQuery}
            }
          }
          legGeometry {
            length
            points
          }
          intermediatePlaces {
            arrivalTime
            stop {
              gtfsId
              lat
              lon
              name
              code
              platformCode
              zoneId
              ${StopAlertsQuery}
            }
          }
          realTime
          realtimeState
          transitLeg
          rentedBike
          startTime
          endTime
          mode
          distance
          duration
          intermediatePlace
          route {
            shortName
            color
            gtfsId
            longName
            desc
            agency {
              gtfsId
              fareUrl
              name
              phone
            }
            ${RouteAlertsQuery}
          }
          trip {
            gtfsId
            tripHeadsign
            pattern {
              code
            }
            stoptimes {
              pickupType
              realtimeState
              stop {
                gtfsId
              }
            }
          }
        }
      }
    `,
  },
});

export { ItineraryTab as Component, withIntlAndRelay as default };
