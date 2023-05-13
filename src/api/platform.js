import request from '@/utils/request'
// 获取列表
export function queryPlatform(url, query, data) {
  return request({
    url: '/platform/list' + url,
    method: 'get',
    params: query,
    data
  })
}
// 添加

export function addPlatform(url, query, data) {
  return request({
    url: '/platform/addPlatform' + url,
    method: 'post',
    params: query,
    data
  })
}

// 修改
export function updatePlatform(url, query, data) {
  return request({
    url: '/platform/updatePlatform/' + url,
    method: 'put',
    params: query,
    data
  })
}
 
 
 
// 获取的某个校区的所有工作人员
export function getAllManagerOfPlatform(url, query, data) {
  return request({
    url: '/platform/getAllManagerOfPlatform/' + url,
    method: 'get',
    params: query,
    data
  })
}


// 设置的管理员
export function setPlatformMaster(url, query, data) {
  return request({
    url: '/platform/setPlatformMaster/' + url,
    method: 'put',
    params: query,
    data
  })
}
 

 
export function getWebTemplate(url, query, data) {
  return request({
    url: '/platform/getWebTemplate/' + url,
    method: 'get',
    params: query,
    data
  })
}
export function setWebTemplate(url, query, data) {
  return request({
    url: '/platform/setWebTemplate/' + url,
    method: 'put',
    params: query,
    data
  })
}


//  
export function setWebContent(url, query, data) {
  return request({
    url: '/platform/setWebContent/' + url,
    method: 'put',
    params: query,
    data
  })
}


//  
export function getWebContent(url, query, data) {
  return request({
    url: '/platform/getWebContent/' + url,
    method: 'get',
    params: query,
    data
  })
}
 
//  
export function deleteWebTemplate(url, query, data) {
  return request({
    url: '/platform/deleteWebTemplate/' + url,
    method: 'delete',
    params: query,
    data
  })
}


//  savePreviewPage 预览官网页面
export function savePreviewPage(url, query, data) {
  return request({
    url: '/platform/savePreviewPage/' + url,
    method: 'put',
    params: query,
    data
  })
}
 
 
 


// //  
// export function getHeader(url, query, data) {
//   return request({
//     url: '/platform/getHeader/' + url,
//     method: 'get',
//     params: query,
//     data
//   })
// }
 

 
// //  
// export function setFooter(url, query, data) {
//   return request({
//     url: '/platform/setFooter/' + url,
//     method: 'put',
//     params: query,
//     data
//   })
// }


// //  
// export function getFooter(url, query, data) {
//   return request({
//     url: '/platform/getFooter/' + url,
//     method: 'get',
//     params: query,
//     data
//   })
// }
 
// //  
// export function getHeaderFooter(url, query, data) {
//   return request({
//     url: '/platform/getHeaderFooter/' + url,
//     method: 'get',
//     params: query,
//     data
//   })
// }
 
 
// //  
// export function setHeaderFooter(url, query, data) {
//   return request({
//     url: '/platform/setHeaderFooter/' + url,
//     method: 'put',
//     params: query,
//     data
//   })
// }

