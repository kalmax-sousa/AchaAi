import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      semi: ["warn", "always"],
      "class-methods-use-this": "off",
      "no-param-reassign": "off",
      camelcase: "off",
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
        },
      ],
    },
    plugins: {
      prettier,
    },
  },
];
