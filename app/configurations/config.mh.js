/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'mh';
const API_URL = 'https://matkahuolto-otp-2.kyytiapis.com';
const APP_TITLE = 'Matkahuolto Reittiopas';
const APP_DESCRIPTION = 'Matkahuolto Reittiopas';
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
    APP_URL: 'https://reittiopas.matkahuolto.fi',
    GEOCODING_BASE_URL: 'https://api.tuup.fi',
    MAP_URL,
    MAP: {
      default: `${MAP_URL}/styles/v1/kyyticom/ckfoy6sug0kci19ql1i7vokr7/tiles/`,
      sv: `${MAP_URL}/styles/v1/kyyticom/ckfoy6sug0kci19ql1i7vokr7/tiles/`,
    },
    STOP_MAP: `${API_URL}/otp/routers/default/vectorTiles/stops,stations/`,
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
    [20.202513, 69.395104],
    [20.132068, 69.089496],
    [23.462036, 65.147754],
    [20.591374, 63.412601],
    [19.213456, 60.556426],
    [19.175181, 59.929547],
    [21.184193, 59.743255],
    [23.193206, 59.555918],
    [27.277708, 59.885993],
    [31.848020, 62.794054],
    [30.397825, 69.456877],
    [27.892942, 70.258801],
    [20.202513, 69.395104]
  ],

  defaultSettings: {
    banned: {
      agencies: "MDR-Porvoo:Porvoo"
    }
  },

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

  agency: {
    show: true,
  },

  /* Option to disable the "next" column of the Route panel as it can be confusing sometimes: https://github.com/mfdz/digitransit-ui/issues/167 */
  displayNextDeparture: false,

  modeToOTP: {
    bus: ['BUS', 'FLEXIBLE'],
    tram: ['TRAM'],
    rail: ['RAIL'],
    subway: ['SUBWAY'],
    citybike: ['BICYCLE_RENT'],
    airplane: ['AIRPLANE'],
    ferry: ['FERRY'],
    walk: ['WALK'],
    bicycle: ['BICYCLE'],
    car: ['CAR'],
    car_park: ['CAR_PARK'],
    public_transport: ['WALK'],
  },


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
  routeSearchDeepLinkBase: 'https://matkahuolto.kyyti.com/route-search/',
  appBundleId: 'com.kyyti.ride.matkahuolto',
  appStoreId: '1496304929',
  sendAppLinkEmailRequestEndpoint: 'https://api.tuup.fi/users/v2/send-route',

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
