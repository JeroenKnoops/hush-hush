import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import { FadingValueBox } from '../animations'
import { Blue } from '../ui'

class Pending extends Component {
  onDone = () => {
    this.props.onDone && this.props.onDone()
  }
  render () {
    return (
      <FadingValueBox>
        <div css={{ display: 'flex', width: '100%', flexFlow: 'column nowrap', alignItems: 'center' }}>
          <div css={{ width: '100%', textAlign: 'center' }}>
            Invitation to <Blue>{this.props.recipient}</Blue> is pending.
          </div>
          <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
            We suggest that you r(h)ush your recipient to accept invitation.
          </div>
          <div css={{ width: '100%', textAlign: 'center', margin: '20px 0 20px 0' }}>
            BTW: did you email the invitation to <Blue>{this.props.recipient}</Blue>?
          </div>
          <Button primary onClick={this.onDone}>Try again later...</Button>
        </div>
      </FadingValueBox>
    )
  }
}

export { Pending }
