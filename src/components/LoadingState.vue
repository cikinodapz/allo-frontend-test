<template>
  <div>
    <!-- List Skeleton View -->
    <v-row v-if="type === 'list'">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        lg="4"
      >
        <div class="skeleton-card rounded-xl overflow-hidden bg-white pa-4">
          <v-skeleton-loader
            type="image, article"
            class="bg-transparent"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Detail Skeleton View -->
    <div v-else class="skeleton-card rounded-2xl overflow-hidden bg-white pa-8">
      <v-skeleton-loader
        type="image, heading, paragraph, paragraph"
        class="bg-transparent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'list' | 'detail'
  }>(),
  {
    type: 'list',
  }
)
</script>

<style scoped>
.skeleton-card {
  border: 1px solid #e2e8f0;
}
</style>
