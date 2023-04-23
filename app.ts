import * as dotenv from "dotenv";
import * as Discord from "discord.js"
import { clientId, guildId } from "./src/config.json"

import {optioBot} from "./src/utils/discordBotServices"
import { getFreeGameFromEpic } from "./src/utils/api";
import { getFreeGameCommand } from "./src/commands/freeGame";
import { Collection, Events, REST, Routes } from "discord.js";
import { pingCommand } from "./src/commands/ping";
import { getFreeGameMessages } from "./src/services/freeGame/getFreeGame";

dotenv.config();
  
const token = process.env.DISCORD_TOKEN ?? "";

optioBot.on('ready', () => {
    console.log(`Logged in as ${optioBot!.user!.tag}!`);
    getFreeGameFromEpic();
});

// optioBot.commands = new Collection();

const commands = [];

commands.push(pingCommand.data.toJSON());
commands.push(getFreeGameCommand.data.toJSON());

// (optioBot as any).commands = new Collection();

// (optioBot as any).commands.set(getFreeGameCommand.data.name, getFreeGameCommand)
// (optioBot as any).commands.set(pingCommand.data.name, pingCommand)

// optioBot.on(Events.InteractionCreate, interaction => {
// 	console.log(interaction);
// });

// https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands

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
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

optioBot.on(Events.InteractionCreate, async (interaction: any) => { //TODO: Extends type because WTF
    // interaction.reply("Pong!")
	console.log(interaction.commandName);

	try {

		if(interaction.commandName === "ping") {
			interaction.reply("Pong!")
		} else if (interaction.commandName === "get_free_game") {
			const messages = await getFreeGameMessages()
			console.log({messages});
			messages.forEach(message => console.log(message.data))
			interaction.reply({embeds: messages})
		}

	} catch (err) {
		console.error(err);
	}

});

optioBot.login(token);

