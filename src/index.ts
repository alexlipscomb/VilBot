const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log(commandFiles);

// Load commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Load event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on('interactionCreate', async interaction => {
    console.log('\x1b[34m', `- ${getTimestamp()} (UTC ${getUTCTimeStamp()}): ${interaction.user.tag} used ${interaction.commandName} in \#${interaction.channel.name}`);
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command, please try again later.', ephemeral: true });
    }
});

function getTimestamp() {
    var date = new Date()
    var year = String(date.getFullYear());
    var month = String(date.getMonth());
    var day = String(date.getDate());
    var hour = String(date.getHours());
    var min = String(date.getMinutes());
    var sec = String(date.getSeconds());

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

function getUTCTimeStamp() {
    var date = new Date()
    var year = String(date.getUTCFullYear());
    var month = String(date.getUTCMonth());
    var day = String(date.getUTCDate());
    var hour = String(date.getUTCHours());
    var min = String(date.getUTCMinutes());
    var sec = String(date.getUTCSeconds());

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

client.login(token);

export { };