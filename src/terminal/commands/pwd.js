export default {
	name: "CommandPwd",
	methods: {
		pwd() {
			// console.log(this.findDir(this.workingDir));
			this.write(this.rootHierarchy[0].parent.name);
		}
	}
};