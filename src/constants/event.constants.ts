export class EventConstants {
    // Discord Events
    public static readonly InteractionCreate: string = 'interactionCreate'; // data is interaction: Interaction 
    public static readonly MessageReactionAdd: string = 'messageReactionAdd'; // data is { reaction: MessageReaction, user: User }
    public static readonly MessageReactionRemove: string = 'messageReactionRemove'; // data is { reaction: MessageReaction, user: User }
}