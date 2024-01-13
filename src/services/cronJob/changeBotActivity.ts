import { CronJob } from "cron";
import * as Discord from "discord.js"
import { optioBot, setBotActivity } from "../../utils/discordBotServices";

let activityIndexIterator = 0;

export const changeBotActivity = new CronJob("0 */10 * * * *", () => {
    const activityNames =  [
      "Smoowy coder un autre bot... QUOI ?!",
      "les magnifiques personnes de ce serveur",
      "une vidéo sympathique sur internet",
      "le 473ème épisode de Boblennon sur Skyrim",
      "le couché du Soleil (il est peut-être que midi)",
      "rien... ouai... juste rien..."
    ]
  
    const randomActivityName = activityNames[activityIndexIterator++ % activityNames.length]


    const activity: Discord.ActivitiesOptions = {
      name: randomActivityName,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      type: Discord.ActivityType.Watching
    }
  
    setBotActivity(activity)
});