const { app, BrowserWindow } = require('electron')


const createWindow = () => {
const win = new BrowserWindow({
    width: 1000,
    height: 600
  })

  win.loadURL('https://www.instagram.com/reels')
}


app.whenReady().then(() => {
  createWindow()})
