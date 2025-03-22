export const getCookie = (name: string) =>
  document.cookie.split('; ')
    .filter(row => row.startsWith(`${name}=`))
    .map(c=>c.split('=')[1])[0]


export const setCookie = (name: string, value: string) =>
  document.cookie = `${name}=${value}`

export const EMAIL_REGEXP = /[\d\w\._\-%+-]+@[\d\w\._-]+\.[\w]{2,}/
