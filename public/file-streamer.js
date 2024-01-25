const fs = require('fs');
const path = require('path');
const progress = require('progress-stream');
const { ipcRenderer } = require('electron');

const MINUTE = 'minute';
const SECOND = 'second';
const EMPTY_STRING = '';
const EMPTY_SPACE = ' ';
const AND = ' and ';
const SIXTY = 60.0;


const ComObject = {
  channels: {
    GET_STATUS_OF_COPY: 'get_status_of_copy'
  },
};

const timeStringModifier = (timeCount, timeString) => {
	const timeStringPlural = `${timeString}s`;
	if(timeCount === 0) return EMPTY_STRING;
	return `${EMPTY_SPACE}${timeCount > 1 ? timeStringPlural : timeString}`;
};

const timeZeroCheck = (timeCount, additionalString) => `${timeCount > 0 ? additionalString + timeCount : EMPTY_STRING}`;

const getTimeString = timeInSeconds => {
	if(timeInSeconds >= SIXTY) {
		const minutes = parseInt(timeInSeconds / SIXTY);
		const secondsRemaining = timeInSeconds % SIXTY;
		return `${timeZeroCheck(minutes, EMPTY_STRING)}${timeStringModifier(minutes, MINUTE)}${timeZeroCheck(secondsRemaining, AND)}${timeStringModifier(secondsRemaining, SECOND)}`;
	} else {
		return `${timeZeroCheck(timeInSeconds, EMPTY_STRING)}${timeStringModifier(timeInSeconds, SECOND)}`;
	}
};

const streamFile = (sourceFile, targetFile, win) => {
	const sourceFileExists = fs.existsSync(sourceFile);
	const targetFileExists = fs.existsSync(targetFile);

	if(sourceFileExists) {

		const sourceStat = fs.statSync(sourceFile);

		const sourceStatSize = sourceStat.size;

		const progressString = progress({
	    length: sourceStatSize,
	    time: 1000 /* ms */
		});

		progressString.on('progress', function(Progress) {
		  const {
		  	percentage,
		  	eta,
		  	runtime
			} = Progress;

			const percentageTwoDecimals = percentage.toFixed(2);
			const currentPercentageString = `${percentageTwoDecimals}%`;
		 	const currentEtaString = getTimeString(eta);
		 	const currentRuntimeString = getTimeString(runtime);

		 	const currentProgressString = `Percentage Done: ${currentPercentageString}${eta > 0 ? '. ETA: ' : ''}${currentEtaString}. Runtime: ${currentRuntimeString}.`;
		 	console.log(currentProgressString);
		    /*
		    {
		        percentage: 9.05,
		        transferred: 949624,
		        length: 10485760,
		        remaining: 9536136,
		        eta: 42,
		        runtime: 3,
		        delta: 295396,
		        speed: 949624
		    }
		    */
		});

		const readStream = fs.createReadStream(sourceFile);
		const writeStream = fs.createWriteStream(targetFile);

		readStream.pipe(progressString).pipe(writeStream);

		// readStream.pipe(progressString);

		// let totalDataTransfered = 0;

		// readStream.on('data', chunk => {
		// 	//write into the file  one piece at a time
		// 	// console.log('chunk length: ', chunk.length);
		// 	totalDataTransfered += chunk.length;
		// 	const totalDataTransferedRatio = parseFloat(totalDataTransfered / sourceStatSize);
		// 	const totalDataTransferedPercentageRaw = parseFloat(totalDataTransferedRatio * 100.00);
		// 	const totalDataTransferedPercentage = Math.floor(totalDataTransferedPercentageRaw * 100) / 100.0;
		// 	console.log(`Percentage Done: ${totalDataTransferedPercentage}%`);
		// 	writeStream.write(chunk);
		// });

		// readStream.on('end', () => {
	  //   //after that we read the all file piece  by piece we close the stram 
		// 	console.log('Done reading File');
	  //   writeStream.end();
		// });

		readStream.on('end', () => {
			console.log('Done reading File');
			// writeStream.end();
		});

		writeStream.on('finish', () => {
			console.log('Done writing File: ', targetFile);
		});

	} else {
		console.log(`Source file does not exist: ${sourceFile}`);
	}

};

const streamFilePromise = (sourceFile, targetFile, win, id) => {
	return new Promise((resolve, reject) => {

		const sourceFileExists = fs.existsSync(sourceFile);
		const targetFileExists = fs.existsSync(targetFile);

		if(sourceFileExists) {

			const sourceStat = fs.statSync(sourceFile);

			const sourceStatSize = sourceStat.size;

			const progressString = progress({
		    length: sourceStatSize,
		    time: 1000 /* ms */
			});

			progressString.on('progress', function(Progress) {
			  const {
			  	percentage,
			  	eta,
			  	runtime
				} = Progress;

				const percentageTwoDecimals = percentage.toFixed(2);
				const currentPercentageString = `${percentageTwoDecimals}%`;
			 	const currentEtaString = getTimeString(eta);
			 	const currentRuntimeString = getTimeString(runtime);

			 	const currentProgressString = `Percentage Done: ${currentPercentageString}${eta > 0 ? '. ETA: ' : ''}${currentEtaString}. Runtime: ${currentRuntimeString}.`;
			 	console.log(currentProgressString);
			    /*
			    {
			        percentage: 9.05,
			        transferred: 949624,
			        length: 10485760,
			        remaining: 9536136,
			        eta: 42,
			        runtime: 3,
			        delta: 295396,
			        speed: 949624
			    }
			    */
			});

			const readStream = fs.createReadStream(sourceFile);
			const writeStream = fs.createWriteStream(targetFile);

			// readStream.pipe(progressString).pipe(writeStream);

			// readStream.pipe(progressString);

			let totalDataTransfered = 0;

			readStream.on('data', chunk => {
				//write into the file  one piece at a time
				// console.log('chunk length: ', chunk.length);
				totalDataTransfered += chunk.length;
				const totalDataTransferedRatio = parseFloat(totalDataTransfered / sourceStatSize);
				const totalDataTransferedPercentageRaw = parseFloat(totalDataTransferedRatio * 100.00);
				const totalDataTransferedPercentage = Math.floor(totalDataTransferedPercentageRaw * 100) / 100.0;
				console.log(`Percentage Done: ${totalDataTransferedPercentage}%`);
				writeStream.write(chunk);
				const ComChannelCopyStatus = `${ComObject.channels.GET_STATUS_OF_COPY}-${id}`;
				win.webContents.send(ComChannelCopyStatus, {
					id,
					sourceFile,
					percentageDone: totalDataTransferedPercentage
				});
			});

			readStream.on('end', () => {
		    //after that we read the all file piece  by piece we close the stram 
				console.log('Done reading File');
		    writeStream.end();
		    console.log('Done writing File');
		    resolve(`Done Writing: ${targetFile}`);
			});

			// readStream.on('end', () => {
			// 	console.log('Done reading File: ', sourceFile);
			// 	// writeStream.end();
			// });

			// writeStream.on('finish', () => {
			// 	console.log('Done writing File: ', targetFile);
			// 	resolve(`Done Writing: ${targetFile}`);
			// });

		} else {
			console.log(`Source file does not exist: ${sourceFile}`);
			reject('No Source File');
		}
	});
};


module.exports = {
	streamFile,
	streamFilePromise
};

