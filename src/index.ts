require('source-map-support').install();
import { BaseCommandInteraction, Client, Intents, Interaction, MessageReaction, User } from 'discord.js';
import * as fs from 'fs';
import 'reflect-metadata';
import Container from 'typedi';
import { GarfCommand } from './commands/garf.command';
import { HotTakeCommand } from './commands/hot.take.command';
import { CommandToken, ICommand } from './commands/interfaces/i.command';
import { ProposalCommand } from './commands/proposal.command';
import { SuggestionBoxCommand } from './commands/suggestion.box.command';
import { TestCommand } from './commands/test.command';
import { VilbotCommand } from './commands/vilbot.command';
import { EventConstants } from './constants/event.constants';
import { HotTakeDao } from './dao/hot.take.dao';
import { ProposalDao } from './dao/proposal.dao';
import { ConfigurationService } from './services/configuration.service';
import { EventService } from './services/event.service';
import { HotTakeService } from './services/hot.take.service';
import { Logger } from './services/logging.service';
import { ProposalService } from './services/proposal.service';

// Set base directory
global.__basedir = __dirname;

// Initialize logger
const log: Logger = Logger.getLogger("index");

// Initialize services
Container.get(ConfigurationService).initialize();
Container.get(HotTakeDao).initialize();
Container.get(HotTakeService).initialize();
Container.get(ProposalDao).initialize();
Container.get(ProposalService).initialize();

// Load commands - commands must be present in this array to load
Container.import([ProposalCommand, VilbotCommand, TestCommand, SuggestionBoxCommand, GarfCommand, HotTakeCommand]);
const commandContainers: ICommand[] = Container.getMany(CommandToken);
log.debug(commandContainers);

const commands: Map<string, ICommand> = new Map();

for (let command of commandContainers) {
    log.info(`Loading command '${command.getName()}'`);
    commands.set(command.getName(), command);
}

// Construct client
const client: Client<boolean> = new Client<boolean>({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

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

// Register listeners
client.on(EventConstants.InteractionCreate, async (interaction: Interaction) => {
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

// TODO Discord API docs say these only work for cached messages - so we'll miss reactions from old messages
client.on(EventConstants.MessageReactionAdd, async (reaction: MessageReaction, user: User) => {
    if (log.isDebugEnabled()) {
        log.debug("Received message reaction add event.");
    }
    Container.get(EventService).raise(EventConstants.MessageReactionAdd, { reaction, user });
});

// TODO Discord API docs say these only work for cached messages - so we'll miss reactions from old messages
client.on(EventConstants.MessageReactionRemove, async (reaction: MessageReaction, user: User) => {
    if (log.isDebugEnabled()) {
        log.debug("Received message reaction remove event.");
    }
    Container.get(EventService).raise(EventConstants.MessageReactionRemove, { reaction, user });
});

const token = Container.get(ConfigurationService).getToken();
if (token) {
    client.login(token);
}
else {
    log.fatal("No token provided");
}
