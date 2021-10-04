import { Collection, CommandInteraction, Guild, GuildMember } from 'discord.js';

export class VilbotUtil {
    public readonly PERMISSIONS = {
        CREATE_INSTANT_INVITE: (1 << 0),
        KICK_MEMBERS: (1 << 1),
        BAN_MEMBERS: (1 << 2),
        ADMINISTRATOR: (1 << 3),
        MANAGE_CHANNELS: (1 << 4),
        MANAGE_GUILD: (1 << 5),
        ADD_REACTIONS: (1 << 6),
        VIEW_AUDIT_LOG: (1 << 7),
        PRIORITY_SPEAKER: (1 << 8),
        STREAM: (1 << 9),
        VIEW_CHANNEL: (1 << 10),
        SEND_MESSAGES: (1 << 11),
        SEND_TTS_MESSAGES: (1 << 12),
        MANAGE_MESSAGES: (1 << 13),
        EMBED_LINKS: (1 << 14),
        ATTACH_FILES: (1 << 15),
        READ_MESSAGE_HISTORY: (1 << 16),
        MENTION_EVERYONE: (1 << 17),
        USE_EXTERNAL_EMOJIS: (1 << 18),
        VIEW_GUILD_INSIGHTS: (1 << 19),
        CONNECT: (1 << 20),
        SPEAK: (1 << 21),
        MUTE_MEMBERS: (1 << 22),
        DEAFEN_MEMBERS: (1 << 23),
        MOVE_MEMBERS: (1 << 24),
        USE_VAD: (1 << 25),
        CHANGE_NICKNAME: (1 << 26),
        MANAGE_NICKNAMES: (1 << 27),
        MANAGE_ROLES: (1 << 28),
        MANAGE_WEBHOOKS: (1 << 29),
        MANAGE_EMOJIS_AND_STICKERS: (1 << 30),
        USE_APPLICATION_COMMANDS: (1 << 31),
        REQUEST_TO_SPEAK: (1 << 32),
        MANAGE_THREADS: (1 << 34),
        CREATE_PUBLIC_THREADS: (1 << 35),
        CREATE_PRIVATE_THREADS: (1 << 36),
        USE_EXTERNAL_STICKERS: (1 << 37),
        SEND_MESSAGES_IN_THREADS: (1 << 38),
        START_EMBEDDED_ACTIVITIES: (1 << 39)
    }

    public memberHasPermissions(interaction: CommandInteraction, permissions: Array<number>) {
        for (let i = 0; i < permissions.length; i++) {
            if (Number(interaction.member.permissions['bitfield'] & BigInt(permissions[i])) !== permissions[i]) {
                return false;
            }
        }

        return true;
    }

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
        let month = String(date.getUTCMonth()).padStart(2, '0');
        let day = String(date.getUTCDate()).padStart(2, '0');
        let hour = String(date.getUTCHours());
        let min = String(date.getUTCMinutes()).padStart(2, '0');
        let sec = String(date.getUTCSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }
}