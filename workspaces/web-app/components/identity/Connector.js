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

  onOpen = dispatch => {
    this.setState({ open: true })
  }

  onDone = dispatch => {
    this.setState({ open: false })
    console.log('ready to get your identity from ios app')
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
          buttonText='Go...'
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
