import { ReadLine } from "readline";
import { generateSchedule } from "./lib/schedule_generator";
import { postSchedule } from "./lib/schedule_poster";
import {
  printScheduleError,
  printScheduleToConsole,
} from "./lib/console_utils";

const rl: ReadLine = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  const date: string = await askQuestion(
    "Please enter the date you would like, or press enter (YYYY-MM-DD format): "
  );
  let schedule: any;
  if (date === "") {
    schedule = await generateSchedule();
  } else {
    schedule = await generateSchedule(date);
  }

  let arePeopleScheduled: boolean = false;
  if (schedule !== undefined) {
    for (const teamPosition of schedule.team_positions) {
      if (teamPosition.team_position_members.length > 0) {
        arePeopleScheduled = true;
        break;
      }
    }
  } else {
    console.log("No schedule to post.");
    rl.close();
    return;
  }

  // Print the schedule to the console
  console.log(schedule);
  printScheduleToConsole(schedule);
  if (arePeopleScheduled) {
    const answer: string = await askQuestion(
      "Would you like to post this schedule? (y/n): "
    );
    if (answer === "y") {
      await postSchedule(schedule);
      rl.close();
    } else {
      console.log("Schedule not posted.");
      rl.close();
    }
  } else {
    printScheduleError();
    console.log("No schedule to post.");
    rl.close();
  }
}

main();
