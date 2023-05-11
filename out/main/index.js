"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const mysql = require("mysql2");
const icon = path.join(__dirname, "../../resources/icon.png");
const jwt = require("jsonwebtoken");
const pool = mysql.createPool({
  host: "153.92.210.7",
  user: "admin",
  password: "AB9_$sQ95",
  database: "binaniaga"
});
const db = pool.promise();
const secretKey = "posvite";
class Response {
  constructor(data, success = true) {
    this.success = success;
    this.data = data;
  }
}
const isTokenValid = async () => {
  const user = localStorage.getItem("user");
  const token = `Bearer ${JSON.parse(user).token}`;
  if (token && token.split(" ")[1]) {
    const pureToken = token.split(" ")[1];
    try {
      const result = jwt.verify(pureToken, secretKey);
      const [data] = await db.query(
        `SELECT * FROM user WHERE id = ${result.userid} ORDER BY id ASC`
      );
      const user2 = data[0];
      if (user2.token == pureToken) {
        return new Response({ message: "token valid" }, true);
      } else {
        return new Response({ message: "token invalid" }, false);
      }
    } catch (e) {
      console.error("gagal verify", e);
      return new Response({ message: "token invalid" }, false);
    }
  } else {
    return new Response({ message: "token invalid" }, false);
  }
};
exports = { db, pool, Response, isTokenValid, secretKey };
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    minWidth: 1466,
    minHeight: 768,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  mainWindow.on("close", function(e) {
    let response = electron.dialog.showMessageBoxSync(this, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Konfirmasi",
      message: "Apakah Anda Yakin Ingin Menutup Aplikasi ?"
    });
    if (response == 1) {
      e.preventDefault();
    } else {
      mainWindow.webContents.executeJavaScript('localStorage.removeItem("user")');
    }
  });
  pool.getConnection((err) => {
    if (err) {
      console.error("err database", err);
    } else {
      console.log("Connect DB successfully");
    }
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
