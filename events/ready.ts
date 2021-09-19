module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('\x1b[32m', `${client.user.tag} has connected.`);
    },
};