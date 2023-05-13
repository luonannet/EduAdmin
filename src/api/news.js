import request from '@/utils/request'
// 获取资料列表
export function getDocument(url, param, data) {
  return request({
    url: '/news/getDocument/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 获取竞赛活动
export function getActive(url, param, data) {
  return request({
    url: '/news/getActive/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 获取新闻列表
export function GetPlatformNews(url, param, data) {
  return request({
    url: '/news/getPlatformNews/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 删除单条新闻数据
export function deleNewsRow(url, param, data) {
  return request({
    url: '/news/delete/'+url,
    method: 'delete',
    params: param,
    data
  })
}
// 编辑单条新闻数据
export function editNewsRow(url, param, data) {
  return request({
    url: '/news/updateNews/'+url,
    method: 'put',
    params: param,
    data
  })
}
// 添加单条新闻数据
export function addNewsRow(url, param, data) {
  return request({
    url: '/news/add'+url,
    method: 'post',
    params: param,
    data
  })
}
