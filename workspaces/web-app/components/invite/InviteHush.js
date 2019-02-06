import React from 'react'

import { NoInvitation } from './NoInvitiation'
import { ProcessInvitation } from './ProcessInvitation'

class InviteHush extends React.Component {
  state = {
    invitationOk: false
  }

  componentDidMount () {
    if (window.location.hash) {
      const invitation = window.location.hash.substring(1)
      console.log(invitation)
      this.setState({ invitation, invitationOk: true })
    }
  }

  render () {
    if (!this.state.invitationOk) {
      return (
        <NoInvitation />
      )
    }
    return (
      <ProcessInvitation invitation={this.state.invitation} />
    )
  }
}

export { InviteHush }
