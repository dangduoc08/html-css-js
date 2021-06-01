import os from 'os'

class Network {
  private static instance: Network
  public lan!: string

  private getLAN(): string {
    let lan: string = ''
    Object.values(os.networkInterfaces()).forEach(networkInterface => {
      networkInterface?.forEach(iface => {
        if (iface.family === 'IPv4' && !iface.internal) {
          lan = iface.address
          return
        }
      })
    })
    return lan
  }

  static getInstance(): Network {
    if (!Network.instance) {
      Network.instance = new Network()
      Network.instance.lan = this.instance.getLAN()
    }
    return this.instance
  }
}

export {
  Network
}