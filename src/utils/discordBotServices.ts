import * as Discord from "discord.js"

export const optioBot = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds
  ]
});