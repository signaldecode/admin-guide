import { getPageGuide } from '~/data/pageGuide'

/**
 * 현재 라우트에 해당하는 페이지 가이드 제공
 */
export const usePageGuide = () => {
  const route = useRoute()

  const guide = computed(() => {
    return getPageGuide(route.path)
  })

  const hasGuide = computed(() => {
    return !!guide.value
  })

  const message = computed(() => {
    return guide.value?.message || ''
  })

  return {
    guide,
    hasGuide,
    message,
  }
}
