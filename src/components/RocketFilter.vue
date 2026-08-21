<template>
  <v-card elevation="1" rounded="lg" class="pa-4 mb-6">
    <v-row align="center" dense>
      <!-- Search Input -->
      <v-col cols="12" md="7">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search SpaceX rockets by name or description..."
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          placeholder="e.g. Falcon 9, Heavy, Starship"
          @update:model-value="onSearchUpdate"
        />
      </v-col>

      <!-- Status Filter Segment -->
      <v-col cols="12" sm="8" md="5" class="d-flex justify-sm-end align-center mt-2 mt-md-0">
        <v-btn-toggle
          v-model="status"
          color="primary"
          mandatory
          density="comfortable"
          rounded="lg"
          variant="outlined"
          @update:model-value="onStatusUpdate"
        >
          <v-btn value="all" size="small">
            <v-icon icon="mdi-view-grid-outline" start size="16" />
            All
          </v-btn>
          <v-btn value="active" size="small">
            <v-icon icon="mdi-check-circle-outline" start size="16" />
            Active
          </v-btn>
          <v-btn value="inactive" size="small">
            <v-icon icon="mdi-archive-outline" start size="16" />
            Retired
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  initialSearch?: string
  initialStatus?: 'all' | 'active' | 'inactive'
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:status', value: 'all' | 'active' | 'inactive'): void
}>()

const search = ref(props.initialSearch || '')
const status = ref<'all' | 'active' | 'inactive'>(props.initialStatus || 'all')

function onSearchUpdate(val: string | null) {
  emit('update:search', val || '')
}

function onStatusUpdate(val: 'all' | 'active' | 'inactive') {
  emit('update:status', val)
}
</script>
