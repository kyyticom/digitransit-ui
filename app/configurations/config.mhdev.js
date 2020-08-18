/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'mhdev';
const API_URL = process.env.API_URL || `https://otp.dev.kyyti.io`;
const APP_TITLE = 'Matkahuolto reittihaku DEV';
const APP_DESCRIPTION = 'Matkahuolto reittihaku DEV';
const walttiConfig = require('./config.waltti').default;

const MAP_URL = 'https://api.mapbox.com';

const minLat = 59;
const maxLat = 71;
const minLon = 20;
const maxLon = 32;

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'Matkahuolto', href: 'http://www.matkahuolto.fi/' },

  widgetEnabled: true,

  // This goes to browser, so not secret. When rotating keys just make
  // sure Mapbox account panel lists deployed URLS for CORS policy
  MAP_ACCESS_TOKEN: 'pk.eyJ1Ijoia3l5dGljb20iLCJhIjoiY2thcDdoaDMxMGw0eTJycG85N3Z1azBjMSJ9.hsIE5azenQvs2yOi7cOSCQ',
  URL: {
    API_URL,
    APP_URL : 'https://reittiopas-mh-test.kyyti.io',
    GEOCODING_BASE_URL: 'https://devapi.tuup.fi',
    MAP_URL,
    MAP: {
      default: `${MAP_URL}/styles/v1/kyyticom/cjvytj9650p4a1clh3qbzxspe/tiles/`,
      sv: `${MAP_URL}/styles/v1/kyyticom/cjvytj9650p4a1clh3qbzxspe/tiles/`,
    },
    STOP_MAP: null,
    CITYBIKE_MAP: null,
    OTP: `${API_URL}/otp/routers/default/`,
  },

  colors: {
    primary: '#0070b5',
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    image: {
      url: '/img/mh-social-share.jpg',
      width: 1080,
      height: 600,
    },

    twitter: {
      card: 'summary_large_image',
      site: '@matkahuolto',
    },
  },

  title: APP_TITLE,

  textLogo: false,

  logo: 'mhdev/mh-logo.png',
  favicon: './app/configurations/images/mhdev/mh-favicon.png',

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

  /* Option to disable the "next" column of the Route panel as it can be confusing sometimes: https://github.com/mfdz/digitransit-ui/issues/167 */
  displayNextDeparture: false,

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
      availableForSelection: false,
      defaultValue: false, // always false
    },
  },


  // Default labels for manifest creation
  name: 'Matkahuolto reittihaku',
  shortName: 'Reittihaku',

  appInstallDeepLinkBase: 'https://matkahuolto.page.link/',
  routeSearchDeepLinkBase: 'https://matkahuolto.kyyti.com/devroute-search/',
  appBundleId: 'com.kyyti.ride.matkahuolto.dev',
  appStoreId: '1496304929',
  sendAppLinkEmailRequestEndpoint: 'https://devapi.tuup.fi/users/v2/send-route',

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
