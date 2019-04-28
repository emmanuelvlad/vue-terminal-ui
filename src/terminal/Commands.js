import clear from "./commands/clear";
import pwd from "./commands/pwd";
import whoami from "./commands/whoami";
import secret from "./commands/secret";

export default {
	//
	// Name
	//
	name: "Commands",

	//
	// Mixins
	//
	mixins: [clear, pwd, whoami, secret],

	//
	// Methods
	//
	methods: {
		execute(input) {
			let args = input.trim().split(" ");
			if (!args[0]) return;

			if (typeof this[args[0]] === "function") this[args[0]](args.slice(1));
			else this.write(`sh: ${args[0]}: command not found`, false);
		}
	}
};