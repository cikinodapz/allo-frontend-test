<template>
  <v-card
    color="error"
    variant="tonal"
    rounded="lg"
    class="pa-6 text-center my-8 mx-auto"
    max-width="600"
  >
    <v-avatar color="error" size="64" class="mb-4" variant="flat">
      <v-icon icon="mdi-alert-circle-outline" size="36" color="white" />
    </v-avatar>

    <h3 class="text-h6 font-weight-bold mb-2">
      {{ title || 'Failed to Load Rocket Data' }}
    </h3>

    <p class="text-body-2 text-medium-emphasis mb-6">
      {{ message || 'An error occurred while communicating with the Launch Library API. Please check your network connection and try again.' }}
    </p>

    <div class="d-flex justify-center ga-3">
      <v-btn
        color="error"
        variant="flat"
        prepend-icon="mdi-refresh"
        rounded="pill"
        class="px-6"
        @click="$emit('retry')"
      >
        Retry Again
      </v-btn>

      <slot name="actions" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
