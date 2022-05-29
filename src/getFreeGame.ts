import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
const axios = require('axios').default;

//Type for data from db : an array "games" of objects with properties.
type DataFromDB = {
    // [index: string]: Function|string|number,
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
    db.data ||= {games: []}
    db.data.games ||= []

    for(let i = 0; i < freeGames.length; i++) {
        // isSameData = (freeGames[i].title == db.data.games[i].title) ? true : false;

        if(freeGames[i].title != db.data.games[i].title) {
            changeDataOfDB(freeGames);
            sendMessages();
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
            image: game.keyImages[2].url,
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
    // compareGames(freeGames);
    console.log(db.data);
}

const sendMessages = () => {

}