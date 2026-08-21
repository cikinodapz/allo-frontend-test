<template>
  <v-app>
    <!-- Navigation App Bar -->
    <v-app-bar
      elevation="1"
      color="surface"
      density="comfortable"
      class="border-b"
    >
      <v-container class="d-flex align-center py-0">
        <router-link to="/" class="d-flex align-center text-decoration-none text-high-emphasis">
          <v-avatar color="primary" size="36" class="mr-3" variant="flat">
            <v-icon icon="mdi-rocket-launch" color="white" size="20" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-black line-height-1">Allo Space</div>
            <div class="text-caption text-medium-emphasis">SpaceX Rocket Catalog</div>
          </div>
        </router-link>

        <v-spacer />

        <v-btn
          to="/"
          variant="text"
          prepend-icon="mdi-home"
          class="mr-2"
        >
          Catalog
        </v-btn>

        <v-btn
          icon="mdi-github"
          variant="text"
          href="https://github.com/cikinodapz/allo-frontend-test"
          target="_blank"
          rel="noopener noreferrer"
        />
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <router-view />
    </v-main>

    <!-- App Footer -->
    <v-footer class="border-t py-4 text-center text-caption text-medium-emphasis">
      <v-container>
        <div>
          Allo Bank Frontend Technical Assignment &bull; Built with Vue 3, Vite, TypeScript & Vuetify
        </div>
        <div class="mt-1">
          Data provided by <a href="https://thespacedevs.com/llapi" target="_blank" rel="noopener noreferrer" class="text-primary text-decoration-none">Launch Library 2 API</a>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
// Main App Component
</script>

<style scoped>
.line-height-1 {
  line-height: 1.2;
}
</style>
