import request from '@/utils/request'
//   ----------------学员跟进记录相关操作---------------------
// 获取学员的跟进数据
export function getCustomTracks(url, query, data) {
  return request({
    url: '/studenttrack/getStudentTracks/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加学员的跟进数据
export function addcustomTracks(url, query, data) {
  return request({
    url: '/studenttrack/addStudentTrack' + url,
    method: 'post',
    params: query,
    data
  })
} 
// 回复跟进记录
export function replyTracks(url, query, data) {
  return request({
    url: '/studenttrack/replyStudentTrack/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 学员回复短信，写入跟进记录
export function receiveSmsTrack(url, query, data) {
  return request({
    url: '/studenttrack/receiveSmsTrack/' + url,
    method: 'post',
    params: query,
    data
  })
}
// 获取跟进记录列表
export function getTrackList(url, query, data) {
  return request({
    url: '/studenttrack/getAllTracks/' + url,
    method: 'get',
    params: query,
    data
  })
}

//   ----------------学员购买课程相关操作---------------------

// 获取学员购买课程的记录
export function getCustomBuyCouseRecord(url, query, data) {
  return request({
    url: '/student/queryStudentPayedRecord' + url,
    method: 'get',
    params: query,
    data
  })
}
// 手动添加学员购买课程的记录
export function addCustomBuyCourseRecord(url, query, data) {
  return request({
    url: '/manager/giveBuyCourse/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 是否允许学员做题
export function customAllowDoExercise(url, query, data) {
  return request({
    url: '/coursebook/forbidden/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 删除学员的购买记录。
export function deleteBuyCourse(url, query, data) {
  return request({
    url: '/managecourse/deleteBuyCourse/' + url,
    method: 'delete',
    params: query,
    data
  })
}
//   ----------------学员个人信息相关操作---------------------

// 获取学员信息列表
export function getStudentList(url, query, data) {
  return request({
    url: '/student/list' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加学员信息
export function addStudent(url, query, data) {
  return request({
    url: '/student/add' + url,
    method: 'post',
    params: query,
    data
  })
}
// 修改学员信息
export function editStudent(url, query, data) {
  return request({
    url: '/student/update/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 重置学员密码
export function resetStudentPassword(url, query, data) {
  return request({
    url: '/student/resetpswd/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 禁用或启用学员账户
export function setStudentStatus(url, query, data) {
  return request({
    url: '/student/setState/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 检查这个电话号码是否已经注册
export function checkTelephone(url, query, data) {
  return request({
    url: '/student/checkTelephone/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 设置重点学员
export function setStar(url, query, data) {
  return request({
    url: '/student/markFocus/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 批量转移学员的管理员
export function batchChangeManager(url, query, data) {
  return request({
    url: '/student/batchChangeManager/' + url,
    method: 'post',
    params: query,
    data
  })
}
