const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

const kakaoPackages = ["@react-native-kakao/user", "@react-native-kakao/core"];

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    assert: require.resolve("assert/"),
  },
  resolveRequest: (context, moduleName, platform) => {
    if (kakaoPackages.includes(moduleName)) {
      const pkg = require(
        path.join(__dirname, "node_modules", moduleName, "package.json"),
      );
      return {
        filePath: path.join(
          __dirname,
          "node_modules",
          moduleName,
          `${pkg.main}.js`,
        ),
        type: "sourceFile",
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
