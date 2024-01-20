
function MapCell(props) {
	// console.log('props: ', props);
	const { color } = props;
	// console.log('color: ', color);
	const cellLength = 15;
	const MapCellStyle = {
		backgroundColor: color,
		height: cellLength,
		width: cellLength,
		display: 'inline-block'
	};
  return (
    <div className="MapCell" style={MapCellStyle}>

    </div>
  );
}

export default MapCell;
