import request from '@/utils/request' 
// 删除单条新闻数据
export function deleteOne(url, param, data) {
  return request({
    url: '/party/delete/'+url,
    method: 'delete',
    params: param,
    data
  })
}
// 编辑单条新闻数据
export function updateParty(url, param, data) {
  return request({
    url: '/party/updateParty/'+url,
    method: 'put',
    params: param,
    data
  })
}
// 添加单条新闻数据
export function addParty(url, param, data) {
  return request({
    url: '/party/add'+url,
    method: 'post',
    params: param,
    data
  })
}
// 添加单条新闻数据
export function getPartyList(url, param, data) {
  return request({
    url: '/party/getPartyList/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 添加单条新闻数据
export function getOne(url, param, data) {
  return request({
    url: '/party/'+url,
    method: 'get',
    params: param,
    data
  })
}

// 编辑单条新闻数据
export function setStatus(url, param, data) {
  return request({
    url: '/party/setStatus/'+url,
    method: 'put',
    params: param,
    data
  })
}
// 添加单条新闻数据
export function getPartyMembers(url, param, data) {
  return request({
    url: '/party/getPartyList/'+url,
    method: 'get',
    params: param,
    data
  })
}