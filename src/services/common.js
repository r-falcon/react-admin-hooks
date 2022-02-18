import request from '@/utils/request'

const request_api = '/api/private/v1/'
// 获取商品分类
export const goodsSort = params =>
  request.get(`${request_api}categories`, { params: params })
