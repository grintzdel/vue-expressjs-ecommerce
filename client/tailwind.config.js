/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F3EE",
        "bg-primary": "#EDF1E8",
        "bg-dark": "#3D4F2F",
        "bg-medium-green": "#8B9E7B",
        "bg-light-sage": "#D5DCCC",
        "accent-green": "#5C7045",
        "accent-green-light": "#7B8F6B",
        "font-primary": "#1A1A1A",
        "font-secondary": "#4A4A4A",
        "font-tertiary": "#7A7A7A",
        "font-green": "#3D4F2F",
        "font-light": "#FFFFFF",
        "border-dark": "#3D4F2F",
        "border-light": "#C5CDB9",
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        hero: ["64px", { lineHeight: "1.1" }],
        section: ["40px", { lineHeight: "1.2" }],
        subsection: ["28px", { lineHeight: "1.3" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        body: ["16px", { lineHeight: "1.6" }],
        sm: ["14px", { lineHeight: "1.5" }],
        xs: ["12px", { lineHeight: "1.5" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        full: "999px",
      },
    },
  },
  plugins: [],
};
