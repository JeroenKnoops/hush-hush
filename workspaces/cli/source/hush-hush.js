
import QRCode from 'qrcode'

import messages from './messages'
import { Telepath } from '@cogitojs/telepath-js'

export default class HushHush {
  constructor (opts) {
    this.opts = opts
    this.welcome()
    this.setupTelepath()
  }

  welcome () {
    console.log(messages.welcomeMessage(this.opts.recipient))
  }

  async telepathChannel () {
    const telepathChannel = await this.telepath.createChannel({ appName: 'Hush Hush' })
    return telepathChannel
  }

  async setupTelepath () {
    this.telepath = new Telepath('https://telepath.cogito.mobi')
    this.telepathChannel = await this.telepathChannel()
    console.log(this.qrcode(this.telepathChannel.createConnectUrl('https://cogito.mobi')))
  }

  qrcode (connectUrl) {
    console.log(connectUrl)
    return QRCode.toString(connectUrl, { type: 'terminal' }, function (err, output) {
      if (err) throw err
      return output
    })
  }
}
