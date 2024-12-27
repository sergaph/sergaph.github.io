/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				// mono: ['DistantGalaxy', ...defaultTheme.fontFamily.mono],
				mono: ['Behrens', ...defaultTheme.fontFamily.mono],
				sans: ['Roboto', ...defaultTheme.fontFamily.sans]
			  },
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
