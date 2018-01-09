import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const STATE = {
  user: null
}

const MUTATIONS = {
  saveUser (state) {
    Vue.$firebase.auth().onAuthStateChanged((user) => {
      state.user = user.user.uid
      console.log(state)
    })
  }
}

const ACTIONS = {
  saveUser: ({ commit }) => commit('saveUser'),
  signOut: ({ commit }) => commit('signOut'),
}


export default new Vuex.Store({
  STATE,
  ACTIONS,
  MUTATIONS
})