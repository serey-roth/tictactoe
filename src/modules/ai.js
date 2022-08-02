import * as controller from './gameController'

let aiPrecision = 0;

export const setAiPercentage = (percentage) => {
    aiPrecision = percentage;
}

export const getAiPercentage = () => {
    return aiPrecision;
}

const getEmptySquareIndices = (squares) => {
    return [0,1,2,3,4,5,6,7,8].filter(i =>
        squares[i] === null);
}

export const chooseSquare = (squares) => {
    const value = Math.floor(Math.random() * (100 + 1));
    let choice = null;
    if (value <= aiPrecision) {
        choice = minimax(squares, controller.getAiSign()).index;
        if (squares[choice] != null) {
            return 'error';
        }
    } else {
        const emptySquaresIdx = getEmptySquareIndices(squares);
        let noBestMove = Math.floor(Math.random() * emptySquaresIdx.length);
        choice = emptySquaresIdx[noBestMove];
    }
    return choice;
}

const findBestMove = (moves, playerSign) => {
    let bestMove;
    if (playerSign === controller.getAiSign()) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

const minimax = (squares, playerSign) => {
    let empty = getEmptySquareIndices(squares)
    if (controller.checkForDraw(squares)) {
        return {
            score: 0,
        };
    } else if (controller.checkForWinner(squares)) {
        if (playerSign === controller.getHumanSign()) {
            return {
                score: 10,
            };
        } else if (playerSign === controller.getAiSign()) {
            return {
                score: -10,
            };
        }
    }
    let moves = [];
    for (let i = 0; i < empty.length; i++) {
        let move = {};
        move.index = empty[i];

        //Change the field value to the sign of the player
        if (squares[empty[i]] === null) {
            squares[empty[i]] = playerSign;
        }

        //Call the minimax with the opposite player
        if (playerSign === controller.getHumanSign()) {
            let result = minimax(squares, controller.getAiSign());
            move.score = result.score;
        } else {
            let result = minimax(squares, controller.getHumanSign());
            move.score = result.score;
        }

        //Reset the filled value set before
        squares[empty[i]] = null;
        moves.push(move);
    }

    //find the best move
    return findBestMove(moves, playerSign);
}