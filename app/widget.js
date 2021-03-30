import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import Icon from './component/WidgetIcon';
import WidgetAutoSuggest from './component/WidgetAutoSuggest';
import MhIcon from './configurations/images/mh/mh-favicon.png';
import { getNamedConfiguration } from './config';
import styles from '../sass/_widget.scss';

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
    const {
      originValue,
      destinationValue,
      originLatLng,
      destinationLatLng,
    } = this.state;
    const origin = `${originValue}::${originLatLng.slice().reverse()}`;
    const destination = `${destinationValue}::${destinationLatLng
      .slice()
      .reverse()}`;

    const url = config.URL.APP_URL || '';

    window.open(
      `${url}/reitti/${encodeURIComponent(origin)}/${encodeURIComponent(
        destination,
      )}?time=${time}`,
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
        <div className={styles['widget-body']}>
          <div className={styles['autosuggest-panel']}>
            <div className={styles['main-title']}>
              <FormattedMessage id="widget-name" defaultMessage="Reittihaku" />
            </div>
            <div className={styles['autosuggest-in-panel']}>
              <div className={styles['origin-input-container']}>
                <div
                  className={cx(
                    styles['autosuggest-input-container'],
                    styles.origin,
                  )}
                >
                  <div
                    className={cx(
                      styles['autosuggest-input-icon'],
                      styles.origin,
                    )}
                  >
                    <Icon img="icon-icon_mapMarker-from" />
                  </div>
                  <WidgetAutoSuggest
                    id="origin"
                    placeholder="Hae lähtöpaikkaa"
                    config={config}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div className={styles['destination-input-container']}>
                <div
                  className={cx(
                    styles['autosuggest-input-container'],
                    styles.destination,
                  )}
                >
                  <div
                    className={cx(
                      styles['autosuggest-input-icon'],
                      styles.destination,
                    )}
                  >
                    <Icon img="icon-icon_mapMarker-to" />
                  </div>
                  <WidgetAutoSuggest
                    id="destination"
                    placeholder="Hae määränpäätä"
                    config={config}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <button
                className={styles['search-button']}
                onClick={this.handleOnlick}
              >
                <FormattedMessage
                  id="widget-button-name"
                  defaultMessage="HAE REITTEJÄ"
                />
              </button>
            </div>
            <div className={styles['widget-icon']}>
              <span className={styles['powered-by']}>Powered By </span>
              <div>
                <img className={styles['mh-icon']} src={MhIcon} alt="Logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Widget />, document.getElementById('reittiopas-mh-widget'));
