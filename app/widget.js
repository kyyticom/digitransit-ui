import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { routerShape, locationShape } from 'react-router';
import isEqual from 'lodash/isEqual';
import d from 'debug';
import { intlShape } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import shouldUpdate from 'recompose/shouldUpdate';
import {
  initGeolocation,
  checkPositioningPermission,
} from './action/PositionActions';
import storeOrigin from './action/originActions';
import {
  TAB_NEARBY,
  TAB_FAVOURITES,
  parseLocation,
  isItinerarySearchObjects,
  navigateTo,
} from './util/path';
import { dtLocationShape } from './util/shapes';
import NearbyRoutesPanel from './component/NearbyRoutesPanel';
import FavouritesPanel from './component/FavouritesPanel';
import events from './util/events';
import { addAnalyticsEvent } from './util/analyticsUtils';
import withBreakpoint from './util/withBreakpoint';
import ComponentUsageExample from './component/ComponentUsageExample';
import { isBrowser } from './util/browser';
import DTAutosuggestPanel from './component/DTAutosuggestPanel';

const debug = d('Widget.js');

class Widget extends React.Component {
  static contextTypes = {
    location: locationShape.isRequired,
    router: routerShape.isRequired,
    config: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
  };

  static propTypes = {
    autoSetOrigin: PropTypes.bool,
    breakpoint: PropTypes.string.isRequired,
    origin: dtLocationShape.isRequired,
    destination: dtLocationShape.isRequired,
    tab: PropTypes.string,
  };

  static defaultProps = {
    autoSetOrigin: true,
    tab: TAB_NEARBY,
  };

  constructor(props) {
    super(props);
    this.state = {
      mapExpanded: false, // Show right-now as default
    };
    if (this.props.autoSetOrigin) {
      // context.executeAction(storeOrigin, props.origin);
    }
  }

  componentDidMount() {
    // auto select nearby tab if none selected and bp=large
    if (this.props.tab === undefined) {
      this.clickNearby();
    }

    events.on('popupOpened', this.onPopupOpen);
  }

  componentWillReceiveProps = nextProps => {
    this.handleLocationProps(nextProps);
  };

  componentWillUnmount() {
    events.removeListener('popupOpened', this.onPopupOpen);
  }

  onPopupOpen = () => {
    this.setState({ mapExpanded: true });
  };

  getSelectedTab = () => {
    switch (this.props.tab) {
      case TAB_FAVOURITES:
        return 2;
      case TAB_NEARBY:
        return 1;
      default:
        return undefined;
    }
  };

  /* eslint-disable no-param-reassign */
  handleLocationProps = nextProps => {
    if (!isEqual(nextProps.origin, this.props.origin)) {
      this.context.executeAction(storeOrigin, nextProps.origin);
    }

    if (isItinerarySearchObjects(nextProps.origin, nextProps.destination)) {
      debug('Redirecting to itinerary summary page');
      navigateTo({
        origin: nextProps.origin,
        destination: nextProps.destination,
        context: '/',
        router: this.context.router,
        base: {},
      });
    }
  };

  clickNearby = () => {
    this.openTab(TAB_NEARBY);
    addAnalyticsEvent({
      event: 'sendMatomoEvent',
      category: 'Front page tabs',
      action: 'Nearby',
      name: 'open',
    });
  };

  clickFavourites = () => {
    this.openTab(TAB_FAVOURITES);
    addAnalyticsEvent({
      event: 'sendMatomoEvent',
      category: 'Front page tabs',
      action: 'Favourites',
      name: 'open',
    });
  };

  openTab = tab => {
    navigateTo({
      origin: this.props.origin,
      destination: this.props.destination,
      context: '/',
      router: this.context.router,
      base: {},
      tab,
    });
  };

  togglePanelExpanded = () => {
    addAnalyticsEvent({
      action: this.state.mapExpanded
        ? 'MinimizeMapOnMobile'
        : 'MaximizeMapOnMobile',
      category: 'Map',
      name: 'Widget',
    });
    this.setState(prevState => ({ mapExpanded: !prevState.mapExpanded }));
  };

  renderTab = () => {
    let Tab;
    switch (this.props.tab) {
      case TAB_NEARBY:
        Tab = NearbyRoutesPanel;
        break;
      case TAB_FAVOURITES:
        Tab = FavouritesPanel;
        break;
      default:
        Tab = NearbyRoutesPanel;
    }
    return (
      <Tab origin={this.props.origin} destination={this.props.destination} />
    );
  };

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  render() {
    const { breakpoint, destination, origin } = this.props;
    return breakpoint === 'large' ? (
      <div>
        <div className="content">
          <div className="search-container">
            <DTAutosuggestPanel
              origin={origin}
              destination={destination}
              searchType="all"
              originPlaceHolder="search-origin"
              destinationPlaceHolder="search-destination"
            />
          </div>
        </div>
      </div>
    ) : (
      <div id="widget-search" className="widget-search">
        <div className="title">Search</div>
        <div className="content">
          <div className="arrival-field">
            <span className="arrival-text">Departure</span>
          </div>
          <div className="departure-field">
            <span className="departure-text">Arrival</span>
          </div>

          <div className="search-button">Search</div>
        </div>
      </div>
    );
  }
}

const Index = shouldUpdate(
  // update only when origin/destination/tab/breakpoint or language changes
  (props, nextProps) =>
    !(
      isEqual(nextProps.origin, props.origin) &&
      isEqual(nextProps.destination, props.destination) &&
      isEqual(nextProps.tab, props.tab) &&
      isEqual(nextProps.breakpoint, props.breakpoint) &&
      isEqual(nextProps.lang, props.lang) &&
      isEqual(nextProps.locationState, props.locationState) &&
      isEqual(nextProps.showSpinner, props.showSpinner)
    ),
)(Widget);

const WidgetWithBreakpoint = withBreakpoint(Index);

WidgetWithBreakpoint.description = (
  <ComponentUsageExample isFullscreen>
    <WidgetWithBreakpoint
      autoSetOrigin={false}
      destination={{
        ready: false,
        set: false,
      }}
      origin={{
        ready: false,
        set: false,
      }}
      routes={[]}
      showSpinner={false}
    />
  </ComponentUsageExample>
);

/* eslint-disable no-param-reassign */
const processLocation = (locationString, locationState, intl) => {
  let location;
  if (locationString) {
    location = parseLocation(locationString);

    if (location.gps === true) {
      if (
        locationState.lat &&
        locationState.lon &&
        locationState.address !== undefined // address = "" when reverse geocoding cannot return address
      ) {
        location.ready = true;
        location.lat = locationState.lat;
        location.lon = locationState.lon;
        location.address =
          locationState.address ||
          intl.formatMessage({
            id: 'own-position',
            defaultMessage: 'Own Location',
          });
      }
      const gpsError = locationState.locationingFailed === true;

      location.gpsError = gpsError;
    }
  } else {
    location = { set: false };
  }
  return location;
};

const tabs = [TAB_FAVOURITES, TAB_NEARBY];

const WidgetWithPosition = connectToStores(
  WidgetWithBreakpoint,
  ['PositionStore'],
  (context, props) => {
    const locationState = context.getStore('PositionStore').getLocationState();

    // allow using url without all parameters set. assume:
    // if from == 'lahellasi' or 'suosikit' assume tab = ${from}, from ='-' to '-'
    // if to == 'lahellasi' or 'suosikit' assume tab = ${to}, to = '-'

    let { from, to, tab } = props.params;
    let redirect = false;

    if (tabs.indexOf(from) !== -1) {
      tab = from;
      from = '-';
      to = '-';
      redirect = true;
    } else if (tabs.indexOf(to) !== -1) {
      tab = to;
      to = '-';
      redirect = true;
    }

    const newProps = {};

    if (tab) {
      newProps.tab = tab;
    }

    newProps.locationState = locationState;
    newProps.origin = processLocation(from, locationState, context.intl);
    newProps.destination = processLocation(to, locationState, context.intl);

    if (redirect) {
      navigateTo({
        origin: newProps.origin,
        destination: newProps.destination,
        context: '/',
        router: context.router,
        base: {},
        tab: newProps.tab,
      });
    }

    newProps.showSpinner = locationState.isLocationingInProgress === true;

    if (
      isBrowser &&
      locationState.isLocationingInProgress !== true &&
      locationState.hasLocation === false &&
      (newProps.origin.gps === true || newProps.destination.gps === true)
    ) {
      checkPositioningPermission().then(status => {
        if (
          // check logic for starting geolocation
          status.state === 'granted' &&
          locationState.status === 'no-location'
        ) {
          debug('Auto Initialising geolocation');

          context.executeAction(initGeolocation);
        } else {
          // clear gps & redirect
          if (newProps.origin.gps === true) {
            newProps.origin.gps = false;
            newProps.origin.set = false;
          }

          if (newProps.destination.gps === true) {
            newProps.destination.gps = false;
            newProps.destination.set = false;
          }

          debug('Redirecting away from POS');
          navigateTo({
            origin: newProps.origin,
            destination: newProps.destination,
            context: '/',
            router: context.router,
            base: {},
            tab: newProps.tab,
          });
        }
      });
    }
    newProps.lang = context.getStore('PreferencesStore').getLanguage();

    return newProps;
  },
);

WidgetWithPosition.contextTypes = {
  ...WidgetWithPosition.contextTypes,
  location: locationShape.isRequired,
  router: routerShape.isRequired,
  executeAction: PropTypes.func.isRequired,
  intl: intlShape,
};

ReactDOM.render(<Widget />, document.getElementById('reittiopas-mh-widget'));
