export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    if (store.state.user) {
      $axios.setToken(store.state.user.token.tokenSession, 'Bearer')
    }
  })
}
