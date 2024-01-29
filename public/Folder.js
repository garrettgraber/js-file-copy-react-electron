const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const fastFolderSize = require('fast-folder-size');
const fastFolderSizeAsync = promisify(fastFolderSize);


const {
	streamFile,
	streamFilePromise
} = require('./file-streamer.js');

const folderFilter = n => n.split('.').length === 1;
const fileFilter = n => n.split('.').length !== 1;

class File {
	constructor(filePath, id, size) {
		this.filePath = filePath;
		this.id = id;
		this.size = size;
	}
}

class Folder {
	constructor(folderPath, win, id) {
		const folderPathSplit = folderPath.split('/');
		const folderName = folderPathSplit[folderPathSplit.length - 1];
		const parentFolderName = folderPathSplit[folderPathSplit.length - 2];
		const folderContents = fs.readdirSync(folderPath);
		const subFolders = folderContents.filter(folderFilter);
		const filesInFolder = folderContents.filter(fileFilter);
		this.id = id;
		this.win = win;
		this.folderName = folderName;
		this.parentFolderName = parentFolderName;
		this.folderPath = folderPath;
		this.folders = subFolders;
		this.files = filesInFolder;
		this.subFoldersObjectsArray = [];
		this.fileObjectsArray = [];
	}

	printData() {
		console.log('\nfolderName: ', this.folderName);
		console.log('\parentFolderName: ', this.parentFolderName);
		console.log('folderPath: ', this.folderPath);
		console.log('folders: ', this.folders);
		console.log('files: ', this.files);
		console.log('subFoldersObjectsArray: ', this.subFoldersObjectsArray);
		console.log('fileObjectsArray: ', this.fileObjectsArray);
	}

	async treeSearch() {
		const folderPath = this.folderPath;
		const folderSizeInBytes = await fastFolderSizeAsync(folderPath);
		this.sizeInBytes = folderSizeInBytes;
		console.log('Size in Bytes: ', this.sizeInBytes);
		const subFoldersObjectsArray = this.subFoldersObjectsArray;
		const _win = this.win;
		const fileObjectsArray = this.fileObjectsArray;

		for(const currentFile of this.files) {
			const currentFilePath = path.join(folderPath, currentFile);
			const fileInfo = fs.statSync(currentFilePath);
			const fileSize = fileInfo.size;
			const NewFileObject = new File(currentFilePath, uuidv4(), fileSize);
			fileObjectsArray.push(NewFileObject);
		}

		for(const currentFolder of this.folders) {
			const subFolderPath = path.join(folderPath, currentFolder);
			const SubFolder = new Folder(subFolderPath, _win, uuidv4());
			subFoldersObjectsArray.push(SubFolder);
			await SubFolder.treeSearch();
		}


		// this.folders.forEach((el, index, arr) => {
		// 	const subFolderPath = path.join(folderPath, el);
		// 	const SubFolder = new Folder(subFolderPath, _win, uuidv4());
		// 	subFoldersObjectsArray.push(SubFolder);
		// 	await SubFolder.treeSearch();
		// 	// SubFolder.printData();
		// });
	}

	createSubFoldersAndCopy(targetPath) {
		console.log('\ntargetPath: ', targetPath);

		if(!fs.existsSync(targetPath)) {
			fs.mkdirSync(targetPath);
			console.log('Creating folder: ', targetPath);
		}

		const files = this.files;
		const _win = this.win;
		for(const file of files) {
			const folderPath = this.folderPath;
			const sourceFilePath = path.join(folderPath, file);
			const targetFilePath = path.join(targetPath, file);
			console.log('sourceFilePath: ', sourceFilePath);
			console.log('targetFilePath: ', targetFilePath);
			streamFile(sourceFilePath, targetFilePath, _win);
		}

		// const folderToCreatePath = path.join(targetPath, this.folderName);
		// console.log('targetPath: ', targetPath);
		// if (!fs.existsSync(folderToCreatePath)){
	    // fs.mkdirSync(folderToCreatePath);
    const subFoldersObjectsArray = this.subFoldersObjectsArray;
    for(const SubFolder of subFoldersObjectsArray) {
    	const folderName = SubFolder.folderName;
    	console.log('\nfolderName: ', folderName);
    	const subFolderPath = path.join(targetPath, folderName);
    	console.log('subFolderPath: ', subFolderPath);
    	// fs.mkdirSync(subFolderPath);
    	SubFolder.createSubFoldersAndCopy(subFolderPath);
    }
		// }
	}

	async createSubFoldersAndCopyAsync(targetPath) {
		try {
			console.log('\ntargetPath: ', targetPath);

			if(!fs.existsSync(targetPath)) {
				fs.mkdirSync(targetPath);
				console.log('Creating folder: ', targetPath);
			}

			const files = this.files;
			const _win = this.win;
			for(const file of files) {
				const folderPath = this.folderPath;
				const sourceFilePath = path.join(folderPath, file);
				const targetFilePath = path.join(targetPath, file);
				console.log('sourceFilePath: ', sourceFilePath);
				console.log('targetFilePath: ', targetFilePath);
				const streamFileResponse = await streamFilePromise(sourceFilePath, targetFilePath, _win, uuidv4());
				console.log('streamFileResponse: ', streamFileResponse);
			}
	    const subFoldersObjectsArray = this.subFoldersObjectsArray;
	    for(const SubFolder of subFoldersObjectsArray) {
	    	const folderName = SubFolder.folderName;
	    	console.log('\nfolderName: ', folderName);
	    	const subFolderPath = path.join(targetPath, folderName);
	    	console.log('subFolderPath: ', subFolderPath);
	    	// fs.mkdirSync(subFolderPath);
	    	await SubFolder.createSubFoldersAndCopyAsync(subFolderPath);
	    }
	    return {
	    	success: true,
	    	path: targetPath
	    };

  	} catch(err) {
  		console.log(err);
  	}
	}


	copyFiles(targetPath) {

	}
}

module.exports = Folder;
