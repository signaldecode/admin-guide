<script setup>
/**
 * Login Page
 * 관리자 로그인 페이지
 */
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

// 폼 데이터
const form = reactive({
  email: 'test',
  password: '1234',
})

// 폼 에러
const errors = reactive({
  email: '',
  password: '',
})

// 로딩 상태
const isLoading = ref(false)

// 일반 에러 메시지
const errorMessage = ref('')

// ==================== 3단계 가이드 툴팁 ====================
const guideStep = ref(0)
const showGuide = ref(false)

const guideMessages = [
  '안녕하세요. 시그널디코드의 admin sample 화면 입니다.',
  '먼저 테스트 계정으로 로그인해주세요.',
  '우측 상단에서 해당 페이지의 설명을 볼 수 있어요.',
]

const nextGuide = () => {
  if (guideStep.value < guideMessages.length - 1) {
    guideStep.value++
  } else {
    closeGuide()
  }
}

const prevGuide = () => {
  if (guideStep.value > 0) {
    guideStep.value--
  }
}

const closeGuide = () => {
  showGuide.value = false
}

onMounted(() => {
  // 페이지 진입 시 항상 가이드 표시
  setTimeout(() => {
    showGuide.value = true
  }, 500)
})

// ==================== 폼 유효성 검사 ====================
const validate = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = '아이디를 입력해주세요.'
    isValid = false
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.'
    isValid = false
  }

  return isValid
}

// ==================== 로그인 처리 ====================
const handleSubmit = async () => {
  errorMessage.value = ''

  if (!validate()) return

  isLoading.value = true

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    })

    if (result.success) {
      router.push('/admin')
    } else {
      // 401 에러 또는 로그인 실패 시 친절한 메시지 표시
      errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
    }
  } catch (error) {
    errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <!-- 3단계 가이드 툴팁 -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showGuide"
        class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50"
        role="dialog"
        aria-label="가이드"
        @click.self="closeGuide"
      >
        <div class="relative bg-neutral-700 text-white rounded-xl px-6 py-5 shadow-xl max-w-sm mx-4">
          <!-- 메시지 -->
          <p class="text-sm font-semibold leading-relaxed pr-6 whitespace-pre-line">
            {{ guideMessages[guideStep] }}
          </p>

          <!-- 닫기 버튼 -->
          <button
            type="button"
            class="absolute top-2 right-2 p-1 rounded-full hover:bg-neutral-600 transition-colors"
            aria-label="닫기"
            @click="closeGuide"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 하단: 인디케이터 + 버튼 -->
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-neutral-600">
            <!-- 스텝 인디케이터 -->
            <div class="flex gap-1.5">
              <span
                v-for="(_, index) in guideMessages"
                :key="index"
                :class="[
                  'w-2 h-2 rounded-full transition-colors',
                  index === guideStep ? 'bg-white' : 'bg-neutral-500',
                ]"
              />
            </div>

            <!-- 네비게이션 버튼 -->
            <div class="flex gap-2">
              <button
                v-if="guideStep > 0"
                type="button"
                class="px-3 py-1 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                @click="prevGuide"
              >
                이전
              </button>
              <button
                type="button"
                class="px-3 py-1 text-xs font-medium bg-white text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
                @click="nextGuide"
              >
                {{ guideStep < guideMessages.length - 1 ? '다음' : '확인' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <!-- Logo/Title -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-primary-700">Admin</h1>
      <p class="mt-2 text-neutral-600">관리자 계정으로 로그인해주세요.</p>
    </div>

    <!-- Login Card -->
    <UiCard padding="lg">
      <form @submit.prevent="handleSubmit">
        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <!-- ID -->
        <div class="mb-4">
          <UiInput
            v-model="form.email"
            type="text"
            label="아이디"
            placeholder="test"
            :error="errors.email"
            required
            autocomplete="username"
          />
        </div>

        <!-- Password -->
        <div class="mb-6">
          <UiInput
            v-model="form.password"
            type="password"
            label="비밀번호"
            placeholder="1234"
            :error="errors.password"
            required
            autocomplete="current-password"
          />
        </div>

        <!-- Test Account Info -->
        <div class="mb-4 p-3 bg-info-50 border border-info-200 rounded-lg text-sm text-info-700">
          <p class="font-medium">테스트 계정</p>
          <p>아이디: test / 비밀번호: 1234</p>
        </div>

        <!-- Submit Button -->
        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="isLoading"
        >
          로그인
        </UiButton>
      </form>
    </UiCard>
  </div>
</template>
