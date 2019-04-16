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

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/counts',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/info',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: `message/info/${msg_id}`,
    method: 'get'
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: `message/info/${msg_id}`,
    method: 'post'
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: `message/info/${msg_id}`,
    method: 'delete'
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: `message/info/${msg_id}`,
    method: 'put'
  })
}

