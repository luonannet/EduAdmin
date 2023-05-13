import request from '@/utils/request'
// 获取所有班级
export function getAllClass(url, param, data) {
  return request({
    url: '/class/list'+url,
    method: 'get',
    params: param,
    data
  })
}
// 编辑班级的基本信息
export function editClassInfo(url, param, data) {
  return request({
    url: '/class/update/'+url,
    method: 'put',
    params: param,
    data
  })
}
// 添加班级的基本信息
export function addClassInfo(url, param, data) {
  return request({
    url: '/class/add'+url,
    method: 'post',
    params: param,
    data
  })
}
// 获取某个班级的所有学员
export function getOneClass(url, param, data) {
  return request({
    url: '/class/getone/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 设置班主任
export function setClassManager(url, param, data) {
  return request({
    url: '/class/setClassManager/'+url,
    method: 'post',
    params: param,
    data
  })
}
// 获取班级的开班申请的资料
export function getClassTeachers(url, param, data) {
  return request({
    url: '/class/getClassTeachers/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 根据月份获取班级的课程表
export function getTimeTableByMonth(url, param, data) {
  return request({
    url: '/class/getMonthClassDaily/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 添加班级的课程表
export function addClassDaily(url, param, data) {
  return request({
    url: '/class/addClassDaily/'+url,
    method: 'post',
    params: param,
    data
  })
}
// 添加课程表对应的考勤数据
export function addClassCheck(url, param, data) {
  return request({
    url: '/class/addClassCheck/'+url,
    method: 'post',
    params: param,
    data
  })
}
// 获取课程表对应的考勤数据
export function getClassDaily(url, param, data) {
  return request({
    url: '/class/getClassDaily/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 设置班级学生
export function addClassStudent(url, param, data) {
  return request({
    url: '/class/addClassStudent/'+url,
    method: 'post',
    params: param,
    data
  })
}
// 获取班级学生
export function getClassStu(url, param, data) {
  return request({
    url: '/class/getClassStudents/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 分发作业
export function sendStudentsExercise(url, param, data) {
  return request({
    url: '/class/sendStudentsExercise/'+url,
    method: 'put',
    params: param,
    data
  })
}
// 获取分发记录-全班
export function getClassFinishExercise(url, param, data) {
  return request({
    url: '/class/getClassFinishExercise/'+url,
    method: 'get',
    params: param,
    data
  })
}
// 删除 班级学员
export function removeClassStudent(url, param, data) {
  return request({
    url: '/class/removeClassStudent/'+url,
    method: 'post',
    params: param,
    data
  })
}


// 获取某个学员的作业
export function getClassMateWorks(url, query, data) {
  return request({
    url: '/class/getClassMateWorks/' + url,
    method: 'get',
    params: query,
    data
  })
}

// 获取某个学员的作业
export function addClassCourse(url, query, data) {
  return request({
    url: '/class/addClassCourse/' + url,
    method: 'post',
    params: query,
    data
  })
}

// 获取某个学员的作业
export function removeClassCourse(url, query, data) {
  return request({
    url: '/class/removeClassCourse/' + url,
    method: 'post',
    params: query,
    data
  })
}
// 获取某个学员的作业
export function getClassCourse(url, query, data) {
  return request({
    url: '/class/getClassCourse/' + url,
    method: 'get',
    params: query,
    data
  })
}
// 分发作业给学员
export function sendStudentsWorks(url, query, data) {
  return request({
    url: '/class/sendStudentsWorks/' + url,
    method: 'put',
    params: query,
    data
  })
}
// 分发作业给学员
export function getClassOldWorks(url, query, data) {
  return request({
    url: '/class/getClassOldWorks/' + url,
    method: 'get',
    params: query,
    data
  })
}
//  
export function getClassStudentWorks(url, query, data) {
  return request({
    url: '/class/getClassStudentWorks/' + url,
    method: 'get',
    params: query,
    data
  })
}
//获取班级的试卷 
export function getClassExercise(url, query, data) {
  return request({
    url: '/class/getClassExercise/' + url,
    method: 'get',
    params: query,
    data
  })
}

//获取单个学员的作业 
export function getOneStudentWorks(url, query, data) {
  return request({
    url: '/class/getOneStudentWorks/' + url,
    method: 'get',
    params: query,
    data
  })
}






