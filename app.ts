import * as dotenv from "dotenv";
import * as Discord from "discord.js"
import {CronJob} from "cron";
import { clientId, guildId } from "./src/config.json"
import * as database from "./data/db.json"

import {optioBot} from "./src/utils/discordBotServices"
import { getFreeGameFromEpic } from "./src/utils/api";
import { Collection, Events, REST, Routes } from "discord.js";
import { getFreeGameMessages, handleFreeGameAnnouncement, handleFreeGameCommand } from "./src/services/freeGame";

import { getFreeGameCommand, pingCommand, trollCommand } from "./src/commands"
import { sendFreeGameAnnouncementMessage } from "./src/services/freeGame/sendFreeGameMessage";

dotenv.config();
  
const token = process.env.DISCORD_TOKEN ?? "";

optioBot.on('ready', () => {
    console.log(`Logged in as ${optioBot!.user!.tag}!`);
});

// Cron jobs
const freeGameAnnouncementJob = new CronJob('00 30 17 * * *', handleFreeGameAnnouncement)
freeGameAnnouncementJob.start();


// https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const commands = [];

commands.push(pingCommand.data.toJSON());
commands.push(getFreeGameCommand.data.toJSON());
commands.push(trollCommand.data.toJSON());


const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${(data as any[]).length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

optioBot.on(Events.InteractionCreate, async (interaction) => {
	try {
		handleCommand(interaction as Discord.ChatInputCommandInteraction);
	} catch (err: any) {
		console.error(err);
	}

});

const handleCommand = async (commandInteraction: Discord.ChatInputCommandInteraction) => {
	try {
		if(commandInteraction.commandName === "ping") {
			commandInteraction.reply("Pong!")
		} else if (commandInteraction.commandName === "get_free_game") {		

			if(commandInteraction.channelId !== process.env.FG_COMMAND_CHANNEL_ID) {
				commandInteraction.reply({content: "Pour éviter le spam des autres salons, cette commande n'est autorisé que dans le salon <#928407823145136149> :wink:", ephemeral: true})
				return;
			}

			const option = commandInteraction.options.getString("category");

			await handleFreeGameCommand(option as FreeGameCommandChoice, commandInteraction);
		}

	} catch (err: any) {
		console.error(err);
	}
}

optioBot.login(token);

