import { roleMention } from '@discordjs/builders';
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Service } from 'typedi';
import { proposalRoleId } from '../config.json';
import { VilbotUtil } from '../util/vilbot.util';

@Service()
export class ProposalService {
    constructor() { }

    public async createNewProposal(interaction: CommandInteraction): Promise<void> {
        const pingMode: boolean = !!interaction.options.getBoolean('ping');

        const proposalEmbed: MessageEmbed = this._createProposalEmbed(interaction);

        const proposalMessage: Message = await interaction.reply({ embeds: [proposalEmbed], fetchReply: true }) as Message;

        await proposalMessage.startThread({ name: `Discuss ${interaction.options.getString('proposal').slice(0, 93)}`, autoArchiveDuration: 'MAX' });

        if (pingMode) {
            await proposalMessage.channel.send(roleMention(proposalRoleId));
        }
    }

    public async getMemberCount(interaction: CommandInteraction): Promise<void> {
        const memberCount: number = VilbotUtil.getRoleMembers(interaction.guild, proposalRoleId);
        const votesToPass: number = Math.round(memberCount / 2);
        return await interaction.reply(`${memberCount} proposal member${(memberCount > 1) ? "s" : ""}\n${votesToPass} vote${(votesToPass > 1 ? "s" : "")} to pass`);
    }

    public async setProposalChannel(interaction: CommandInteraction): Promise<void> {
        // TODO
        await interaction.reply("This feature has not been implemented yet!");
    }

    /**
     * @summary Creates a proposal in the Proposals channel where users with the Proposal role can vote
     * @param interaction The context where the command was called
     * @returns {boolean} Returns true if successful, false otherwise
     */
    private _createProposalEmbed(interaction: CommandInteraction): MessageEmbed {
        // Set up all the parameters for the proposal
        const proposalContents: string = interaction.options.getString('proposal');
        // const guildId: string = interaction.guild.id;
        // const userId: string = interaction.user.id;
        // const pingMode: boolean = !!interaction.options.getBoolean('ping');
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
}