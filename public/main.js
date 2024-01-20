
const path = require('path');
// const fs = require('fs');
// const nodeDiskInfo = require('node-disk-info');
// const { v4: uuidv4 } = require('uuid');

const {
  app,
  BrowserWindow,
  // ipcMain,
  // ipcRenderer,
  // contextBridge
} = require('electron');

const IpcComObject = require('./ipcMain/ipcCom.js');

const IpcComObject2 = require('./ipcMain/ipcCom.js');

console.log('IpcComObject: ', IpcComObject);
console.log('IpcComObject2: ', IpcComObject2);

const IpcComObjectAreTheSame = IpcComObject === IpcComObject2;
const IpcComObjectAreTheSameDoubleEquals = IpcComObject == IpcComObject2;
const IpcComObjectAreTheSameObjectIs = Object.is(IpcComObject,IpcComObject2);

console.log('IpcComObjectAreTheSame: ', IpcComObjectAreTheSame);
console.log('IpcComObjectAreTheSameDoubleEquals: ', IpcComObjectAreTheSameDoubleEquals);
console.log('IpcComObjectAreTheSameObjectIs: ', IpcComObjectAreTheSameObjectIs);

// const Folder = require('./Folder.js');
// const {
//   streamFile,
//   streamFilePromise
// } = require('./file-streamer.js');

// const { MainGrid } = require('./mainGrid.js');


// const WINDOWS_RAW = 'win32';
// const LINUX_RAW = 'linux';
// const OSX_RAW = 'osx';

// const WINDOWS_PLATFORM = 'WINDOWS';
// const LINUX_PLATFORM = 'LINUX';
// const OSX_PLATFORM = 'OSX';

// const getCurrentPlatorm = () => {
//   switch (process.platform) {
//     case WINDOWS_RAW:
//       return WINDOWS_PLATFORM;
//     case LINUX_RAW:
//       return LINUX_PLATFORM;
//     case OSX_RAW:
//       return OSX_PLATFORM;
//     default:
//       return process.platform;
//   }
// };

// const CURRENT_PLATFORM = getCurrentPlatorm();

// const sortArrayByNonHiddenFirst = arr => arr.sort((a,b) => a.startsWith('.') - b.startsWith('.'));

// const removedHidden = arr => arr.filter(n => !n.startsWith('.'));

// const root = (CURRENT_PLATFORM === WINDOWS_PLATFORM) ? process.cwd().split(path.sep)[0] : '/';

// const homeFolderName = (CURRENT_PLATFORM === LINUX_PLATFORM) ? 'home' : 'lame';

// const rootSubFolders = fs.readdirSync(root);
// console.log('rootSubFolders: ', rootSubFolders);

// const createFullPathArray = (basePath, arr) => arr.map(n => path.join(basePath, n));

// const isFile = currentPath => {
//   const statsObj = fs.statSync(currentPath);
//   return statsObj.isFile();
// };

// const isDirectory = currentPath => {
//   const statsObj = fs.statSync(currentPath);
//   return statsObj.isDirectory();
// };

// class FolderItem {
//   constructor(itemPath) {
//     this.id = uuidv4();
//     const pathArraySplit = itemPath.split('/');
//     this.name = pathArraySplit[pathArraySplit.length - 1];
//     this.path = itemPath;
//     const itemIsFile = isFile(itemPath);
//     const itemIsDirectory = isDirectory(itemPath);
//     this.isAFile = itemIsFile && !itemIsDirectory;
//     this.isADirectory = !itemIsFile && itemIsDirectory;
//   }
// }

// const createFolderItemArray = arr => arr.map(el => new FolderItem(el));


// const createFolderItemArray = arr => {
//   let folderItemArray = [];
//   for(const itemPath of arr) {
//     console.log('itemPath: ', itemPath);
//     const CurrentFolderItem = new FolderItem(itemPath);
//     console.log('CurrentFolderItem: ', CurrentFolderItem);
//     folderItemArray.push(CurrentFolderItem);
//   }
//   return folderItemArray;
// };

// const ComObject = {
//   channels: {
//     GET_MAP_DATA: 'get_map_data',
//     GET_ROOT_FOLDER: 'get_root_folder',
//     GET_ROOT_SUB_FOLDERS: 'get_root_sub_folders',
//     GET_MEDIA_DRVIES: 'get_media_drives',
//     GET_HOME_FOLDER: 'get_home_folder',
//     GET_CURRENT_FOLDER_CONTENTS: 'get_current_folder_contents',
//     GET_SOURCE_FOLDER_CONTENTS: 'get_source_folder_contents',
//     GET_TARGET_FOLDER_CONTENTS: 'get_target_folder_contents'
//   },
// };

// const getUsbDrives = () => {
//   try {
//     const disks = nodeDiskInfo.getDiskInfoSync();

//     console.log('disks: ', disks);


//     // const driveListRaw = disks[0];

//     // console.log('driveListRaw: ', driveListRaw);

//     const driveList = disks.map(m => m._mounted);
//     console.log('driveList: ', driveList);

//     const mediaDrives = driveList.filter(n => n.startsWith('/media/')).map(m => m + ' Disk');

//     console.log('mediaDrives: ', mediaDrives);

//     return mediaDrives;

//   } catch (e) {
//     console.error(e);
//   }
// };

// const mediaDrivesFound = getUsbDrives();

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  //load the index.html from a url
  win.loadURL('http://localhost:3000');

  // Open the DevTools.
  win.webContents.openDevTools({ mode: 'detach' });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// MainGrid.printRandomCell();
// console.log('Total Cells in the Map/Grid: ', MainGrid.mapTotalCells());

// ipcMain.on(ComObject.channels.GET_MAP_DATA, (event, arg) => {
//   console.log(arg);
//   event.sender.send(ComObject.channels.GET_MAP_DATA, MainGrid);
// });

// ipcMain.on(ComObject.channels.GET_ROOT_FOLDER, (event, arg) => {
//   console.log(arg);
//   event.sender.send(ComObject.channels.GET_ROOT_FOLDER, root);
// });

// ipcMain.on(ComObject.channels.GET_ROOT_SUB_FOLDERS, (event, arg) => {
//   console.log(arg);
//   event.sender.send(ComObject.channels.GET_ROOT_SUB_FOLDERS, rootSubFolders);
// });

// ipcMain.on(ComObject.channels.GET_MEDIA_DRVIES, (event, arg) => {
//   console.log(arg);
//   event.sender.send(ComObject.channels.GET_MEDIA_DRVIES, mediaDrivesFound);
// });

// ipcMain.on(ComObject.channels.GET_HOME_FOLDER, (event, arg) => {
//   console.log(arg);
//   if(CURRENT_PLATFORM === LINUX_PLATFORM && rootSubFolders.includes('home')) {
//     event.sender.send(ComObject.channels.GET_HOME_FOLDER, `/${homeFolderName}`);
//   } else {
//     event.sender.send(ComObject.channels.GET_HOME_FOLDER, '/lame');
//   }
// });

// ipcMain.on(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, (event, arg) => {
//   console.log('current Source folder: ', arg);

//   const directoryContents = fs.readdirSync(arg.folderPath);
//   const directoryContentsNonHiddenFirst = sortArrayByNonHiddenFirst(directoryContents);

//   console.log('Source Directory Contents: ', directoryContents);

//   console.log('Source Directory Contents Non Hidden First: ', directoryContentsNonHiddenFirst);

//   const fullPathArray = createFullPathArray(arg.folderPath, directoryContentsNonHiddenFirst);

//   console.log('Source Full Path Array: ', fullPathArray);

//   const currentFolderItemsArray = createFolderItemArray(fullPathArray);

//   currentFolderItemsArray.forEach(el => console.log(JSON.stringify(el)));

//   // console.log('Source currentFolderItemsArray: ', currentFolderItemsArray);

//   event.sender.send(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, currentFolderItemsArray);
// });

// ipcMain.on(ComObject.channels.GET_TARGET_FOLDER_CONTENTS, (event, arg) => {
//   console.log('current Target folder: ', arg);

//   const directoryContents = fs.readdirSync(arg.folderPath);

//   const directoryContentsNonHiddenFirst = sortArrayByNonHiddenFirst(directoryContents);
//   console.log('Target Directory Contents: ', directoryContents);

//   console.log('Target Directory Contents Non Hidden First: ', directoryContentsNonHiddenFirst);

//   const fullPathArray = createFullPathArray(arg.folderPath, directoryContentsNonHiddenFirst);

//   console.log('Target Full Path Array: ', fullPathArray);

//   const currentFolderItemsArray = createFolderItemArray(fullPathArray);

//   currentFolderItemsArray.forEach(el => console.log(JSON.stringify(el)));

//   // console.log('Target currentFolderItemsArray: ', currentFolderItemsArray);

//   event.sender.send(ComObject.channels.GET_TARGET_FOLDER_CONTENTS, currentFolderItemsArray);
// });

// ipcMain.on(ComObject.channels.GET_CURRENT_FOLDER_CONTENTS, (event, arg) => {
//   console.log('current folder: ', arg);

//   const directoryContents = fs.readdirSync(arg.folderPath);
//   console.log('Target Directory Contents: ', directoryContents);

//   const directoryContentsNonHidden = directoryContents.filter(n => !n.startsWith('.'));

//   event.sender.send(ComObject.channels.GET_CURRENT_FOLDER_CONTENTS, directoryContentsNonHidden);
// });
