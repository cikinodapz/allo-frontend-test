<template>
  <v-container class="py-6 max-w-1000">
    <!-- Back navigation button -->
    <div class="mb-4">
      <v-btn
        variant="tonal"
        prepend-icon="mdi-arrow-left"
        rounded="pill"
        @click="goBack"
      >
        Back to Rockets
      </v-btn>
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
          prepend-icon="mdi-arrow-left"
          rounded="pill"
          @click="goBack"
        >
          Return to Catalog
        </v-btn>
      </template>
    </ErrorState>

    <!-- Detail Content -->
    <div v-else-if="rocket">
      <v-card rounded="xl" elevation="3" class="overflow-hidden mb-6">
        <!-- Hero Image -->
        <div class="position-relative">
          <v-img
            :src="rocket.image_url || DEFAULT_ROCKET_IMAGE"
            height="400"
            cover
            class="align-end bg-grey-darken-4"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="primary" indeterminate size="48" />
              </div>
            </template>

            <template #error>
              <div class="d-flex flex-column align-center justify-center fill-height text-grey">
                <v-icon icon="mdi-rocket-outline" size="64" class="mb-2" />
                <span>Image not available</span>
              </div>
            </template>

            <div class="hero-overlay pa-6">
              <div class="d-flex flex-wrap ga-2 mb-2">
                <v-chip
                  v-if="rocket.isLocal"
                  color="warning"
                  variant="flat"
                  size="small"
                  prepend-icon="mdi-account-edit"
                  class="font-weight-bold"
                >
                  Custom Added Rocket
                </v-chip>
                <v-chip
                  v-else
                  :color="rocket.active ? 'success' : 'grey'"
                  variant="flat"
                  size="small"
                  :prepend-icon="rocket.active ? 'mdi-check-circle' : 'mdi-archive'"
                  class="font-weight-bold"
                >
                  {{ rocket.active ? 'Active Configuration' : 'Retired Configuration' }}
                </v-chip>
                <v-chip
                  v-if="rocket.family"
                  color="info"
                  variant="flat"
                  size="small"
                >
                  {{ rocket.family }} Family
                </v-chip>
              </div>

              <h1 class="text-h4 text-sm-h3 font-weight-black text-white">
                {{ rocket.full_name }}
              </h1>
            </div>
          </v-img>
        </div>

        <v-card-text class="pa-6">
          <!-- Key Metrics Grid -->
          <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
            <v-icon icon="mdi-information-outline" color="primary" class="mr-2" />
            Key Launch Specifications
          </h2>

          <v-row class="mb-6">
            <!-- Cost Per Launch -->
            <v-col cols="12" sm="6" md="4">
              <v-card variant="tonal" color="primary" rounded="lg" class="pa-4 h-100">
                <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                  COST PER LAUNCH
                </div>
                <div class="text-h5 font-weight-black text-primary">
                  {{ formatCurrency(rocket.launch_cost) }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Estimated single mission cost
                </div>
              </v-card>
            </v-col>

            <!-- Country -->
            <v-col cols="12" sm="6" md="4">
              <v-card variant="tonal" color="info" rounded="lg" class="pa-4 h-100">
                <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                  COUNTRY OF ORIGIN
                </div>
                <div class="text-h5 font-weight-black text-info d-flex align-center">
                  <v-icon icon="mdi-flag" size="20" class="mr-2" />
                  {{ rocket.manufacturer?.country_code || 'N/A' }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ rocket.manufacturer?.name || 'SpaceX' }}
                </div>
              </v-card>
            </v-col>

            <!-- First Flight -->
            <v-col cols="12" sm="6" md="4">
              <v-card variant="tonal" color="success" rounded="lg" class="pa-4 h-100">
                <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                  MAIDEN FLIGHT
                </div>
                <div class="text-h5 font-weight-black text-success">
                  {{ formatDate(rocket.maiden_flight) }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  First orbital flight date
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <!-- Description Section -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-3 d-flex align-center">
              <v-icon icon="mdi-text-box-outline" color="primary" class="mr-2" />
              Description & Overview
            </h2>
            <p class="text-body-1 line-height-relaxed text-medium-emphasis">
              {{ rocket.description || 'No detailed description is currently recorded for this launcher configuration.' }}
            </p>
          </div>

          <!-- Additional Specs if available from API -->
          <div v-if="hasAdditionalSpecs">
            <v-divider class="my-6" />
            <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
              <v-icon icon="mdi-ruler" color="primary" class="mr-2" />
              Technical Dimensions & Stages
            </h2>

            <v-row dense>
              <v-col v-if="rocket.length" cols="6" sm="3">
                <div class="text-caption text-medium-emphasis">Height / Length</div>
                <div class="text-subtitle-1 font-weight-bold">{{ rocket.length }} m</div>
              </v-col>
              <v-col v-if="rocket.diameter" cols="6" sm="3">
                <div class="text-caption text-medium-emphasis">Diameter</div>
                <div class="text-subtitle-1 font-weight-bold">{{ rocket.diameter }} m</div>
              </v-col>
              <v-col v-if="rocket.min_stage !== undefined && rocket.min_stage !== null" cols="6" sm="3">
                <div class="text-caption text-medium-emphasis">Stages</div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ rocket.min_stage === rocket.max_stage ? rocket.min_stage : `${rocket.min_stage} - ${rocket.max_stage}` }}
                </div>
              </v-col>
              <v-col v-if="rocket.leo_capacity" cols="6" sm="3">
                <div class="text-caption text-medium-emphasis">LEO Payload Capacity</div>
                <div class="text-subtitle-1 font-weight-bold">{{ rocket.leo_capacity.toLocaleString() }} kg</div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
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
    rocket.value.min_stage !== null ||
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
  max-width: 1000px;
}

.hero-overlay {
  background: linear-gradient(to top, rgba(13, 27, 42, 0.95) 0%, rgba(13, 27, 42, 0.4) 60%, rgba(0, 0, 0, 0) 100%);
  width: 100%;
}

.line-height-relaxed {
  line-height: 1.7;
}
</style>
