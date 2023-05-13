import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import customRouter from './modules/custom'
import courseRouter from './modules/course'
import bookRouter from './modules/book'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: [1,0]    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/manager/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/system/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/system/401'),
    hidden: true
  },
  {
    path: '/',

    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',

        component: () => import('@/views/system/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/personalData',
    children: [
      {
        hidden: true,
        path: 'personalData',
        component: () => import('@/views/manager/personalData'),
        name: 'personalData',
        meta: { title: 'personalData', icon: 'dashboard' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/system',
    component: Layout,
    redirect: 'setting',
    name: 'system',
    meta: { title: 'system', icon: 'skill', roles: [0] },
    children: [
      {
        path: 'setting',
        component: () => import('@/views/system/setting'),
        name: 'setting',
        meta: { title: 'system', icon: 'edit' }
      },
      {
        path: 'college',
        component: () => import('@/views/course/college'),
        name: 'college',
        meta: { title: 'college', icon: 'college' }
      }
      , {
        path: 'docUpload',
        name: 'docUpload',
        component: () => import('@/views/platform/web/docDownload'),
        meta: { title: 'docUpload', icon: "docUpload" }
      }
    ]
  },
  {
    path: '/platform',
    component: Layout,
    redirect: 'platforList',
    name: 'platform',
    meta: { title: 'system', icon: 'skill', roles: [0] },
    children: [
      {
        path: 'platforList',
        component: () => import('@/views/platform/platform'),
        name: 'platforList',
        meta: { title: 'platform', icon: 'tree-table' }
      }
    ]
  },
  {
    path: '/manager',
    component: Layout,
    redirect: 'managerList',
    name: 'manager',
    meta: { title: 'system', icon: 'skill', roles: [0] },
    children: [
      {
        path: 'managerList',
        component: () => import('@/views/manager/managerlist'),
        name: 'managerList',
        meta: { title: 'managerList', icon: "user" }
      }
    ]
  },
  courseRouter,
  bookRouter,
  customRouter,
  // 404 page must be placed at the end !!!
  { path: '/scratch3/*', redirect: '/scratch3/index', hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
