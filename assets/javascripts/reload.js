/* eslint-disable*/
export function reload() {
  const wsClient = new WebSocket(window.location.href.replace('https', 'wss').replace('http', 'ws'))
  wsClient.onclose = () => setTimeout(() => reload(), 1000)
  wsClient.onopen = () => wsClient.onmessage = () => location.reload()
}
