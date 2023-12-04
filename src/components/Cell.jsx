function Cell(props) {
    return (
        <div className={"board-cell" + " player" + props.cellValue} id={props.id} onClick={(e) => props.onCellClick(e.currentTarget.id)}>
            {props.cellValue === null ? " " : props.cellValue}
        </div>
    )
}

export default Cell;