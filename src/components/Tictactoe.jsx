import { useState, useEffect } from "react";
import axios from "axios";
import Cell from './Cell';
import '../styles/tictactoe.css'

const Empty = null;
const X = "X";
const O = "O";

function getNextPlayer(board) {
    // get parameters and return players turn
    /* get optimal move 
     */ 
    let countX = 0;
    let countO = 0;
    for (let i = 0; i < board.length; i++) {
        countX += board[i].filter(c => c === X).length
        countO += board[i].filter(c => c === O).length
    }
    
    return countX <= countO ? X : O;
}

async function fetchOptimalMove(boardData) {
    let url = 'http://127.0.0.1:8000/optimalmove/'
    // let url = '/optimalmove/'
    const data = await axios.post(url, {board: boardData});
    return data;
}

function Tictactoe(){
    const boardInitialState = [[Empty, Empty, Empty], [Empty, Empty, Empty], [Empty, Empty, Empty]];
    const [board, setBoard] = useState(boardInitialState);
    const [humanSymbol, setHumanSymbol] = useState('');
    const [winner, setWinner] = useState(null);
    
    useEffect(() => { 
        let ignore = false;
        setBoard(board);

        // If it is machines turn and there is not winner yet, fetch AI move 
        if (humanSymbol !== getNextPlayer(board) && humanSymbol !== '' && winner === null) {
                fetchOptimalMove(board).then((response) => {
                setTimeout(() => { // set time out just for animation 
                    if (!ignore) {
                        if (response.data.optimalAction !== null) {
                            var aiMove = response.data.optimalAction;
                            updateBoard(aiMove[0], aiMove[1]);
                        }
                        if (response.data.terminalBoard) {
                            switch (response.data.winner) {
                                case X:
                                case O:
                                    setWinner(response.data.winner);
                                    break;
                                default:
                                    setWinner('TIE');
                            }
                        } 
                    }
                }, 600)
                
            });
        }
        
        return (() => {
            ignore = true;
        });
    }, [board, humanSymbol, winner] );

    function updateBoard(i,j) {
        setBoard((previousBoard) => {
            var newBoard = [...previousBoard];
            newBoard[i][j] = getNextPlayer(previousBoard);
            return newBoard
        });
    }

    function handleCellClick(cellId) {
        let [i,j] = cellId.match(/[\d]/g);
        if (board[i][j] === Empty) {
            updateBoard(i, j);
        }
    }

    function restartGame() {
        setHumanSymbol('');
        setBoard(boardInitialState);
        setWinner(null);
    }

    // Render cells 
    let renderCells = [];

    for (let i = 0; i < board.length; i++) {
        renderCells.push(
            board[i].map((cell, index) => <Cell cellValue={cell} id={`cell${i}-${index}`} key={`cell(${i},${index})`} onCellClick={handleCellClick} />)
        )
    }

    return (
        <>
            {humanSymbol === '' ?
                <div className="playerButtonContainer">
                    <div className='button' onClick={(e) => setHumanSymbol(X)}
                    > PLAY X
                    </div>
                    <div className='button' onClick={(e) => setHumanSymbol(O)}
                    > PLAY O
                    </div>
                </div>
                : 
                <>
                    <div className='button' onClick={(e) => {restartGame()}}
                    > Restart game
                    </div>
                    {humanSymbol === getNextPlayer(board) ? <p>It's your turn: </p> : <p>Computer thinking (caculating AI move)...</p>}
                    {winner !== null ?
                    <div className="banner"><p>
                        { winner === "TIE" ? 
                            "TIE!"
                            : winner === humanSymbol ?
                            "YOU WIN!"
                            : winner !== humanSymbol && winner !== null ?
                            "LOSER!"
                            : <></>
                        }
                    </p></div>
                    : <></>
                    }
                    <div className={winner === null && getNextPlayer(board) === humanSymbol ? "board-container" : "board-container disabled"}>
                        {renderCells}
                    </div>
                </> 
            }
        </>
    )
}

export default Tictactoe;