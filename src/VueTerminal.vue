<template>
	<vue-terminal-ui
		ref="terminal-ui"
		:prefix="prefix"
		@triggerCommand="execute"
	/>
</template>


<script>
import VueTerminalUI from "./VueTerminalUI.vue";
import Commands from "./terminal/Commands";
import Directory from "./terminal/Directory";

export default {
	//
	// Name
	//
	name: "VueTerminal",

	mixins: [Commands, Directory],

	//
	// Components
	//
	components: {
		VueTerminalUI
	},

	//
	// Props
	//
	props: {
		prefix: {
			type: String,
			default: ""
		},

		user: {
			type: String,
			default: "root"
		}
	},

	//
	// Methods
	//
	methods: {

		execute(command) {
			if (command === "test") {
				this.prefix = "hello@root:";
			}
			// TODO: do all the command execution
		},

	},
};
</script>
