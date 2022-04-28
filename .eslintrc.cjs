module.exports = {
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
  },
  "rules": {
    "indent": ["error", 2],
    "multiline-comment-style": ["error", "starred-block"],
    "spaced-comment": ["error", "always"],
    "linebreak-style": ["error", "windows"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-extra-semi": "error",
    "semi-spacing": "error",
    "no-unexpected-multiline": "error",
    "max-len": ["error", { "code": 100 }],
    "comma-style": ["error", "last"],
    "comma-dangle": ["error", "always-multiline"],
  },
};