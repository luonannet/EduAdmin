const state = {
  currentClassMate:{}, //当前选中的学员 
}

const mutations = {
  CHANGE_CLASSMATE: (state, studentInfo) => {
    state.currentClassMate = studentInfo
  }
}

const actions = { 
  addVisitedView({ commit }, view) {
    commit('CHANGE_CLASSMATE', view)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
