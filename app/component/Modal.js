import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from './Icon';
import { isKeyboardSelectionEvent } from '../util/browser';
import withBreakpoint from '../util/withBreakpoint';

class Modal extends React.Component {
  static propTypes = {
    allowClicks: PropTypes.bool,
    breakpoint: PropTypes.oneOf(['small', 'medium', 'large']),
    children: PropTypes.node,
    open: PropTypes.bool,
    title: PropTypes.node,
    toggleVisibility: PropTypes.func.isRequired,
  };

  stopClickPropagation = e => {
    if (this.props.allowClicks !== true) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  render() {
    const { breakpoint, children, open, toggleVisibility, title } = this.props;
    const isActive = {
      'is-active': open,
    };

    const overlayStyle = {
      zIndex: 1400,
    };

    return (
      <div
        className={cx('modal-overlay', 'cursor-pointer', isActive)}
        onClick={toggleVisibility}
        onKeyPress={e => isKeyboardSelectionEvent(e) && toggleVisibility()}
        role="button"
        style={overlayStyle}
        tabIndex="0"
      >
        <div
          data-closable
          className={cx('modal', isActive, {
            'modal-small': breakpoint === 'small',
          })}
          onClick={this.stopClickPropagation}
          onKeyPress={e =>
            isKeyboardSelectionEvent(e) && this.stopClickPropagation(e)
          }
          role="button"
          tabIndex="0"
        >
          <div className="modal-top-nav">
            <h2>{title}</h2>
            <div className="text-right">
              <div
                className="close-button cursor-pointer"
                onClick={toggleVisibility}
                onKeyPress={e =>
                  isKeyboardSelectionEvent(e) && toggleVisibility()
                }
                role="button"
                tabIndex="0"
              >
                <Icon img="icon-icon_close" />
              </div>
            </div>
          </div>
          <div className="modal-wrapper">
            <div className="modal-content momentum-scroll">{children}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withBreakpoint(Modal);
