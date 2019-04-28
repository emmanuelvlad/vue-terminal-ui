export default {
	//
	// Name
	//
	name: "Directory",

	//
	// Data
	//
	data() {
		return {
			currentDir: {},
			workingDir: "/",
			rootHierarchy: [
				{
					name: "root",
					directory: [
						{
							name: "hello.txt",
							permissions: 777,
							content: "hello"
						}
					],
					permissions: 777,
				}
			]
		};
	},

	//
	// Methods
	//
	methods: {

		cleanPath(path) {
			return path.replace(/\/{2,}/, "/");
		},

		findDir(raw) {
			let path = this.cleanPath(raw);
			let fromRoot = (path[0] === "/") ? true : false;
			let split = path.substring((fromRoot) ? 1 : 0, path.length).split("/");
			let index = 0;
			let find = (fromRoot) ? this.rootHierarchy : this.currentDir;

			for (; split.length > index; index++) {
				let next = find.find(el => el.name === split[index] && el.directory instanceof Array);
				if (next && next.directory && (find = next.directory)) continue;
				else if (fromRoot && split.length === 1) continue;
				else break;
			}

			return (split.length === index) ? find : (split.length === 1 && fromRoot) ? true : false;
		},

		changeDir(str) {
			let dir = this.findDir(str);

			if (dir) this.currentDir = dir;
			else return false;
			let fromRoot = (str[0] === "/") ? true : false;

			let split = str.split("/");

			split.forEach();
		},

		applyParent(parent) {
			for (let i = 0; parent.length > i; i++) {
				parent[i].parent = parent;
				if (parent[i].directory) parent[i] = this.applyParent(parent[i]);
			}
			return parent;
		}
	},

	//
	// Created
	//
	created() {
		this.rootHierarchy = this.applyParent(this.rootHierarchy);
		this.currentDir = this.rootHierarchy;
	}
};
