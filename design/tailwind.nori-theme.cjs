/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#117ec6",
          primaryDark: "#0064a6",
          primarySoft: "#edf7fe",
          primaryBorder: "#b0d1f0",
          secondary: "#4bafc5",
          secondarySoft: "#eafbff",
          success: "#12c74b",
          successStrong: "#219653",
          successSoft: "#ebfaf0",
          accent: "#e9606d",
          accentSoft: "#fdeff0",
          attention: "#fbdb01"
        },
        surface: {
          page: "#ffffff",
          panel: "#ffffff",
          subtle: "#f9f9f9",
          muted: "#f2f2f2",
          header: "#464c56"
        },
        text: {
          strong: "#333333",
          body: "#666666",
          muted: "#aaaaaa",
          inverse: "#ffffff",
          header: "#6a7077"
        },
        border: {
          DEFAULT: "#dddddd",
          muted: "#dedede",
          focus: "#91c4ea",
          error: "#e9606d"
        },
        feedback: {
          infoBg: "#eafbff",
          infoText: "#2d9cdb",
          successBg: "#ebfaf0",
          successText: "#219653",
          warningText: "#e2c501",
          errorBg: "#fdeff0",
          errorText: "#e9606d"
        }
      },
      fontFamily: {
        base: ["Hiragino Kaku Gothic Pro", "Osaka", "Meiryo", "MS PGothic", "Verdana", "sans-serif"],
        code: ["Fira Code", "monospace"],
        display: ["Oswald", "sans-serif"],
        serifAccent: ["Yuji Syuku", "Noto Serif JP", "serif"]
      },
      fontSize: {
        "2xs": "1rem",
        xs: "1.1rem",
        sm: "1.2rem",
        md: "1.3rem",
        lg: "1.4rem",
        xl: "1.6rem",
        "2xl": "2rem"
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        11: "44px",
        12: "48px"
      },
      borderRadius: {
        xs: "2px",
        sm: "3px",
        md: "4px",
        lg: "8px",
        xl: "14px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12)",
        search: "0 3px 5px rgba(0,0,0,.25), 3px 5px 8px rgba(0,0,0,.15)",
        tooltip: "0 2px 8px 8px hsla(0,0%,67%,.6)",
        tooltipLg: "0 4px 16px 8px hsla(0,0%,67%,.6)",
        errorFocus: "0 0 4px 0 #e9606d"
      },
      maxWidth: {
        content: "1168px"
      },
      screens: {
        xs: "368px",
        sm: "600px",
        smAlt: "615px",
        md: "839px",
        mdAlt: "840px",
        lg: "961px",
        xl: "1167px",
        "2xl": "1380px",
        "3xl": "1400px",
        "4xl": "1500px"
      }
    }
  }
};
