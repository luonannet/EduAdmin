import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '@/store'
import { isUndefined } from 'xe-utils/methods'
/**
 * Use meta.role to determine if the current user has permission
 * @param role
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param role
 */
export function filterAsyncRoutes(routes, role) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, newMyplatfromlist) {
    return new Promise(async resolve => {
      if (!store.getters.manager.Tel) {
        await store.dispatch('manager/getInfo')
      }
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(asyncRoutes, store.getters.manager.Role)

      let myPlatformList = store.getters.manager.myPlatformList;
      if (newMyplatfromlist) {
        myPlatformList = newMyplatfromlist;
      } 
      if (myPlatformList) {
        let index = 0;
        myPlatformList.forEach(platform => {
          index++;
          const platformRoute = {
            path: '/platform/' + index.toString(10),// platform.Id,
            redirect: 'noRedirect',
            component: Layout,
            name: platform.Id,
            meta: { title: platform.Label, icon: "platform" },
            children: [

              // {
              //   path: 'setting/' + platform.Id,
              //   component: () => import('@/views/platform/setting'),
              //   name: 'setting' + index.toString(10),
              //   meta: { title: 'setting', icon: 'tree' }
              // },
              {
                path: 'template/' + platform.Id,
                component: () => import('@/views/platform/template'),
                name: 'template' + index.toString(10),
                meta: { title: 'template', icon: 'tree' }
              },
              {
                path: 'news/' + platform.Id.toString(10),
                name: 'newsList' + index.toString(10),
                component: () => import('@/views/platform/web/news'),
                meta: { title: 'news', icon: "news" }
              },
              {
                path: 'party/' + platform.Id,
                name: 'party' + index.toString(10),
                component: () => import('@/views/platform/party'),
                meta: { title: 'party', icon: "wechat" }
              },
              {
                path: 'managers/' + platform.Id,
                component: () => import('@/views/manager/managerlist'),
                name: 'managerList' + index.toString(10),
                meta: { title: 'managerList', icon: "user" },

              }
              ,
              {
                path: 'list/' + platform.Id,
                component: () => import('@/views/student/studentList'),
                name: 'customList' + index.toString(10),
                meta: { title: 'platformCustom', icon: 'student' }
              },
              {
                path: 'classList/' + platform.Id,
                component: () => import('@/views/platform/classList'), // Parent router-view
                name: "classList" + index.toString(10),
                meta: { title: "classList", icon: "platform" }
              },
              {
                path: 'contractList/' + platform.Id,
                component: () => import('@/views/student/contractList'),
                name: 'contractList' + index.toString(10),
                meta: { title: 'contractList', icon: 'contract' }
              },
              {
                path: 'questions/' + platform.Id,
                component: () => import('@/views/course/bookAsk'),
                name: 'questions' + index.toString(10),
                meta: { title: 'questions', icon: "user" },
              }

            ]
          }
          accessedRoutes.push(platformRoute)
        })
      }
      // accessedRoutes.push(topPlatformRoute)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
