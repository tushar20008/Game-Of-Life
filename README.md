Game-Of-Life using Node and Socket
===============================

## Overview
[Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life) is a cellular automation zero player game.

The game is played on an MxN board, where each position in the board (called a 'cell' for purposes of the game) can be 'alive' or 'dead'.

At each step in time, the following transitions occur:

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overcrowding.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

![](https://photos-3.dropbox.com/t/0/AADW_EP6b-vclc9GgnTfTJ5jrLWmX0ScHSHrVWYIS0t_Kg/12/290579252/png/1024x768/3/1409248800/0/2/Screenshot%202014-08-28%2012.06.25.png/mln_7w5A0sDkIH-Q_dflT3iFiBfEQi9wOvJEBmGNOHo)

## How to run
- Clone or download Repository
- Run "npm install" and "node index.js" in the project directory (inside Game-Of-Life folder)
- Open "http://localhost:8080"

## Algorithm Implementation
At each step, the game calculates the status of next generation for each cell. This is done using a naiive algorithm which would check each and every cell on step for a time complexity of O(M*N).
