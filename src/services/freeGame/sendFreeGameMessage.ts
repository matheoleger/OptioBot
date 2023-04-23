import { ChannelType, TextChannel } from "discord.js";
import { optioBot } from "../../utils/discordBotServices";
import { JSONFile, Low } from "lowdb";
import { freeGameMessage } from "../../templates/freeGameMessage";

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

export const sendFreeGameMessage = async () => {
    await db.read()

    if(!db.data) return;

    db.data.servers.forEach((server: any) => {
        const guild = optioBot.guilds.cache.get(server.serverID);
        const channel = (guild) ? guild.channels.cache.get(server.freeGameChannelID) : undefined;

        if(!channel) return;

        if(channel.type == ChannelType.GuildText && db.data) {
            sendEachGameToChannel(channel, db.data.games)
        }
    })
}

const sendEachGameToChannel = (channel: TextChannel, games: Game[]) => {
    games.forEach(game => {
        //TODO: Refacto here
        channel.send({embeds: [freeGameMessage(game.title, game.id, game.image, game.startDate, game.endDate)]});
    })
}