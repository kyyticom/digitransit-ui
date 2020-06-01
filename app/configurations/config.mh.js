/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'mh';
const APP_TITLE = 'Matkahuolto reittihaku';
const APP_DESCRIPTION = 'Matkahuolto reittihaku';
const walttiConfig = require('./config.waltti').default;

const minLat = 59;
const maxLat = 71;
const minLon = 20;
const maxLon = 32;

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'Matkahuolto', href: 'http://www.matkahuolto.fi/' },

  URL: {
    GEOCODING_BASE_URL: 'https://api.tuup.fi',
    OTP: `https://otp.matkahuolto.kyyti.com/otp/routers/default/`,
  },

  colors: {
    primary: '#0070b5',
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  title: APP_TITLE,

  textLogo: false,

  logo: 'mh/mh-logo.png',
  favicon: './app/configurations/images/mh/mh-favicon.png',

  feedIds: ['Matkahuolto'],

  searchParams: {
    'boundary.rect.min_lat': minLat,
    'boundary.rect.max_lat': maxLat,
    'boundary.rect.min_lon': minLon,
    'boundary.rect.max_lon': maxLon,
  },

  areaPolygon: [
    [20.212469, 69.475061],
    [27.902898, 70.335542],
    [30.407781, 69.536604],
    [31.857976, 62.897937],
    [27.287664, 60],
    [23.203162, 59.671057],
    [19.185137, 60.043405],
    [19.223412, 60.668124],
    [20.60133, 63.514296],
    [23.471992, 65.243247],
    [20.142024, 69.170586],
    [20.212469, 69.475061]
  ],


  footer: {
    content: [
      { label: `© Matkahuolto ${walttiConfig.YEAR}` },
      {},
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/tietoja-palvelusta',
        icon: 'icon-icon_info',
      },
    ],
  },

  contactName: {
    sv: 'Matkahuolto',
    fi: 'Matkahuolto',
    default: "Matkahuolto's",
  },
  availableLanguages: ['fi','sv','en'],
  defaultLanguage: 'fi',
  mainMenu: {
    // Whether to show the left menu toggle button at all
    show: true,
    showDisruptions: false,
    showLoginCreateAccount: false,
    showOffCanvasList: true,
  },

  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
    },

    tram: {
      availableForSelection: true,
      defaultValue: true,
    },

    rail: {
      availableForSelection: true,
      defaultValue: true,
    },

    subway: {
      availableForSelection: true,
      defaultValue: true,
    },

    airplane: {
      availableForSelection: false,
      defaultValue: false,
    },

    ferry: {
      availableForSelection: true,
      defaultValue: true,
    },

    citybike: {
      availableForSelection: true,
      defaultValue: false, // always false
    },
  },


  // Default labels for manifest creation
  name: 'Matkahuolto reittihaku',
  shortName: 'Reittihaku',

  appInstallDeepLinkBase: 'https://matkahuolto.page.link/',
  routeSearchDeepLinkBase: 'https://matkahuolto.kyyti.com/route-search/',
  appBundleId: 'com.kyyti.ride.matkahuolto',
  appStoreId: '1496304929',
  sendAppLinkEmailRequestEndpoint: false,

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tämän palvelun tarjoaa Matkahuolto reittisuunnittelua varten Suomessa. Palvelu kattaa joukkoliikenteen, kävelyn, pyöräilyn ja yksityisautoilun rajatuilta osin. Palvelu perustuu Digitransit-palvelualustaan.',
        ],
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Den här tjänsten erbjuds av Matkahuolto för reseplanering inom Finland. Reseplaneraren täcker med vissa begränsningar kollektivtrafik, promenad, cykling samt privatbilism. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Matkahuolto for route planning in Finland. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
    ],
  },
});
