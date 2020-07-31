import React from 'react';
import ReactDOM from 'react-dom';
import Icon from './component/Icon';
import WidgetAutoSuggest from './widgetAutoSuggest';
import MhIcon from './configurations/images/mh/mh-favicon.png';
import { getNamedConfiguration } from './config';

// Config name filled in global window.* when serving the asset from specialised URL
// eslint-disable-next-line no-underscore-dangle
const config = getNamedConfiguration(window.____kyytiDigitransitUIWidgetConfig);

class Widget extends React.Component {
  constructor() {
    super();
    this.state = {
      originValue: '',
      originLatLng: [],
      destinationValue: '',
      destinationLatLng: [],
    };
  }

  onChange = (id, newValue, suggestionLatLng) => {
    if (id.toLowerCase() === 'origin') {
      this.setState({ originValue: newValue, originLatLng: suggestionLatLng });
    }
    if (id.toLowerCase() === 'destination') {
      this.setState({
        destinationValue: newValue,
        destinationLatLng: suggestionLatLng,
      });
    }
  };

  handleOnlick = () => {
    const time = Math.floor(new Date().getTime() / 1000);
    const origin = `${
      this.state.originValue
    }::${this.state.originLatLng.reverse()}`;
    const destination = `${
      this.state.destinationValue
    }::${this.state.destinationLatLng.reverse()}`;

    const url = config.URL.APP_URL || '';

    window.open(
      `${url}/reitti/${encodeURIComponent(origin)}/${encodeURIComponent(
        destination,
      )}?time=${time}`,
    );
  };

  searchButton = () => {
    return (
      <button
        type="button"
        className="search-button"
        onClick={this.handleOnlick}
      >
        Hae Lippuja
      </button>
    );
  };

  createSpriteMarkup = () => {
    return {
      __html:
        "<svg aria-hidden='true' style='position: absolute; width: 0; height: 0;' width='0' height='0' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'><defs>      <symbol id='icon-icon_mapMarker-from' viewBox='0 0 16 24'>        <path          fill-rule='evenodd'          d='M4.5 8c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5S4.5 9.93 4.5 8zM8 24c5.333-7.721 8-13.054 8-16A8 8 0 1 0 0 8c0 2.946 2.667 8.279 8 16z'        ></path>      </symbol>      <symbol id='icon-icon_mapMarker-to' viewBox='0 0 16 24'>        <path          fill-rule='evenodd'          d='M4.5 8c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5S4.5 9.93 4.5 8zM8 24c5.333-7.721 8-13.054 8-16A8 8 0 1 0 0 8c0 2.946 2.667 8.279 8 16z'        ></path>      </symbol>      <symbol id='icon-icon_search' viewBox='0 0 1024 1024'>        <path class='path1' d='M726.005 636.553l297.996 297.996-89.445 89.445-297.996-297.996 89.445-89.445z'></path>        <path class='path2' d='M425.705 126.488c164.987 0 299.213 134.226 299.213 299.216 0 164.987-134.226 299.213-299.213 299.213s-299.216-134.226-299.216-299.213c0-164.987 134.23-299.216 299.216-299.216zM425.705-0.007c-235.116 0-425.712 190.596-425.712 425.712s190.599 425.708 425.712 425.708 425.712-190.596 425.712-425.708-190.596-425.712-425.712-425.712v0z'></path>      </symbol>      <symbol id='icon-icon_close' viewBox='0 0 1024 1024'>        <path class='path1' d='M1024.007 93.076l-93.080-93.083-418.927 418.92-418.917-418.92-93.091 93.083 418.924 418.924-418.924 418.92 93.091 93.087 418.917-418.92 418.927 418.92 93.080-93.087-418.92-418.92z'></path>      </symbol>    </defs></svg>",
    };
  };

  render() {
    return (
      <div>
        <div dangerouslySetInnerHTML={this.createSpriteMarkup()} />
        <div className="widget-body">
          <div className="autosuggest-panel">
            <div className="main-title">Matkahaku</div>
            <div className="autosuggest-in-panel">
              <div className="origin-input-container">
                <div className="autosuggest-input-container origin">
                  <div className="autosuggest-input-icon origin">
                    <Icon img="icon-icon_mapMarker-from" />
                  </div>
                  <WidgetAutoSuggest
                    id="origin"
                    placeholder="Search origin"
                    config={config}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div className="destination-input-container">
                <div className="autosuggest-input-container destination">
                  <div className="autosuggest-input-icon destination">
                    <Icon img="icon-icon_mapMarker-to" />
                  </div>
                  <WidgetAutoSuggest
                    id="destination"
                    placeholder="Search destination"
                    config={config}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <button className="search-button" onClick={this.handleOnlick}>
                Hae Lippuja
              </button>
            </div>
            <div className="widget-icon">
              <span>Powered By </span>
              <img className="mh-icon" src={MhIcon} alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Widget />, document.getElementById('reittiopas-mh-widget'));
