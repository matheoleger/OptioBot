// require("dotenv").config();
import * as dotenv from "dotenv";
import * as Discord from "discord.js"

import {getFreeGameFromEpic} from "./src/getFreeGame";

dotenv.config();

const client = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
    ]
});
  
const token = process.env.DISCORD_TOKEN;

client.on('ready', () => {
    console.log(`Logged in as ${client!.user!.tag}!`);
    getFreeGameFromEpic();
});

client.login(token);

