import { login, getInfo } from '@/api/manager'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  manager: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_MANAGER: (state, data) => {
    state.manager = data
  },
  SET_MY_MANAGER: (state, data) => {
    state.manager = data
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    // const { tel, password ,captcha} = userInfo
    return new Promise((resolve, reject) => {
      login('', '', userInfo).then(response => {
        commit('SET_MANAGER', response.data)
        commit('SET_TOKEN', response.title)
        setToken(response.title)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  // // get user info
  getInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo("", "", "").then(response => {
        commit('SET_MANAGER', response.data)
        commit('SET_TOKEN', response.title)
        setToken(response.title)
        dispatch('app/getPlatformList', null, { root: true })
        dispatch('app/getCollegeWithCourseKind', null, { root: true })
        // dispatch('app/getQuestionTypes', null, { root: true })

        resolve()
      }).catch(error => {
        console.log(error)
      })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_MANAGER', null)
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_MANAGER', {})
      removeToken()
      resolve()
    })
  },
  setMyManager({ commit }, userInfo) {
    console.log("======setMyManager=====")
    // const { tel, password ,captcha} = userInfo
    return new Promise((resolve, reject) => {
      commit('SET_MY_MANAGER', userInfo) 
      resolve()

    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
