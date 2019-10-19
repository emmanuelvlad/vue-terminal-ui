module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:vue/strongly-recommended",
	],

	plugins: ["vue"],

	rules: {

		"no-console": "warn",
		
    /**
     * Vue-related rules
     */

		"vue/component-name-in-template-casing": [2, "PascalCase", {
			"registeredComponentsOnly": true,
			"ignores": []
		}],


		"vue/html-closing-bracket-newline": ["error", {
			"singleline": "never",
			"multiline": "never"
		}],

		"vue/html-indent": ["error", "tab"],

		"vue/multiline-html-element-content-newline": ["error", {
			"ignoreWhenEmpty": false,
			"allowEmptyLines": true
		}],

		"vue/multiline-html-element-content-newline": "error"
	}
};
