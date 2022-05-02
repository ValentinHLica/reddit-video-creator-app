import { tempPath } from "@config/paths";
import { Storage } from "@interface/helper";

const {
  mkdirSync,
  existsSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  lstatSync,
  writeFileSync,
  readFileSync,
  // statSync,
} = window.require("fs");
const { join, basename } = window.require("path");
const { execSync } = window.require("child_process");

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
  const files: string[] = readdirSync(path) ?? [];

  const filesList = [];

  for (const file of files) {
    const index = parseInt(file.split("-")[0], 10);
    filesList[index] = file;
  }

  return filesList;
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
    " kmgtpe"[newStr.length - 1]
  }`;
};

/**
 * Convert sentence to time
 * @param sentence Sentence to convert number
 */
export const countWords = (sentence: string): number => {
  const words = sentence.split(" ");
  return parseFloat((words.length / 170).toFixed(1).replace(".0", ""));
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

// Copy files
const copyFileSync = (source: string, target: string) => {
  let targetFile = target;

  if (existsSync(target)) {
    if (lstatSync(target).isDirectory()) {
      targetFile = join(target, basename(source));
    }
  }

  writeFileSync(targetFile, readFileSync(source));
};

// Copy dir
export const copyFolderRecursiveSync = (source: string, target: string) => {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = join(target, basename(source));
  if (!existsSync(targetFolder)) {
    mkdirSync(targetFolder);
  }

  // Copy
  if (lstatSync(source).isDirectory()) {
    files = readdirSync(source);
    files.forEach(function (file: string) {
      var curSource = join(source, file);
      if (lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
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

type GetVoices = (args: {
  customAudio: boolean;
  balcon: string | null;
  bal4web: string | null;
}) => string[];

/**
 * Get List of voices
 * @returns List of voices
 */
export const getVoices: GetVoices = ({ customAudio, balcon, bal4web }) => {
  if (!customAudio) {
    const command = `${
      balcon && existsSync(balcon) ? `"${balcon}"` : "balcon"
    } -l`;

    const voices = execSync(command).toString() as string;

    return voices
      .trim()
      .split("\n")
      .map((v) => v.trim())
      .filter((v) => v !== "SAPI 5:");
  } else {
    const command = `${
      bal4web && existsSync(bal4web) ? `"${bal4web}"` : "bal4web"
    } -s m -m`;

    const voices = execSync(command).toString() as string;

    return voices
      .trim()
      .split("\n")
      .map((v) => v.trim())
      .filter((v) => v !== "* Microsoft Azure *" && v.includes("en-US"))[0]
      .split(" en-US ")[1]
      .slice(1, -1)
      .split(", ");
  }
};

type ListenVoice = (args: {
  text: string | undefined;
  customAudio: boolean;
}) => Promise<string | null>;

/**
 * Listen to selected voice
 */
export const listenVoice: ListenVoice = ({ text, customAudio }) => {
  const balcon = localStorage.getItem("balcon");
  const bal4web = localStorage.getItem("bal4web");

  const voice = localStorage.getItem("voice");

  if (!customAudio) {
    execSync(
      `${existsSync(balcon) ? `"${balcon}"` : "balcon"} -n ${voice} -t ${text}`
    );
  } else {
    const audioPath = join(
      tempPath,
      "data",
      `${createRandomString(3)}-audio.wav`
    );

    if (existsSync(audioPath)) {
      unlinkSync(audioPath);
    }

    execSync(
      `${
        existsSync(bal4web) ? `"${bal4web}"` : "bal4web"
      } -s m -l en-US -n ${voice} -t "${text}" -w "${audioPath}"`
    );

    return audioPath;
  }
};

export const getStorage = (key: Storage) => {
  try {
    const data = localStorage.getItem(key);

    if (data && data !== "") return JSON.parse(data);
  } catch (err) {
    logger("Data saved in localStorage is corrupted!", "error");
  }

  return null;
};

export const setStorage = (key: Storage, data: any) => {
  try {
    localStorage.setItem(key, data);
  } catch (err) {
    logger("Data saved in localStorage is corrupted!", "error");
  }
};

export const deleteStorage = (key: Storage) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    logger("Data saved in localStorage is corrupted!", "error");
  }
};
