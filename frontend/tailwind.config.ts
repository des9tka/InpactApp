import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			animation: {
				wave: "wave 1s ease-in-out infinite",
			},
			keyframes: {
				wave: {
					"0%, 100%": { height: "10px" },
					"50%": { height: "50px" },
				},
			},
		},
	},
	plugins: [
		function (api: PluginAPI) {
			const { addUtilities } = api;
			const newUtilities = {
				".animation-delay-100": { "animation-delay": "0.1s" },
				".animation-delay-200": { "animation-delay": "0.2s" },
				".animation-delay-300": { "animation-delay": "0.3s" },
			};
			addUtilities(newUtilities);
		},
	],
} satisfies Config;
