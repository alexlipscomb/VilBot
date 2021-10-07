import { roleMention } from '@discordjs/builders';
import { Channel, CommandInteraction, Message, MessageEmbed } from "discord.js";
import { Service } from 'typedi';
import { ProposalDao } from '../dao/proposal.dao';
import { Proposal } from '../model/proposal';
import { VilbotUtil } from '../util/vilbot.util';
import { ConfigurationService } from './configuration.service';
import { EventService } from './event.service';
import { Logger } from './logging.service';

@Service()
export class ProposalService {
    private readonly log: Logger = Logger.getLogger('ProposalService');
    private readonly vilbotUtil: VilbotUtil = new VilbotUtil();

    constructor(
        private _dao: ProposalDao,
        private _eventService: EventService,
        private _configService: ConfigurationService
    ) { }

    public initialize(): void {

    }

    // TODO set limits on length of proposals and limit the types of characters that can be sent to avoid bugs.
    // ? Maybe check to see if the proposal role is already set, since if someone calls this command
    // and it's not already set, that could be an issue. Better maybe to get that out of the way and confirm that the proposal role is set.
    public async createNewProposal(interaction: CommandInteraction): Promise<void> {
        const pingMode: boolean = !!interaction.options.getBoolean('ping');

        // Check if the user has the proposal commnand, and if not, send an ephemeral message to them saying that they'll need the proposal role.

        try {
            const id: string = await this._dao.createProposal(interaction.options.getString('proposal'), interaction.user.id);
            if (id) {
                const proposal: Proposal = await this._dao.getProposalById(id);
                if (proposal) {
                    await this._dao.addMessageMetadata(id, {
                        messageId: interaction.id,
                        channelId: interaction.channel.id,
                        guildId: interaction.guild.id
                    })
                }
            } else {
                return null;
            }
        } catch (error) {
            await interaction.reply({ content: 'Something went wrong while creating your proposal.', ephemeral: true });
        }

        const proposalChannelId: string = await this._dao.getProposalChannel(interaction);
        if (proposalChannelId === null) {
            await interaction.reply({ content: 'No proposal channel was set. Set one using /proposal setproposalchannel', ephemeral: true });
            return null;
        }

        const proposalChannel: Channel = await (await interaction.guild.channels.fetch(proposalChannelId)).fetch();

        if (proposalChannel.isText()) {
            try {
                const proposalEmbed: MessageEmbed = this._createProposalEmbed(interaction);
                const proposalMessage: Message = await proposalChannel.send({ embeds: [proposalEmbed] }) as Message;
                proposalMessage.react('👍');
                proposalMessage.react('👎');
                await proposalMessage.startThread({ name: `Discuss ${interaction.options.getString('proposal').slice(0, 93)}`, autoArchiveDuration: 'MAX' });

                if (pingMode) {
                    await proposalMessage.channel.send(roleMention(await this._dao.getProposalRole(interaction)));
                }

                await interaction.reply({ content: `Proposal created in ${proposalChannel.toString()}!`, ephemeral: true });

            } catch (error) { // Catch a specific error, but I don't know what, yet.
                this.log.error(error);
                await interaction.reply({ content: 'Something went wrong while creating your proposal.', ephemeral: true });
            }
        }

    }

    // TODO 
    // Set Guild Agree & Disagree emojis
    // Set Guild ProposalRole 

    public async getMemberCount(interaction: CommandInteraction): Promise<void> {
        const memberCount: number = VilbotUtil.getRoleMembers(interaction.guild, this._configService.getProposalRoleId());
        const votesToPass: number = Math.round(memberCount / 2);
        return await interaction.reply(`${memberCount} proposal member${(memberCount > 1) ? "s" : ""}\n${votesToPass} vote${(votesToPass > 1 ? "s" : "")} to pass`);
    }

    public async setProposalChannel(interaction: CommandInteraction): Promise<void> {
        if (!this.vilbotUtil.memberHasPermissions(interaction, [this.vilbotUtil.PERMISSIONS.ADMINISTRATOR])) {
            return null;
        }

        try {
            this._dao.setProposalChannel(interaction);
            await interaction.reply(`Set ${interaction.options.getChannel('channel')} as the proposal channel`);
        } catch (error) {
            this.log.error('Error setting proposal channel:', error);
            await interaction.reply('There was an error setting the proposal channel')
        }
    }

    public async setProposalMode(interaction: CommandInteraction, mode: string): Promise<void> {
        switch (mode) {
            case 'majority':
                return await interaction.reply('Set pass condition to `majority`');
            case 'static':
                const numVotesToPass: number = interaction.options.getInteger('votes');
                if (this._setStaticVotes(numVotesToPass)) {
                    return await interaction.reply(`Set pass condtion to \`static\` with ${numVotesToPass} votes required to pass`);
                } else {
                    return await interaction.reply('Something went wrong on our end. Try again later');
                }
        }
        const proposalMode = interaction;
        // TODO

        console.log(proposalMode);
    }

    public async setProposalRole(interaction: CommandInteraction): Promise<void> {
        if (!this.vilbotUtil.memberHasPermissions(interaction, [this.vilbotUtil.PERMISSIONS.ADMINISTRATOR])) {
            return null;
        }

        try {
            this._dao.setProposalRole(interaction);
            await interaction.reply(`Set ${interaction.options.getRole('role')} as the proposal role`);
        } catch (error) {
            this.log.error('Error setting proposal role:', error);
            await interaction.reply('There was an error setting the proposal role');
        }
    }

    private async _setStaticVotes(numVotes: number): Promise<boolean> {
        return true;
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