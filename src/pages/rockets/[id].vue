<template>
  <v-container class="py-8 px-4 max-w-1000">
    <!-- Back Navigation Link -->
    <div class="mb-6">
      <button
        type="button"
        class="back-btn d-inline-flex align-center ga-2 text-body-2 font-weight-medium text-slate-600"
        @click="goBack"
      >
        <v-icon icon="mdi-arrow-left" size="18" />
        <span>Back to Rockets</span>
      </button>
    </div>

    <!-- Loading State -->
    <LoadingState v-if="store.loading" type="detail" />

    <!-- Error State with Retry -->
    <ErrorState
      v-else-if="store.error"
      title="Rocket Not Found"
      :message="store.error"
      @retry="loadData"
    >
      <template #actions>
        <v-btn
          variant="outlined"
          color="secondary"
          rounded="lg"
          class="text-none"
          @click="goBack"
        >
          Back to list
        </v-btn>
      </template>
    </ErrorState>

    <!-- Detail Content -->
    <div v-else-if="rocket" class="detail-container">
      <!-- Main Card -->
      <div class="detail-card bg-white rounded-2xl overflow-hidden mb-8">
        <!-- Hero Media with Clean Header -->
        <div class="hero-image-wrapper position-relative">
          <v-img
            :src="rocket.image_url || DEFAULT_ROCKET_IMAGE"
            height="380"
            cover
            class="rocket-detail-img"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height bg-slate-100">
                <v-progress-circular color="secondary" indeterminate size="32" />
              </div>
            </template>

            <template #error>
              <div class="d-flex flex-column align-center justify-center fill-height bg-slate-100 text-slate-400">
                <v-icon icon="mdi-image-off-outline" size="48" class="mb-2" />
                <span class="text-caption font-weight-medium">Image unavailable</span>
              </div>
            </template>

            <!-- Subtle Gradient Overlay for Text Readability -->
            <div class="hero-text-overlay pa-6 d-flex flex-column justify-end">
              <div class="d-flex flex-wrap ga-2 mb-3">
                <span
                  v-if="rocket.isLocal"
                  class="detail-badge detail-badge-amber"
                >
                  <v-icon icon="mdi-account-edit" size="12" class="mr-1" />
                  Custom Added Rocket
                </span>
                <span
                  v-else
                  :class="rocket.active ? 'detail-badge detail-badge-emerald' : 'detail-badge detail-badge-slate'"
                >
                  <span class="detail-dot" :class="rocket.active ? 'bg-emerald' : 'bg-slate'" />
                  {{ rocket.active ? 'Active Vehicle' : 'Retired Vehicle' }}
                </span>

                <span v-if="rocket.family" class="detail-badge detail-badge-white">
                  {{ rocket.family }} Family
                </span>
              </div>

              <h1 class="text-h4 text-sm-h3 font-weight-bold text-white tracking-tight">
                {{ rocket.full_name }}
              </h1>
            </div>
          </v-img>
        </div>

        <!-- Specifications Grid & Content -->
        <div class="pa-6 pa-md-8">
          <!-- Key Metrics Grid -->
          <div class="mb-8">
            <h2 class="section-title text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 mb-4">
              Key Specifications
            </h2>

            <v-row dense class="ga-3 ga-sm-0">
              <!-- Cost Per Launch -->
              <v-col cols="12" sm="4">
                <div class="spec-card pa-4 rounded-xl">
                  <div class="d-flex align-center text-slate-400 text-caption font-weight-semibold mb-1">
                    <v-icon icon="mdi-currency-usd" size="16" class="mr-1" />
                    EST. LAUNCH COST
                  </div>
                  <div class="text-h5 font-weight-bold text-slate-900 mb-1">
                    {{ formatCurrency(rocket.launch_cost) }}
                  </div>
                  <div class="text-caption text-slate-500">
                    Per single orbital mission
                  </div>
                </div>
              </v-col>

              <!-- Country -->
              <v-col cols="12" sm="4">
                <div class="spec-card pa-4 rounded-xl">
                  <div class="d-flex align-center text-slate-400 text-caption font-weight-semibold mb-1">
                    <v-icon icon="mdi-flag-outline" size="16" class="mr-1" />
                    ORIGIN COUNTRY
                  </div>
                  <div class="text-h5 font-weight-bold text-slate-900 mb-1">
                    {{ rocket.manufacturer?.country_code || 'USA' }}
                  </div>
                  <div class="text-caption text-slate-500">
                    {{ rocket.manufacturer?.name || 'SpaceX' }}
                  </div>
                </div>
              </v-col>

              <!-- Maiden Flight -->
              <v-col cols="12" sm="4">
                <div class="spec-card pa-4 rounded-xl">
                  <div class="d-flex align-center text-slate-400 text-caption font-weight-semibold mb-1">
                    <v-icon icon="mdi-calendar-blank-outline" size="16" class="mr-1" />
                    FIRST FLIGHT
                  </div>
                  <div class="text-h5 font-weight-bold text-slate-900 mb-1">
                    {{ formatDate(rocket.maiden_flight) }}
                  </div>
                  <div class="text-caption text-slate-500">
                    Initial launch date
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <div class="divider-line my-6" />

          <!-- Description Section -->
          <div class="mb-8">
            <h2 class="section-title text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 mb-3">
              Overview & Capabilities
            </h2>
            <p class="text-body-1 text-slate-700 description-text">
              {{ rocket.description || 'No detailed overview description is available for this launcher configuration.' }}
            </p>
          </div>

          <!-- Extra Technical Dimensions if available -->
          <div v-if="hasAdditionalSpecs">
            <div class="divider-line my-6" />

            <h2 class="section-title text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 mb-4">
              Dimensions & Capabilities
            </h2>

            <div class="tech-specs-grid">
              <div v-if="rocket.length" class="tech-spec-item">
                <span class="tech-label">Height</span>
                <span class="tech-value">{{ rocket.length }} m</span>
              </div>
              <div v-if="rocket.diameter" class="tech-spec-item">
                <span class="tech-label">Diameter</span>
                <span class="tech-value">{{ rocket.diameter }} m</span>
              </div>
              <div v-if="rocket.min_stage !== undefined && rocket.min_stage !== null" class="tech-spec-item">
                <span class="tech-label">Stages</span>
                <span class="tech-value">
                  {{ rocket.min_stage === rocket.max_stage ? rocket.min_stage : `${rocket.min_stage} - ${rocket.max_stage}` }}
                </span>
              </div>
              <div v-if="rocket.leo_capacity" class="tech-spec-item">
                <span class="tech-label">LEO Capacity</span>
                <span class="tech-value">{{ rocket.leo_capacity.toLocaleString() }} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCurrency, formatDate, DEFAULT_ROCKET_IMAGE } from '@/utils/formatters'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = computed(() => store.selectedRocket)

const hasAdditionalSpecs = computed(() => {
  if (!rocket.value) return false
  return Boolean(
    rocket.value.length ||
    rocket.value.diameter ||
    (rocket.value.min_stage !== undefined && rocket.value.min_stage !== null) ||
    rocket.value.leo_capacity
  )
})

function loadData() {
  const id = route.params.id as string
  if (id) {
    store.fetchRocketDetail(id)
  }
}

function goBack() {
  router.push('/')
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  store.clearSelectedRocket()
})
</script>

<style scoped>
.max-w-1000 {
  max-width: 960px;
}

.back-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.back-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.detail-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.hero-image-wrapper {
  background-color: #0f172a;
}

.hero-text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(0, 0, 0, 0) 100%);
}

.detail-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
}

.detail-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}

.bg-emerald {
  background-color: #10b981;
}

.bg-slate {
  background-color: #cbd5e1;
}

.detail-badge-emerald {
  background-color: rgba(6, 78, 59, 0.85);
  color: #a7f3d0;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.detail-badge-slate {
  background-color: rgba(30, 41, 59, 0.85);
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.detail-badge-amber {
  background-color: rgba(120, 53, 15, 0.85);
  color: #fde68a;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.detail-badge-white {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
  font-size: 0.7rem;
}

.spec-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.divider-line {
  height: 1px;
  background-color: #f1f5f9;
}

.description-text {
  line-height: 1.75;
}

.tech-specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.tech-spec-item {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
}

.tech-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 2px;
}

.tech-value {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 700;
}
</style>
