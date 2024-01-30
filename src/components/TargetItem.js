import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

const TargetItem = props => {

	const copyCollection = useSelector((state) => state.copyCollection);
	const copyAllItems = useSelector((state) => state.copyAllItems);

	const [isInCopyArray, setIsInCopyArray] = useState(false);

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

		const itemIsInCopyCollection = copyCollection.some(Item => Item.id === id);
		if(itemIsInCopyCollection) {
			setIsInCopyArray(true);
		} else {
			setIsInCopyArray(false);
		}

		if(copyAllItems) {
			// console.log('Copying Items: ', copyCollection);
		}
 
    // Clean the listener after the component is dismounted
    return () => {

    };
	}, []);

	const FolderItemTargetStyle = {};
	const FolderItemTargetIsCopyingStyle = {
		backgroundColor: 'red'
	};

	const TargetCopyItemStyle = isInCopyArray ? FolderItemTargetIsCopyingStyle : FolderItemTargetStyle;

	return (
		<div style={TargetCopyItemStyle} disabled={isInCopyArray}>
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


export default TargetItem;
