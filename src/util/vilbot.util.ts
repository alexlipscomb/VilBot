import { proposalChannelId } from '../config.json';

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

  /**
   * @summary Checks to see if a Discord Channel is a Text Channel or not
   * @param channel The channel to test
   * @returns {boolean} True if the channel is a Text Channel, false otherwise
   */
  public static isTextChannel(channel) {
    switch (channel.type) {
      case 'GUILD_TEXT':
        return true;
      default:
        return false;
    }
  }


  // Find a way to keep the number of db calls down to a minimum. Maybe only make one call, then store it in an object.
  public static getGuildProposalChannel(guildId) {
    // Change this to data stored in a database per guild.
    return proposalChannelId;
  }
}