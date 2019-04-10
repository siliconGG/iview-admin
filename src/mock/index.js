import Mock from 'mockjs'
<<<<<<< HEAD
import { login, logout, getUserInfo, getUserMenus } from './login'
import { getTableData, getDragList } from './data'

// 登录相关和获取用户信息
// Mock.mock(/\/login/, login)
// Mock.mock(/\/get_info/, getUserInfo)
=======
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList } from './data'

// 登录相关和获取用户信息
Mock.mock(/\/login/, login)
Mock.mock(/\/get_info/, getUserInfo)
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')
<<<<<<< HEAD
Mock.mock(/\/menu\/nav/, getUserMenus)
=======
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556

export default Mock
