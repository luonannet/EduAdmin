import request from '@/utils/request'

// 获取课程列表-查询课程名称获取
export function getCourseList(url, param, data) {
  return request({
    url: '/course/list' + url,
    method: 'get',
    params: param,
    data
  })
}

// 获取课程类别
export function GetCourseOfKind(url, param, data) {
  return request({
    url: '/course/getCourseOfKind' + url,
    method: 'get',
    params: param,
    data
  })
}

// 设置课程是否上架
export function setCourseUpperShelf(url, param, data) {
  return request({
    url: '/course/setOpen/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 添加课程

export function addCourse(url, param, data) {
  return request({
    url: '/course/add' + url,
    method: 'post',
    params: param,
    data
  })
}
// 编辑课程
export function editCourse(url, param, data) {
  return request({
    url: '/course/update/' + url,
    method: 'put',
    params: param,
    data
  })
}

// 根据课程获取科目
export function getCourseBookByCourse(url, param, data) {
  return request({
    url: '/coursebook/getCourseBookByCourse/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 获取课程的宣传资料
export function getCourseTravelBrochure(url, param, data) {
  return request({
    url: '/course/getCourseShowInfo/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 修改课程的宣传资料
export function updateCourseTravelBrochure(url, param, data) {
  return request({
    url: '/course/updateCourseShowInfo/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 获取课程价格列表
export function getCoursePriceList(url, param, data) {
  return request({
    url: '/coursebook/getByCourse/' + url,
    method: 'get',
    params: param,
    data
  })
}
// 保存课程价格列表
export function saveCoursePriceList(url, param, data) {
  return request({
    url: '/coursebook/addCoursePrice' + url,
    method: 'post',
    params: param,
    data
  })
}

// 添加课程

export function addCourseKind(url, param, data) {
  return request({
    url: '/course_kind/add' + url,
    method: 'post',
    params: param,
    data
  })
}
// 编辑课程
export function editCourseKind(url, param, data) {
  return request({
    url: '/course_kind/update/' + url,
    method: 'put',
    params: param,
    data
  })
}
// 绕开学院，直接获取所有课程类别列表
export function getAllCourseKind(url, param, data) {
  return request({
    url: '/course_kind/getAllCourseKind' + url,
    method: 'get',
    params: param,
    data
  })
}

// 删除课程类别
export function deleteCourseKind(url, param, data) {
  return request({
    url: '/course_kind/delete/' + url,
    method: 'delete',
    params: param,
    data
  })
}
// 设置禁售校区
export function setForbiddenSellPlatform(url, param, data) {
  return request({
    url: '/course/setForbiddenSellPlatform/' + url,
    method: 'put',
    params: param,
    data
  })
} 
// 获取某些课程的所属教材列表
export function getBooksOfCourses(url, param, data) {
  return request({
    url: '/course/getBooksOfCourses/' + url,
    method: 'post',
    params: param,
    data
  })
}

