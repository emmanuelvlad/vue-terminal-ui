export default {
	name: "CommandWhoami",
	methods: {
		whoami(args) {
			if (args.length > 0) this.write("usage: whoami");
			else this.write(this.user);
		}
	}
};