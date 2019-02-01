import React from 'react'
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoConnector } from '@cogitojs/cogito-react-ui'

class Connector extends React.Component {
  telepath
  state = {
    open: false
  }

  constructor () {
    super()
    this.telepath = new Telepath('https://telepath.cogito.mobi')
  }

  async componentDidMount () {
    const telepathChannel = await this.telepath.createChannel({ appName: 'Hush Hush' })
    this.setState({ telepathChannel })
  }

  onOpen = () => {
    this.setState({ open: true })
  }

  onDone = () => {
    this.setState({ open: false })
    console.log('ready to get your identity from ios app')
    this.props.onDone && this.props.onDone(this.state.telepathChannel, this.props.invite)
    // dispatch(AccountActions.get(this.props.telepathChannel))
  }

  onCancel = dispatch => {
    this.setState({ open: false })
  }

  getConnectUrl = () => {
    return this.state.telepathChannel.createConnectUrl('https://cogito.mobi')
  }

  render () {
    if (!this.state.telepathChannel) return null
    return (
      <div css={{ alignSelf: 'center', marginTop: '1rem' }}>
        <CogitoConnector open={this.state.open}
          buttonText={this.props.invite ? 'Invite...' : 'Go...'}
          buttonDisabled={this.props.disabled}
          buttonStyling={{ primary: true }}
          connectUrl={this.getConnectUrl()}
          onOpen={this.onOpen}
          onDone={this.onDone}
          onCancel={this.onCancel} />
      </div>
    )
  }
}

export { Connector }
