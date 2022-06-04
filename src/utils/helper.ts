export const getStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);

    if (data && data !== "") return JSON.parse(data);
  } catch (err) {
    console.log("Data saved in localStorage is corrupted!", "error");
  }

  return null;
};

export const setStorage = (key: string, data: string) => {
  try {
    localStorage.setItem(key, data);
  } catch (err) {
    console.log("Data saved in localStorage is corrupted!", "error");
  }
};

export const deleteStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.log("Data saved in localStorage is corrupted!", "error");
  }
};
