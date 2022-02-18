import request from '@/utils/request'

const request_api = '/api/private/v1/'

export const loginApi = data =>
  request.post(`${request_api}login`, { data: data })
