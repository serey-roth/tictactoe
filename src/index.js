import React from 'react';
import ReactDOM from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import './index.css';
import Select from 'react-select'
import * as controller from './modules/gameController'
import * as ai from './modules/ai'

function GameSelect(props) {
    const options = [
        { value: 0, label: 'Easy' },
        { value: 1, label: 'Medium' },
        { value: 2, label: 'Hard' },
        { value: 3, label: '2-player' }
    ];
    return (
        <Select 
        value={options[props.value]}
        className={props.className}
        onChange={props.onChange} 
        options={options} />
    );
}

function Square(props) {
    return (
        <button 
        className={props.className}
        onClick={props.onClick}>
          {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, name='square') {
      return <Square 
      className={name}
      value={this.props.squares[i]}
      key={i}
      onClick={() => this.props.onClick(i)} />;
    }
  
    render() {
        const winner = this.props.winnerSquares
        const squares = [];
        for (let r = 0; r < 3; r++) {
            let row = [];
            for (let c = 0; c < 3; c++) {
                let index = 3 * r + c;
                if (winner && winner.includes(index)) {
                    row.push(this.renderSquare(index, 'square winSquare'));
                } else {
                    row.push(this.renderSquare(index));
                }
            }
            squares.push(
                <div className="board-row" key={r}>
                {row}
                </div>
            );
        }
        return (
            <div>            
            {squares}
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            isAscending: true,
            gameMode: 0,
            ai: true,
        }
        //if these are not bound, then in the call back, this will be undefined
        this.handleClick = this.handleClick.bind(this);
        this.handleSortToggle = this.handleSortToggle.bind(this);
        this.handleChangeGameMode = this.handleChangeGameMode.bind(this);
    }

    reset(modeValue) {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
                move: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            isAscending: true,
            gameMode: modeValue,
            ai: modeValue !== 3,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (controller.checkForWinner(squares) || squares[i]) {
            return;
        }
        if (this.state.ai) {
            squares[i] = 'X';
            const aiSquare = ai.chooseSquare(squares);
            squares[aiSquare] = 'O';
        } else {
            squares[i] = this.state.xIsNext ? 'X' : 'O';
        }
        console.log(squares)
        this.setState({
            history: history.concat([{
                squares: squares,
                move: i
            }]),
            xIsNext: this.state.ai ? true : !this.state.xIsNext,
            stepNumber: history.length,
        });// the Game will render every time this is called
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    //return location of given move in (col, row)
    getLocation(move) {
        const history = this.state.history; 
        const current = history[move];
        const index = current.move;
        return `(${index % 3}, ${Math.floor(index / 3)})`;
    }

    handleSortToggle() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    handleChangeGameMode(mode) {
        switch(mode.value) {
            case 0: ai.setAiPercentage(0); break;
            case 1: ai.setAiPercentage(50); break;
            case 2: ai.setAiPercentage(100); break;
            default: break;
        }
        this.reset(mode.value);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = controller.checkForWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ? 
            'Go to move# ' + move + ` ${this.getLocation(move)}`:
            'Go to game start';
            return (
                <li key={move}>
                    <button 
                    className={move === this.state.stepNumber ? 
                        `move-list-item selected` : 
                        `move-list-item`}
                    onClick={() => {this.jumpTo(move)}}>
                    {desc}
                    </button>
                </li>
            );
        });

        if (!this.state.isAscending) {
            moves.reverse();
        }

        let status;
        if (winner) {
            if (this.state.ai) {
                status = 'Winner: ' + (current.squares[winner[0]] === 'X' ?
                'You' : 'AI');
            } else {
                status = 'Winner: ' + current.squares[winner[0]];
            }
        } else if (controller.checkForDraw(current.squares)) {
            status = `It's a draw!`;
        } else {
            if (this.state.ai) {
                status= `You: ${controller.getHumanSign()}; 
                AI: ${controller.getAiSign()}`;
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className="container">
                <div className="header">
                    <h1>tic.tac.toe</h1>
                </div>            
                <div className="game">
                    <div className="game-board">
                        <GameSelect 
                            value={this.state.gameMode}
                            className="game-modes" 
                            onChange={this.handleChangeGameMode}
                        />
                        <Board
                            squares={current.squares}
                            winnerSquares={winner}
                            onClick={this.handleClick}
                        />
                        <button
                            id="restartBtn"
                            onClick={this.reset.bind(this, 0)}>
                            Restart Game
                        </button>
                    </div>
                    <div className="game-info">
                        <div className="status">{status}</div>
                        <p>Moves:</p>
                        <div className="game-moves">
                            <ol className="move-list">{moves}</ol>
                            <button
                                id="sortMovesToggleBtn"
                                onClick={this.handleSortToggle}>
                                <FontAwesomeIcon icon={faSort}/>
                        </button>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    Copyright &copy; 2022 Serey Roth
                    <a target="_blank" href="https://github.com/serey-roth/tictactoe" 
                    rel="noreferrer">Source</a>
                </div>
            </div>
        );
    }
}
  
// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);