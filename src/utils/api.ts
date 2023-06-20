const axios = require('axios').default;

export const getFreeGameFromEpic = async () => {
    const response = await axios.get("https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=FR")

    const games = response.data.data.Catalog.searchStore.elements
    
    return games;
}