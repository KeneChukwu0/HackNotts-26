const { app, BrowserWindow } = require('electron')
const { spawn } = require("node:child_process");
const path = require("node:path");


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600
  })

  win.loadURL('https://www.instagram.com/reels')
}

app.whenReady().then(() => {
  createWindow()
})

Scroll.handle("run-python", async ()) => {
    return new Promise((resolve,reject) => {
        const python = spawn("python", [   
            path.join(__dirname, "opencv.py")
        ]);
        
        let stoudt="";
        let stderr="";
        
        python.stdout.on("data", data=>{
            stdout += data.toString();
        });
        
        python.stderr.on("data", data => {
            stderr += data.toString();
        });

        python.on("error", reject);
        
        python.on("close", code => {
            if (code !== 0) {
                reject(new Error(stderr || `Python exited with code ${code}`));
                return;
            }

        try {
            resolve(JSON.parse(stdout));
        } catch (error) {
            reject(new Error(`Invalid JSON from Python: ${stdout}`));
        }
        });
  });
});
