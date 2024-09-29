import { ref } from 'vue'
import { defaultWindow } from '@/helper'
import { useSupported } from '@/compositions/useSupported'
import { useEventListener } from '@/compositions/useEventListener'

export function useScreenOrientation(options = {}) {
  const {
    window = defaultWindow,
  } = options

  const isSupported = useSupported(() => window && 'screen' in window && 'orientation' in window.screen)

  const screenOrientation = (isSupported.value ? window.screen.orientation : {})

  // portrait-primary, portrait-secondary, landscape-primary, or landscape-secondary
  const orientation = ref(screenOrientation.type)
  // document's current orientation angle.
  const angle = ref(screenOrientation.angle || 0)

  if (isSupported.value) {
    useEventListener(window, 'orientationchange', () => {
      orientation.value = screenOrientation.type
      angle.value = screenOrientation.angle
    })
  }

  const lockOrientation = (type) => {
    if (isSupported.value && typeof screenOrientation.lock === 'function')
      return screenOrientation.lock(type)

    return Promise.reject(new Error('Not supported'))
  }

  const unlockOrientation = () => {
    if (isSupported.value && typeof screenOrientation.unlock === 'function')
      screenOrientation.unlock()
  }

  return {
    isSupported,
    orientation,
    angle,
    lockOrientation,
    unlockOrientation,
  }
}
