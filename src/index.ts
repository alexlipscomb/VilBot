require('source-map-support').install();
import { BaseCommandInteraction, Client, Collection, Intents, Interaction } from 'discord.js';
import * as fs from 'fs';
import { ICommand } from './commands/interfaces/i.command';
import { token } from './config.json';

const client: Client<boolean> = new Client<boolean>({ intents: [Intents.FLAGS.GUILDS] });
const commands: Collection<string, ICommand> = new Collection();

const commandFiles: Array<string> = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log(commandFiles);

// Load commands
for (const file of commandFiles) {
  const commandBuilder = require(`./commands/${file}`);
  const command = commandBuilder.getCommandInstance();
  commands.set(command.data.name, command);
}

// Load event files
// TODO I suspect there's a cleaner way to do this but I don't want to mess with it for now.
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on('interactionCreate', async (interaction: Interaction) => {
  // if (interaction instanceof BaseCommandInteraction && interaction.channel instanceof TextChannel)
  console.log('\x1b[34m', `- ${getTimestamp()} (UTC ${getUTCTimeStamp()}): ${interaction.user.tag} used ${(<BaseCommandInteraction>interaction).commandName} in \#${(<any>interaction.channel).name}`);
  // else
  // console.warn("Unexpected interaction or interaction channel type.");

  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.log("No command associated with command name", interaction.commandName);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command, please try again later.', ephemeral: true });
  }
});

// TODO move to util
function getTimestamp() {
  let date = new Date()
  let year = String(date.getFullYear());
  let month = String(date.getMonth());
  let day = String(date.getDate());
  let hour = String(date.getHours());
  let min = String(date.getMinutes());
  let sec = String(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

function getUTCTimeStamp() {
  let date = new Date()
  let year = String(date.getUTCFullYear());
  let month = String(date.getUTCMonth());
  let day = String(date.getUTCDate());
  let hour = String(date.getUTCHours());
  let min = String(date.getUTCMinutes());
  let sec = String(date.getUTCSeconds());

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

client.login(token);
