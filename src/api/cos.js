import request from '@/utils/request'
// 获取所有班级
export function getCosTempKey(url, param, data) {
  return request({
    url: '/helper/getCOSTempKey'+url,
    method: 'get',
    params: param,
    data
  })
}