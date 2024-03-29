import { SlashCommandBuilder } from "discord.js";

// https://discordjs.guide/slash-commands/advanced-creation.html#option-types
export const getFreeGameCommand = {
  data: new SlashCommandBuilder()
    .setName("get_free_game")
    .setDescription(
      "Récupérez la liste des jeux gratuits (d'Epic game store) !"
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Jeux actuellement gratuit ou prochainement gratuit ?")
        .setRequired(true)
        .addChoices(
          { name: "Tous les jeux", value: "all_free_games" },
          { name: "Actuellement gratuit", value: "currently_free_games" },
          { name: "Prochainement gratuit", value: "upcoming_free_games" }
        )
    ),
};
