const { app, BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

// const iconPath =
//   process.platform !== "darwin"
//     ? "src/assets/icons/favicon.ico"
//     : "src/assets/icons/favicon.icns";

require("@electron/remote/main").initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    // icon: "../src/assets/icons/icon.png",
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      // webSecurity: false,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : "https://wxxcx-29w9p-1300523937.tcloudbaseapp.com"
    // isDev
    //   ? "http://localhost:3000"
    //   : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.webContents.on("devtools-opened", () => {
    isDev
      ? (win.webContents.closeDevTools(), alert("Dev tool disabled"))
      : null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
