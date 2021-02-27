`use strict`;

let gameboard = (function(){
  const x = 1;
  const o = 0;
  let blocks = [false, false, false, false, false, false, false, false, false];
  let players = ["O", "X"];
  let setBlock = function(turn, block) {
    if(blockStatus(block) != false){
      return;
    }
    if(turn % 2 == 0){
      player = 0;
    } else {
      player = 1;
    }
    blocks[block] = players[player];
    render.updateBlock(block, player);
    if(turn >= 4 /*Turns start at 0. Incrementation for turns happens after setBlocks is called*/){
        let result = logic.winChecker(block, player);
        if(result === 0 || result === 1){
          if(confirm("Would you like to play again?")){
            location.reload();
          } else {
            location.replace('_blank');
          }
        }
    }
  }
  function blockStatus(blockNumber) {
    return blocks[blockNumber];
  }
  return {
    blockStatus,
    setBlock,
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
  function updateBlock(block) {
    newDivs[block].textContent = gameboard.blockStatus(block);
  }

  return {
    updateBlock, //updateBlock : updateBlock,
  };
})();


let elementBinder = (function() {
  let allBlocks = document.querySelectorAll(`.blocks`);
  let ii = 0;
  let turns = 0;
  allBlocks.forEach(function(div){
    let plugin = ii; //make sure to define this outside of the addEventListener because then it's value will be computed at initiation rather than at the time of call
    div.addEventListener(`click`, function(){
      gameboard.setBlock(turns, plugin);
      turns++; //turns is here because we only want to increment it when the entire function is called, NOT at initiation
    });
    ii++;
  });
})();


let logic = (function() {
  function winChecker(block, player) {
    if(rowChecker(block) || columnChecker(block)){
      return player;
    }
    return false;
  }
  function rowChecker(block) {
    let row = (block < 3) ? 1 : (block < 6) ? 2 : 3;
    let row1st = 3 * (row - 1);
    if((gameboard.blockStatus(row1st) == gameboard.blockStatus(row1st + 1)) && (gameboard.blockStatus(row1st) == gameboard.blockStatus(row1st + 2))) {
      return true;
    }
    return false;
  }
  function columnChecker(block) {
      let column = (block + 1) % 3 || 3;
      let colum1st = column - 1;
      if((gameboard.blockStatus(colum1st) == gameboard.blockStatus(colum1st + 3)) && (gameboard.blockStatus(colum1st) == gameboard.blockStatus(colum1st + 6))) {
        return true;
      }
      return false;
  }
  return {
    winChecker, //winChecker: winChecker,
  }
})();
