import { getCurrentInstance, onMounted, ref } from 'vue'

export function useMounted() {
  const isMounted = ref(false)

  const instance = getCurrentInstance()
  if (instance) {
    onMounted(() => {
      isMounted.value = true
    }, instance)
  }

  return isMounted
}
