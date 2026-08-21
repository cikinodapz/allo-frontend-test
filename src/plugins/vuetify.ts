/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#3b82f6', // Electric space blue
          secondary: '#6366f1', // Indigo accent
          surface: '#111827', // Slate 900
          background: '#090d16', // Deep space dark background
          error: '#ef4444',
          info: '#0ea5e9',
          success: '#10b981',
          warning: '#f59e0b',
        },
      },
    },
  },
})
