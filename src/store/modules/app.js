import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'
import { getQuestionTypes } from "@/api/exercise";
import { getCollegeWithCourseKind } from '@/api/college'
import { queryPlatform } from '@/api/platform'
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  platformList: [],//所有的平台列表
  collegeWithCourseKind: [],// 
  questionTypes: [
    {
      "ID": 1,
      "Label": "单项选择题"
    },
    {
      "ID": 2,
      "Label": "多项选择题"
    },
    {
      "ID": 3,
      "Label": "判断题"
    },
    {
      "ID": 4,
      "Label": "案例分析"
    }],
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_PLATFORMLIST: (state, data) => {
    state.platformList = data
  },
  SET_COLLEGEWITHCOURSEKIND: (state, data) => {
    state.collegeWithCourseKind = data
  },
  SET_QUESTIONTYPES: (state, data) => {
    state.questionTypes = data
  },


  PUSH_PLATFORM: (state, newItem) => {
    let hasIn = false;
    state.platformList.forEach(item => {
      if (item.Id === newItem.Id) {
        item = newItem;
        hasIn = true;
        return
      }
    })
    if (hasIn == false) {
      state.platformList.push(newItem);
    }
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },


  // getPlatformList
  getPlatformList({ commit }) {
    return new Promise((resolve, reject) => {
      queryPlatform('', '', '').then(response => {
        commit('SET_PLATFORMLIST', response.data);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // getPlatformList
  getCollegeWithCourseKind({ commit }) {
    return new Promise((resolve, reject) => {
      getCollegeWithCourseKind('', { "include": 1 }, '').then(response => {
        commit('SET_COLLEGEWITHCOURSEKIND', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
 
  pushPlatform({ commit }, data) {
    commit('PUSH_PLATFORM', data)
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
