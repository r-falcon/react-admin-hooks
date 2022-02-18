import request from '@/utils/request'

const request_api = '/api/private/v1/'

export const orderList = params =>
  request.get(`${request_api}orders`, { params: params })

export const orderById = orderId =>
  request.get(`${request_api}orders/${orderId}`)
