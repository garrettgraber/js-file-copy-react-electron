import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import Button from '@mui/material/Button';

import { addCopyItem } from '../actions/actions.js';

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

	// console.log('CurrentItem: ', CurrentItem);

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
				style={{margin: 0, border: 'none', backgroundColor: 'black', color: '#2f8ca3', width: '100%', height: 43, fontSize: 16, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
				onClick={folderItemClick}
				data-id={id}
				data-name={name}
				data-path={path}
				data-isafile={isAFile}
				data-isadirectory={isADirectory}
				data-tooltip-id={id}
				data-tooltip-position-strategy={'fixed'}
				data-tooltip-place={'top-start'}
			>
				{CurrentItem.name}
			</button>
			<Tooltip
			  id={id}
			  content={path}
			  events={['hover']}
			/>

			<Button size="small" style={{float:'right',marginRight: 10, marginTop: 5, marginBottom: 5, backgroundColor: '#2f8ca3', borderRadius: 2, color: 'black'}} onClick={copyItem}>Copy</Button>
		</div>
	);

};


export default FolderItemToCopy;
