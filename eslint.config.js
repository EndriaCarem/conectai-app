// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // Objeto com APENAS `ignores` = exclusão global (bundle e build não são lintados).
    ignores: ["**/dist/**", "**/.expo/**"],
  },
  {
    rules: {
      // Reanimated: mutar `.value` de shared values é o padrão documentado da biblioteca,
      // mas o eslint-plugin-react-hooks interpretava como mutação ilegal de estado.
      "react-hooks/immutability": "off",
    },
  }
]);
