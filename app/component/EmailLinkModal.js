import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { locationShape, routerShape } from 'react-router';
import PortalModal from './PortalModal';
import SecondaryButton from './SecondaryButton';
import Icon from './Icon';
import { getFrom, getTo, getFromStartTime } from '../util/routeDeepLinkUtils';

function EmailLinkModal(props, context) {
  const [email, setEmail] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const requestDeepLinkEmail = async (requestUrl, options) => {
    await fetch(requestUrl, {
      method: 'post',
      headers: {
        'Kyyti-App-AppId': context.config.appBundleId,
        Accept: 'application/json',
      },
      body: JSON.stringify({ ...options }),
    });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(props.deepLink);
    setCopySuccess(true);
  };

  const emailValid = () => /^.+@.+\..{2,}/.test(email);

  const doRequest = async () => {
    if (emailValid()) {
      await requestDeepLinkEmail(
        context.config.sendAppLinkEmailRequestEndpoint,
        {
          email,
          from: getFrom(props.itinerary),
          to: getTo(props.itinerary),
          startTime: getFromStartTime(props.itinerary),
        },
      );
    }
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
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SecondaryButton
            ariaLabel="copy-link"
            buttonClickAction={copyLinkToClipboard}
            buttonName="copy-link-to-clipboard"
            buttonIcon="icon-icon_clipboard"
            iconViewBox="0 0 24 24"
          />

          {copySuccess && (
            <div
              style={{
                marginLeft: '5px',
                flexDirection: 'row',
                marginBottom: '20px',
              }}
            >
              <Icon
                img="icon-icon_thumb-up"
                viewBox="0 0 24 24"
                color="green"
                style={{ marginRight: '5px' }}
              />
              <FormattedMessage
                id="copy-link-to-clipboard-copied"
                defaultMessage="Copied!"
              />
            </div>
          )}
        </div>

        <label htmlFor="input-deep-link-email" className="form-input">
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
        <button type="submit" onClick={doRequest} className="primary-button">
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
  deepLink: PropTypes.string.isRequired,
  // eslint-disable-next-line
  itinerary: PropTypes.object.isRequired,
};
EmailLinkModal.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};
export default injectIntl(EmailLinkModal);
