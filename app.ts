import * as dotenv from "dotenv";
import * as Discord from "discord.js"
import {optioBot} from "./src/utils/discordBotServices"

import {getFreeGameFromEpic} from "./src/getFreeGame";

dotenv.config();
  
const token = process.env.DISCORD_TOKEN;

optioBot.on('ready', () => {
    console.log(`Logged in as ${optioBot!.user!.tag}!`);
    getFreeGameFromEpic();
});

optioBot.login(token);

