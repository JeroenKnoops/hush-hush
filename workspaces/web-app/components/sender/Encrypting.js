import React from 'react'
// import { Encryptor } from '../crypto'

class Encrypting extends React.Component {
  state = {
    status: 'encrypting your secret...'
  }

  componentDidMount () {
    const { secret, recipient, telepathChannel: { id } } = this.props
    this.setState({
      status: `Sending ${secret} to ${recipient} on channel ${id}`
    })
  }

  render () {
    return (
      <div>
        {this.state.status}
      </div>
    )
  }
}

export { Encrypting }
