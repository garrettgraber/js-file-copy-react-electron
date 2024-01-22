import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

const FolderItem = props => {

	const {
		CurrentItem,
		folderItemClick
	} = props;

	const {
		name,
		path,
		id,
		isAFile,
		isADirectory
	} = CurrentItem;

	const FolderItemStyles = {
		border: '1px solid #0FFF50',
		paddingTop: 10,
		paddingBottom: 10,
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		cursor: 'default'
	};

	useEffect(() => {
 
    // Clean the listener after the component is dismounted
    return () => {

    };
	}, []);

	return (
		<div>
			<div
				style={FolderItemStyles}
				onClick={folderItemClick}
				data-name={name}
				data-path={path}
				data-isafile={isAFile}
				data-isadirectory={isADirectory}
				data-tooltip-id={id}
				data-tooltip-position-strategy={'fixed'}
				data-tooltip-place={'top-end'}
			>
				{CurrentItem.name}
				<Tooltip
				  id={id}
				  content={path}
				  events={['hover']}
				/>
			</div>
		</div>
	);

};


export default FolderItem;
