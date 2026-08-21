<template>
  <v-dialog
    :model-value="modelValue"
    max-width="580"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="2xl" class="dialog-card pa-2 bg-white">
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-1">
        <div>
          <span class="text-h6 font-weight-bold text-slate-900 d-block">Add New Rocket</span>
          <span class="text-caption text-slate-500 font-weight-normal">
            Add a custom launch vehicle configuration to your local fleet.
          </span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          class="text-slate-400"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider class="my-3 border-subtle" />

      <v-card-text class="px-4 py-2">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-row dense>
            <!-- Full Name (Required) -->
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Full Name *"
                placeholder="e.g. Starship Block 2"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="[rules.required]"
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
                rounded="lg"
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
                rounded="lg"
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
                rounded="lg"
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
                rounded="lg"
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
                rounded="lg"
                hint="Leave empty to use high-res default fallback image"
                persistent-hint
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12" class="mt-2">
              <v-textarea
                v-model="form.description"
                label="Rocket Description *"
                placeholder="Provide details about the rocket's stages, payloads, and mission profile..."
                variant="outlined"
                density="comfortable"
                rows="3"
                rounded="lg"
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Status Switch -->
            <v-col cols="12" class="pt-2">
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

      <v-divider class="my-3 border-subtle" />

      <v-card-actions class="px-4 pb-4 pt-1">
        <v-spacer />
        <v-btn
          variant="text"
          rounded="lg"
          class="text-none font-weight-medium text-slate-600"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          class="text-none font-weight-semibold px-5 action-btn"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Add to Fleet
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

<style scoped>
.dialog-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.border-subtle {
  border-color: #f1f5f9 !important;
}

.action-btn {
  background-color: #0f172a !important;
  color: #ffffff !important;
}
</style>
