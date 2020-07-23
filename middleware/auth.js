export default function ({ store, redirect }) {
  if (!store.state.user) {
    return redirect('/')
  } else if (store.state.user.role !== 0) {
    return redirect('/')
  }
}
