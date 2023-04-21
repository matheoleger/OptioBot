import {TextChannel} from "discord.js"
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

import {optioBot} from "./utils/discordBotServices"
import {freeGameMessage} from "./templates/freeGameMessage"

const axios = require('axios').default;

//Type for data from db : an array "games" of objects with properties.
type DataFromDB = {
    // [index: string]: Function|string|number,
    servers: {[key: string]: string}[]
    games: {[key: string]: unknown}[],
}

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

export const getFreeGameFromEpic = () => {
    axios.get("https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=FR")
    .then((res: any) => {
        console.log(res.data);
        compareGames(res.data.data.Catalog.searchStore.elements);
    })
    .catch((error: Error) => {
        console.log(error);
    })
} 

const compareGames = async (freeGames: any[]) => {
    await db.read();
    console.log(db.data);

    let isSameData = false;

    //If db.data is null we do just an empty array "games"
    // db.data ||= {servers: [], games: []}

    if(db.data == null || db.data == undefined) {
        return;
    }

    db.data.games ||= []

    for(let i = 0; i < freeGames.length; i++) {
        // isSameData = (freeGames[i].title == db.data.games[i].title) ? true : false;

        if(freeGames[i].title != db.data.games[i].title) {
            await changeDataOfDB(freeGames);
            await sendMessages();
        }
    }
}

const changeDataOfDB = async (freeGames: {[key: string]: any}[]) => {
    db.data!.games = [];

    let essentialDataOfFreeGames: any[] = []

    freeGames.forEach((game) => {
        let essentialData = {
            type: "",
            title: game.title,
            id: game.id,
            image: game.keyImages[2].url.split(" ").join("%20"),
            startDate: "",
            endDate: "",
        }

        if(game.promotions.upcomingPromotionalOffers.length >= 1) {
            essentialData.startDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate
            essentialData.endDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate
            essentialData.type = "coming soon"
        } else {
            essentialData.startDate = game.promotions.promotionalOffers[0].promotionalOffers[0].startDate
            essentialData.endDate = game.promotions.promotionalOffers[0].promotionalOffers[0].endDate
            essentialData.type = "currently free"           
        }

        essentialDataOfFreeGames.push(essentialData)
    })

    db.data!.games = essentialDataOfFreeGames;
    await db.write()

    console.log(db.data);
}

const sendMessages = async () => {
    await db.read()

    if(db.data == null || db.data == undefined) {
        return;
    }

    db.data.servers.forEach(server => {
        const guild = optioBot.guilds.cache.get(server.serverID);
        const channel = (guild) ? guild.channels.cache.get(server.freeGameChannelID) : undefined;

        if(!channel) return;

        if(channel.type == "GUILD_TEXT" && db.data != null && db.data != undefined) {
            sendEachGameToChannel(channel, db.data.games)
        }
    })


}

const sendEachGameToChannel = (channel: TextChannel, games: {[key: string]: unknown}[]) => {
    games.forEach(game => {

        if(game.type == "currently free" && typeof game.title == "string" && typeof game.image == "string" && typeof game.startDate == "string" && typeof game.endDate == "string") {
            channel.send({embeds: [freeGameMessage(game.title, game.image, game.startDate, game.endDate)]});
        }
    })
}