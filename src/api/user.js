import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: 'authentication/login',
    data: {
      loginName: userName,
      loginPassword: password
    },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'authentication/info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const listUserMenus = (token) => {
  return axios.request({
    url: 'menu/nav',
    method: 'get'
  })
}
