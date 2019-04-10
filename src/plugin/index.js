<<<<<<< HEAD
import config from '@/config'
const { plugin } = config

export default (Vue) => {
  for (let name in plugin) {
    const value = plugin[name]
    Vue.use(require(`./${name}`).default, typeof value === 'object' ? value : undefined)
  }
}
=======
import config from '@/config'
const { plugin } = config

export default (Vue) => {
  for (let name in plugin) {
    const value = plugin[name]
    Vue.use(require(`./${name}`).default, typeof value === 'object' ? value : undefined)
  }
}
>>>>>>> 1d06fb3a01ddefa6e96ab6b024b816bd877ab556
