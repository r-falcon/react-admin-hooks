export function setToken(token) {
  return localStorage.setItem('user_token', token)
}

export function getToken() {
  return localStorage.getItem('user_token')
}

export function isLogin() {
  return localStorage.getItem('user_token') !== null
}

export function setLocalUser(user) {
  return localStorage.setItem('user', JSON.stringify(user))
}

export function getLocalUser() {
  return JSON.parse(localStorage.getItem('user'))
}

export function setUserInfo(info) {
  return localStorage.setItem('user_info', JSON.stringify(info))
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem('user_info'))
}
