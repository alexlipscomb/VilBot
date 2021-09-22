require('source-map-support').install();
import { BaseCommandInteraction, Client, Intents, Interaction } from 'discord.js';
import * as fs from 'fs';
import 'reflect-metadata';
import Container from 'typedi';
import { GarfCommand } from './commands/garf.command';
import { CommandToken, ICommand } from './commands/interfaces/i.command';
import { ProposalCommand } from './commands/proposal.command';
import { SuggestionBoxCommand } from './commands/suggestion.box.command';
import { TestCommand } from './commands/test.command';
import { VilbotCommand } from './commands/vilbot.command';
import { token } from './config.json';
import { Logger } from './services/logging.service';

const log: Logger = Logger.getLogger("index");

// Load commands - commands must be present in this array to load
Container.import([ProposalCommand, VilbotCommand, TestCommand, SuggestionBoxCommand, GarfCommand]);
const commandContainers: ICommand[] = Container.getMany(CommandToken);
log.debug(commandContainers);

const commands: Map<string, ICommand> = new Map();

for (let command of commandContainers) {
    log.info(`Loading command '${command.getName()}'`);
    commands.set(command.getName(), command);
}

// Construct client
const client: Client<boolean> = new Client<boolean>({ intents: [Intents.FLAGS.GUILDS] });

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
    log.debug(`${interaction.user.tag} used ${(<BaseCommandInteraction>interaction).commandName} in \#${(<any>interaction.channel).name}`);

    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
        log.warn("No command associated with command name", interaction.commandName);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        log.error(error);
        await interaction.reply({ content: 'There was an error while executing this command, please try again later.', ephemeral: true });
    }
});

client.login(token);
