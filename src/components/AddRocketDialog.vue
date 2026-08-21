<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg" class="pa-2">
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-2">
        <div class="d-flex align-center">
          <v-icon icon="mdi-rocket-launch" color="primary" class="mr-2" />
          <span class="text-h6 font-weight-bold">Add New Rocket</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="closeDialog"
        />
      </v-card-title>

      <v-card-subtitle class="px-4 text-caption text-medium-emphasis">
        Create a custom rocket to display in the running session.
      </v-card-subtitle>

      <v-divider class="my-2" />

      <v-card-text class="px-4 py-2">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-row dense>
            <!-- Full Name (Required) -->
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Rocket Full Name *"
                placeholder="e.g. Starship Super Heavy Block 2"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-format-title"
              />
            </v-col>

            <!-- Short / Base Name -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.name"
                label="Short Name"
                placeholder="e.g. Starship"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-tag-outline"
              />
            </v-col>

            <!-- Country Code -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-flag-outline"
              />
            </v-col>

            <!-- Cost per launch -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Cost Per Launch (USD)"
                placeholder="e.g. 10000000"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
                :rules="[rules.numericOrEmpty]"
              />
            </v-col>

            <!-- Maiden Flight Date -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight Date"
                placeholder="e.g. 2026-10-15"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL"
                placeholder="https://example.com/rocket.jpg"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                hint="Leave empty to use the default high-quality space launch image"
                persistent-hint
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12" class="mt-2">
              <v-textarea
                v-model="form.description"
                label="Rocket Description *"
                placeholder="Provide a detailed description of the rocket's mission, stages, and specs..."
                variant="outlined"
                density="comfortable"
                rows="3"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-text-long"
              />
            </v-col>

            <!-- Status Switch -->
            <v-col cols="12">
              <v-switch
                v-model="form.active"
                color="success"
                label="Active Launch Vehicle"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="my-2" />

      <v-card-actions class="px-4 pb-3 pt-2">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!isFormValid"
          prepend-icon="mdi-plus"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', rocket: NewRocketInput): void
}>()

const isFormValid = ref(false)
const formRef = ref()

const initialFormState = (): NewRocketInput => ({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  active: true,
})

const form = reactive<NewRocketInput>(initialFormState())

const rules = {
  required: (v: string) => Boolean(v && v.trim().length > 0) || 'This field is required.',
  numericOrEmpty: (v: string) => !v || !isNaN(Number(v)) || 'Must be a valid number.',
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      Object.assign(form, initialFormState())
    }
  }
)

function closeDialog() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  if (!form.full_name || !form.description) return

  const newRocket: NewRocketInput = {
    name: form.name?.trim() || form.full_name.trim(),
    full_name: form.full_name.trim(),
    description: form.description.trim(),
    image_url: form.image_url?.trim() || undefined,
    launch_cost: form.launch_cost?.trim() || undefined,
    country_code: form.country_code?.trim() || 'USA',
    maiden_flight: form.maiden_flight || undefined,
    active: form.active ?? true,
  }

  emit('submit', newRocket)
  closeDialog()
}
</script>
