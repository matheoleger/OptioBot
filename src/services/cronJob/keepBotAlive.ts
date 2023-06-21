import { CronJob } from "cron";
import * as Discord from "discord.js"
import { setBotActivity } from "../../utils/discordBotServices";

export const keepBotAliveJob = new CronJob("* */10 * * * *", () => {

    console.log("I try to stay alive")

    const activityNames =  [
      "try to stay alive",
      "try to bypass free plan",
      "try to be awesome"
    ]
  
    let activityIndex = 0
  
    const activity: Discord.ActivitiesOptions = {
      name: activityNames[activityIndex++ % activityNames.length],
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      type: Discord.ActivityType.Watching
    }
  
    setBotActivity(activity)
});