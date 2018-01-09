const LOGIN = "LOGIN"
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGOUT = "LOGOUT"

const store = new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem("token")
  },
  mutations: {
    [LOGIN] (state) {
      state.pending = true
    },
    [LOGIN_SUCCESS] (state) {
      state.isLoggedIn = true
      state.pending = false
    },
    [LOGOUT](state) {
      state.isLoggedIn = false
    }
  }
})