const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
import 'reflect-metadata';
import Container from 'typedi';
import { GarfCommand } from "./commands/garf.command";
import { HotTakeCommand } from './commands/hot.take.command';
import { CommandToken, ICommand } from "./commands/interfaces/i.command";
import { ProposalCommand } from "./commands/proposal.command";
import { SuggestionBoxCommand } from './commands/suggestion.box.command';
import { TestCommand } from './commands/test.command';
import { VilbotCommand } from './commands/vilbot.command';

// Load commands - commands must be present in this array to load
Container.import([ProposalCommand, VilbotCommand, TestCommand, SuggestionBoxCommand, GarfCommand, HotTakeCommand]);
const commandContainers: ICommand[] = Container.getMany(CommandToken);

var commands = [];
console.log("Commands to deploy:")
console.log(commandContainers);

// Locate command files and load into JSON
for (const command of commandContainers) {
    commands.push(command.data.toJSON());
}

// Deploy slash commands to Discord
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();

export { };

