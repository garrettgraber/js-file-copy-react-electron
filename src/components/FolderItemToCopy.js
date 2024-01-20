import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCopyItem } from '../actions/copyAction.js';

const FolderItemToCopy = props => {
	const dispatch = useDispatch();
	const {
		CurrentItem,
		folderItemClick
	} = props;

	const {
		id,
		name,
		path,
		isAFile,
		isADirectory
	} = CurrentItem;

	const FolderItemStyles = {
		border: '1px solid #0FFF50',
		// paddingTop: 10,
		// paddingBottom: 10,
		display: 'flex'
	};

	console.log('CurrentItem: ', CurrentItem);

	const copyItem = e => {
		console.log('item to copy: ', e);
		console.log('CurrentItem to copy: ', CurrentItem);
		dispatch(addCopyItem(CurrentItem));
	};

	useEffect(() => {
 
    // Clean the listener after the component is dismounted
    return () => {

    };
	}, []);

	return (
		<div
			style={FolderItemStyles}
		>
			<button
				style={{margin: 0, border: 'none', backgroundColor: 'black', color: '#2f8ca3', width: 300, height: 43, fontSize: 16}}
				onClick={folderItemClick}
				data-id={id}
				data-name={name}
				data-path={path}
				data-isafile={isAFile}
				data-isadirectory={isADirectory}
			>
				{CurrentItem.name}
			</button>
			<button style={{float:'right',marginRight: 10, marginTop: 10, marginBottom: 10, backgroundColor: '#2f8ca3', borderRadius: 2}} onClick={copyItem}>Copy</button>
			{/*<input style={{float:'left',marginLeft: 10}} type="checkbox" name="copy"/>
    	<label for="copy">{CurrentItem.name}</label>*/}
		</div>
	);

};


export default FolderItemToCopy;
