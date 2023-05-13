import request from '@/utils/request'

// 获取首页上的统计统计数据
export function setSystemData(url, query, data) {
  return request({
    url: '/system/setSystemData/' + url,
    method: 'post',
    params: query,
    data
  })
}

export function getSystemData(url, query, data) {
  return request({
    url: '/system/getSystemData/' + url,
    method: 'get',
    params: query,
    data
  })
} 