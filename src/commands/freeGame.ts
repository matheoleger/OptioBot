import { SlashCommandBuilder } from "discord.js";
import { sendFreeGameMessage } from "../services/freeGame/sendFreeGameMessage";
import { getFreeGameMessages } from "../services/freeGame/getFreeGame";

export const getFreeGameCommand = {
    data: new SlashCommandBuilder()
        .setName("get_free_game")
        .setDescription("Get free game list (from Epic Game Store) !"),
    // async execute(interaction: any) {
    //     await interaction.reply(await getFreeGameMessages())
    // }
}