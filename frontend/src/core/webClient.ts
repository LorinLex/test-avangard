const BASE_HTTP_HOST = import.meta.env.BACKEND_HTTP_HOST || "http://localhost:8000/" ||  document.location.origin
const API_ENDPOINT = import.meta.env.API_ENDPOINT || ""
const BASE_URL = `${BASE_HTTP_HOST}/${API_ENDPOINT}`
const BASE_WS_HOST = import.meta.env.BACKEND_WS_HOST || "ws://localhost:8000/"
const WS_ENDPOINT = import.meta.env.WS_ENDPOINT || "ws"
const BASE_WS_URL = `${BASE_WS_HOST}${WS_ENDPOINT}`

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export const get_headers = () => {
  const token = localStorage.getItem("Authorization")
  if (token) {
    return {
      ...BASE_HEADERS,
      "Authorization": `Bearer ${token}`
    }
  }
  return BASE_HEADERS
}


export const get_axios_config = () => {
  return {
    baseURL: BASE_URL,
    headers: get_headers()
  }
}

export const getWebSocket = (userId: number) =>
  new WebSocket(`${BASE_WS_URL}/${userId}`)
