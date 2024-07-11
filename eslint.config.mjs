import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  {
    // files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // 'no-console': 'off' // allow console.log in TypeScript files
      "vue/html-self-closing": 0,
      "@typescript-eslint/no-explicit-any": "warn",

      // TODO: Remove those rules
      "@stylistic/brace-style": "off",
      "@stylistic/semi": "off",
      "@stylistic/operator-linebreak": "off",
      "vue/max-attributes-per-line": ["off", {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      "vue/singleline-html-element-content-newline": "off",
      "vue/comma-dangle": "off",
      "@stylistic/comma-dangle": "off",
      "@stylistic/member-delimiter-style": "off",
      "comma-dangle": ["off"],
    },
  },
)
