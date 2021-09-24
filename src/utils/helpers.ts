import { black } from "chalk";

const { readdir } = window.require("fs");

/**
 * Logger handler for action, success, error
 * @param {string} message Message to display to consol
 * @param {string} type Message type
 */

type LogType = "success" | "action" | "error";

export const logger = (message: string, type: LogType) => {
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

/**
 * Create Random String
 * @param {number} size
 * @returns
 */
export const createRandomString = (size: number) =>
  (Math.random() + 1).toString(36).substring(size || 7);

/**
 * Generate array of sentences from comment
 * @param {string} text Comment text
 */
export const splitComment = (text: string): string[] => {
  const words = text.split(" ");

  const sentences: string[] = [];

  let sentence: string = "";
  for (const word of words) {
    sentence += `${word} `;

    const chars = [",", ".", "!", "?"];

    if (chars.some((char) => word.includes(char)) || sentence.length > 100) {
      sentences.push(sentence.trim());
      sentence = "";
    }
  }

  return sentences;
};

/**
 * List all files and folders inside folder
 * @param path Folder path
 * @returns List of files and folders inside folder
 */
export const getFolders = async (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    readdir(path, function (err: any, files: string[]) {
      if (err) {
        reject(null);
      } else {
        resolve(files);
      }
    });
  });
};

/**
 * Roundup number to 1k, 1M ...
 * @param number Number to Roundup
 * @returns Rounded number
 */
export const roundUp = (number: number): string => {
  const newStr = ("" + number)
    .split("")
    .reverse()
    .join("")
    .match(/.{1,3}/g) as string[];

  return `${newStr[newStr.length - 1].split("").reverse().join("")}${
    " kMGTPE"[newStr.length - 1]
  }`;
};

/**
 * Convert sentence to time
 * @param sentence Sentence to convert number
 */
export const countWords = (sentence: string): number => {
  const words = sentence.split(" ");
  return parseFloat((words.length / 130).toFixed(1).replace(".0", ""));
};
