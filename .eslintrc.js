module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 10
        },
        multiline: {
          max: 1
        }
      }
    ],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/multi-word-component-names': ['off'],
    'vue/html-self-closing': ['off']
  }
};
