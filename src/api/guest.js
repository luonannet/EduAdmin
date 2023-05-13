import request from '@/utils/request'
// 获取所有班级
export function listSchoolTeacher(url, param, data) {
  return request({
    url: '/guest/listSchoolTeacher'+url,
    method: 'get',
    params: param,
    data
  })
} 
// 获取所有班级
export function listPartyMembers(url, param, data) {
  return request({
    url: '/guest/listPartyMembers/'+url,
    method: 'get',
    params: param,
    data
  })
} 
