import { black } from "chalk";

// Logger Helper function
/**
 *
 * @param {string} message Message to display to consol
 * @param {string} type Message type
 */

type LogType = "success" | "action" | "error";

export default (message: string, type: LogType) => {
  if (process.env.PROD === "yes") {
    return;
  }

  switch (type) {
    case "action":
      console.log(black.bgBlue(message));
      break;

    case "success":
      console.log(black.bgGreen(message));
      break;

    case "error":
      console.log(black.bgRed(message));
      break;

    default:
      console.log(black.bgGray(message));
  }
};
