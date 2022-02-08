# i18next-electron-fs-backend
* This is a fork of i18next-node-fs-backend 
This is an i18next library designed to work with [secure-electron-template](https://github.com/reZach/secure-electron-template). The library is a rough copy of [i18next-node-fs-backend](https://github.com/i18next/i18next-node-fs-backend) but using IPC (inter-process-communication) to request a file be read or written from the electron's [main process](https://electronjs.org/docs/api/ipc-main). The translation files that are written are written synchronously, but this should not be a problem because you should be creating translation files in development only (translation files should already exist before deploying to production environments).

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=reZach_i18next-electron-fs-backend&metric=alert_status)](https://sonarcloud.io/dashboard?id=reZach_i18next-electron-fs-backend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=reZach_i18next-electron-fs-backend&metric=security_rating)](https://sonarcloud.io/dashboard?id=reZach_i18next-electron-fs-backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=reZach_i18next-electron-fs-backend&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=reZach_i18next-electron-fs-backend)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=reZach_i18next-electron-fs-backend&metric=bugs)](https://sonarcloud.io/dashboard?id=reZach_i18next-electron-fs-backend)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=reZach_i18next-electron-fs-backend&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=reZach_i18next-electron-fs-backend)

## How to install

### Install the package
`npm i @wallaceosmar/i18next-electron-fs-backend`

### Add into your i18next config
Based on documentation for a [i18next config](https://www.i18next.com/how-to/add-or-load-translations#load-using-a-backend-plugin), import the backend.
```javascript
import i18n from "i18next";
import {
  initReactI18next
} from "react-i18next";
import backend from "@wallaceosmar/i18next-electron-fs-backend";

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "./app/localization/locales/{{lng}}/{{ns}}.json",
      addPath: "./app/localization/locales/{{lng}}/{{ns}}.missing.json",
      ipcRenderer: window.api.i18nextElectronBackend // important!
    },

    // other options you might configure
    debug: true,
    saveMissing: true,
    saveMissingTo: "current",
    lng: "en"
  });

export default i18n;
```

### Update your preload.js script
```javascript
const {
    contextBridge,
    ipcRenderer
} = require("electron");
const path = require('path');
const backend = require("@wallaceosmar/i18next-electron-fs-backend");

contextBridge.exposeInMainWorld(
    "api", {
        i18nextElectronBackend: backend.preloadBindings(ipcRenderer, process, path)
    }
);
```

### Update your main.js script

In the mainBindings function you have the following parameters:
- ipcMain
- win: the BrowserWindow
- fs: the file system
- path: the path module
- options: the options object(optional)
 - absPath: the absolute path to the translation files

```javascript
const {
  app,
  BrowserWindow,
  session,
  ipcMain
} = require("electron");
const path = require('path');
const backend = require("@wallaceosmar/i18next-electron-fs-backend");
const fs = require("fs");

let win;

async function createWindow() {  
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  const options = { absPath: './' };
  backend.mainBindings(ipcMain, win, fs, path, options); // <- configures the backend
  
  // ...
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    i18nextBackend.clearMainBindings(ipcMain);
  }
});
```

## Options
These are options that are configurable, all values below are defaults.
```javascript
{
    debug: false, // If you'd like to show diagnostic messages
    loadPath: "/locales/{{lng}}/{{ns}}.json", // Where the translation files get loaded from
    addPath: "/locales/{{lng}}/{{ns}}.missing.json" // Where the missing translation files get generated    
}
```