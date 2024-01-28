import ComObject from './COM.js';

const { api } = window;


const getRootFolder = () => {
  api.send(ComObject.channels.GET_ROOT_FOLDER, { prop: 'ROOT_FOLDER' });
};
const getSubRootFolders = () => {
  api.send(ComObject.channels.GET_ROOT_SUB_FOLDERS, { prop: 'ROOT_SUB_FOLDERS' });
};
const getMediaDrives = () => {
  api.send(ComObject.channels.GET_MEDIA_DRVIES, { prop: 'GET_MEDIA_DRVIES' });
};
const getHomeFolder = () => {
  api.send(ComObject.channels.GET_HOME_FOLDER, { prop: 'GET_HOME_FOLDER' });
};
const getSourceFolderContents = folderPath => {
  api.send(ComObject.channels.GET_SOURCE_FOLDER_CONTENTS, { folderPath });
};
const getTargetFolderContents = folderPath => {
  api.send(ComObject.channels.GET_TARGET_FOLDER_CONTENTS, { folderPath });
};
const createFolder = (currentFolder, newFolder) => {
	api.send(ComObject.channels.CREATE_FOLDER, {currentFolder, newFolder});
};
const copyFile = (id, sourceFilePath, targetFilePath) => {
	api.send(ComObject.channels.COPY_FILE, {id, sourceFilePath, targetFilePath});
};
const copyFolder = (id, sourceFolderPath, targetFolderPath) => {
	api.send(ComObject.channels.COPY_FOLDER, {id, sourceFolderPath, targetFolderPath});
};
const copyFiles = copyFilesArray => {
	api.send(ComObject.channels.COPY_FILES, copyFilesArray);
};
const copyFolders = copyFoldersArray => {
	api.send(ComObject.channels.COPY_FOLDERS, copyFoldersArray);
};

const ApiBase = {
	getRootFolder,
	getSubRootFolders,
	getMediaDrives,
	getHomeFolder,
	getSourceFolderContents,
	getTargetFolderContents,
	createFolder,
	copyFile,
	copyFiles,
	copyFolder,
	copyFolders
};

export default ApiBase;