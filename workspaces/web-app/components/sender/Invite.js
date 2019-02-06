import React from 'react'

import { FadingValueBox } from '../animations'
import { Button } from 'semantic-ui-react'

import { FormatBlue } from './FormatBlue'

class Invite extends React.Component {
  invite = () => {
    this.props.onInvite && this.props.onInvite()
  }

  cancel = () => {
    this.props.onCancel && this.props.onCancel()
  }

  render () {
    return (
      <FadingValueBox css={{ alignItems: 'center' }}>
        <div css={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
          Looks like you never, ever hushed anything with <FormatBlue>{`${this.props.recipient}`}</FormatBlue>
        </div>
        <div css={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
          In order to hush we need to establish a special hushing relationship with the recipient.
          Invite <FormatBlue>{`${this.props.recipient}`}</FormatBlue> now to become your hushing buddy.
        </div>
        <div css={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
          No pressure...
        </div>
        <div css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
          <Button primary onClick={this.invite}>Invite...</Button>
          <Button onClick={this.cancel}>Maybe later...</Button>
        </div>
      </FadingValueBox>
    )
  }
}

export { Invite }
