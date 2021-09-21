import { Collection, Guild, GuildMember } from 'discord.js';
import { proposalChannelId, suggestionBoxChannelId } from '../config.json';

export class VilbotUtil {
    /**
     * @param interaction The context where the command was called
     * @param channelId The ID of the channel to check for
     * @returns {boolean} True if channel exists, false otherwise.
     */
    public static checkIfChannelExists(interaction, channelId: string) {
        try {
            const suggestionboxChannel = interaction.guild.channels.fetch(channelId);
            return false;

        } catch { // catch something useful here like the discord 404 not found error.
            return true;
        }
    }

    // TODO: Offline users don't show up? This is because they're in the cache. 
    /**
     * @summary Returns the members with the specified role in the guild
     * @param guild The guild to search for members
     * @param roleId The role id to match
     * @returns {number} Returns the number of members
     */
    public static getRoleMembers(guild: Guild, roleId: string): number {
        // Change this to be something called from a guild's database
        const users: Collection<string, GuildMember> = guild.members.cache;

        // Using the cache probably isn't a good long-term solution.
        // Users might be fluctuate depending on who's in the cache.
        var memberCount: number = 0;
        for (let user of users) {
            if (user[1]['user']['bot']) { continue };

            const userRoles = user[1]['_roles'];
            for (let i = 0; i < userRoles.length; i++) {
                if (userRoles[i] === roleId) {
                    memberCount++;
                }
            }
        }

        return memberCount;
    }


    // Find a way to keep the number of db calls down to a minimum. Maybe only make one call, then store it in an object.
    public static getGuildProposalChannel(guildId) {
        // Change this to data stored in a database per guild.
        return proposalChannelId;
    }

    // Find a way to keep the number of db calls down to a minimum. Maybe only make one call, then store it in an object.
    public static getGuildSuggestionboxChannel(guildId) {
        return suggestionBoxChannelId; // Change this to data stored in a database per guild.
    }

    // TODO move to util
    public static getTimestamp() {
        let date = new Date()
        let year = String(date.getFullYear());
        let month = String(date.getMonth());
        let day = String(date.getDate());
        let hour = String(date.getHours());
        let min = String(date.getMinutes());
        let sec = String(date.getSeconds());

        return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }

    public static getUTCTimeStamp() {
        let date = new Date()
        let year = String(date.getUTCFullYear());
        let month = String(date.getUTCMonth());
        let day = String(date.getUTCDate());
        let hour = String(date.getUTCHours());
        let min = String(date.getUTCMinutes());
        let sec = String(date.getUTCSeconds());

        return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }
}