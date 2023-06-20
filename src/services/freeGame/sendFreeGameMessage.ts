import { ChannelType, EmbedBuilder, TextChannel } from "discord.js";
import { optioBot } from "../../utils/discordBotServices";
import { JSONFile, Low } from "lowdb";
import { freeGameMessage } from "../../templates/freeGameMessage";
import { getFreeGameMessages } from ".";

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

export const sendFreeGameAnnouncementMessage = async (messages: EmbedBuilder[]) => {
    // await db.read()

    // if(!db.data) return;

    const serverID = process.env.SERVER_ID || "928046024843493456" 
    const freeGameAnnouncementChannelID = process.env.FG_ANNOUNCEMENT_CHANNEL_ID || "1099779510796292216"

    const guild = optioBot.guilds.cache.get(serverID);
    const channel = (guild) ? guild.channels.cache.get(freeGameAnnouncementChannelID) : undefined;

    if(!channel) return;

    if(channel.type == ChannelType.GuildAnnouncement) {
        // const messages = await getFreeGameMessages("currently_free_games")
        channel.send({ embeds: messages })
    }
}

const sendEachGameToChannel = (channel: TextChannel, games: Game[]) => {
    games.forEach(game => {
        //TODO: Refacto here
        channel.send({embeds: [freeGameMessage(game.title, game.id, game.image, game.startDate, game.endDate, game.category)]});
    })
}