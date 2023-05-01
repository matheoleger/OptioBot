import {TextChannel} from "discord.js"
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { isEqual } from "lodash"

import {freeGameMessage} from "../../templates/freeGameMessage"
import { getFreeGameFromEpic } from "../../utils/api"

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

export const getFreeGameMessages = async (option: string) => {

    //TODO: Verify is the date of games in DB corresponding to the date of today (or before) to avoid to get data again. (we can get the current free game date to know when we need to get data again)
    const games = await getFreeGameFromEpic();

    const isSameData = await getIsSameFreeGame(games);

    const freeGamesData = (isSameData) ? games : await changeDataOfDB(games);

    const messages = freeGamesData.map((game: Game) => freeGameMessage(game.title, game.id, game.image, game.startDate, game.endDate))

    // let messages: Game[] = []



    return messages;
}

const getIsSameFreeGame = async (freeGames: any[]) => {
    await db.read();
    console.log(db.data);

    if(!db.data) return false;

    const gamesFromDB = db.data.games

    // freeGames.filter((game) => gamesFromDB.includes(game))

    return isEqual(gamesFromDB, freeGames)
}

const changeDataOfDB = async (freeGames: {[key: string]: any}[]) => {
    db.data!.games = [];

    let essentialDataOfFreeGames: Game[] = []

    freeGames.forEach((game) => { //TODO: change to .map(), refacto types
        let essentialData: Game = {
            type: "",
            title: game.title as string,
            id: game.id as string,
            image: game.keyImages[2].url.split(" ").join("%20") as string,
            startDate: "",
            endDate: "",
        }

        if(!game.promotions) return;

        if(game.promotions.upcomingPromotionalOffers.length) {
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

    return essentialDataOfFreeGames;
}