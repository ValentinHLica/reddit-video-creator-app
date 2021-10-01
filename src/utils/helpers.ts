import { tempPath } from "@config/paths";

const {
  mkdirSync,
  existsSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  lstatSync,
  statSync,
} = window.require("fs");
const { join } = window.require("path");

/**
 * Logger handler for action, success, error
 * @param {string} message Message to display to consol
 * @param {string} type Message type
 */

type LogType = "success" | "action" | "error";

export const logger = (message: string, type: LogType) => {
  const selectedColor = {
    success: "10b981",
    action: "3b82f6",
    error: "ef4444",
    fallback: "6b7280",
  };

  console.log(`%c${message}`, `color: #${selectedColor[type]}`);
};

/**
 * Create Random String
 * @param {number} size
 * @returns
 */
export const createRandomString = (size: number) =>
  (Math.random() + 1).toString(36).substring(size || 7);

/**
 * List all files and folders inside folder
 * @param path Folder path
 * @returns List of files and folders inside folder
 */
export const getFolders = (path: string | null): string[] => {
  const files = readdirSync(path) ?? [];

  files.sort(function (a: string, b: string) {
    return (
      statSync(join(path, a)).mtime.getTime() -
      statSync(join(path, b)).mtime.getTime()
    );
  });

  return files;
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

/**
 * Delete Folder with its contents
 * @param path Folder path
 */
export const deleteFolder = (path: string) => {
  if (existsSync(path)) {
    readdirSync(path).forEach((file: string) => {
      const curPath = join(path, file);
      if (lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);
  }
};

/**
 * Reset Temp folder for new process
 */
export const resetTemp = async () => {
  deleteFolder(tempPath);
  mkdirSync(tempPath);
};

/**
 * Generate array of sentences from comment
 * @param {string} text Comment text
 */
export const splitText = (text: string): string[] => {
  const words = text.split(" ");

  const sentences: string[] = [];

  let sentence: string = "";
  for (const word of words) {
    sentence += `${word} `;

    const chars = [",", ".", "!", "?"];

    if (chars.some((char) => word.includes(char)) || sentence.length > 90) {
      sentences.push(sentence.trim());
      sentence = "";
    }
  }

  if (sentence !== "") {
    sentences.push(sentence);
  }

  return sentences;
};
