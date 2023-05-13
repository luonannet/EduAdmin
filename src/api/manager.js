import request from '@/utils/request'

export function login(url, param, data) {
  return request({
    url: '/manager/login' + url,
    method: 'post',
    params: param,
    data
  })
}

export function getInfo(url, param, data) {
  return request({
    url: '/manager/info/mine' + url,
    method: 'get',
    params: param,
    data
  })
}

export function logout(url, param, data) {
  return request({
    url: '/manager/logout' + url,
    method: 'post',
    params: param,
    data
  })
}

export function updateMyInfo(url, param, data) {
  return request({
    url: '/manager/updateMyInfo/mine' + url,
    method: 'put',
    params: param,
    data
  })
}

export function updatePSWD(url, param, data) {
  return request({
    url: '/manager/updatePSWD/mine' + url,
    method: 'put',
    params: param,
    data
  })
} 
 
export function getCodeImg(url, param, data) {
  return request({
    url: '/manager/getCaptcha/' + url,
    method: 'post',
    params: param,
    data
  })
} 

// -----------------------------
export function getManagerList(url, param, data) {
  return request({
    url: '/manager/list' + url,
    method: 'get',
    params: param,
    data
  })
}
export function getLoginPhoneCode(url, param, data) {
  return request({
    url: '/manager/captcha' + url,
    method: 'post',
    params: param,
    data
  })
}
export function editManager(url, param, data) {
  return request({
    url: '/manager/update/' + url,
    method: 'put',
    params: param,
    data
  })
}
export function addManager(url, param, data) {
  return request({
    url: '/manager/add/' + url,
    method: 'post',
    params: param,
    data
  })
}
export function setStateManager(url, param, data) {
  return request({
    url: '/manager/setState/' + url,
    method: 'put',
    params: param,
    data
  })
}
export function resetPasswordManager(url, param, data) {
  return request({
    url: '/manager/resetpswd/' + url,
    method: 'put',
    params: param,
    data
  })
}
export function getManagerRight(url, param, data) {
  return request({
    url: '/manager/getRight/withLabel/' + url,
    method: 'get',
    params: param,
    data
  })
}
export function setManagerRight(url, param, data) {
  return request({
    url: '/manager/setRight/' + url,
    method: 'put',
    params: param,
    data
  })
}
export function getAllTeacher(url, param, data) {
  return request({
    url: '/manager/' + url,
    method: 'get',
    params: param,
    data
  })
}
 
export function getPlatforms(url, param, data) {
  return request({
    url: '/manager/getPlatforms/' + url,
    method: 'get',
    params: param,
    data
  })
}
export function setPlatform(url, param, data) {
  return request({
    url: '/manager/setPlatform/' + url,
    method: 'put',
    params: param,
    data
  })
}

