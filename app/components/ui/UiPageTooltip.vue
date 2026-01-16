<script setup>
/**
 * UiPageTooltip
 * 페이지 진입 시 표시되는 가이드 말풍선
 * - 우측 상단 플로팅
 * - 다른 요소 클릭 시 사라짐
 */

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  /** 자동 표시 여부 */
  autoShow: {
    type: Boolean,
    default: true,
  },
})

const isVisible = ref(false)
const tooltipRef = ref(null)

// 페이지 진입 시 자동 표시
onMounted(() => {
  if (props.autoShow && props.message) {
    // 약간의 딜레이 후 표시 (페이지 렌더링 후)
    setTimeout(() => {
      isVisible.value = true
    }, 300)
  }

  // 외부 클릭 감지
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// 외부 클릭 시 닫기
const handleOutsideClick = (event) => {
  if (tooltipRef.value && !tooltipRef.value.contains(event.target)) {
    isVisible.value = false
  }
}

// 수동 닫기
const close = () => {
  isVisible.value = false
}

// 라우트 변경 시 다시 표시
const route = useRoute()
watch(() => route.path, () => {
  if (props.autoShow && props.message) {
    setTimeout(() => {
      isVisible.value = true
    }, 300)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="isVisible && message"
      ref="tooltipRef"
      class="fixed top-20 right-4 md:right-8 z-50 max-w-xs"
      role="tooltip"
      aria-live="polite"
    >
      <!-- 말풍선 본체 -->
      <div class="relative bg-neutral-700 text-white rounded-xl px-4 py-3 shadow-lg">
        <!-- 메시지 -->
        <p class="text-sm font-semibold leading-relaxed pr-6 whitespace-pre-line">
          {{ message }}
        </p>

        <!-- 닫기 버튼 -->
        <button
          type="button"
          class="absolute top-2 right-2 p-1 rounded-full hover:bg-neutral-600 transition-colors"
          aria-label="닫기"
          @click.stop="close"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- 말풍선 꼬리 (하단) -->
        <div class="absolute -bottom-2 right-6 w-4 h-4 bg-neutral-700 rotate-45" />
      </div>
    </div>
  </Transition>
</template>
