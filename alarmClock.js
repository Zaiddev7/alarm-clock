const readline = require("readline");

class Alarm {
  constructor(hour, minute, daysOfWeek) {
    this.hour = hour;
    this.minute = minute;
    this.daysOfWeek = daysOfWeek;
    this.snoozeDuration = 5;
    this.snoozeCount = 0;
    this.maxSnoozeLimit = 3;
    this.isSnoozed = false;
    this.snoozeEndTime = null;
  }

  getISTDate() {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000;
    const istOffset = 5.5 * 60 * 60000;
    return new Date(now.getTime() + utcOffset + istOffset);
  }

  checkAlarm() {
    const now = this.getISTDate();
    const dayOfWeek = now.toLocaleString("en-us", { weekday: "long" });

    if (this.isSnoozed && now >= this.snoozeEndTime) {
      this.isSnoozed = false;
      this.snoozeCount = 0;
      return true;
    }

    if (
      this.daysOfWeek.includes(dayOfWeek) &&
      now.getHours() === this.hour &&
      now.getMinutes() === this.minute
    ) {
      return true;
    }

    return false;
  }

  snooze() {
    if (this.snoozeCount < this.maxSnoozeLimit) {
      this.isSnoozed = true;
      this.snoozeCount++;
      this.snoozeEndTime = new Date(
        this.getISTDate().getTime() + this.snoozeDuration * 60000
      );
      return true;
    } else {
      return false;
    }
  }
}

class AlarmClock {
  constructor() {
    this.alarms = [];
  }

  addAlarm(hour, minute, daysOfWeek) {
    const newAlarm = new Alarm(hour, minute, daysOfWeek);
    this.alarms.push(newAlarm);
  }

  deleteAlarm(index) {
    if (index >= 0 && index < this.alarms.length) {
      this.alarms.splice(index, 1);
      console.log("Alarm deleted.");
    } else {
      console.log("Invalid alarm index.");
    }
  }

  checkAlarms() {
    this.alarms.forEach((alarm, index) => {
      if (alarm.checkAlarm()) {
        console.log("Alarm ringing!");
        this.snoozeOrDeleteAlarm(alarm, index);
      }
    });
  }

  snoozeOrDeleteAlarm(alarm, index) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Snooze the alarm for 5 minutes or delete it? (Type : snooze or delete): ",
      (answer) => {
        if (answer.toLowerCase() === "snooze") {
          const snoozeSuccess = alarm.snooze();
          if (snoozeSuccess) {
            console.log("You have snoozed the alarm for 5 minutes.");
          } else {
            console.log("You cannot snooze further. Alarm will ring again.");
          }
        } else if (answer.toLowerCase() === "delete") {
          this.deleteAlarm(index);
        } else {
          console.log("You enterd an invalid option. Alarm will ring again.");
        }
        rl.close();
      }
    );
  }

  start() {
    setInterval(() => {
      const now = new Alarm().getISTDate();
      console.log("Current time is:", now.toLocaleTimeString());
      this.checkAlarms();
    }, 60000);
  }
}

const alarmClock = new AlarmClock();
alarmClock.addAlarm(1, 17, [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);
alarmClock.start();
