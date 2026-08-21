<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    hover
    rounded="lg"
    @click="navigateToDetail"
  >
    <!-- Rocket Image with Fallback and Status Badge -->
    <div class="position-relative">
      <v-img
        :src="rocket.image_url || DEFAULT_ROCKET_IMAGE"
        height="220"
        cover
        class="align-end bg-grey-darken-4"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="primary"
              indeterminate
              size="28"
            />
          </div>
        </template>

        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height text-grey">
            <v-icon
              icon="mdi-rocket-outline"
              size="48"
              class="mb-2"
            />
            <span class="text-caption">Image unavailable</span>
          </div>
        </template>

        <div class="image-gradient pa-3 d-flex justify-space-between align-end">
          <v-chip
            v-if="rocket.isLocal"
            color="warning"
            size="small"
            variant="flat"
            prepend-icon="mdi-account-edit"
          >
            Custom Added
          </v-chip>
          <v-chip
            v-else
            :color="rocket.active ? 'success' : 'grey'"
            size="small"
            variant="flat"
            :prepend-icon="rocket.active ? 'mdi-check-circle' : 'mdi-archive'"
          >
            {{ rocket.active ? 'Active' : 'Retired' }}
          </v-chip>

          <v-chip
            v-if="rocket.manufacturer?.country_code"
            color="surface"
            size="small"
            variant="flat"
            class="text-caption font-weight-medium"
          >
            <v-icon
              icon="mdi-map-marker"
              start
              size="14"
            />
            {{ rocket.manufacturer.country_code }}
          </v-chip>
        </div>
      </v-img>
    </div>

    <!-- Content Area -->
    <v-card-item class="pb-1">
      <v-card-title class="text-h6 font-weight-bold text-truncate" :title="rocket.full_name">
        {{ rocket.full_name }}
      </v-card-title>
      <v-card-subtitle class="text-caption text-primary font-weight-medium">
        {{ rocket.manufacturer?.name || 'SpaceX' }}
        <span v-if="rocket.family"> &bull; {{ rocket.family }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-2 pb-3">
      <p class="description-text text-body-2 text-medium-emphasis mb-3">
        {{ rocket.description || 'No description available for this rocket configuration.' }}
      </p>

      <v-divider class="mb-3" />

      <!-- Quick specs row -->
      <div class="d-flex justify-space-between text-caption text-medium-emphasis">
        <div>
          <v-icon icon="mdi-currency-usd" size="14" class="mr-1" />
          <span>{{ formatCurrency(rocket.launch_cost) }}</span>
        </div>
        <div>
          <v-icon icon="mdi-calendar" size="14" class="mr-1" />
          <span>{{ formatDate(rocket.maiden_flight) }}</span>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0">
      <v-btn
        color="primary"
        variant="tonal"
        block
        append-icon="mdi-arrow-right"
        size="small"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, DEFAULT_ROCKET_IMAGE } from '@/utils/formatters'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.image-gradient {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  width: 100%;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4rem;
  line-height: 1.35;
}
</style>
