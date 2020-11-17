/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'mobilitydesigner';
const API_URL = process.env.API_URL || 'https://opentripplanner-trillium.kyyti.io';
const APP_TITLE = 'Route Planner';
const APP_DESCRIPTION = process.env.APP_DESCRIPTION || 'Mobility Designer - Route Planner';
const walttiConfig = require('./config.waltti').default;

const MAP_URL = 'https://api.mapbox.com';

const [minLat, maxLat, minLon, maxLon] = (process.env.BOUNDING_BOX || '44.20:46.40:-124.25:-121.85').split(':').map(i => Number(i));

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'Kyyti', href: 'https://www.kyyti.com/' },

  // This goes to browser, so not secret. When rotating keys just make
  // sure Mapbox account panel lists deployed URLS for CORS policy
  MAP_ACCESS_TOKEN: 'pk.eyJ1Ijoia3l5dGljb20iLCJhIjoiY2tmZjdnd2oyMGM3ZjMxczJoMms4MWg0dSJ9.2HKOs4heiHaVyYD9Z_IZfg',
  URL: {
    API_URL,
    APP_URL: process.env.APP_URL || 'https://otp2-oregon-flex.kyyti.io',
    GEOCODING_BASE_URL: process.env.GEOCODING_BASE_URL || 'https://api.tuup.fi',
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
    primary: '#65A8D0',
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  title: APP_TITLE,

  textLogo: false,
  logo: 'mobilitydesigner/md-logo.png',
  favicon: './app/configurations/images/mobilitydesigner/md-favicon.png',

  feedIds: ['Mobilitydesigner'],

  searchParams: {
    'boundary.rect.min_lat': minLat,
    'boundary.rect.max_lat': maxLat,
    'boundary.rect.min_lon': minLon,
    'boundary.rect.max_lon': maxLon,
  },

  areaPolygon: JSON.parse(process.env.AREA_POLYGON || 'false') || [
    [-124.10427365216604, 46.34373083369677],
    [-122.81277721717258, 46.26546793951183],
    [-122.68438283474632, 45.68812034425427],
    [-122.30675229819853, 45.60364097423179],
    [-121.89891131872692, 45.70922028077350],
    [-121.60813580558510, 45.36005307763868],
    [-121.57414905729583, 45.07542495324026],
    [-121.68743821826016, 44.81348746505913],
    [-122.90340854594405, 44.80277075221398],
    [-123.08467120348698, 44.25087352955946],
    [-124.23644433995776, 44.26710089846950],
    [-124.23644433995776, 44.26710089846950],
    [-124.10427365216604, 46.34373083369677],
  ],

  defaultEndpoint: {
    address: 'Mobility Designer',
    lat: 0.5 * (minLat + maxLat),
    lon: 0.5 * (minLon + maxLon),
  },

  defaultOrigins: JSON.parse(process.env.DEFAULT_ORIGINS || 'false') || [
    {
      icon: 'icon-icon_place',
      label: 'Oregon State Capitol, Salem, OR, USA',
      lat: 44.938620,
      lon: -123.030711,
    },
  ],

  footer: {
    content: [
      { label: `© Kyyti ${walttiConfig.YEAR}` },
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
    en: 'Kyyti',
    fi: 'Kyyti',
    default: "Kyyti's",
  },
  availableLanguages: ['en','fi', 'sv'],
  defaultLanguage: 'en',

  aboutThisService: {
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Kyyti Group Ltd for route planning. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
    ],

    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tämän palvelun tarjoaa Kyyti Group Oy reittisuunnittelua varten. Palvelu kattaa joukkoliikenteen, kävelyn, pyöräilyn ja yksityisautoilun rajatuilta osin. Palvelu perustuu Digitransit-palvelualustaan.',
        ],
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Den här tjänsten erbjuds av Kyyti Group Ab för reseplanering. Reseplaneraren täcker med vissa begränsningar kollektivtrafik, promenad, cykling samt privatbilism. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
    ],

  },
});
