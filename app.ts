import * as dotenv from "dotenv";
import * as Discord from "discord.js";
import { CronJob } from "cron";
import { clientId, guildId } from "./src/config.json";

import { optioBot, setBotActivity } from "./src/utils/discordBotServices";
import { Events, REST, Routes } from "discord.js";
import {
  handleFreeGameAnnouncement,
  handleFreeGameCommand,
} from "./src/services/freeGame";

import { getFreeGameCommand, pingCommand, trollCommand } from "./src/commands";
import { freeGameAnnouncementJob, changeBotActivity } from "./src/services/cronJob";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const port = 3000;

app.get('/', (req: Request , res: Response) => res.send('Hello World!'));
app.listen(port, () => console.log(`App listening at http://localhost:${port} for a useless webserver`));

const token = process.env.DISCORD_TOKEN ?? "";

optioBot.on("ready", () => {
  console.log(`Logged in as ${optioBot!.user!.tag}!`);

  //Start cron jobs
  freeGameAnnouncementJob.start();
  changeBotActivity.start();
});

// https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
const commands = [];

commands.push(pingCommand.data.toJSON());
commands.push(getFreeGameCommand.data.toJSON());
commands.push(trollCommand.data.toJSON());

const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${
        (data as any[]).length
      } application (/) commands.`
    );
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

const handleCommand = async (
  commandInteraction: Discord.ChatInputCommandInteraction
) => {
  try {
    if (commandInteraction.commandName === "ping") {
      commandInteraction.reply("Pong!");
    } else if (commandInteraction.commandName === "get_free_game") {
      if (commandInteraction.channelId !== process.env.FG_COMMAND_CHANNEL_ID) {
        commandInteraction.reply({
          content:
            "Pour éviter le spam des autres salons, cette commande n'est autorisé que dans le salon <#928407823145136149> :wink:",
          ephemeral: true,
        });
        return;
      }

      const option = commandInteraction.options.getString("category");

      await handleFreeGameCommand(
        option as FreeGameCommandChoice,
        commandInteraction
      );
    }
  } catch (err: any) {
    console.error(err);
  }
};

optioBot.login(token);
