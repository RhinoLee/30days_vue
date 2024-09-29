import { ref } from 'vue'
import { defaultWindow } from '@/helper'
import { useSupported } from '@/compositions/useSupported'
import { useEventListener } from '@/compositions/useEventListener'

export function useDeviceOrientation(options = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'DeviceOrientationEvent' in window)

  const isAbsolute = ref(false)
  const alpha = ref(null)
  const beta = ref(null)
  const gamma = ref(null)

  if (window && isSupported.value) {
    useEventListener(window, 'deviceorientation', (event) => {
      isAbsolute.value = event.absolute
      alpha.value = event.alpha
      beta.value = event.beta
      gamma.value = event.gamma
    })
  }

  return {
    isSupported,
    isAbsolute,
    alpha,
    beta,
    gamma,
  }
}
