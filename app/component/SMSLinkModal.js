import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { locationShape, routerShape } from 'react-router';
import PortalModal from './PortalModal';
import { getDeepLinkUrl } from './ItineraryTab';

const requestDeepLinkSMS = async (requestUrl, deepLink) => {
  await fetch(requestUrl, {
    method: 'post',
    body: JSON.stringify({ deepLink }),
  });
};

function SMSlinkModal(props, context) {
  const [smsNumber, setSmsNumber] = useState('');

  const smsNumberValid = () =>
    // eslint-disable-next-line no-self-compare
    smsNumber.split('').every(c => +c === +c || c === ' ' || c === '-');

  const doRequest = async () => {
    if (smsNumberValid()) {
      await requestDeepLinkSMS(
        context.config.sendAppLinkSMSrequestEndpoint,
        getDeepLinkUrl(context.config.routeAppDeepLink, props.itinerary),
      );
    }
  };

  const changeNumber = e => setSmsNumber(e.target.value);
  return (
    <PortalModal
      key="sms-modal"
      className="dynamic-height-modal"
      disableScrolling
      open={props.open}
      title={
        <FormattedMessage
          id="send-sms-modal-title"
          defaultMessage="Send link to buy route on your phone"
        />
      }
      toggleVisibility={props.toggleVisibility}
    >
      <div style={{ padding: '0.5em' }}>
        <label htmlFor="input-deep-link-sms">
          <FormattedMessage
            id="send-sms-modal-input-label"
            defaultMessage="Phone number"
          />
          <input
            type="tel"
            id="input-deep-link-sms"
            className="sms-input-field"
            placeholder={props.intl.formatMessage({
              id: 'send-sms-modal-input-placeholder',
              defaultMessage: 'Enter number...',
            })}
            value={smsNumber}
            onChange={changeNumber}
            aria-invalid={smsNumber && !smsNumberValid()}
          />
        </label>
        <button onClick={doRequest}>
          <FormattedMessage
            id="send-sms-modal-submit"
            defaultMessage="Send link"
          />
        </button>
      </div>
    </PortalModal>
  );
}

SMSlinkModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  itinerary: PropTypes.object.isRequired,
};
SMSlinkModal.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};
export default injectIntl(SMSlinkModal);
