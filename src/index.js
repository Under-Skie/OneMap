import { app, BrowserWindow, protocol } from 'electron';
const path = require('path');
const url = require("url");
const sqlite3 = require('sqlite3').verbose();
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({ show: false });
  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

const db = new sqlite3.Database(path.resolve(__dirname, 'Data.gmdb'));
console.log(db)

const registerMapProtocal = () => {

  protocol.registerBufferProtocol('map', function (request, callback) {
    let parsedUrl = url.parse(request.url)
    let pathName = parsedUrl.pathname.substr(1);

    let reqArry = pathName.split('/');
    let type = parsedUrl.hostname

    let zoom = reqArry[0];
    let x = reqArry[1];
    let y = reqArry[2];

    db.all(`select Tile from TilesData inner JOIN Tiles ON Tiles.id = TilesData.id where Tiles.Type=$type and Tiles.Zoom=$zoom and Tiles.X=$x and Tiles.Y=$y`, {
      $type: type,
      $zoom: zoom,
      $x: x,
      $y: y
    }, function (error, results, fields) {
      if (error) {
        callback({ mimeType: 'text/plain', data: Buffer.from(error) });
      } else if (!results || !results[0]) {
        callback({ mimeType: 'text/plain', data: Buffer.from("") });
      } else {
        callback({ mimeType: 'image/png', data: Buffer.from(results[0].Tile) });
      }

    });

  }, function (error) {
    if (error)
      console.error('Failed to register protocol')
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  registerMapProtocal();
  createWindow();
});


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
