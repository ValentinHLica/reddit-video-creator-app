const { alias } = require("react-app-rewire-alias");

module.exports = function override(config) {
  alias({
    "@components": "src/components",
    "@ui": "src/components/UI/index.tsx",
    "@config": "src/config",
    "@interface": "src/interface",
    "@styles": "src/styles/components",
    "@utils": "src/utils",
    "@icon": "src/components/CustomIcons.tsx",
    "@context": "src/components/Context.tsx",
  })(config);

  return config;
};
