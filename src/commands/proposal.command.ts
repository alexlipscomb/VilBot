import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from "discord.js";
import { Service } from 'typedi';
import { ProposalService } from '../services/proposal.service';
import { CommandToken, ICommand } from "./interfaces/i.command";

@Service({ id: CommandToken, multiple: true })
export class ProposalCommand implements ICommand {
    public static readonly NAME: string = 'proposal';

    public static readonly PASS_CONDITION_MODE_MAJORITY: string = 'majority';
    public static readonly PASS_CONDITION_MODE_STATIC: string = 'static';
    public static readonly NEW_PROPOSAL: string = 'new';
    public static readonly MEMBERS: string = 'members';
    public static readonly SET_CHANNEL: string = 'setproposalchannel';
    public static readonly SET_PROPOSAL_ROLE: string = 'setproposalrole';
    public static readonly SET_AGREE_EMOJI: string = 'setagreeemoji';
    public static readonly SET_DISAGREE_EMOJI: string = 'setdisagreeemoji';


    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    constructor(
        private _proposalService: ProposalService
    ) {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('Options for proposals')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.NEW_PROPOSAL)
                    .setDescription('Create a new proposal')
                    .addStringOption(option => option.setName('proposal').setDescription('The proposal').setRequired(true))
                    .addBooleanOption(option => option.setName('ping').setDescription('Pings users with proposal role'))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.MEMBERS)
                    .setDescription('Get the number of members with the proposal role and how many votes are needed to pass')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.SET_CHANNEL)
                    .setDescription('Set which channel proposals will be sent to')
                    .addChannelOption(option => option.setName('channel').setDescription('The target channel').setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.SET_PROPOSAL_ROLE)
                    .setDescription('Set the role which will be able to use this command')
                    .addRoleOption(option => option.setName('role').setDescription('The role that will use proposals').setRequired(true))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.SET_AGREE_EMOJI)
                    .setDescription('Set the emoji that will be used for agrees')
                    .addStringOption(option => option.setName('emoji').setDescription('The emoji to use').setRequired(true))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.SET_DISAGREE_EMOJI)
                    .setDescription('Set the emoji that will be used for agrees')
                    .addStringOption(option => option.setName('emoji').setDescription('The emoji to use').setRequired(true))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.PASS_CONDITION_MODE_MAJORITY)
                    .setDescription('Set the pass condition to \'majority\'')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(ProposalCommand.PASS_CONDITION_MODE_STATIC)
                    .setDescription('Set the pass condition to \'static\'')
                    .addIntegerOption(option => option.setName('votes').setDescription('The number of votes required to pass').setRequired(true))
            );
    }

    public getName(): string {
        return ProposalCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        // create new proposal
        const subcommand: string = interaction.options.getSubcommand();
        switch (subcommand) {
            case ProposalCommand.NEW_PROPOSAL:
                return await this._proposalService.createNewProposal(interaction);
            case ProposalCommand.MEMBERS:
                return await this._proposalService.getMemberCount(interaction);
            case ProposalCommand.SET_CHANNEL:
                return await this._proposalService.setProposalChannel(interaction);
            case ProposalCommand.SET_PROPOSAL_ROLE:
                await this._proposalService.setProposalRole(interaction);
                break;
            case ProposalCommand.SET_AGREE_EMOJI:
                await interaction.reply(interaction.options.getString('emoji'));
                break;
            case ProposalCommand.SET_DISAGREE_EMOJI:
                await interaction.reply(interaction.options.getString('emoji'));
                break;

            // TODO
            // Make these commands only applicable to a mod role.
            case ProposalCommand.PASS_CONDITION_MODE_MAJORITY:
                return await this._proposalService.setProposalMode(interaction, 'majority');
            case ProposalCommand.PASS_CONDITION_MODE_STATIC:
                return await this._proposalService.setProposalMode(interaction, 'static');

            default:
                return await interaction.reply(`Unknown command: ${subcommand}`);
        }
    }
}