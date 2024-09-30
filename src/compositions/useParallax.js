import { computed, reactive } from 'vue'
import { useDeviceOrientation } from '@/compositions/useDeviceOrientation'
import { useMouseInElement } from '@/compositions/useMouseInElement'
import { useScreenOrientation } from '@/compositions/useScreenOrientation'
import { defaultWindow } from '@/helper'

export function useParallax(target, options = {}) {
  const {
    deviceOrientationTiltAdjust = i => i,
    deviceOrientationRollAdjust = i => i,
    mouseTiltAdjust = i => i,
    mouseRollAdjust = i => i,
    window = defaultWindow,
  } = options

  const orientation = reactive(useDeviceOrientation({ window }))
  const screenOrientation = reactive(useScreenOrientation({ window }))
  const {
    elementX: x,
    elementY: y,
    elementWidth: width,
    elementHeight: height,
  } = useMouseInElement(target, { handleOutside: false, window })

  const source = computed(() => {
    if (orientation.isSupported
      && ((orientation.alpha != null && orientation.alpha !== 0) || (orientation.gamma != null && orientation.gamma !== 0))
    ) {
      return 'deviceOrientation'
    }
    return 'mouse'
  })

  const roll = computed(() => {
    if (source.value === 'deviceOrientation') {
      let value
      switch (screenOrientation.orientation) {
        case 'landscape-primary':
          value = orientation.gamma / 90
          break
        case 'landscape-secondary':
          value = -orientation.gamma / 90
          break
        case 'portrait-primary':
          value = -orientation.beta / 90
          break
        case 'portrait-secondary':
          value = orientation.beta / 90
          break
        default:
          value = -orientation.beta / 90
      }
      return deviceOrientationRollAdjust(value)
    }
    else {
      // (y.value - height.value / 2) 這段是為了讓滑鼠在畫面中央時，roll 值為 0
      // 除以 height.value 是為了換算成百分比，也因為前面有除 2，所以這邊會是 -0.5 ~ 0.5
      // 負號是因為滑鼠往下滑時，y 值會變大，但 roll 值要變小
      const value = -(y.value - height.value / 2) / height.value
      return mouseRollAdjust(value)
    }
  })

  const tilt = computed(() => {
    if (source.value === 'deviceOrientation') {
      let value
      switch (screenOrientation.orientation) {
        case 'landscape-primary':
          value = orientation.beta / 90
          break
        case 'landscape-secondary':
          value = -orientation.beta / 90
          break
        case 'portrait-primary':
          value = orientation.gamma / 90
          break
        case 'portrait-secondary':
          value = -orientation.gamma / 90
          break
        default:
          value = orientation.gamma / 90
      }
      return deviceOrientationTiltAdjust(value)
    }
    else {
      const value = (x.value - width.value / 2) / width.value
      return mouseTiltAdjust(value)
    }
  })

  return { roll, tilt, source }
}
