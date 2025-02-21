module.exports = {
  presets: [
    [
      require("@babel/preset-env").default,
      {
        targets: {
          node: "current",
        },
      },
    ],
    [require("@babel/preset-typescript").default],
  ],
  plugins: [[require("@babel/plugin-transform-runtime").default]],
};
