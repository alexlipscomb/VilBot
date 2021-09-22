import { SlashCommandBuilder } from '@discordjs/builders';
import { Awaited, CommandInteraction } from "discord.js";
import { Token } from 'typedi';

export interface ICommand {
    getName(): string;
    data: Pick<SlashCommandBuilder, "name" | "toJSON">;
    execute: (interaction: CommandInteraction) => Awaited<void>;
}

export const CommandToken = new Token<ICommand>('Command');