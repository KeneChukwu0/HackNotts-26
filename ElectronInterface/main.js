const fs = require("fs")

function nextreel() {
browserWindow.webContents.sendInputEvent({keyCode: "Down", type: "keyDown"});
browserWindow.webContents.sendInputEvent({keyCode: "Down", type: "char"});
browserWindow.webContents.sendInputEvent({keyCode: "Down", type: "keyUp"});

}

const { app, BrowserWindow } = require('electron')


const createWindow = () => {
const win = new BrowserWindow({
    width: 1000,
    height: 600
  })

  win.loadURL('https://www.instagram.com/reels')
}

app.whenReady().then(() => {
  createWindow()
  readfile()
})


function readfile(){
while (true){
    fs.readFile("blink.txt",{ encoding: utf8 },function (err,data) {
    if (err) return
    if (data == "True"){
        console.log("True")
        nextreel();
    }
    else{
        console.log("False")
    }

    });
    }
}
