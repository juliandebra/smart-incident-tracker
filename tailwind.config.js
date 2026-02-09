/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ion-color-primary)',
        secondary: 'var(--ion-color-secondary)',
        success: 'var(--ion-color-success)',
        warning: 'var(--ion-color-warning)',
        danger: 'var(--ion-color-danger)',
        dark: 'var(--ion-color-dark)',
        medium: 'var(--ion-color-medium)',
        light: 'var(--ion-color-light)',
      },
    },
  },
  plugins: [],
}
