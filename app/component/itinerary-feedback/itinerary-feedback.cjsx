React = require 'react'
Icon = require '../icon/icon'
intl = require 'react-intl'

FormattedMessage = intl.FormattedMessage

class ItineraryFeedback extends React.Component

  constructor: ->
    @state =
      voted: false
      # TODO: Use state to for instance disable vote buttons when already voted.

  @contextTypes:
    getStore: React.PropTypes.func.isRequired
    executeAction: React.PropTypes.func.isRequired
    intl: intl.intlShape.isRequired
    piwik: React.PropTypes.object

  rate: (rating) =>
    console.log "rated #{rating}"

    # Feedback.recordResult(@context.piwik, @context.getStore('TimeStore').getCurrentTime().valueOf(), @state.selectedNPS, @state.useThisMoreLikely, @state.openText)
    @context.piwik.setCustomVariable 4, 'itineraryFeedback', rating, 'summary'

    @state.voted = true

  render: ->
    <div className="itinerary-feedback">
      <div className="option" onClick={() => @rate(10)}><Icon img="icon-icon_thumb-up"/></div>
      <div className="option" onClick={() => @rate(1)}><Icon img="icon-icon_thumb-down"/></div>
    </div>

module.exports = ItineraryFeedback
