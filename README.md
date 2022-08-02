## TicTacToe
A classic Tic-Tac-Toe game, built using ReactJS according to the tutorial on the React.js official website. 

# Properties
* A react-select component which displays several modes of difficulty - easy, medium, hard and 2-player. The first three modes are set up as 'Human vs AI' and run on the 'Minimax' algorithm.  By default, the game is set up on the 'easy' mode.
* A game board which displays the markers as the game progresses
* A button with which the player can restart the game
* A list of moves that the human makes (in the case of 'Human vs AI') or both players make (2-player version) during the game. Each move is displayed as a button and asscoiated with a state of the board. The players can click on a move to time-travel back to its corresponding state of the game. 
* A toggle button that sorts the move list in either ascending or descending order.

# What I learnt
While coding the time-travel portion of the game, I became more familiar with the states of a React component and what happens behind the scenes when we call setState(). My basic understanding of React element rendering and event handling improved as well. 

I also learnt about the top-down approach and its benefits as I passed event handlers and states in the Game component as props for its children. In addition, I got to practice using SOLID principles, especially single-responsibility and task-delegation principles, when I was writing the modules for the AI aspect of the game. 

# Future updates
I plan on incorporating SVG animations for the board and using hooks to delay a marker's display. It will make the game more dynamic and attractive. 
