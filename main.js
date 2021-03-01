`use strict`;

let gameboard = (function(){
  const x = 1;
  const o = 0;
  let turns = 0;
  let blocks = [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `];
  let players = ["O", "X"];
  let playersScore = [0, 0];
  let playersName = ["Player 1", "Player 2"];

  let blockStatus = function(blockNumber) {
    return blocks[blockNumber];
  }

  let updateScore = function(player){
    playersScore[player]++;
    render.loadStats();
  }

  let resetBoard = function(){
    for(i = 0; i < 9; i++){
      blocks[i] = ` `;
      render.loadBlock(i);
    }
    turns = 0;
    render.meltBoard();
  }

  let scoreStatus = function(player){
    return playersScore[player];
  }

  let updateName = function(player, playerElement){
    playersName[player] = playerElement.value;
    render.loadStats();
  }

  let setBlock = function(block) {
    if(blockStatus(block) != ` `){
      return;
    }
    if(turns % 2 == 0){
      player = 0;
    } else {
      player = 1;
    }
    blocks[block] = players[player];
    render.loadBlock(block);
    render.liveUpdate(player, block, 2);
    if(turns >= 4 /*Turns start at 0. Incrementation for turns happens after setBlocks is called*/){
      let result = logic.winChecker(block, player);
      if(result === 0 || result === 1){
        updateScore(result);
        render.freezeBoard();
        render.liveUpdate(player, block, 1);
      }
      if(turns >= 8){
        render.liveUpdate(player, block, 0);
        render.freezeBoard();
      }
    }
    turns++;
  }
  return {
    blockStatus,
    setBlock,
    playersName,
    scoreStatus,
    updateName,
    resetBoard,
  };
})();


let render = (function(){
  let container = document.querySelector(`.boxContainer`);
  let newDivs = [];
  for(i = 0; i < 9; i++){
    newDivs[i] = document.createElement(`div`);
    newDivs[i].classList.add(`blocks`);
    container.appendChild(newDivs[i]);
  }

  let liveUpdate = function(player, block, gameStatus){
    let status = document.querySelector(`.liveUpdate`);
    if(gameStatus == 1 /*for a win*/){
      status.textContent = `${gameboard.playersName[player]} has won!!! Press reset to play again`
    } else if (gameStatus == 2 /*for a non-tie or win*/){
      status.textContent =  `${gameboard.playersName[player]} has choosen block ${block + 1}`;
    } else {
      status.textContent = `Tie. Press reset to play  again`;
    }
  }

  let freezeBoard = function(){
    for(i = 0; i < 9; i++){
      newDivs[i].style.pointerEvents = `none`;
    }
  }

  let meltBoard = function(){
    for(i = 0; i < 9; i++){
      newDivs[i].style.pointerEvents = ``; //sets to default value
    }
  }

  let loadBlock = function(block) {
    newDivs[block].textContent = gameboard.blockStatus(block);
  }

  let loadStats = function(){
    for(i = 0; i < 2; i++){
      scoreBoard = document.querySelector(`.score${i + 1}`);
      scoreBoard.textContent = `${gameboard.playersName[i]}'s Score: ${gameboard.scoreStatus(i)}`;
    }
  }

  return {
    loadBlock, //loadBlock : loadBlock,
    loadStats,
    freezeBoard,
    meltBoard,
    liveUpdate,
  };
})();


let elementBinder = (function() {
  let allBlocks = document.querySelectorAll(`.blocks`);
  let ii = 0;
  let player1Name = document.querySelector(`.name1`);
  let player2Name = document.querySelector(`.name2`);
  let resetBtn = document.querySelector(`.newGameButton`);

  resetBtn.addEventListener(`click`, gameboard.resetBoard); //in addeventlistener you give the function reference, not the result of the function

  player1Name.addEventListener(`change`, function(){
    gameboard.updateName(0, player1Name);
  });

  player2Name.addEventListener(`change`,function(){
     gameboard.updateName(1, player2Name);
  });

  allBlocks.forEach(function(div){
    let plugin = ii; //make sure to define this outside of the addEventListener because then it's value will be computed at initiation rather than at the time of call
    div.addEventListener(`click`, function(){
      gameboard.setBlock(plugin); //this is here because we only want to run the function when the button is clicked, NOT at initiation and assign a value to it
    });
    ii++;
  });
})();


let logic = (function() {
  function winChecker(block, player) {
    if(rowChecker(block) || columnChecker(block) || diagonalChecker()){
      return player;
    }
    return false;
  }

  function rowChecker(block) {
    let row = (block < 3) ? 1 : (block < 6) ? 2 : 3;
    let row1st = 3 * (row - 1);
    if((gameboard.blockStatus(row1st) == gameboard.blockStatus(row1st + 1)) && (gameboard.blockStatus(row1st) == gameboard.blockStatus(row1st + 2))) {
      return true;
    } else {
      return false;
    }
  }

  function columnChecker(block) {
    let column = (block + 1) % 3 || 3;
    let colum1st = column - 1;
    if((gameboard.blockStatus(colum1st) == gameboard.blockStatus(colum1st + 3)) && (gameboard.blockStatus(colum1st) == gameboard.blockStatus(colum1st + 6))) {
      return true;
    } else {
      return false;
    }
  }

  function diagonalChecker() {
    let result = gameboard.blockStatus(4);
    if((gameboard.blockStatus(0) == result) && (gameboard.blockStatus(8) == result) && (result != ` `)){
      return true;
    } else if ((gameboard.blockStatus(2) == result) && (result == gameboard.blockStatus(6)) && (result != ` `)){
      return true;
    } else {
      return false;
    }
  }

  return {
    winChecker, //winChecker: winChecker,
  }
})();
