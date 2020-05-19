import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';

const PortalModal = props => {
  return props.open
    ? ReactDOM.createPortal(
        <div
          className={props.className}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          role="none"
        >
          <Modal {...props} />
        </div>,
        document.getElementById('app'),
      )
    : null;
};

export default PortalModal;
