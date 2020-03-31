import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import Link from 'found/lib/Link';

import Icon from './Icon';

const FavouriteLocation = ({ favourite, className, clickFavourite, key }) => {
  const { name, favouriteId, selectedIconId, address } = favourite;

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
  return (
    <div
      key={key}
      data-swipeable="true"
      className={cx('new-favourite-location-content', className)}
      onClick={() => clickFavourite(favourite)}
    >
      <Icon className="favourite-location-icon" img={selectedIconId} />
      <div className="favourite-location">
        <div className="favourite-location-name">{name}</div>
        <div className="favourite-location-address">{address}</div>
      </div>
      <Link
        to={`/suosikki/muokkaa/sijainti/${favouriteId}`}
        className="cursor-pointer no-decoration"
      >
        <div className="favourite-edit-icon-click-area">
          <Icon className="favourite-edit-icon" img="icon-icon_edit" />
        </div>
      </Link>
    </div>
  );
};

FavouriteLocation.propTypes = {
  favourite: PropTypes.object.isRequired,
  clickFavourite: PropTypes.func.isRequired,
  key: PropTypes.string.isRequired,
  className: PropTypes.string,
};

FavouriteLocation.displayName = 'FavouriteLocation';

export default FavouriteLocation;
