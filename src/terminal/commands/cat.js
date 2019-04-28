export default {
	name: "CommandCat",
	methods: {
		cat(path) {
			let split = this.cleanPath(path).split("/");
			split.slice(0, split.length - 1);
			
			this.findDir(this.workingDir);
			this.write(this.rootHierarchy[0].parent.name);
		}
	}
};