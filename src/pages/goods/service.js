import request from '@/utils/request'

const request_api = '/api/private/v1/'

// 商品列表
export const goodsList = params =>
  request.get(`${request_api}goods`, { params: params })
// 商品分类
export const goodsSort = params =>
  request.get(`${request_api}categories`, { params: params })
// 分类参数
export const sortParams = (sortId, params) =>
  request.get(`${request_api}categories/${sortId}/attributes`, {
    params: params
  })
// 添加商品
export const goodsAdd = data =>
  request.post(`${request_api}goods`, { data: data })
// 根据id查询商品
export const goodsById = id => request.get(`${request_api}goods/${id}`)
// 修改商品
export const goodsUpdate = (id, data) =>
  request.put(`${request_api}goods/${id}`, { data: data })
// 删除商品
export const goodsDelete = id => request.delete(`${request_api}goods/${id}`)
