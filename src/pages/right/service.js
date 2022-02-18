import request from '@/utils/request'

const request_api = '/api/private/v1/'

export const rightList = type => request.get(`${request_api}rights/${type}`)

export const roleList = () => request.get(`${request_api}roles`)

export const deleteAssignRole = (roleId, rightId) =>
  request.delete(`${request_api}roles/${roleId}/rights/${rightId}`)

export const addRole = data =>
  request.post(`${request_api}roles`, { data: data })

export const editRole = (id, data) =>
  request.put(`${request_api}roles/${id}`, { data: data })

export const deleteRole = id => request.delete(`${request_api}roles/${id}`)

export const setRole = (roleId, rids) =>
  request.post(`${request_api}roles/${roleId}/rights`, { data: { rids: rids } })
