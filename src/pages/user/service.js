import request from '@/utils/request'

const request_api = '/api/private/v1/'

export const userTable = params =>
  request.get(`${request_api}users`, { params: params })

export const roleList = () => request.get(`${request_api}roles`)

export const addUser = data =>
  request.post(`${request_api}users`, { data: data })

export const editUser = (id, data) =>
  request.put(`${request_api}users/${id}`, { data: data })

export const changeStatus = (id, type) =>
  request.put(`${request_api}users/${id}/state/${type}`)

export const deleteUser = id => request.delete(`${request_api}users/${id}`)

export const setterUser = (id, rid) =>
  request.put(`${request_api}users/${id}/role`, { data: { rid: rid } })
