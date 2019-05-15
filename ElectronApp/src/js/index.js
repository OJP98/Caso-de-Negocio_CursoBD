const electron = require('electron');


const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('./src/html/index.html');

    win.setMenu(null);

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        app.quit();
    })
}

function createProductsWindow() {
    // Create the browser window.
    let prodsWindow = new BrowserWindow({
        width: 600,
        height: 600,
        titleBarStyle: 'customButtonsOnHover',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    prodsWindow.loadFile('./src/html/tabla_productos.html');

    // Emitted when the window is closed.
    prodsWindow.on('closed', () => {
        prodsWindow = null;
    })

}

function createProductsWindow2() {
    // Create the browser window.
    let prodsAtrib = new BrowserWindow({
        width: 600,
        height: 600,
        titleBarStyle: 'customButtonsOnHover',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    prodsAtrib.loadFile('./src/html/datosProducto.html');

    // Emitted when the window is closed.
    prodsAtrib.on('closed', () => {
        prodsAtrib = null;
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.requestSingleInstanceLock();

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

ipcMain.on('show-products', function () {
    createProductsWindow();
});

ipcMain.on('show-products2', function () {
    createProductsWindow2();

});