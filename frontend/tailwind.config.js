/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#c8d8e4', // Soft Blue
                secondary: '#f0f7fa', // Very light blue for backgrounds
                accent: '#3b82f6', // Bright Blue for actions
                surface: '#ffffff', // White
                'text-main': '#1e293b', // Slate 800
                'text-muted': '#64748b', // Slate 500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
