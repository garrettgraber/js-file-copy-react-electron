const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const {
	streamFile,
	streamFilePromise
} = require('./file-streamer.js');

const folderFilter = n => n.split('.').length === 1;
const fileFilter = n => n.split('.').length !== 1;

class Folder {
	constructor(folderPath, win, id) {
		const folderPathSplit = folderPath.split('/');
		const folderName = folderPathSplit[folderPathSplit.length - 1];
		const parentFolderName = folderPathSplit[folderPathSplit.length - 2];
		const folderContents = fs.readdirSync(folderPath);
		const subFolders = folderContents.filter(folderFilter);
		const filesInFolder = folderContents.filter(fileFilter);
		this.win = win;
		this.folderName = folderName;
		this.parentFolderName = parentFolderName;
		this.folderPath = folderPath;
		this.folders = subFolders;
		this.files = filesInFolder;
		this.subFoldersObjectsArray = [];
	}

	printData() {
		console.log('\nfolderName: ', this.folderName);
		console.log('\parentFolderName: ', this.parentFolderName);
		console.log('folderPath: ', this.folderPath);
		console.log('folders: ', this.folders);
		console.log('files: ', this.files);
		console.log('subFoldersObjectsArray: ', this.subFoldersObjectsArray);
	}

	treeSearch() {
		const folderPath = this.folderPath;
		const subFoldersObjectsArray = this.subFoldersObjectsArray;
		const _win = this.win;
		this.folders.forEach((el, index, arr) => {
			const subFolderPath = path.join(folderPath, el);
			const SubFolder = new Folder(subFolderPath, _win, uuidv4());
			subFoldersObjectsArray.push(SubFolder);
			SubFolder.treeSearch();
			// SubFolder.printData();
		});
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
