<script setup>
/**
 * Statistics - Main Page
 * 통계 분석 메인 페이지 (매출/상품/고객 분석)
 */
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
)

// 페이지 가이드
const { message: guideMessage } = usePageGuide()

// 현재 탭
const activeTab = ref('sales')

const tabs = [
  { id: 'sales', label: '매출 분석', icon: 'chart' },
  { id: 'products', label: '상품 분석', icon: 'box' },
  { id: 'customers', label: '고객 분석', icon: 'users' },
]

// 기간 필터
const periodFilter = ref('month')
const periodOptions = [
  { value: 'week', label: '최근 7일' },
  { value: 'month', label: '최근 30일' },
  { value: 'quarter', label: '최근 3개월' },
  { value: 'year', label: '최근 1년' },
]

// ==================== 매출 분석 데이터 ====================
const salesOverview = ref([
  { label: '총 매출', value: 127500000, change: '+12.5%', changeType: 'positive' },
  { label: '주문 건수', value: 1847, change: '+8.2%', changeType: 'positive' },
  { label: '평균 주문금액', value: 69000, change: '+3.8%', changeType: 'positive' },
  { label: '환불 금액', value: 4320000, change: '-15.3%', changeType: 'positive' },
])

const dailySales = ref([
  { date: '01/10', amount: 4250000 },
  { date: '01/11', amount: 3890000 },
  { date: '01/12', amount: 5120000 },
  { date: '01/13', amount: 4780000 },
  { date: '01/14', amount: 6340000 },
  { date: '01/15', amount: 5670000 },
  { date: '01/16', amount: 4920000 },
])

const paymentMethods = ref([
  { method: '신용카드', amount: 78500000, percent: 61.6 },
  { method: '계좌이체', amount: 28900000, percent: 22.7 },
  { method: '간편결제', amount: 15200000, percent: 11.9 },
  { method: '기타', amount: 4900000, percent: 3.8 },
])

const categorySales = ref([
  { category: '의류', amount: 45600000, percent: 35.8, orders: 542 },
  { category: '신발', amount: 32100000, percent: 25.2, orders: 287 },
  { category: '가방', amount: 24800000, percent: 19.4, orders: 198 },
  { category: '악세서리', amount: 15200000, percent: 11.9, orders: 456 },
  { category: '기타', amount: 9800000, percent: 7.7, orders: 364 },
])

// ==================== 상품 분석 데이터 ====================
const topProducts = ref([
  { rank: 1, name: '프리미엄 캐시미어 코트', sales: 156, revenue: 23400000, change: '+23%' },
  { rank: 2, name: '클래식 레더 토트백', sales: 134, revenue: 18760000, change: '+15%' },
  { rank: 3, name: '울 블렌드 니트 스웨터', sales: 198, revenue: 15840000, change: '+31%' },
  { rank: 4, name: '스니커즈 화이트', sales: 245, revenue: 14700000, change: '+8%' },
  { rank: 5, name: '실크 블라우스', sales: 167, revenue: 13360000, change: '+19%' },
])

const categoryPerformance = ref([
  { category: '의류', views: 45230, purchases: 542, conversionRate: 1.2 },
  { category: '신발', views: 28450, purchases: 287, conversionRate: 1.0 },
  { category: '가방', views: 18920, purchases: 198, conversionRate: 1.05 },
  { category: '악세서리', views: 35680, purchases: 456, conversionRate: 1.28 },
])

const stockStatus = ref([
  { status: '정상', count: 1245, percent: 72 },
  { status: '부족', count: 328, percent: 19 },
  { status: '품절', count: 156, percent: 9 },
])

// ==================== 고객 분석 데이터 ====================
const customerOverview = ref([
  { label: '총 회원수', value: 15847, change: '+324', changeType: 'positive' },
  { label: '신규 회원', value: 324, change: '+12.1%', changeType: 'positive' },
  { label: '재구매율', value: '34.5%', change: '+2.3%', changeType: 'positive' },
  { label: '탈퇴 회원', value: 18, change: '-28%', changeType: 'positive' },
])

const customerSegments = ref([
  { segment: 'VIP', count: 156, percent: 1, avgOrder: 450000 },
  { segment: '골드', count: 892, percent: 5.6, avgOrder: 180000 },
  { segment: '실버', count: 3245, percent: 20.5, avgOrder: 95000 },
  { segment: '일반', count: 11554, percent: 72.9, avgOrder: 52000 },
])

const ageDistribution = ref([
  { age: '20대', count: 4123, percent: 26 },
  { age: '30대', count: 5698, percent: 36 },
  { age: '40대', count: 3962, percent: 25 },
  { age: '50대 이상', count: 2064, percent: 13 },
])

const topCustomers = ref([
  { rank: 1, name: '김**', totalOrders: 47, totalSpent: 8940000, lastOrder: '2025-01-15' },
  { rank: 2, name: '이**', totalOrders: 38, totalSpent: 7230000, lastOrder: '2025-01-14' },
  { rank: 3, name: '박**', totalOrders: 35, totalSpent: 6580000, lastOrder: '2025-01-16' },
  { rank: 4, name: '최**', totalOrders: 32, totalSpent: 5920000, lastOrder: '2025-01-13' },
  { rank: 5, name: '정**', totalOrders: 29, totalSpent: 5340000, lastOrder: '2025-01-12' },
])

// 금액 포맷
const formatCurrency = (value) => {
  if (typeof value === 'string') return value
  return new Intl.NumberFormat('ko-KR').format(value) + '원'
}

// 숫자 포맷
const formatNumber = (value) => {
  if (typeof value === 'string') return value
  return new Intl.NumberFormat('ko-KR').format(value)
}

// Chart.js 데이터
const chartData = computed(() => ({
  labels: dailySales.value.map(d => d.date),
  datasets: [
    {
      label: '매출',
      data: dailySales.value.map(d => d.amount),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}))

// Chart.js 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (context) => {
          return new Intl.NumberFormat('ko-KR').format(context.raw) + '원'
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 11 },
        color: '#64748b',
      },
    },
    y: {
      grid: {
        color: '#e2e8f0',
      },
      ticks: {
        font: { size: 11 },
        color: '#64748b',
        callback: (value) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(0) + 'M'
          }
          return value
        },
      },
    },
  },
}
</script>

<template>
  <LayoutDetailPage>
    <!-- 페이지 가이드 툴팁 -->
    <UiPageTooltip :message="guideMessage" />

    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">통계 분석</h1>
          <p class="mt-1 text-neutral-600">매출, 상품, 고객 데이터를 분석합니다.</p>
        </div>

        <!-- 기간 필터 -->
        <select
          v-model="periodFilter"
          class="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option v-for="option in periodOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b border-neutral-200">
      <nav class="flex gap-0 -mb-px overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- ==================== 매출 분석 탭 ==================== -->
    <div v-if="activeTab === 'sales'" class="space-y-6">
      <!-- 매출 요약 카드 -->
      <section>
        <h2 class="text-lg font-semibold text-neutral-900 mb-4">매출 요약</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UiCard v-for="(stat, index) in salesOverview" :key="index" padding="md">
            <p class="text-sm text-neutral-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-neutral-900 mt-1">
              {{ stat.label.includes('금액') || stat.label.includes('매출') ? formatCurrency(stat.value) : formatNumber(stat.value) }}
            </p>
            <p
              :class="[
                'text-sm font-medium mt-1',
                stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600',
              ]"
            >
              {{ stat.change }} vs 이전 기간
            </p>
          </UiCard>
        </div>
      </section>

      <!-- 일별 매출 차트 (Chart.js) -->
      <section>
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">일별 매출 추이</h2>
          </template>
          <div class="h-64">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </UiCard>
      </section>

      <!-- 결제수단별 & 카테고리별 매출 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 결제수단별 매출 -->
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">결제수단별 매출</h2>
          </template>
          <div class="space-y-4">
            <div v-for="payment in paymentMethods" :key="payment.method">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-neutral-700">{{ payment.method }}</span>
                <span class="text-sm font-medium text-neutral-900">{{ formatCurrency(payment.amount) }}</span>
              </div>
              <div class="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-400 rounded-full"
                  :style="{ width: `${payment.percent}%` }"
                />
              </div>
              <p class="text-xs text-neutral-500 mt-1">{{ payment.percent }}%</p>
            </div>
          </div>
        </UiCard>

        <!-- 카테고리별 매출 -->
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">카테고리별 매출</h2>
          </template>
          <div class="overflow-x-auto -mx-4 md:-mx-6">
            <table class="w-full">
              <thead>
                <tr class="border-b border-neutral-200">
                  <th class="text-left py-2 px-4 md:px-6 text-sm font-medium text-neutral-500">카테고리</th>
                  <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">매출</th>
                  <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">비중</th>
                  <th class="text-right py-2 px-4 md:px-6 text-sm font-medium text-neutral-500">주문수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in categorySales" :key="cat.category" class="border-b border-neutral-100">
                  <td class="py-3 px-4 md:px-6 text-sm text-neutral-900">{{ cat.category }}</td>
                  <td class="py-3 px-4 text-sm text-neutral-700 text-right">{{ formatCurrency(cat.amount) }}</td>
                  <td class="py-3 px-4 text-sm text-neutral-500 text-right">{{ cat.percent }}%</td>
                  <td class="py-3 px-4 md:px-6 text-sm text-neutral-500 text-right">{{ formatNumber(cat.orders) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>
      </div>
    </div>

    <!-- ==================== 상품 분석 탭 ==================== -->
    <div v-if="activeTab === 'products'" class="space-y-6">
      <!-- 인기 상품 TOP 5 -->
      <section>
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">인기 상품 TOP 5</h2>
          </template>
          <div class="overflow-x-auto -mx-4 md:-mx-6">
            <table class="w-full">
              <thead>
                <tr class="border-b border-neutral-200">
                  <th class="text-center py-2 px-4 md:px-6 text-sm font-medium text-neutral-500 w-12">순위</th>
                  <th class="text-left py-2 px-4 text-sm font-medium text-neutral-500">상품명</th>
                  <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">판매수</th>
                  <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">매출</th>
                  <th class="text-right py-2 px-4 md:px-6 text-sm font-medium text-neutral-500">증감</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in topProducts" :key="product.rank" class="border-b border-neutral-100">
                  <td class="py-3 px-4 md:px-6 text-center">
                    <span
                      :class="[
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                        product.rank === 1 ? 'bg-warning-500 text-white' :
                        product.rank === 2 ? 'bg-neutral-400 text-white' :
                        product.rank === 3 ? 'bg-warning-700 text-white' :
                        'bg-neutral-200 text-neutral-600',
                      ]"
                    >
                      {{ product.rank }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-neutral-900">{{ product.name }}</td>
                  <td class="py-3 px-4 text-sm text-neutral-700 text-right">{{ formatNumber(product.sales) }}</td>
                  <td class="py-3 px-4 text-sm text-neutral-700 text-right">{{ formatCurrency(product.revenue) }}</td>
                  <td class="py-3 px-4 md:px-6 text-sm text-success-600 text-right font-medium">{{ product.change }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>
      </section>

      <!-- 카테고리 성과 & 재고 현황 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 카테고리별 전환율 -->
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">카테고리별 전환율</h2>
          </template>
          <div class="space-y-4">
            <div v-for="cat in categoryPerformance" :key="cat.category" class="p-3 bg-neutral-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-neutral-900">{{ cat.category }}</span>
                <span class="text-sm font-semibold text-primary-600">{{ cat.conversionRate }}%</span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-neutral-500">조회수</span>
                  <p class="font-medium text-neutral-700">{{ formatNumber(cat.views) }}</p>
                </div>
                <div>
                  <span class="text-neutral-500">구매수</span>
                  <p class="font-medium text-neutral-700">{{ formatNumber(cat.purchases) }}</p>
                </div>
              </div>
            </div>
          </div>
        </UiCard>

        <!-- 재고 현황 -->
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">재고 현황</h2>
          </template>
          <div class="flex flex-col items-center py-4">
            <!-- 도넛 차트 시각화 -->
            <div class="relative w-40 h-40 mb-6">
              <svg viewBox="0 0 36 36" class="w-full h-full">
                <!-- 정상 (green) -->
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="transparent"
                  stroke="#22c55e"
                  stroke-width="3"
                  :stroke-dasharray="`${stockStatus[0].percent} ${100 - stockStatus[0].percent}`"
                  stroke-dashoffset="25"
                />
                <!-- 부족 (yellow) -->
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="transparent"
                  stroke="#f59e0b"
                  stroke-width="3"
                  :stroke-dasharray="`${stockStatus[1].percent} ${100 - stockStatus[1].percent}`"
                  :stroke-dashoffset="`${25 - stockStatus[0].percent}`"
                />
                <!-- 품절 (red) -->
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="transparent"
                  stroke="#ef4444"
                  stroke-width="3"
                  :stroke-dasharray="`${stockStatus[2].percent} ${100 - stockStatus[2].percent}`"
                  :stroke-dashoffset="`${25 - stockStatus[0].percent - stockStatus[1].percent}`"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <p class="text-2xl font-bold text-neutral-900">{{ formatNumber(stockStatus.reduce((a, b) => a + b.count, 0)) }}</p>
                  <p class="text-xs text-neutral-500">총 상품</p>
                </div>
              </div>
            </div>
            <!-- 범례 -->
            <div class="flex gap-6">
              <div v-for="stock in stockStatus" :key="stock.status" class="text-center">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    :class="[
                      'w-3 h-3 rounded-full',
                      stock.status === '정상' ? 'bg-success-500' :
                      stock.status === '부족' ? 'bg-warning-500' : 'bg-error-500',
                    ]"
                  />
                  <span class="text-sm text-neutral-600">{{ stock.status }}</span>
                </div>
                <p class="text-lg font-semibold text-neutral-900">{{ formatNumber(stock.count) }}</p>
                <p class="text-xs text-neutral-500">{{ stock.percent }}%</p>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>

    <!-- ==================== 고객 분석 탭 ==================== -->
    <div v-if="activeTab === 'customers'" class="space-y-6">
      <!-- 고객 요약 카드 -->
      <section>
        <h2 class="text-lg font-semibold text-neutral-900 mb-4">고객 요약</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UiCard v-for="(stat, index) in customerOverview" :key="index" padding="md">
            <p class="text-sm text-neutral-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-neutral-900 mt-1">{{ formatNumber(stat.value) }}</p>
            <p
              :class="[
                'text-sm font-medium mt-1',
                stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600',
              ]"
            >
              {{ stat.change }}
            </p>
          </UiCard>
        </div>
      </section>

      <!-- 회원 등급 분포 & 연령대 분포 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 회원 등급 분포 -->
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">회원 등급 분포</h2>
          </template>
          <div class="space-y-4">
            <div v-for="segment in customerSegments" :key="segment.segment" class="p-3 border border-neutral-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded',
                    segment.segment === 'VIP' ? 'bg-warning-100 text-warning-700' :
                    segment.segment === '골드' ? 'bg-warning-50 text-warning-600' :
                    segment.segment === '실버' ? 'bg-neutral-100 text-neutral-600' :
                    'bg-neutral-50 text-neutral-500',
                  ]"
                >
                  {{ segment.segment }}
                </span>
                <span class="text-sm text-neutral-500">{{ segment.percent }}%</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-600">{{ formatNumber(segment.count) }}명</span>
                <span class="text-neutral-700 font-medium">평균 {{ formatCurrency(segment.avgOrder) }}</span>
              </div>
            </div>
          </div>
        </UiCard>

        <!-- 연령대 분포 -->
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">연령대 분포</h2>
          </template>
          <div class="space-y-4">
            <div v-for="age in ageDistribution" :key="age.age">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-neutral-700">{{ age.age }}</span>
                <span class="text-sm font-medium text-neutral-900">{{ formatNumber(age.count) }}명 ({{ age.percent }}%)</span>
              </div>
              <div class="h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full rounded-full',
                    age.age === '30대' ? 'bg-primary-500' : 'bg-primary-300',
                  ]"
                  :style="{ width: `${age.percent}%` }"
                />
              </div>
            </div>
          </div>
        </UiCard>
      </div>

      <!-- VIP 고객 TOP 5 -->
      <section>
        <UiCard>
          <template #header>
            <h2 class="text-lg font-semibold text-neutral-900">VIP 고객 TOP 5</h2>
          </template>
          <div class="overflow-x-auto -mx-4 md:-mx-6">
            <table class="w-full">
              <thead>
                <tr class="border-b border-neutral-200">
                  <th class="text-center py-2 px-4 md:px-6 text-sm font-medium text-neutral-500 w-12">순위</th>
                  <th class="text-left py-2 px-4 text-sm font-medium text-neutral-500">고객명</th>
                  <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">주문수</th>
                  <th class="text-right py-2 px-4 text-sm font-medium text-neutral-500">총 구매액</th>
                  <th class="text-right py-2 px-4 md:px-6 text-sm font-medium text-neutral-500">최근 주문</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in topCustomers" :key="customer.rank" class="border-b border-neutral-100">
                  <td class="py-3 px-4 md:px-6 text-center">
                    <span
                      :class="[
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                        customer.rank === 1 ? 'bg-warning-500 text-white' :
                        customer.rank === 2 ? 'bg-neutral-400 text-white' :
                        customer.rank === 3 ? 'bg-warning-700 text-white' :
                        'bg-neutral-200 text-neutral-600',
                      ]"
                    >
                      {{ customer.rank }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-neutral-900">{{ customer.name }}</td>
                  <td class="py-3 px-4 text-sm text-neutral-700 text-right">{{ customer.totalOrders }}회</td>
                  <td class="py-3 px-4 text-sm text-neutral-700 text-right font-medium">{{ formatCurrency(customer.totalSpent) }}</td>
                  <td class="py-3 px-4 md:px-6 text-sm text-neutral-500 text-right">{{ customer.lastOrder }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>
      </section>
    </div>
  </LayoutDetailPage>
</template>
