
const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process');
const path = require('path');

const createWindow = () => {
const win = new BrowserWindow({
    width: 1000,
    height: 600
  })

  win.loadURL('https://www.instagram.com/reels')
}



let browserWindow = null;
let pyProc = null;
let client = null;
let checkingBlink = false;
let stopped = false;


function nextreel() {
  if (!browserWindow || browserWindow.isDestroyed()) return;

  browserWindow.webContents.sendInputEvent({
    type: 'keyDown',
    keyCode: 'Down'
  });

  browserWindow.webContents.sendInputEvent({
    type: 'keyUp',
    keyCode: 'Down'
  });
}





const selectPort = () => {
  pyPort = 8080
  return pyPort
}

function createPyProc() {
const pythonExe =
    'C:\\Users\\YourUser\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';

const script = path.join(__dirname, 'EyeTracker', 'api.py');

  pyProc = spawn('python', [script]);

  pyProc.stdout.on('data', data => console.log(data.toString()));
  pyProc.stderr.on('data', data => console.error(data.toString()));
}

function checkForBlink() {
   if (stopped) return;

  fetch('http://127.0.0.1:8080/blink_detected')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.blink_detected === true) {
        nextreel();
      }

      // Check again after the request finishes.
      setTimeout(checkForBlink, 100);
    })
    .catch(error => {
      console.error('Blink API:', error.message);

      // Retry if Python is not ready yet.
      setTimeout(checkForBlink, 1000);
    });
}

app.whenReady().then(() => {
  createWindow();
  createPyProc();

  // Give Python a moment to start its RPC server.
  setTimeout(checkForBlink, 1000);
});

app.on('before-quit', () => {
  stopped = true;
  if (pyProc) pyProc.kill();
});
