import { extend } from 'umi-request'
import { notification } from 'antd'
import codeMessage from './codeMessage'
import { getToken } from './auth'

const baseUrl = '/api'

const errorHandler = error => {
  const { response } = error
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status, url } = response

    notification.error({
      message: `请求错误${status}:${url}`,
      description: errorText
    })
  } else {
    notification.error({
      description: '网络发生异常，无法连接服务器',
      message: '网络异常'
    })
  }
  return response
}

const request = extend({
  // 默认错误处理
  errorHandler,
  // 默认前缀
  prefix: baseUrl,
  // 超时
  timeout: 15000,
  // 请求头
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: getToken() ? getToken() : null
  }
  // 默认请求是否带上cookie
  // credentials: 'include',
})

// request 拦截器
request.interceptors.request.use((url, options) => {
  if (getToken()) {
    options = { ...options, Authorization: getToken() }
  }
  return {
    url: url,
    options: { ...options }
  }
})

// response 拦截器
request.interceptors.response.use(async response => {
  const res = await response.clone().json()
  const code = res.meta.status
  if (code === 200 || code === 201) {
    return res
  } else {
    return codeMessage[code]
  }
})

export default request
