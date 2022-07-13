module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        ["@babel/plugin-proposal-async-generator-functions"],
        ["@babel/plugin-transform-for-of", {
          "loose": false, // defaults to false
          "assumeArray": false // defaults to false
        }],
    ],
  };
};

