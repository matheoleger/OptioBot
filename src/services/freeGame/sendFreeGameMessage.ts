import { ChannelType, EmbedBuilder } from "discord.js";
import { optioBot } from "../../utils/discordBotServices";

export const sendFreeGameAnnouncementMessage = async (
  messages: EmbedBuilder[]
) => {
  const serverID = process.env.SERVER_ID || "928046024843493456";
  const freeGameAnnouncementChannelID =
    process.env.FG_ANNOUNCEMENT_CHANNEL_ID || "1099779510796292216";

  const guild = optioBot.guilds.cache.get(serverID);
  const channel = guild
    ? guild.channels.cache.get(freeGameAnnouncementChannelID)
    : undefined;

  if (!channel) return;

  if (channel.type == ChannelType.GuildAnnouncement) {
    const message = await channel.send({ embeds: messages });
    message.crosspost();
  }
};
