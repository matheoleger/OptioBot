import {ChatInputCommandInteraction} from "discord.js"
import { Low, JSONFile } from 'lowdb'

import {freeGameMessage} from "../../templates/freeGameMessage"
import { getFreeGameFromEpic } from "../../utils/api"
import { getIsDatesAreOnSameDay } from "../../utils"
import { sendFreeGameAnnouncementMessage } from "./sendFreeGameMessage"

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
const db = new Low(adapter)

export const handleFreeGameAnnouncement = async () => {
    await db.read();

    const gamesFromDB = db.data?.games;
    const gamesFromEpic = await getFreeGameFromEpic();
    const formattedFreeGamesFromEpic = formatFreeGames(gamesFromEpic);

    const filteredGamesFromEpic = getFilteredFreeGames(formattedFreeGamesFromEpic, "currently_free_games");

    if(!gamesFromDB || !gamesFromDB.length) {
        const messages = getFreeGameMessages(filteredGamesFromEpic);
        await changeDatabaseGames(formattedFreeGamesFromEpic);
        sendFreeGameAnnouncementMessage(messages);
        return;
    }

    const filteredGamesFromDB = getFilteredFreeGames(gamesFromDB, "currently_free_games");
    
    if(getIsSameGames(filteredGamesFromDB, filteredGamesFromEpic)) return;

    const messages = getFreeGameMessages(filteredGamesFromEpic);
    sendFreeGameAnnouncementMessage(messages);
}

export const handleFreeGameCommand = async (categoryChoice: FreeGameCommandChoice, commandInteraction: ChatInputCommandInteraction) => {
    await db.read();

    const isAlreadyCalled = await getIsAlreadyCalled();

    let freeGames = db.data?.games;

    if(!isAlreadyCalled || !freeGames || !freeGames.length) {
        const freeGamesFromEpic = await getFreeGameFromEpic();
        freeGames = formatFreeGames(freeGamesFromEpic);
        await changeDatabaseGames(freeGames);
    }

    const filteredFreeGames = getFilteredFreeGames(freeGames, categoryChoice);

    const messages = getFreeGameMessages(filteredFreeGames);

    commandInteraction.reply({embeds: messages})
}

export const getFreeGameMessages = (games: Game[]) => {
    const messages = games.map((game) => freeGameMessage(game.title, game.id, game.image, game.startDate, game.endDate, game.category))
    return messages;
}

const getIsAlreadyCalled = async () => {
    const currentDate = new Date();
    const changeHour = 17;

    if(!db.data?.lastGamesUpdateTime) return false;

    if(getIsDatesAreOnSameDay(new Date(db.data?.lastGamesUpdateTime), currentDate)
    && currentDate.getHours() <= changeHour) 
        return true;

    return false;
}

const getIsSameGames = (firstGames: Game[], secondGames:Game[]) => {
    return firstGames.filter(firstGame => secondGames.some(secondGame => firstGame.id === secondGame.id));
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

const getFilteredFreeGames = (freeGames: Game[], category: FreeGameCommandChoice) => {
    const filteredFreeGames = freeGames.filter(game => {
        if(category == "all_free_games") return true;

        return game.category == category;
    })

    return filteredFreeGames;
}

const changeDatabaseGames = async (freeGames: Game[]) => {
    db.data!.games = freeGames;
    db.data!.lastGamesUpdateTime = new Date().toISOString();
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