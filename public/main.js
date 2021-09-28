const { app, BrowserWindow, Menu, protocol } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

function createWindow() {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = request.url.replace("file:///", "");
    callback(pathname);
  });

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
    resizable: false,
  });

  // if (!isDev) {
  //   const mainMenu = Menu.buildFromTemplate([]);
  //   Menu.setApplicationMenu(mainMenu);
  // }

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
