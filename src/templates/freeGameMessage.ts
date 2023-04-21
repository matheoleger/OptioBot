import {dateToFrenchLanguage} from "../utils/utils"

export const freeGameMessage = (name: string, image: string, startDate: string, endDate: string) => {
    return {
        type: "rich",
        title: `Nouveau jeu gratuit sur Epic !`,
        description: `Et oui, pas besoin de dépenser de l'argent pour jouer à **${name}** ! (clique sur le titre au dessus pour y accéder)`,
        color: 0x600273,
        image: {
          url: `${image}`,
          height: 0,
          width: 0
        },
        thumbnail: {
          url: `https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png`,
          height: 0,
          width: 0
        },
        fields: [
            {
                name:"Date de début",
                value: dateToFrenchLanguage(startDate),
                inlines: true
            },
            {
                name:"Date de fin",
                value: dateToFrenchLanguage(endDate),
                inlines: true
            }
        ],
        url: `https://store.epicgames.com/fr/free-games`
    } 
};