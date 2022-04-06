// pseudo code
// int variable for player turn 0 or 1
// int varia
// variable array for all my boxes
// array variable for all the sides of the boxes
// add event listener for whenever a side gets clicked
// add event listener to reset button that calls restart game function that will start the game from scratch 
// when an uncolored side gets clicked check whether or not the side is the last side of a cooresponding box
// if so color box and side to player's color and add 1 to that player's score
// if not just change side's color to player's color
// when all boxes are colored end game and display message with info about who won
// call restart game function


// Idea for connecting boxes to edges
// make 2d array to represent center boxes initialize with zero
//   |_|  set vertical edges(pipes) with id v00 v01 foramt(v - vertocal, row number, col number)
// whenever you come across vertical edge you extract column number
// then add 1 to to center box before (if column number is not 0) and 1 to center box after(if column number is not n)
// similar thing for the horizontal edges e.g. h00 h01 format(h - horizontal, row number, column number)

