/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const bookRouter = {
    path: '/book',
    component: Layout,
    redirect: 'noRedirect',
    name: 'bookResearch',
    meta: { title: 'bookResearch', icon: "book", roles: [0, 1] },
    children: [
        {
            path: 'list',
            component: () => import('@/views/course/bookList'),
            name: 'bookList',
            meta: { title: 'bookList', icon: 'documentation' }
        },
        {
            path: 'bookAdpter',
            component: () => import('@/views/course/bookChapter'),
            name: 'bookAdpter',
            hidden: true,
            meta: { title: 'bookAdpter', icon: "book" }
        }, 
        {

            path: 'bookAsk',
            component: () => import('@/views/course/bookAsk'),
            name: 'bookAsk',
            hidden: true,
            meta: {
                title: 'bookAsk', icon: "book"
            },
        },
        {

            path: 'questionsList',
            name: 'questionsList',
            hidden: true,
            meta: {
                title: 'questionsList',
            },
            component: () => import('@/views/course/question/questionsList'),
        },
        {
            hidden: true,
            path: 'chapterExercise',
            name: 'chapterExercise',
            meta: { title: 'chapterExercise', icon: "exam1" },
            component: () => import('@/views/course/question/chapterExercises'),
        },
        {
            hidden: true,
            path: 'mockExam',
            name: 'mockExam',
            meta: {
                title: 'mockExam', icon: "exam2"
            },
            component: () => import('@/views/course/question/mockExam'),
        },
        {
            hidden: true,
            path: 'highFrequency',
            name: 'highFrequency',
            meta: {
                title: 'highFrequency', icon: "exam3"
            },
            component: () => import('@/views/course/question/highFrequencyExam'),
        },
        {
            hidden: true,
            path: 'svipExam',
            name: 'svipExam',
            meta: { title: 'svipExam', icon: "exam4" },
            component: () => import('@/views/course/question/svipExam'),
        },

        {
            hidden: true,
            path: 'achievementAnalysis',
            name: 'achievementAnalysis',
            meta: { title: 'achievementAnalysis', icon: "exam6" },
            component: () => import('@/views/course/question/achievementAnalysis'),
        }
    ]
}
export default bookRouter
