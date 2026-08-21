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
        <v-card rounded="lg" elevation="2" class="h-100">
          <v-skeleton-loader
            type="image, article, actions"
            class="bg-surface"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Detail Skeleton View -->
    <v-card v-else rounded="lg" elevation="2" class="pa-6">
      <v-skeleton-loader
        type="heading, subtitle, image, paragraph, paragraph, actions"
        class="bg-surface"
      />
    </v-card>
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
