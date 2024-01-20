





const landArray = [
	'rocky',
	'mountains',
	'hills',
	'plains',
	'forest',
	'coast',
	'desert',
	'dunes',
	'jungles',
	'swamps',
	'coast',
	'tundra',
	'steppe',
	'volcanoes'
];

const waterArray = [
	'sea',
	'lakes',
	'ocean',
	'ice',
	'glacier'
];

const ColorMap = {
	rocky: 'grey',
	mountains: `DarkSlateGray`,
	hills: `Tan`,
	plains: `Wheat`,
	forest: `ForestGreen`,
	coast: `SeaShell`,
	desert: `SandyBrown`,
	dunes: `Gold`,
	jungles: `LimeGreen`,
	swamps: `DarkGreen`,
	coast: `LightSeaGreen`,
	tundra: `LightGray`,
	steppe: `SaddleBrown`,
	volcanoes: `Black`,
	sea: `DarkSeaGreen`,
	lakes: `Blue`,
	ocean: `DarkBlue`,
	ice: `AliceBlue`,
	glacier: `Cyan`
};


const terrainArray = [...landArray].concat(waterArray);






const mapCell = (name, number, terrain, land) => { return { name, number, terrain, land } };


const gaussSummation = n => (n * (n + 1)) / 2;


const checkSetOrderedStatus = inputSet => {
	let sum = 0;
	let previousNumber = 0;
	let orderCheck = true;
	let indexCheck = true;
	inputSet.forEach((value, index) => {
		const currentNumber = value.number;
		sum += currentNumber;
		// console.log(`currentNumber: ${currentNumber}`);
		orderCheck = (previousNumber + 1 === currentNumber)? true : false;
		indexCheck = (index + 1 === currentNumber)? true : false;
		previousNumber = currentNumber;
	});
	const gaussSummationNumber = gaussSummation(inputSet.length);
	const gaussSummationCheck = (sum === gaussSummationNumber)? true : false;
	return {
		orderCheck,
		indexCheck,
		gaussSummationCheck
	};
};


M1 = mapCell('ONE', 1, 'rocky', true);
M2 = mapCell('2', 2, 'desert', true);
M3 = mapCell('#3', 3, 'mountains', true);
M = [M1,M2,M3];

console.log(`M: ${JSON.stringify(M)}`);

// class MapObject {
// 	constructor(cellNumber, columNumber, cellArray) {
//     this.cellNumber = cellNumber;
//     this.columNumber = columNumber;
//     this.cellArray = cellArray || [];
//   }

//   objectProps() {
//   	return JSON.stringify({
//   		cellNumber 	: this.cellNumber,
//     	columNumber : this.columNumber,
//     	cellArray   : this.cellArray
//   	});
//   }

//   addCellArray(newCellArray, columNumber) {
//   	this.cellArray = newCellArray;
//   	this.columNumber = columNumber;
//   	this.cellNumber = newCellArray.length;
//   }


// };

const getRowsAndColumns = (cellNumber, totalNumberOfCells, columnNumber) => {
	const cellColumnRatio = cellNumber / columnNumber;
	if(cellNumber === totalNumberOfCells) {
		const row = cellColumnRatio;
		const column = columnNumber;
		return {row, column};
	} else {
		const columnModulo = cellNumber % columnNumber;
  	const column = (columnModulo === 0)? columnNumber : columnModulo;
		const row = (columnModulo === 0)? cellColumnRatio : Math.floor(cellColumnRatio) + 1;
		return {row, column};
	}
};

const generateMapGrid = (totalNumberOfCells, newColumNumber) => {
	if(totalNumberOfCells % newColumNumber !== 0) {
		console.log('newColumNumber and cell number mismatch');
		return false;
	}
	let cellArray = [];
	for(let i=0; i < totalNumberOfCells; i++) {
		const cellNumber = i + 1;
		// console.log(`cellNumber: ${cellNumber}`);
		const terrain = terrainArray[Math.floor(Math.random() * terrainArray.length)];
		// const terrain = terrainArray[i % (terrainArray.length - 1)];
		// const terrain = terrainArray[0];
		const isTerrainLand = landArray.includes(terrain);
		let CellObject = mapCell(`${cellNumber}`, cellNumber, terrain, isTerrainLand);
		// let CellObject = {name: 'Test', number: cellNumber, terrain, land: isTerrainLand};
		// console.log(`CellObject: ${JSON.stringify(CellObject)}`);
		const PositionObject = getRowsAndColumns(cellNumber, totalNumberOfCells, newColumNumber);
		const color = ColorMap[terrain];
		const ExpandedCellObject = Object.assign({color}, CellObject, PositionObject);
		cellArray.push(ExpandedCellObject);
	}
	// this.cellNumber = totalNumberOfCells;
	// this.newColumNumber = newColumNumber;
	// this.cellArray = cellArray;
	console.log(`${JSON.stringify(checkSetOrderedStatus(cellArray))}`);
	return cellArray;
};


const getMidPointOfCells = (numberOfCells) => {
	const cellsRawMidPoint = numberOfCells / 2.0;
	const cellsMidPointFloor = Math.floor(cellsRawMidPoint);
	if(cellsMidPointFloor === cellsRawMidPoint) {
		const endCellMidPoint = cellsRawMidPoint + 1;
		return {
			startCellMidPoint: cellsRawMidPoint,
			endCellMidPoint,
			betweenCells: true
		};
	} else {
		return {
			startCellMidPoint: cellsMidPointFloor + 1,
			endCellMidPoint: cellsMidPointFloor + 1,
			betweenCells: false
		}
	}
};


const foo3 = (row, column, totalColumns) => ((row - 1) * totalColumns) + column;

const convertRowAndColumnToCellNumber = (row, column, totalColumns) => {
	const previousRowsCellCount = (row - 1) * totalColumns;
	return previousRowsCellCount + column;
};


const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randmoNumberNotInclusive = (min, max) => randomNumber(min + 1, max - 1);



class GlobalMapObject {
	constructor(totalNumberOfCells, numberOfColumns) {
		this.numberOfCells = totalNumberOfCells;
		this.numberOfColumns = numberOfColumns;
		this.numberOfRows = totalNumberOfCells / numberOfColumns;
		this.masterCellArray = generateMapGrid(totalNumberOfCells, numberOfColumns);
		this.maxRows = totalNumberOfCells / numberOfColumns;
	}

	getColumnMidPoint() {
		const columnNumbers = this.numberOfColumns;
		const { startCellMidPoint, endCellMidPoint, betweenCells } = getMidPointOfCells(columnNumbers);
		return {
			startColumnMidPoint: startCellMidPoint,
			endColumnMidPoint: endCellMidPoint,
			betweenCells
		};
	}

	getRowMidPoint() {
		const rowNumbers = this.numberOfRows;
		const { startCellMidPoint, endCellMidPoint, betweenCells } = getMidPointOfCells(rowNumbers);
		return {
			startEndMidPoint: startCellMidPoint,
			endEndMidPoint: endCellMidPoint,
			betweenCells
		};
	}

  objectProps() {
  	return JSON.stringify({
  		numberOfCells 	: this.numberOfCells,
    	numberOfColumns : this.numberOfColumns,
    	masterCellArray : this.masterCellArray
  	});
  }

  getCellObject(cellNumber) {
  	return this.masterCellArray.find(el => el.number === cellNumber);
  }

  printCellObject(cellNumber) {
  	console.log(`CellObject: ${JSON.stringify(this.getCellObject(cellNumber))}`);
  }

  getCellLocation(cellNumber) {
  	const masterCellArrayLength = this.masterCellArray.length;
  	const numberOfColumns = this.numberOfColumns;
  	const RowColumnLocation = getRowsAndColumns(cellNumber, masterCellArrayLength, numberOfColumns);
  	const { row, column } = RowColumnLocation;
  	console.log(`row: ${row}, column: ${column}`);

  	// if(cellNumber > masterCellArrayLength) {
  	// 	console.log(`cell number to large: ${cellNumber} > ${masterCellArrayLength}`);
  	// } else if(cellNumber === masterCellArrayLength) {
  	// 	const row = cellNumber / this.numberOfColumns;
  	// 	const column = this.numberOfColumns;
  	// 	console.log(`row: ${row}, column: ${column}`);
  	// } else {
  	// 	const columnModulo = cellNumber % this.numberOfColumns;
  	// 	const column = (columnModulo === 0)? cellNumber / this.numberOfColumns : columnModulo;
  	// 	const row = Math.floor(cellNumber / this.numberOfColumns) + 1;
  	// 	console.log(`row: ${row}, column: ${column}`);
  	// }
  }

  cellHasNorthNeighbor(cellNumber) {
  	const CellObject = this.getCellObject(cellNumber);
  	// console.log(`CellObject: ${JSON.stringify(CellObject)}`);
  	return (CellObject.row > 1)? true : false; 
  }

  cellHasWestNeighbor(cellNumber) {
  	const CellObject = this.getCellObject(cellNumber);
  	// console.log(`CellObject: ${JSON.stringify(CellObject)}`);
  	return (CellObject.column > 1)? true : false; 
  }

  cellHasEastNeighbor(cellNumber) {
  	const CellObject = this.getCellObject(cellNumber);
  	// console.log(`CellObject: ${JSON.stringify(CellObject)}`);
  	return (CellObject.column < this.numberOfColumns)? true : false;
  }

  cellHasSouthNeighbor(cellNumber) {
  	const CellObject = this.getCellObject(cellNumber);
  	// console.log(`CellObject: ${JSON.stringify(CellObject)}`);
  	return (CellObject.row < this.maxRows)? true : false;
  }

  cellHasNorthWestNeighbor(cellNumber) {
  	return this.cellHasNorthNeighbor(cellNumber) && this.cellHasWestNeighbor(cellNumber);
  }

  cellHasNorthEastNeighbor(cellNumber) {
  	return this.cellHasNorthNeighbor(cellNumber) && this.cellHasEastNeighbor(cellNumber);
  }

  cellHasSouthWestNeighbor(cellNumber) {
  	return this.cellHasSouthNeighbor(cellNumber) && this.cellHasWestNeighbor(cellNumber);
  }

  cellHasSouthEastNeighbor(cellNumber) {
  	return this.cellHasSouthNeighbor(cellNumber) && this.cellHasEastNeighbor(cellNumber);
  }

  mapTotalCells() {
  	return this.masterCellArray.length;
  }

  printRandomCell() {
  	const randomCellNumber = randmoNumberNotInclusive(1, this.mapTotalCells() - 1);
  	const randomCellData = JSON.stringify(this.getCellObject(randomCellNumber));
  	const randomCellDataString = `Random Cell ${randomCellNumber}: ${randomCellData}`;
  	console.log(randomCellDataString);
  }

}

// const masterMapColumns = 90;
// const masterMapRows = 70;


const scalingFactor = 1;
const masterMapColumns = 150 * scalingFactor;
const masterMapRows = 120 * scalingFactor;


const masterMapTotalCells = masterMapRows * masterMapColumns;


const MasterMap = new GlobalMapObject(masterMapTotalCells, masterMapColumns);

console.log(`GlobalMapObject: ${JSON.stringify(MasterMap.getCellObject(1))}`);

const randomInteriorRow = randmoNumberNotInclusive(1, masterMapRows);
const randomInteriorColumn = randmoNumberNotInclusive(1, masterMapColumns);
const randomInteriorCellNumber = ((randomInteriorRow - 1) * masterMapColumns) + randomInteriorColumn;
console.log(`GlobalMapObject ${randomInteriorCellNumber}: ${JSON.stringify(MasterMap.getCellObject(randomInteriorCellNumber))}`);
console.log(`Has South East Neighbor: ${MasterMap.cellHasSouthEastNeighbor(randomInteriorCellNumber)}`);
console.log(`Has South West Neighbor: ${MasterMap.cellHasSouthWestNeighbor(randomInteriorCellNumber)}`);
console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(randomInteriorCellNumber)}`);
console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(randomInteriorCellNumber)}`);


const topRowRandomCellColumn = randmoNumberNotInclusive(1, masterMapColumns);
const eastMostColumnRandomCellRow = randmoNumberNotInclusive(1, masterMapRows);
const westMostColumnRandomCellRow = randmoNumberNotInclusive(1, masterMapRows);
const bottomRowRandomCellColumn = randomNumber(1, masterMapColumns - 1);


const northBorderCellNumber = topRowRandomCellColumn;
const eastBorderCellNumber = eastMostColumnRandomCellRow * masterMapColumns;
const westBorderCellNumber = ((westMostColumnRandomCellRow - 1) * masterMapColumns) + 1;
const southBorderCellNumber = masterMapTotalCells - bottomRowRandomCellColumn;



console.log(`\nNorth Border Check: ${northBorderCellNumber}`);
MasterMap.getCellLocation(northBorderCellNumber);
MasterMap.printCellObject(northBorderCellNumber);
console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(northBorderCellNumber)}`);
console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(northBorderCellNumber)}`);

console.log(`\nWest Border Check: ${westBorderCellNumber}`);
MasterMap.getCellLocation(westBorderCellNumber);
MasterMap.printCellObject(westBorderCellNumber);
console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(westBorderCellNumber)}`);
console.log(`Has South West Neighbor: ${MasterMap.cellHasSouthWestNeighbor(westBorderCellNumber)}`);

console.log(`\nEast Border Check: ${eastBorderCellNumber}`);
MasterMap.getCellLocation(eastBorderCellNumber);
MasterMap.printCellObject(eastBorderCellNumber);
console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(eastBorderCellNumber)}`);
console.log(`Has South East Neighbor: ${MasterMap.cellHasSouthEastNeighbor(eastBorderCellNumber)}`);

console.log(`\nSouth Border Check: ${southBorderCellNumber}`);
MasterMap.getCellLocation(southBorderCellNumber);
MasterMap.printCellObject(southBorderCellNumber);
console.log(`Has South East Neighbor: ${MasterMap.cellHasSouthEastNeighbor(southBorderCellNumber)}`);
console.log(`Has South West Neighbor: ${MasterMap.cellHasSouthWestNeighbor(southBorderCellNumber)}`);


const NORTH_WEST = 'North West';
const NORTH_EAST = 'North East';
const SOUTH_EAST = 'South East';
const SOUTH_WEST = 'South West';

const OppositeDiagonalsObject = {
	[NORTH_WEST]: SOUTH_EAST,
	[NORTH_EAST]: SOUTH_WEST,
	[SOUTH_EAST]: NORTH_WEST,
	[SOUTH_WEST]: NORTH_EAST
};

const checkDiagonalNeighbors = (locationName, cellNumber, CurrentMap) => {
	const oppositeDiagonalLocation = OppositeDiagonalsObject[locationName];
	console.log(`\nPerimeter Check: ${locationName}`);
	MasterMap.getCellLocation(cellNumber);
	MasterMap.printCellObject(cellNumber);

	const northEastNeighbor = MasterMap.cellHasNorthEastNeighbor(cellNumber);
	const northWestNeighbor = MasterMap.cellHasNorthWestNeighbor(cellNumber);
	const southEastNeighbor = MasterMap.cellHasSouthEastNeighbor(cellNumber);
	const southWestNeighbor = MasterMap.cellHasSouthWestNeighbor(cellNumber);

	console.log(`Has North East Neighbor: ${northEastNeighbor}`);
	console.log(`Has North West Neighbor: ${northWestNeighbor}`);
	console.log(`Has South East Neighbor: ${southEastNeighbor}`);
	console.log(`Has South West Neighbor: ${southWestNeighbor}`);

	const NeighborStatusObject = {
		[NORTH_WEST]: northWestNeighbor,
		[NORTH_EAST]: northEastNeighbor,
		[SOUTH_EAST]: southEastNeighbor,
		[SOUTH_WEST]: southWestNeighbor
	};

	const hasOppositeDiagonalNeighbor = NeighborStatusObject[oppositeDiagonalLocation];

	delete NeighborStatusObject[oppositeDiagonalLocation];

	const remainingNeighborsDoNotExist = Object.values(NeighborStatusObject).every(n => n === false);

	const isInCorrectCorner = hasOppositeDiagonalNeighbor && remainingNeighborsDoNotExist;
	console.log(`Is In Correct Position: ${isInCorrectCorner}`);
};


// console.log('\nPerimeter Check North West');
// MasterMap.getCellLocation(1);
// MasterMap.printCellObject(1);
// console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(1)}`);
// console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(1)}`);
// console.log(`Has South West Neighbor: ${MasterMap.cellHasSouthWestNeighbor(1)}`);

// console.log('\nPerimeter Check North East');
// MasterMap.getCellLocation(90);
// MasterMap.printCellObject(90);
// console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(90)}`);
// console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(90)}`);
// console.log(`Has South East Neighbor: ${MasterMap.cellHasSouthEastNeighbor(90)}`);

// console.log('\nPerimeter Check South East');
// MasterMap.getCellLocation(6300);
// MasterMap.printCellObject(6300);
// console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(6300)}`);
// console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(6300)}`);
// console.log(`Has South East Neighbor: ${MasterMap.cellHasSouthEastNeighbor(6300)}`);
// console.log(`Has South West Neighbor: ${MasterMap.cellHasSouthWestNeighbor(6300)}`);


// console.log('\nPerimeter Check South East');
// MasterMap.getCellLocation(6210);
// MasterMap.printCellObject(6210);
// console.log(`Has North East Neighbor: ${MasterMap.cellHasNorthEastNeighbor(6210)}`);
// console.log(`Has North West Neighbor: ${MasterMap.cellHasNorthWestNeighbor(6210)}`);
// console.log(`Has South East Neighbor: ${MasterMap.cellHasSouthEastNeighbor(6210)}`);


const northWestMostCell = 1;
const northEastMostCell = masterMapColumns;
const southEastMostCell = masterMapTotalCells;
const southWestMostCell = masterMapTotalCells - masterMapColumns + 1;


checkDiagonalNeighbors(NORTH_WEST, northWestMostCell, MasterMap);
checkDiagonalNeighbors(NORTH_EAST, northEastMostCell, MasterMap);
checkDiagonalNeighbors(SOUTH_EAST, southEastMostCell, MasterMap);
checkDiagonalNeighbors(SOUTH_WEST, southWestMostCell, MasterMap);


console.log('\n');
console.log(`Map Rows: ${JSON.stringify(MasterMap.maxRows)}`);
console.log(`Total Cells in Map: ${JSON.stringify(MasterMap.masterCellArray.length)}`);



// const GlobalMapObject = new MapObject(0, 0, []);

// console.log(`GlobalMapObject: ${GlobalMapObject.objectProps()}`);


// const globalMapArray = generateMapGrid(10, 2);
// console.log(`globalMapArray:${JSON.stringify(globalMapArray)}`);


// console.log(`GlobalMapObject: ${GlobalMapObject.objectProps()}`);

// for(let i=0; i < a.length; i++) {
// 	console.log(`i:${i}`);
// 	const findValue = (i%a.length)-1;
// 	console.log(`findValue:${findValue}`);
// 	const foundAValue = a[findValue];
// 	console.log(`foundAValue:${foundAValue}`);
// }



module.exports = {
	MainGrid: MasterMap
};