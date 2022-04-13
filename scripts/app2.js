// pseudo code
// int variable for player turn 0 or 1
// int variable
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
// when 2d array pos for the center box == 4 then I color entire box
const startButton = document.querySelector('.startButton');
const sliders = document.querySelectorAll('.slider');
const firstLayer = document.querySelector('.firstLayer');
const secondLayer = document.querySelector('.secondLayer');
const playerColors = ['red', 'blue'];
const twoPlayer = document.querySelector('#twoPlayer');
const computer = document.querySelector('#computer');
const rulePopup = document.querySelector('.rules');
const showRules = document.querySelector('#rulesButton');
const resetButton = document.querySelector('#resetButton');
let dots = document.querySelectorAll('.dots');
let horizontalEdges = document.querySelectorAll('.hEdge');
let verticalEdges = document.querySelectorAll('.vEdge');
let computerActive = computer.checked;
let playerColorIndex = 0;
let gameMatrix = [];
let aiMatrix = [];
let redPlayerScore = 0;
let bluePlayerScore= 0;
let moves = 0;
let numOfMoves = 0;
let rowSize = 0;
let colSize = 0;
const redScore = document.querySelector('#redScore');
const blueScore = document.querySelector('#blueScore');
const gameStatus = document.querySelector('#gameStatus');

startButton.addEventListener('click', () => {
    if(computer.checked || twoPlayer.checked){
        startGame();
    }
});
showRules.addEventListener('click', () => {
    rulePopup.classList.toggle('hide')
});
resetButton.addEventListener('click', () =>{
    console.log('nah');
    console.log(secondLayer);
    firstLayer.classList.toggle('hide');
})
// update slider text as slider is being dragged
sliders.forEach(slider => slider.oninput = function (){
    //console.log(slider.id)
    const label = document.querySelector(`.${slider.id}`);
    //console.log(label);
    if(slider.id == 'rowSlider')
        label.innerText = `Row: ${this.value}`;
    else
        label.innerText = `Column: ${this.value}`;  
} );
function startGame(){
    computerActive = computer.checked;
    // if()
    document.querySelector('.gameboard').remove();
    const gameBoard = document.createElement('div');
    gameBoard.classList.add('gameboard');
    firstLayer.classList.toggle('hide');
    rowSize = sliders[0].value * 2 + 1;
    colSize = sliders[1].value * 2 + 1;
    for(let i = 0; i < rowSize; ++i){
        const currRow = document.createElement('div');
        currRow.classList.add('row' + (i % 2).toString());
        const row = [];
        const aiRow = [];
        for(let j = 0; j < colSize; ++j){
            row.push(0);
            aiRow.push(0);
            const currElement = document.createElement('div');
            if(i % 2 == 0){
                if(j % 2 == 0){
                    currElement.classList.add('dot');
                }
                else{
                    currElement.setAttribute('id', `h-${i}-${j}`)
                    currElement.classList.add('hEdge', 'edge');
                }
            }
            else{
                if(j % 2 == 0){
                    currElement.setAttribute('id', `v-${i}-${j}`)
                    currElement.classList.add('vEdge', 'edge');
                }
                else{
                    currElement.setAttribute('id', `b-${i}-${j}`)
                    currElement.classList.add('box');
                }
            }
            currRow.append(currElement);
            //console.log(row);
        }
        gameMatrix.push([...row]);
        aiMatrix.push([...aiRow]);
        gameBoard.append(currRow);
        secondLayer.append(gameBoard);
    }
    // console.table(gameMatrix);
    dots = document.querySelectorAll('.dots');
    edges = document.querySelectorAll('.edge');
    redScore.style.color = 'red';
    blueScore.style.color = 'blue';
    gameStatus.style.color = 'red';
    numOfMoves = edges.length;
    console.log(edges);
    edges.forEach((edge)=> edge.addEventListener('click', () => {
        changeEdgeColor(edge);
        // console.log('after click', aiMatrix);
        console.log('after click', aiMatrix);
        if(playerColorIndex === 1 && computerActive){
            let moveList = pickMove();
            console.log(`MoveList is: `, moveList);
            setOpponentMoves(moveList);
        }
        if(moves === numOfMoves){
            endGame();
        } 
    })); 
}
// change edged to player color if not colored already
function setOpponentMoves(moveList){

    moveList.forEach((move) =>{
        const currEdge = document.querySelector(`#${move}`);
        console.log(currEdge);
        changeEdgeColor(currEdge);
    })
}
function changeEdgeColor(edge){
    let changePlayerTurn = true;
    if(edge.style.backgroundColor === ''){
        ++moves;
        //console.log('why')
        edge.style.backgroundColor = playerColors[playerColorIndex];
        // check if the edge is the last uncolored edge of a box
        // let edgeId = edge.id;
        let info = edge.id.split('-');
        //console.log(info);
        let edgeRow = parseInt(info[1]), edgeCol = parseInt(info[2]);
        aiMatrix[edgeRow][edgeCol] = 1;
        //console.log(edge.id)
        //check horizontal edges
        if(edge.id[0] === 'h'){
            if(edgeRow + 1 < gameMatrix.length){
                ++gameMatrix[edgeRow + 1][edgeCol];
                ++aiMatrix[edgeRow + 1][edgeCol];
                if(gameMatrix[edgeRow + 1][edgeCol] === 4){
                    const el = document.querySelector(`#b-${edgeRow+1}-${edgeCol}`);
                    // console.log(el);
                    updateScore()
                    changePlayerTurn = false;
                    el.style.backgroundColor = playerColors[playerColorIndex];
                }
            }
            if(edgeRow - 1 >= 0){
                ++gameMatrix[edgeRow-1][edgeCol];
                ++aiMatrix[edgeRow  - 1][edgeCol];
                if(gameMatrix[edgeRow - 1][edgeCol] === 4){
                    const el = document.querySelector(`#b-${edgeRow-1}-${edgeCol}`);
                    // console.log(el);
                    updateScore()
                    changePlayerTurn = false;
                    el.style.backgroundColor = playerColors[playerColorIndex];
                }
            }
        }
        // check vertical edges
        else{
            if(edgeCol + 1 < gameMatrix[0].length){
                ++gameMatrix[edgeRow][edgeCol + 1];
                ++aiMatrix[edgeRow][edgeCol  + 1];
                if(gameMatrix[edgeRow][edgeCol + 1] === 4){
                    const el = document.querySelector(`#b-${edgeRow}-${edgeCol+1}`);
                    // console.log(el);
                    updateScore()
                    changePlayerTurn = false;
                    el.style.backgroundColor = playerColors[playerColorIndex];
                }
            }
            if(edgeCol - 1 >= 0){
                ++gameMatrix[edgeRow][edgeCol - 1];
                ++aiMatrix[edgeRow][edgeCol - 1];
                if(gameMatrix[edgeRow][edgeCol - 1] === 4){
                    const el = document.querySelector(`#b-${edgeRow}-${edgeCol - 1}`);
                    // console.log(el);
                    updateScore()
                    changePlayerTurn = false;
                    el.style.backgroundColor = playerColors[playerColorIndex];
                }
            }
        }
        if(changePlayerTurn){
            playerColorIndex ^= 1;
            gameStatus.innerText = `${playerColors[playerColorIndex]} player's turn`.toUpperCase();
            gameStatus.style.color = playerColors[playerColorIndex];
        }
    }
}
function updateScore(){
    if(playerColorIndex == 0){
        redPlayerScore++;
        redScore.innerText = `Red Score: ${redPlayerScore}`;
    }
    else{
        bluePlayerScore++;
        blueScore.innerText = `Blue Score: ${bluePlayerScore}`;
    }
}
function changeInnerText(element, replacement){
    //console.log(element);
    element.innerText = replacement;
}
function decideWinner(){
    let winnerStatus = '';
    //console.log(bluePlayerScore, redPlayerScore);
    if(bluePlayerScore > redPlayerScore){
        winnerStatus = `Blue Player is the Winner!!`.toUpperCase();
        gameStatus.style.color = 'blue';
    }
    else if(redPlayerScore > bluePlayerScore){
        winnerStatus = `Red Player is the Winner!!`.toUpperCase()
        gameStatus.style.color = 'red';
    }
    else{
        winnerStatus = `TIE!!`
    }
    changeInnerText(gameStatus, winnerStatus);
}
function endGame(){
    decideWinner();
    moves = 0;
    gameActive = false;
    playerColorIndex = 0;
    gameMatrix = [];
    aiMatrix = [];
    redPlayerScore = 0;
    bluePlayerScore = 0;
    setTimeout(()=>{
        firstLayer.classList.toggle('hide');
        changeInnerText(gameStatus, "Red Player's Turn");
        changeInnerText(redScore, `Red score: 0`);
        changeInnerText(blueScore, `Blue score: 0`);
    }, 3000);
}

function pickMove(curr=[]){
    
    let bestMove = [];
    let possibleMove;
    let possibleMoveChance = -1;
    // console.log(curr);
    console.log('in', aiMatrix);
    for(let i = 0; i < rowSize; ++i){
        let j = (i % 2 == 0) ? 1 : 0;
        for(; j < colSize; j+=2){
            if(aiMatrix[i][j] === 0){
                if(bestMove[0] === undefined){
                    let rand = 1 + Math.floor(Math.random() * 101);
                    if(i % 2 == 0){
                        if(rand > possibleMoveChance){
                            possibleMove = `h-${i}-${j}`;
                            possibleMoveChance = rand;
                        }
                    }
                    else{
                        let rand = 1 + Math.floor(Math.random() * 101);
                        if(rand > possibleMoveChance){
                            possibleMove = `v-${i}-${j}`;
                            possibleMoveChance = rand;
                        }
                    }
                }
                aiMatrix[i][j] = 1;
                // console.log('before change', aiMatrix);
                if(isLastEdge(i, j)){
                    addEdge(i, j);
                    let addon = [...curr]
                    if(i % 2 == 0)
                        addon.push(`h-${i}-${j}`);
                    else
                        addon.push(`v-${i}-${j}`)
                    temp = pickMove(addon);
                    removeEdge(i, j);
                    if(temp.length > bestMove.length){
                        bestMove = temp;
                    }
                }
                // console.log('after change', aiMatrix);
                // removeEdge(i, j);
                aiMatrix[i][j] = 0;
            }
        }
    }
    if(bestMove[0] === undefined){
        if(possibleMove !== undefined)
            bestMove = [possibleMove];
    }
    if(bestMove.length > curr.length)
        return bestMove;
    curr.push(...bestMove);
    return curr;
}
function isLastEdge(i, j){
    // console.log('i and j', typeof(i), typeof(j))
    // console.log('before checking', aiMatrix);
    if(i % 2 === 0){
        if(i + 1 < rowSize){
           let numOfMatricies = aiMatrix[i + 1][j] + 1;
            if(numOfMatricies === 4){
               return true;
            }
        }
        if(i - 1 >= 0){
           let numOfMatricies = aiMatrix[i - 1][j] + 1;
            if(numOfMatricies=== 4){
                return true;
            }
        }
    }
    // check vertical edges
    else{
        if(j + 1 < colSize){
           let numOfMatricies = aiMatrix[i][j + 1] + 1;
            if(numOfMatricies === 4){
                return true;
            }
        }
        if(j - 1 >= 0){
           let numOfMatricies = aiMatrix[i][j - 1] + 1;
            if(numOfMatricies === 4){
              return true;
            }
        }
    }
    return false;
}
function addEdge(i, j){
    if(i % 2 === 0){
        if(i + 1 < rowSize){
            ++aiMatrix[i + 1][j];
        }
        if(i - 1 >= 0){
            ++aiMatrix[i - 1][j];
        }
    }
    // check vertical edges
    else{
        if(j + 1 < colSize){
            ++aiMatrix[i][j + 1];
        }
        if(j - 1 >= 0){
            ++aiMatrix[i ][j - 1];
        }
    }
}
function removeEdge(i, j){
    if(i % 2 === 0){
        if(i + 1 < rowSize){
            --aiMatrix[i + 1][j];
        }
        if(i - 1 >= 0){
            --aiMatrix[i - 1][j];
        }
    }
    // check vertical edges
    else{
        if(j + 1 < colSize){
            --aiMatrix[i][j + 1];
        }
        if(j - 1 >= 0){
            --aiMatrix[i ][j - 1];
        }
    }
}
function copy_matrix(matrix){
    let res = [];
    // console.log('copy_matrix', res);
    for(let i = 0; i < rowSize; ++i){
        let row = [...matrix[i]];
        // console.log(row);
        res.push(row);
        // console.log(res);
    }
    // console.log(res);
    return res;

}

