import {TextChannel} from "discord.js"
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

import {optioBot} from "../../utils/discordBotServices"
import {freeGameMessage} from "../../templates/freeGameMessage"
import { sendFreeGameMessage } from "./sendFreeGameMessage"
import { getFreeGameFromEpic } from "../../utils/api"

const axios = require('axios').default;

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

// export const getFreeGameFromEpic = async () => {
//     const response = await axios.get("https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=FR")
//     // .then((res: any) => {
//     //     console.log(res.data);
//     //     compareGames(res.data.data.Catalog.searchStore.elements);
//     // })
//     // .catch((error: Error) => {
//     //     console.log(error);
//     // })

//     const games = response.data.data.Catalog.searchStore.elements
    
//     return games;
// } 

export const getFreeGameMessages = async (choice: FreeGameCommandChoice) => {
    const games = await getFreeGameFromEpic();

    const isSameData = await getIsSameFreeGame(games);

    const freeGamesData = await changeDataOfDB(games);

    const filteredFreeGames = freeGamesData.filter(game => {

        if(choice == "all_free_games") return true;

        return game.category == choice;
    })

    const messages = filteredFreeGames.map((game) => freeGameMessage(game.title, game.id, game.image, game.startDate, game.endDate, game.category))

    return messages;
}

const getIsSameFreeGame = async (freeGames: any[]) => {
    await db.read();
    console.log(db.data);

    let isSameData = false;

    //If db.data is null we do just an empty array "games"
    // db.data ||= {servers: [], games: []}

    if(db.data == null || db.data == undefined) {
        return;
    }

    const gamesFromDB = db.data.games

    // for(let i = 0; i < freeGames.length; i++) {
    //     // isSameData = (freeGames[i].title == db.data.games[i].title) ? true : false;

    //     if(freeGames[i].title != db.data.games[i].title) {
    //         // await changeDataOfDB(freeGames);
    //         // await sendFreeGameMessage();
    //     }
    // }

    freeGames.filter((game) => gamesFromDB.includes(game))
}

const changeDataOfDB = async (freeGames: {[key: string]: any}[]) => {
    db.data!.games = [];

    let essentialDataOfFreeGames: Game[] = []

    freeGames.forEach((game) => { //TODO: change to .map(), refacto types
        let essentialData: Game = {
            category: "currently_free_games",
            title: game.title as string,
            id: game.id as string,
            image: getImage(game.keyImages),
            startDate: "",
            endDate: "",
        }

        if(!game.promotions) return;

        if(game.promotions.upcomingPromotionalOffers.length) {
            essentialData.startDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate
            essentialData.endDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate
            essentialData.category = "upcoming_free_games"
        } else {
            essentialData.startDate = game.promotions.promotionalOffers[0].promotionalOffers[0].startDate
            essentialData.endDate = game.promotions.promotionalOffers[0].promotionalOffers[0].endDate
            essentialData.category = "currently_free_games"           
        }

        essentialDataOfFreeGames.push(essentialData)
    })

    db.data!.games = essentialDataOfFreeGames;
    await db.write()

    return essentialDataOfFreeGames;
}

const getImage = (keyImages: ImageFromEpic[]) => {
    let image = keyImages.find(image => {
        if (image.type = "OfferImageWide") {
            return true;
        } else if (image.type = "OfferImageTall") {
            return true;
        } else if (image.type = "Thumbnail") {
            return true;
        } else if (image.type = "VaultClosed") {
            return true;
        }
    })

    if(!image) image = keyImages[0];

    return image.url.split(" ").join("%20");
}