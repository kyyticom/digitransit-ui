/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'trillium';
const APP_TITLE = 'Trillium Route Planner';
const APP_DESCRIPTION = 'Trillium Route Planner';
const walttiConfig = require('./config.waltti').default;

const minLat = 44.20;
const maxLat = 46.40;
const minLon = -124.25;
const maxLon = -121.85;

export default configMerger(walttiConfig, {
  CONFIG,

  appBarLink: { name: 'Trillium', href: 'https://trilliumtransit.com/' },

  colors: {
    primary: '#65A8D0',
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  title: APP_TITLE,

  textLogo: false,
  logo: 'trillium/kyyti_md_logo.png',
  favicon: './app/configurations/images/trillium/kyyti_md_favicon',

  feedIds: ['Trillium'],

  searchParams: {
    'boundary.rect.min_lat': minLat,
    'boundary.rect.max_lat': maxLat,
    'boundary.rect.min_lon': minLon,
    'boundary.rect.max_lon': maxLon,
  },

  areaPolygon: [
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

  /*
  defaultEndpoint: {
    address: 'Trillium',
    lat: 0.5 * (minLat + maxLat),
    lon: 0.5 * (minLon + maxLon),
  },

  defaultOrigins: [
    {
      icon: 'icon-icon_bus',
      label: 'Linja-autoasema, Trillium',
      lat: 63,
      lon: 27,
    },
  ],
  */

  footer: {
    content: [
      { label: `© Trillium ${walttiConfig.YEAR}` },
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
    en: 'Trillium',
    fi: 'Trillium',
    default: "Trillium's",
  },
  availableLanguages: ['en','fi'],
  defaultLanguage: 'en',

  aboutThisService: {
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Trillium for route planning in Oregon, USA region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
    ],

    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tämän palvelun tarjoaa Trillium reittisuunnittelua varten Oregon, USA alueella. Palvelu kattaa joukkoliikenteen, kävelyn, pyöräilyn ja yksityisautoilun rajatuilta osin. Palvelu perustuu Digitransit-palvelualustaan.',
        ],
      },
    ],

  },
});
