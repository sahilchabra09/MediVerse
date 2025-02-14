import type { Config } from "tailwindcss";

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

import svgToDataUri from "mini-svg-data-uri";
import { withUt } from "uploadthing/tw";
const {
  default: flattenColorPalette,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    darkMode: "class",
    extend: {
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      return withUt({
        content: [
          "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
          "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
          "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        ],
        theme: {
          darkMode: "class",
          extend: {
            animation: {
              scroll:
                "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
            },
            keyframes: {
              shimmer: {
                from: {
                  backgroundPosition: "0 0",
                },
                to: {
                  backgroundPosition: "-200% 0",
                },
              },
              scroll: {
                to: {
                  transform: "translate(calc(-50% - 0.5rem))",
                },
              },
            },
            colors: {
              background: "var(--background)",
              foreground: "var(--foreground)",
            },
          },
        },
        plugins: [
          addVariablesForColors,
          function ({ matchUtilities, theme }: any) {
            matchUtilities(
              {
                "bg-grid": (value: any) => ({
                  backgroundImage: `url("${svgToDataUri(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                  )}")`,
                }),
                "bg-grid-small": (value: any) => ({
                  backgroundImage: `url("${svgToDataUri(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                  )}")`,
                }),
                "bg-dot": (value: any) => ({
                  backgroundImage: `url("${svgToDataUri(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                  )}")`,
                }),
              },
              { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
            );
          },
          require("@tailwindcss/typography"),
        ],
      });
    },
    require("@tailwindcss/typography"),
  ],
};
export default withUt(config);
