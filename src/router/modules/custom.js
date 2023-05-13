/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const customRouter = {
  path: '/student',
  component: Layout,
  redirect: 'noRedirect',
  name: 'student',
  meta: {
    title: 'customManage',
    icon: 'peoples'
    , roles: [ 0]
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/student/studentList'),
      name: 'customList',
      meta: {
        title: 'customList',
        icon: 'student'

      }
    },
    {
      path: 'trackList',
      component: () => import('@/views/student/trackList'),
      name: 'trackList',
      meta: {
        title: 'trackList',
        icon: 'zuji'

      }
    },
    {
      path: 'contractList',
      component: () => import('@/views/student/contractList'),
      name: 'contractList',
      meta: {
        title: 'contractList',
        icon: 'contract'

      }
    },
    // {
    //   path: 'sendSMS',
    //   component: () => import('@/views/business/sendSMS'),
    //   name: 'sendSMS',
    //   meta: {
    //     title: 'sendSMS',
    //     icon: 'email'
    //   }
    // }

  ]
}
export default customRouter
