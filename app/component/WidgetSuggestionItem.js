import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import pure from 'recompose/pure';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import Icon from './WidgetIcon';
import {
  getNameLabel,
  getIcon,
  isStop,
  isTerminal,
  getGTFSId,
} from '../util/suggestionUtils';
import styles from '../../sass/_widget.scss';

const SuggestionItem = pure(
  ({ item, intl, useTransportIcons, doNotShowLinkToStop, loading }) => {
    let icon;
    let iconstr;
    if (item.properties.mode && useTransportIcons) {
      iconstr = `icon-icon_${item.properties.mode}`;
      icon = (
        <Icon
          img={`icon-icon_${item.properties.mode}`}
          className={item.properties.mode}
        />
      );
    } else {
      // DT-3262 Icon as string for screen readers
      const layer = item.properties.layer.replace('route-', '').toLowerCase();
      if (intl) {
        iconstr = intl.formatMessage({
          id: layer,
          defaultMessage: layer,
        });
      }
      icon = (
        <Icon
          img={getIcon(item.properties.layer)}
          className={item.iconClass || ''}
        />
      );
    }
    const [name, label] = getNameLabel(item.properties, false);
    // DT-3262 For screen readers
    const acri = (
      <div className={styles['sr-only']}>
        <p>
          {' '}
          {iconstr} - {name} - {label}
        </p>
      </div>
    );
    const ri = (
      <div
        aria-hidden="true"
        className={cx(styles['search-result'], styles[item.type], {
          favourite: item.type.startsWith('Favourite'),
          loading,
        })}
      >
        <span aria-label={iconstr} className={styles.autosuggestIcon}>
          {icon}
        </span>
        <div>
          <p className={styles['suggestion-name']}>{name}</p>
          <p className={styles['suggestion-label']}>{label}</p>
        </div>
      </div>
    );
    if (
      doNotShowLinkToStop === false &&
      (isStop(item.properties) || isTerminal(item.properties)) &&
      getGTFSId(item.properties) !== undefined &&
      (get(item, 'properties.id') ||
        get(item, 'properties.gtfsId') ||
        get(item, 'properties.code')) !== undefined
    ) {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      /* eslint-disable jsx-a11y/anchor-is-valid */
      return (
        <div className={styles['suggestion-item-stop']}>
          <div>
            <Link
              onClick={() => {
                item.timetableClicked = false;
              }}
            >
              {acri}
              {ri}
            </Link>
          </div>
          <div className={styles['suggestion-item-timetable']}>
            <Link
              onClick={() => {
                item.timetableClicked = true;
              }}
            >
              <Icon img="icon-icon_schedule" />
              <div
                aria-hidden="true"
                aria-label="Timetable button"
                className={styles['suggestion-item-timetable-label']}
              >
                <FormattedMessage id="timetable" defaultMessage="Timetable" />
              </div>
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div>
        {acri}
        {ri}
      </div>
    );
  },
);

SuggestionItem.propTypes = {
  item: PropTypes.object,
  useTransportIcons: PropTypes.bool,
  doNotShowLInkToStop: PropTypes.bool,
};

export default SuggestionItem;
