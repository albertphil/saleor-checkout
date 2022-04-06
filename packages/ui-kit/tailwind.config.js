const getSpacing = (
  base /* number */,
  unit /* "px" | "rem" */,
  values /* number[] */
) => {
  return values.reduce((acc, value) => {
    return { ...acc, [value]: base * value + unit };
  }, {});
};

const spacing = getSpacing(
  0.4,
  "rem",
  [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 6.5, 7, 8, 10, 11, 12, 14, 16, 18, 19,
    21, 22, 28, 85, 256, 350,
  ]
);

const theme = {
  colors: {
    transparent: "transparent",
    skeleton: "#DEE4EF",
    background: {
      primary: "#FAFAFA",
      secondary: "#FFFFFF",
      tertiary: "#EEF1F7",
    },
    text: {
      primary: "#394052",
      secondary: "#8A919F",
      tertiary: "#EEF1F7",
      error: "#B65757",
      inverted: "#FFFFFF",
    },
    button: {
      primary: "#394052",
      secondary: "#FFFFFF",
      tertiary: "#DEE4EF",
      quaternary: "#EEF1F7",
    },
    chipButton: {
      active: "#4f5460",
      activeTextColor: "#ffffff",
    },
    border: {
      primary: "#B9C1CF",
      tertiary: "#DEE4EF",
      active: "#394052",
      error: "#B65757",
    },
    tooltip: {
      primary: "#28234A",
    },
    snackbar: {
      error: "#FFE9EA",
      success: "#EDF9F0",
    },
    switch: {
      bgOn: "#394052",
      bgOff: "transparent",
      dotOn: "#ffffff",
      dotOff: "#b9c1cf",
      borderOn: "#394052",
      borderOff: "#b9c1cf",
    },
  },
  fontFamily: {
    sans: ["Inter"],
  },
  spacing: {
    px: "1px",
    ...spacing,
  },
  fontWeight: {
    normal: 400,
    regular: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: ["1.1rem", "1.6rem"],
    sm: ["1.2rem", "2.1rem"],
    base: ["1.4rem", "2.1rem"],
    md: ["1.6rem", "2.3rem"],
    lg: ["2.4rem", "3.2rem"],
    xl: ["3.2rem", "4.6rem"],
  },
  borderRadius: {
    DEFAULT: "4px",
    full: "50%",
  },
};

module.exports = {
  content: ["./src/**/*.tsx"],
  mode: "jit",
  theme: theme,
  plugins: [],
};
