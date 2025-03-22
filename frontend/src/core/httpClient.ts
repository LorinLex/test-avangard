import axios from "axios"

const BASE_HOST = import.meta.env.BACKEND_URL || "http://localhost:8000/" ||  document.location.origin
const API_ENDPOINT = import.meta.env.API_ENDPOINT || ""
const BASE_URL = `${BASE_HOST}/${API_ENDPOINT}`
const BASE_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const get_headers = () => {
  const token = localStorage.getItem("Authorization")
  if (token) {
    return {
      ...BASE_HEADERS,
      "Authorization": `Bearer ${token}`
    }
  }
  return BASE_HEADERS
}

export const axiosIns = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: get_headers()
});



