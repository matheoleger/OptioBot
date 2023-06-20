import {TextChannel} from "discord.js"
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

import {freeGameMessage} from "../../templates/freeGameMessage"
import { getFreeGameFromEpic } from "../../utils/api"
import { getIsDatesAreOnSameDay } from "../../utils"

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

export const getFreeGameMessages = async (categoryChoice: FreeGameCommandChoice) => {
    await db.read();

    const isAlreadyCalled = await getIsAlreadyCalled();

    let freeGames = db.data?.games;

    if(!isAlreadyCalled || !freeGames || !freeGames.length) {
        const freeGamesFromEpic = await getFreeGameFromEpic();
        freeGames = formatFreeGames(freeGamesFromEpic);
        await changeDatabaseGames(freeGames);
    }

    const filteredFreeGames = freeGames.filter(game => {
        if(categoryChoice == "all_free_games") return true;

        return game.category == categoryChoice;
    })

    const messages = filteredFreeGames.map((game) => freeGameMessage(game.title, game.id, game.image, game.startDate, game.endDate, game.category))

    return messages;
}

const getIsAlreadyCalled = async () => {
    // await db.read();

    const currentDate = new Date();
    const changeTime = 17;

    if(!db.data?.lastGamesUpdateTime) {
        db.data!.lastGamesUpdateTime = currentDate.toISOString();
        await db.write();
        
        return false;
    }

    if(getIsDatesAreOnSameDay(new Date(db.data?.lastGamesUpdateTime), currentDate)
    && currentDate.getHours() <= changeTime) 
        return true;

    db.data!.lastGamesUpdateTime = currentDate.toISOString();
    await db.write();

    return false;
}

const formatFreeGames = (gamesFromEpic: GameFromEpic[]) => {
    const formattedFreeGames = gamesFromEpic.filter((game) => game.promotions).map((game) => {
        let essentialData: Game = {
            category: "currently_free_games",
            title: game.title as string,
            id: game.id as string,
            image: getImage(game.keyImages),
            startDate: "",
            endDate: "",
        }

        if(game.promotions.upcomingPromotionalOffers.length) {
            essentialData.startDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate
            essentialData.endDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate
            essentialData.category = "upcoming_free_games"
        } else {
            essentialData.startDate = game.promotions.promotionalOffers[0].promotionalOffers[0].startDate
            essentialData.endDate = game.promotions.promotionalOffers[0].promotionalOffers[0].endDate
            essentialData.category = "currently_free_games"           
        }

        return essentialData;
    });

    return formattedFreeGames;
}

const changeDatabaseGames = async (freeGames: Game[]) => {
    db.data!.games = freeGames;
    await db.write()

    return freeGames;
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