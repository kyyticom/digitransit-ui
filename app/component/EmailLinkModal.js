import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { locationShape, routerShape } from 'react-router';
import PortalModal from './PortalModal';

function EmailLinkModal(props /* context */) {
  const [email, setEmail] = useState('');

  // const requestDeepLinkEmail = async (requestUrl, options) => {
  //   await fetch(requestUrl, {
  //     method: 'post',
  //     body: JSON.stringify({ ...options }),
  //   });
  // };

  const emailValid = () => /^.+@.+\..{2,}/.test(email);

  const doRequest = async () => {
    // if (emailValid()) {
    //   await requestDeepLinkEmail(
    //     context.config.sendAppLinkSMSrequestEndpoint,
    //     getDeepLinkUrl(context.config.routeAppDeepLink, props.itinerary),
    //   );
    // }
    props.toggleVisibility();
  };

  const changeEmail = e => setEmail(e.target.value);

  return (
    <PortalModal
      key="email-modal"
      className="dynamic-height-modal"
      disableScrolling
      open={props.open}
      title={
        <FormattedMessage
          id="send-email-modal-title"
          defaultMessage="Send link to buy route on your phone"
        />
      }
      toggleVisibility={props.toggleVisibility}
    >
      <div style={{ padding: '0.5em' }}>
        <label htmlFor="input-deep-link-email">
          <FormattedMessage
            id="send-email-modal-input-label"
            defaultMessage="Email address"
          />
          <input
            type="tel"
            id="input-deep-link-email"
            className="email-input-field"
            placeholder={props.intl.formatMessage({
              id: 'send-email-modal-input-placeholder',
              defaultMessage: 'Enter email...',
            })}
            value={email}
            onChange={changeEmail}
            aria-invalid={email && !emailValid()}
          />
        </label>
        <button type="submit" onClick={doRequest}>
          <FormattedMessage
            id="send-email-modal-submit"
            defaultMessage="Send link"
          />
        </button>
      </div>
    </PortalModal>
  );
}

EmailLinkModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  // eslint-disable-next-line
  itinerary: PropTypes.object.isRequired,
};
EmailLinkModal.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};
export default injectIntl(EmailLinkModal);
