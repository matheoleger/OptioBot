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

    if(db.data == null || db.data == undefined) {
        return;
    }

    db.data.servers.forEach((server: any) => {
        const guild = optioBot.guilds.cache.get(server.serverID);
        const channel = (guild) ? guild.channels.cache.get(server.freeGameChannelID) : undefined;

        if(!channel) return;

        if(channel.type == ChannelType.GuildText && db.data != null && db.data != undefined) {
            sendEachGameToChannel(channel, db.data.games)
        }
    })
}

const sendEachGameToChannel = (channel: TextChannel, games: {[key: string]: unknown}[]) => {
    games.forEach(game => {

        //TODO: Refacto here
        if(game.type == "currently free" && typeof game.title == "string" && typeof game.image == "string" && typeof game.startDate == "string" && typeof game.endDate == "string") {
            channel.send({embeds: [freeGameMessage(game.title, game.image, game.startDate, game.endDate)]});
        }
    })
}