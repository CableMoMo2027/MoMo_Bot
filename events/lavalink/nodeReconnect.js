module.exports = {
    name: 'nodeReconnect',
    execute(node) {
        console.log(`[WARN] ${node.host} reconnected.`);
    },
};