import request from '@/utils/request'
// 获取指定大类的科目列表
export function listCert(url, param, data) {
  return request({
    url: '/cert/listCert' + url,
    method: 'get',
    params: param,
    data
  })
}
 // 获取指定大类的科目列表
export function deleteCert(url, param, data) {
  return request({
    url: '/cert/delete/' + url,
    method: 'delete',
    params: param,
    data
  })
}
  // 获取指定大类的科目列表 
export function addCert(url, param, data) {
  return request({
    url: '/cert/addCert' + url,
    method: 'post',
    params: param,
    data
  })
}
  // 获取指定大类的科目列表
export function updateCert(url, param, data) {
  return request({
    url: '/cert/updateCert/' + url,
    method: 'put',
    params: param,
    data
  })
}
 