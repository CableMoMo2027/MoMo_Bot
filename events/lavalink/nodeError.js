module.exports = {
	name: 'nodeError',
	execute(node, error) {
		console.error(`❌ Lavalink Node Error [${node.name}]:`, error);
	},
};