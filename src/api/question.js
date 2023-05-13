import request from '@/utils/request'

// 获取提问列表
export function getAskList(url, param, data) {
  return request({
    url: '/question/getAskList/' + url,
    method: 'get',
    params: param,
    data
  })
}


// 回复
export function reply(url, param, data) {
  return request({
    url: '/question/reply/' + url,
    method: 'post',
    params: param,
    data
  })
}
