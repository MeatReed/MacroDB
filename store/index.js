export const state = () => {
  return {
    user: null,
  }
}

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.user = userData
    this.$axios.setToken(userData.token.tokenSession, 'Bearer')
  },
  LOGOUT(state, userData) {
    state.user = null
    this.$axios.setToken(false)
  },
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.user) {
      commit('SET_USER_DATA', req.session.user)
    }
  },
  login({ commit }, { email, password, token }) {
    return this.$axios
      .$post(this.$axios.defaults.baseURL + '/api/login', {
        email,
        password,
        token,
      })
      .then((data) => {
        commit('SET_USER_DATA', data)
      })
  },
  register({ commit }, credentials) {
    return this.$axios
      .$post(this.$axios.defaults.baseURL + '/api/register', credentials)
      .then((data) => {
        commit('SET_USER_DATA', data)
      })
  },
  logout({ commit }) {
    return this.$axios
      .$post(this.$axios.defaults.baseURL + '/api/logout')
      .then((data) => {
        commit('LOGOUT')
      })
  },
  deleteUnverifiedApp({ commit }, data) {
    return this.$axios
      .$post(this.$axios.defaults.baseURL + '/api/apps/unverified/delete', data)
      .then((data) => {
        return data
      })
  },
  acceptUnverifiedApp({ commit }, data) {
    return this.$axios
      .$post(this.$axios.defaults.baseURL + '/api/apps/unverified/accept', data)
      .then((data) => {
        return data
      })
  },
  submitApp({ commit }, data) {
    return this.$axios
      .$post(this.$axios.defaults.baseURL + '/api/apps/submit', data)
      .then((data) => {
        return data
      })
  },
}
