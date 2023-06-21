import { CronJob } from "cron";
import { handleFreeGameAnnouncement } from "../freeGame";

export const freeGameAnnouncementJob = new CronJob(
    "00 30 17 * * *",
    handleFreeGameAnnouncement
);
  
