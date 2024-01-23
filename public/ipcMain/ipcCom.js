
const path = require('path');
const fs = require('fs');
const nodeDiskInfo = require('node-disk-info');
const { v4: uuidv4 } = require('uuid');


const { ipcMain } = require('electron');

const {
	streamFile,
	streamFilePromise
} = require('../file-streamer.js');
const Folder = require('../Folder.js');


const WINDOWS_RAW = 'win32';
const LINUX_RAW = 'linux';
const OSX_RAW = 'osx';

const WINDOWS_PLATFORM = 'WINDOWS';
const LINUX_PLATFORM = 'LINUX';
const OSX_PLATFORM = 'OSX';

const getCurrentPlatorm = () => {
  switch (process.platform) {
    case WINDOWS_RAW:
      return WINDOWS_PLATFORM;
    case LINUX_RAW:
      return LINUX_PLATFORM;
    case OSX_RAW:
      return OSX_PLATFORM;
    default:
      return process.platform;
  }
};

const CURRENT_PLATFORM = getCurrentPlatorm();

const sortArrayByNonHiddenFirst = arr => arr.sort((a,b) => a.startsWith('.') - b.startsWith('.'));

const removedHidden = arr => arr.filter(n => !n.startsWith('.'));

const root = (CURRENT_PLATFORM === WINDOWS_PLATFORM) ? process.cwd().split(path.sep)[0] : '/';

const homeFolderName = (CURRENT_PLATFORM === LINUX_PLATFORM) ? 'home' : 'lame';

const rootSubFolders = fs.readdirSync(root);
console.log('rootSubFolders: ', rootSubFolders);

const createFullPathArray = (basePath, arr) => arr.map(n => path.join(basePath, n));

const isFile = currentPath => {
  const statsObj = fs.statSync(currentPath);
  return statsObj.isFile();
};

const isDirectory = currentPath => {
  const statsObj = fs.statSync(currentPath);
  return statsObj.isDirectory();
};

class FolderItem {
  constructor(itemPath) {
    this.id = uuidv4();
    const pathArraySplit = itemPath.split('/');
    this.name = pathArraySplit[pathArraySplit.length - 1];
    this.path = itemPath;
    const itemIsFile = isFile(itemPath);
    const itemIsDirectory = isDirectory(itemPath);
    this.isAFile = itemIsFile && !itemIsDirectory;
    this.isADirectory = !itemIsFile && itemIsDirectory;
  }
}

const createFolderItemArray = arr => arr.map(el => new FolderItem(el));

const getUsbDrives = () => {
  try {
    const disks = nodeDiskInfo.getDiskInfoSync();

    console.log('disks: ', disks);


    // const driveListRaw = disks[0];

    // console.log('driveListRaw: ', driveListRaw);

    const driveList = disks.map(m => m._mounted);
    console.log('driveList: ', driveList);

    const mediaDrives = driveList.filter(n => n.startsWith('/media/')).map(m => m + ' Disk');

    console.log('mediaDrives: ', mediaDrives);

    return mediaDrives;

  } catch (e) {
    console.error(e);
  }
};

const mediaDrivesFound = getUsbDrives();

const ComObject = {
  channels: {
    GET_MAP_DATA: 'get_map_data',
    GET_ROOT_FOLDER: 'get_root_folder',
    GET_ROOT_SUB_FOLDERS: 'get_root_sub_folders',
    GET_MEDIA_DRVIES: 'get_media_drives',
    GET_HOME_FOLDER: 'get_home_folder',
    GET_CURRENT_FOLDER_CONTENTS: 'get_current_folder_contents',
    GET_SOURCE_FOLDER_CONTENTS: 'get_source_folder_contents',
    GET_TARGET_FOLDER_CONTENTS: 'get_target_folder_contents',
    CREATE_FOLDER: 'create_folder',
    COPY_FILE: 'copy_file',
    COPY_FOLDER: 'copy_folder'
  },
};

const ipcGetRootFolder = () => {
	ipcMain.on(ComObject.channels.GET_ROOT_FOLDER, (event, arg) => {
	  console.log(arg);
	  event.sender.send(ComObject.channels.GET_ROOT_FOLDER, root);
	});
};
const ipcGetRootSubFolders = () => {
	ipcMain.on(ComObject.channels.GET_ROOT_SUB_FOLDERS, (event, arg) => {
	  console.log(arg);
	  event.sender.send(ComObject.channels.GET_ROOT_SUB_FOLDERS, rootSubFolders);
	});
};
const ipcGetMediaDrives = () => {
	ipcMain.on(ComObject.channels.GET_MEDIA_DRVIES, (event, arg) => {
	  console.log(arg);
	  event.sender.send(ComObject.channels.GET_MEDIA_DRVIES, mediaDrivesFound);
	});
};
const ipcGetHomeFolder = () => {
	ipcMain.on(ComObject.channels.GET_HOME_FOLDER, (event, arg) => {
	  console.log(arg);
	  if(CURRENT_PLATFORM === LINUX_PLATFORM && rootSubFolders.includes('home')) {
	    event.sender.send(ComObject.channels.GET_HOME_FOLDER, `/${homeFolderName}`);
	  } else {
	    event.sender.send(ComObject.channels.GET_HOME_FOLDER, '/lame');
	  }
	});
};
const ipcGetSourceFolderContents = () => {
	ipcMain.on(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, (event, arg) => {
	  console.log('current Source folder: ', arg);

	  const directoryContents = fs.readdirSync(arg.folderPath);
	  const directoryContentsNonHiddenFirst = sortArrayByNonHiddenFirst(directoryContents);

	  console.log('Source Directory Contents: ', directoryContents);

	  console.log('Source Directory Contents Non Hidden First: ', directoryContentsNonHiddenFirst);

	  const fullPathArray = createFullPathArray(arg.folderPath, directoryContentsNonHiddenFirst);

	  console.log('Source Full Path Array: ', fullPathArray);

	  const currentFolderItemsArray = createFolderItemArray(fullPathArray);

	  currentFolderItemsArray.forEach(el => console.log(JSON.stringify(el)));

	  // console.log('Source currentFolderItemsArray: ', currentFolderItemsArray);

	  event.sender.send(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, currentFolderItemsArray);
	});
};
const ipcGetTargetFolderContents = () => {
	ipcMain.on(ComObject.channels.GET_TARGET_FOLDER_CONTENTS, (event, arg) => {
	  console.log('current Target folder: ', arg);

	  const directoryContents = fs.readdirSync(arg.folderPath);

	  const directoryContentsNonHiddenFirst = sortArrayByNonHiddenFirst(directoryContents);
	  console.log('Target Directory Contents: ', directoryContents);

	  console.log('Target Directory Contents Non Hidden First: ', directoryContentsNonHiddenFirst);

	  const fullPathArray = createFullPathArray(arg.folderPath, directoryContentsNonHiddenFirst);

	  console.log('Target Full Path Array: ', fullPathArray);

	  const currentFolderItemsArray = createFolderItemArray(fullPathArray);

	  currentFolderItemsArray.forEach(el => console.log(JSON.stringify(el)));

	  // console.log('Target currentFolderItemsArray: ', currentFolderItemsArray);

	  event.sender.send(ComObject.channels.GET_TARGET_FOLDER_CONTENTS, currentFolderItemsArray);
	});
};
const ipcGetCurrentFolderContents = () => {
	ipcMain.on(ComObject.channels.GET_CURRENT_FOLDER_CONTENTS, (event, arg) => {
	  console.log('current folder: ', arg);

	  const directoryContents = fs.readdirSync(arg.folderPath);
	  console.log('Target Directory Contents: ', directoryContents);

	  const directoryContentsNonHidden = directoryContents.filter(n => !n.startsWith('.'));

	  event.sender.send(ComObject.channels.GET_CURRENT_FOLDER_CONTENTS, directoryContentsNonHidden);
	});
};
const ipcCreateFolder = () => {
	ipcMain.on(ComObject.channels.CREATE_FOLDER, (event, arg) => {
		const { currentFolder, newFolder } = arg;
		console.log('current folder: ', arg.currentFolder);
		console.log('folder to create: ', arg.newFolder);

		const newFolderPath = path.join(currentFolder, newFolder);

		try {
		  if (!fs.existsSync(newFolderPath)) {
		    fs.mkdirSync(newFolderPath);
		    const AjaxReturnObject = {
		    	success: true,
		    	folderName: newFolderPath,
		    	currentFolder
		    };
		    event.sender.send(ComObject.channels.CREATE_FOLDER, AjaxReturnObject);
		  }
		} catch (err) {
		  console.error(err);
		  event.sender.send(ComObject.channels.CREATE_FOLDER, {success: false, error: err});
		}
	});
};
const ipcCopyFile = (win) => {
	ipcMain.on(ComObject.channels.COPY_FILE, async (event, arg) => {
		try {
			console.log('File to Copy: ', arg);
			const { sourceFilePath, targetFilePath, id } = arg;
			const response = await streamFilePromise(sourceFilePath, targetFilePath, win, id);
			console.log('response: ', response);
			event.sender.send(ComObject.channels.COPY_FILE, {success: true, response});
		} catch (error) {
	    console.error(`Could not get products: ${error}`);
	    event.sender.send(ComObject.channels.COPY_FILE, {success: false, error});
	  }
	});
};
const ipcCopyFolder = (win) => {
	ipcMain.on(ComObject.channels.COPY_FOLDER, async (event, arg) => {
		try {
			console.log('Folder to Copy: ', arg);
			const { sourceFolderPath, targetFolderPath, id } = arg;
			const FolderToCopy = new Folder(sourceFolderPath, win, id);
			FolderToCopy.treeSearch();
			const response = await FolderToCopy.createSubFoldersAndCopyAsync(targetFolderPath);
			console.log('response: ', response);
			event.sender.send(ComObject.channels.COPY_FOLDER, response);
		} catch (error) {
	    console.error(`Could not get products: ${error}`);
	    event.sender.send(ComObject.channels.COPY_FOLDER, {success: false, error});
	  }
	});
};

let instance;

class IpcCom {
	constructor(win) {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    this.win = win;
    this.getCurrentPlatorm = getCurrentPlatorm;
    this.getUsbDrives = getUsbDrives;
    this.mediaDrivesFound = mediaDrivesFound;
		this.ComObject = ComObject;
		this.CURRENT_PLATFORM = CURRENT_PLATFORM;
		this.WINDOWS_RAW = WINDOWS_RAW;
		this.LINUX_RAW = LINUX_RAW;
		this.OSX_RAW = OSX_RAW;
		this.WINDOWS_PLATFORM = WINDOWS_PLATFORM;
		this.LINUX_PLATFORM = LINUX_PLATFORM;
		this.OSX_PLATFORM = OSX_PLATFORM;
		this.setupIpcCommunicationsHasRun = false;

		if (!IpcCom._instance) {
      IpcCom._instance = this;
    }
    if(!this.setupIpcCommunicationsHasRun) {
    	this.setupIpcCommunications();
    }
    console.log('IpcCom constructor has run.');
    return IpcCom._instance;
  }

  setupIpcCommunications() {
  	console.log('setupIpcCommunications has started.');
  	const _win = this.win;

  	console.log('_win: ', _win);

  	ipcGetRootFolder();
  	ipcGetRootSubFolders();
  	ipcGetMediaDrives();
  	ipcGetHomeFolder();
  	ipcGetSourceFolderContents();
  	ipcGetTargetFolderContents();
  	ipcGetCurrentFolderContents();
  	ipcCreateFolder();
  	ipcCopyFile(_win);
  	ipcCopyFolder(_win);

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
		// ipcMain.on(ComObject.channels.CREATE_FOLDER, (event, arg) => {
		// 	const { currentFolder, newFolder } = arg;
		// 	console.log('current folder: ', arg.currentFolder);
		// 	console.log('folder to create: ', arg.newFolder);

		// 	const newFolderPath = path.join(currentFolder, newFolder);

		// 	try {
		// 	  if (!fs.existsSync(newFolderPath)) {
		// 	    fs.mkdirSync(newFolderPath);
		// 	    const AjaxReturnObject = {
		// 	    	success: true,
		// 	    	folderName: newFolderPath,
		// 	    	currentFolder
		// 	    };
		// 	    event.sender.send(ComObject.channels.CREATE_FOLDER, AjaxReturnObject);
		// 	  }
		// 	} catch (err) {
		// 	  console.error(err);
		// 	  event.sender.send(ComObject.channels.CREATE_FOLDER, {success: false, error: err});
		// 	}
		// });
		// ipcMain.on(ComObject.channels.COPY_FILE,(event, arg) => {
		// });

		this.setupIpcCommunicationsHasRun = true;
		console.log('setupIpcCommunications has run.');
  }

}


// const IpcComInstance = new IpcCom();

module.exports = IpcCom;


