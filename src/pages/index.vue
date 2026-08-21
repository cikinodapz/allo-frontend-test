<template>
  <v-container class="py-6">
    <!-- Header Banner -->
    <v-card
      class="mb-6 pa-6 hero-card text-white"
      rounded="xl"
      elevation="4"
    >
      <v-row align="center">
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-2">
            <v-chip color="primary" variant="flat" size="small" class="mr-2 font-weight-bold">
              SpaceX Launch Vehicles
            </v-chip>
            <span class="text-caption text-grey-lighten-1">Powered by Launch Library 2</span>
          </div>
          <h1 class="text-h4 text-sm-h3 font-weight-black mb-2">
            SpaceX Rockets Catalog
          </h1>
          <p class="text-body-1 text-grey-lighten-1 mb-0 max-w-600">
            Explore orbital rocket configurations developed by SpaceX — from early Falcon 1 test flights to reusable Falcon 9, Falcon Heavy, and Starship.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right mt-4 mt-md-0">
          <v-btn
            color="primary"
            size="large"
            rounded="pill"
            prepend-icon="mdi-plus"
            elevation="3"
            class="font-weight-bold px-6"
            @click="isAddDialogOpen = true"
          >
            Add New Rocket
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Filter & Search Bar -->
    <RocketFilter
      :initial-search="store.searchQuery"
      :initial-status="store.statusFilter"
      @update:search="onSearchChange"
      @update:status="onStatusChange"
    />

    <!-- Loading State -->
    <LoadingState v-if="store.loading" type="list" />

    <!-- Error State with Retry -->
    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="refreshData"
    />

    <!-- Empty Filter Result State -->
    <v-card
      v-else-if="store.filteredRockets.length === 0"
      class="pa-8 text-center my-6"
      rounded="lg"
      variant="outlined"
    >
      <v-avatar color="surface-variant" size="64" class="mb-4">
        <v-icon icon="mdi-magnify-remove-outline" size="32" />
      </v-avatar>
      <h3 class="text-h6 font-weight-bold mb-2">No Rockets Found</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        No rockets matched your current search criteria: "<strong>{{ store.searchQuery }}</strong>"
      </p>
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-filter-remove-outline"
        @click="resetFilters"
      >
        Clear Filters
      </v-btn>
    </v-card>

    <!-- Success / Rockets Grid State -->
    <div v-else>
      <div class="d-flex justify-space-between align-center mb-4 px-1">
        <span class="text-subtitle-2 text-medium-emphasis">
          Showing <strong>{{ store.filteredRockets.length }}</strong> of {{ store.totalCount }} rockets
        </span>
        <v-btn
          variant="text"
          density="compact"
          size="small"
          prepend-icon="mdi-refresh"
          color="primary"
          @click="refreshData"
        >
          Refresh
        </v-btn>
      </div>

      <v-row>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>

    <!-- Add Rocket Dialog Modal -->
    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddNewRocket"
    />

    <!-- Success Snackbar Notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      location="top right"
      timeout="3500"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="mr-2" />
        <span>{{ snackbarMessage }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput } from '@/types/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const store = useRocketStore()

const isAddDialogOpen = ref(false)
const showSnackbar = ref(false)
const snackbarMessage = ref('')

onMounted(() => {
  store.fetchRockets()
})

function onSearchChange(query: string) {
  store.setSearchQuery(query)
}

function onStatusChange(status: 'all' | 'active' | 'inactive') {
  store.setStatusFilter(status)
}

function resetFilters() {
  store.setSearchQuery('')
  store.setStatusFilter('all')
}

function refreshData() {
  store.fetchRockets(true)
}

function handleAddNewRocket(newRocketInput: NewRocketInput) {
  const created = store.addNewRocket(newRocketInput)
  snackbarMessage.value = `Rocket "${created.full_name}" added successfully!`
  showSnackbar.value = true
}
</script>

<style scoped>
.hero-card {
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #1e3a8a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.max-w-600 {
  max-width: 600px;
}
</style>
