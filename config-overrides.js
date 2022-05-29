const { alias } = require("react-app-rewire-alias");

module.exports = function override(config) {
  alias({
    "@utils": "src/utils",
    "@interface": "src/interface",
    "@components": "src/components",
    "@styles": "src/styles",
    "@ui": "src/components/UI/index.tsx",
    "@icon": "src/components/CustomIcons.tsx",
    "@pages": "src/pages",
  })(config);

  return config;
};
