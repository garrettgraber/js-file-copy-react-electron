import { useState, useEffect } from 'react';

const FolderItem = props => {

	const {
		CurrentItem,
		folderItemClick
	} = props;

	const {
		name,
		path,
		isAFile,
		isADirectory
	} = CurrentItem;

	const FolderItemStyles = {
		border: '1px solid #0FFF50',
		paddingTop: 10,
		paddingBottom: 10
	};

	console.log('CurrentItem: ', CurrentItem);

	useEffect(() => {
 
    // Clean the listener after the component is dismounted
    return () => {

    };
	}, []);

	return (
		<div
			style={FolderItemStyles}
			onClick={folderItemClick}
			data-name={name}
			data-path={path}
			data-isafile={isAFile}
			data-isadirectory={isADirectory}
		>{CurrentItem.name}</div>
	);

};


export default FolderItem;
