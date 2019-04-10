import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
<<<<<<< HEAD
  return axios.request({
    url: 'authentication/login',
    data: {
      loginName: userName,
      loginPassword: password
    },
=======
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
<<<<<<< HEAD
    url: 'authentication/info',
=======
    url: 'get_info',
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556
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
<<<<<<< HEAD

export const listUserMenus = (token) => {
  return axios.request({
    url: 'menu/nav',
    method: 'get'
  })
}
=======
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556
