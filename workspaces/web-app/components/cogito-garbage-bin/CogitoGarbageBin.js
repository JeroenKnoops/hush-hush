import { CogitoRequest } from './CogitoRequest'

class CogitoGarbageBin {
  channel

  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
  }

  store = async ({ key, value }) => {
    const request = CogitoRequest.create('addKeyValuePair', { key, value })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
  }

  get = async ({ key }) => {
    const request = CogitoRequest.create('getValueForKey', { key })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    return response.result
  }

  delete = async ({ key }) => {
    const request = CogitoRequest.create('deleteKey', { key })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
  }
}

export { CogitoGarbageBin }
