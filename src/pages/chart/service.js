import request from '@/utils/request'

const request_api = '/api/private/v1/'

export const echartsData = () => request.get(`${request_api}reports/type/1`)
