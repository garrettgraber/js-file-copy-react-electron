const path = require('path');
const fs = require('fs');
const nodeDiskInfo = require('node-disk-info');
const { v4: uuidv4 } = require('uuid');


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