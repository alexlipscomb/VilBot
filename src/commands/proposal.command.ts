import { roleMention, SlashCommandBuilder } from '@discordjs/builders';
import { Collection, CommandInteraction, GuildMember, Message, MessageEmbed } from "discord.js";
import { proposalRoleId } from '../config.json';
import { ICommand } from "./interfaces/i.command";

export function getCommandInstance(): ICommand {
  return new ProposalCommand();
}

export class ProposalCommand implements ICommand {
  public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName('proposal')
      .setDescription('Options for proposals')
      .addSubcommand(subcommand =>
        subcommand
          .setName('new')
          .setDescription('Create a new proposal')
          .addStringOption(option => option.setName('proposal').setDescription('The proposal').setRequired(true))
          .addBooleanOption(option => option.setName('ping').setDescription('Pings users with proposal role'))
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('members')
          .setDescription('Get the number of members with the proposal role and how many votes are needed to pass')
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('setproposalchannel')
          .setDescription('Set which channel proposals will be sent to')
          .addChannelOption(option => option.setName('channel').setDescription('The target channel').setRequired(true))
      );
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    // create new proposal
    switch (interaction.options.getSubcommand()) {
      case 'new':
        const proposalEmbed: MessageEmbed = this._createProposalEmbed(interaction);

        const proposalMessage: Message = await interaction.reply({ embeds: [proposalEmbed], fetchReply: true }) as Message;
        const pingMode: boolean = !!interaction.options.getBoolean('ping');

        proposalMessage.startThread({ name: `Discuss ${interaction.options.getString('proposal').slice(0, 93)}`, autoArchiveDuration: 'MAX' });

        if (pingMode) {
          proposalMessage.channel.send(roleMention(proposalRoleId));
        }

        break;

      // Check how many members are in proposals
      case 'members':
        const memberCount: number = this._getProposalRoleMembers(interaction);
        const votesToPass: number = Math.round(memberCount / 2);
        return await interaction.reply(`${memberCount} proposal member${(memberCount > 1) ? "s" : ""}\n${votesToPass} vote${(votesToPass > 1 ? "s" : "")} to pass`);

      case 'setproposalchannel':
        break;
    }
  }

  /**
   * @summary Creates a proposal in the Proposals channel where users with the Proposal role can vote
   * @param interaction The context where the command was called
   * @returns {boolean} Returns true if successful, false otherwise
   */
  private _createProposalEmbed(interaction: CommandInteraction): MessageEmbed {
    // Set up all the parameters for the proposal
    const proposalContents: string = interaction.options.getString('proposal');
    const pingMode: boolean = !!interaction.options.getBoolean('ping');
    const guildId: string = interaction.guild.id;
    const userId: string = interaction.user.id;
    const date: string = new Date().toUTCString()
    console.log(date);

    // Create proposal embed
    const embed: MessageEmbed = new MessageEmbed()
      .setColor('#eb6734')
      // .setTitle('')
      .setAuthor(interaction.user.tag, interaction.user.avatarURL())
      // .setDescription(`**Proposal**\n${proposalContents}\nDate Proposed${timeProposed.getDate()}`);
      .addFields(
        { name: 'Proposal', value: proposalContents, inline: false },
        { name: 'Date Proposed', value: date, inline: false }
      )

    return embed;
  }


  // TODO: Offline users don't show up? This is because they're in the cache. 
  /**
   * @summary Returns the members with the Proposal role
   * @param interaction The context where the command was called
   * @returns {number} Returns the number of members
   */
  private _getProposalRoleMembers(interaction: CommandInteraction): number {
    // Change this to be something called from a guild's database
    const users: Collection<string, GuildMember> = interaction.guild.members.cache;

    // Using the cache probably isn't a good long-term solution.
    // Users might be fluctuate depending on who's in the cache.
    var memberCount: number = 0;
    for (let user of users) {
      if (user[1]['user']['bot']) { continue };

      const userRoles = user[1]['_roles'];
      for (let i = 0; i < userRoles.length; i++) {
        if (userRoles[i] === proposalRoleId) {
          memberCount++;
        }
      }
    }

    return memberCount;
  }
}