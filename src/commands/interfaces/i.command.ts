import { SlashCommandBuilder } from '@discordjs/builders';
import { Awaited, CommandInteraction } from "discord.js";

export interface ICommand {
  data: Pick<SlashCommandBuilder, "name" | "toJSON">;
  execute: (interaction: CommandInteraction) => Awaited<void>;
}