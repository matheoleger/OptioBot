import { APIEmbed, EmbedBuilder, EmbedType } from "discord.js";
import {dateToFrenchLanguage} from "../utils"

export const freeGameMessage = (name: string, id: string, image: string, startDate: string, endDate: string, category: FreeGameCategory) => {
    const message = new EmbedBuilder()
                    .setTitle(`**${name}** ${category == "currently_free_games" ? 'est gratuit sur Epic' : 'sera prochainement gratuit sur Epic'} !`)
                    .setDescription(`Et oui, pas besoin de dépenser de l'argent pour jouer à **${name}** ! (clique sur le titre au dessus pour y accéder)`)
                    .setColor(0x600273)
                    .setImage(image)
                    .setThumbnail(`https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png`)
                    .addFields([
                        {
                            name:"Date de début",
                            value: dateToFrenchLanguage(startDate),
                            inline: true
                        },
                        {
                            name:"Date de fin",
                            value: dateToFrenchLanguage(endDate),
                            inline: true
                        }
                    ],)
                    .setURL(`https://store.epicgames.com/fr/free-games?game=${id}`)

    return message;
};