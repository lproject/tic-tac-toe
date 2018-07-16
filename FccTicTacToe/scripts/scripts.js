$(document).ready(function() {
  //Setting up vars
  var yourWins = document.getElementById("wins");
  var myWins = document.getElementById("winsMachine");
  //setup choice question
  $("body").append("<div id='question'></div>");
  var questionString = "<p>Do you want X's or O's?</p>";
  var buttonsXO =
    "<ul><li><button id='xButton'>X</button></li><li><button id='oButton'>O</button>";
  $("#question").append(questionString + buttonsXO);
  var question = document.getElementById("question");
  var questionOffSetWidth = question.offsetWidth;
  $("#question").css("left", `calc(50vw - ${questionOffSetWidth / 2}px)`);

  //setup player id. player is opperator and player2 is machine or second opperator
  var player1;
  var player2;
  $("#xButton").click(function() {
    player1 = new player("X");
    player2 = new player("O");
    $("#question").detach();
    $("#letsPlay").click(game.startPlayer);
    // console.log(player1.id);
  });
  $("#oButton").click(function() {
    player1 = new player("o");
    player2 = new player("x");
    $("#question").detach();
    $("#letsPlay").click(game.startPlayer);
    // console.log(player1.id);
  });

  //game
  function player(id) {
    this.id = id;
    this.plays = [];
    this.wins = [];
    this.didIWin = function() {
      for (let i = 0; i < game.winningConditions.length; i++) {
        if (
          this.plays.includes(game.winningConditions[i][0]) &&
          this.plays.includes(game.winningConditions[i][1]) &&
          this.plays.includes(game.winningConditions[i][2])
        ) {
          this.wins.push(game.id);
          if(this == player1){
            if(yourWins.hasChildNodes()){
            $("h1",yourWins).remove();
            }
            $(yourWins).append(`<h1>${this.wins.length}</h1>`);
          } else{
            if(myWins.hasChildNodes()){
              $("h1",myWins).remove();
              }
              $(myWins).append(`<h1>${this.wins.length}</h1>`);
          }

          $("body").append(
            `<h1 id='winner'>${this.id} Won ${this.wins.length}!</h1>`
          );
          // console.log($("#winner"));
          $(`#winner`).fadeOut(2500, function() {
            this.remove();
            game.clearBoard();
            game.startPlayer();
          });
          player1.plays = [];
          player2.plays = [];
          game.setId();

          return true;
        }
      }
    };
  }

  var game = {
    startPlayer: function() {
      var rand = Math.floor(Math.random() * 10);
      var first = rand < 5 ? player1 : player2;
      if (first === player1) {
        $("#letsPlay").after(`<p id="goInfo">You go First</p>`);
        $("#goInfo").fadeOut(3500);
      } else {
        $("#letsPlay").after(`<p id="goInfo">I'm going First</p>`);
        $("#goInfo").fadeOut(3500);
      }
      if ($("#letsPlay").click) {
        $("#letsPlay").off("click").hide();
        $("#board").css("margin-top", "2em");
      }
      game.setCurrentPlayer(first);
      if(game.currentPlayer == player2){
        var firstPlayTimeOut = setTimeout(game.player2Go,2000);
      }
    },
    currentPlayer: "",
    setCurrentPlayer: function(thisPlayer) {
      this.currentPlayer = thisPlayer;
    },
    board: ["a0", "a1", "a2", "b0", "b1", "b2", "c0", "c1", "c2"],
    winningConditions: [
      ["a0", "a1", "a2"],
      ["b0", "b1", "b2"],
      ["c0", "c1", "c2"],
      ["a0", "b0", "c0"],
      ["a1", "b1", "c1"],
      ["a2", "b2", "c2"],
      ["a0", "b1", "c2"],
      ["a2", "b1", "c0"]
    ],
    id: 1,
    setId: function() {
      this.id += 1;
    },
    //computer play
    player2Go: function() {
      //possible win vectors of computer
      var opponentFilter = game.winningConditions.filter(function(cur) {
        if (
          player1.plays.includes(cur[0]) ||
          player1.plays.includes(cur[1]) ||
          player1.plays.includes(cur[2])
        ) {
          return true;
        }
      });
      //computer win vectors that need blocking
      var myBlockFilter = opponentFilter.filter(function(cur) {
        if (
          !player2.plays.includes(cur[0]) &&
          !player2.plays.includes(cur[1]) &&
          !player2.plays.includes(cur[2])
        ) {
          return true;
        }
      });
      //possible win vectors of human player
      var myFilter = game.winningConditions.filter(function(cur) {
        if (
          player2.plays.includes(cur[0]) ||
          player2.plays.includes(cur[1]) ||
          player2.plays.includes(cur[2])
        ) {
          return true;
        }
      });
      //priority1 is moves to win
      var priority1 = [];
      for (let k = 0; k < myFilter.length; k++) {
        //find out if human play is blocked
        if(player1.plays.includes(myFilter[k][0]) ||
        player1.plays.includes(myFilter[k][1]) ||
        player1.plays.includes(myFilter[k][2])){
          continue;
        }
        priority1.push([]);
        //filtering out the already made plays of win vector
        myFilter[k].forEach(function(cur) {
          if (!player2.plays.includes(cur)) {
            priority1[priority1.length - 1].push(cur);
          }
        });
      }
      //priority2 is moves to block
      var priority2 = [];
      for (let l = 0; l < myBlockFilter.length; l++) {
        priority2.push([]);
        myBlockFilter[l].forEach(function(cur) {
          if (!player1.plays.includes(cur)) {
            priority2[l].push(cur);
          }
        });
      }
      function play(){
        var a = priority1.filter(cur => cur.length == 1);
        
        var b = priority2.filter(cur => cur.length == 1);
        
        var c = player1.plays.concat(player2.plays);

        var d = game.board.filter(function(cur){
          return !(c.includes(cur));
        });

        var e = priority2.reduce(function(a,b){
          return a += b.length;
        },0);
        //first play
        if(player1.plays.length == 0 && player2.plays.length == 0){
          console.log(1);
          return ["b1"];
        }
        //first move after opponent first move
        if(player1.plays.length == 1 && player2.plays.length == 0){
          console.log(8);
          console.log(c);

          if(!c.includes("b1")){
            return d.filter(cur => cur == "b1");
          } else{
            var secondChoice = ["a0","c0","a2","c2"];
            var secondChoiceRandom = Math.floor(Math.random() * 4);
            return secondChoice[secondChoiceRandom];
          }
        }
        //two  plays in a row so play to win
        
        else if(a.length > 0){
          console.log(2);
          return a[0];
        }
        //Two opponent plays in a row so block
        
        else if(b.length > 0){
          console.log(3);
          return b[0];
        }
        
        else if(e % 2 == 0 && priority1.length > 0 && priority2.length > 0){
          var randomMain = 0;
          var randomMinor = 0;
          randomMain = Math.floor(Math.random() * priority1.length);
          randomMinor = Math.floor(Math.random() * priority1[randomMain].length);
          console.log(4);
          console.log(priority1[randomMain][randomMinor])
          return priority1[randomMain][randomMinor];
        }
        //no plays to block so play one to win
        else if(priority2.length == 0 && priority1.length > 0){
          var randomMain1 = 0;
          var randomMinor1 = 0;
          randomMain1 = Math.floor(Math.random() * priority1.length);
          randomMinor1 = Math.floor(Math.random() * priority1[randomMain1].length);
          console.log(5);
          return priority1[randomMain1][randomMinor1];
        }
        else if(priority1.length == 0 && priority2.length == 0){
          console.log(6);
          return d;
        }
        else if(player2.plays.length > 0){
          var randomMain2 = 0;
          var randomMinor2 = 0;
          randomMain2 = Math.floor(Math.random() * priority2.length);
          randomMinor2 = Math.floor(Math.random() * priority2[randomMain2].length);
          console.log(7);
          return [priority2[randomMain2][randomMinor2]];
        }
        
      }
      
      //console.log(myFilter);
      console.log(priority1);
      console.log(priority2);
      //console.log(myBlockFilter);
      var preSpace = play();
      var space = typeof preSpace == "string"? preSpace : preSpace[0];
      console.log(space);
      console.log(typeof space);
      var go = document.getElementById(space);
      console.log(go);
      go.click();
    },
    clearBoard: function() {
      $("#board div h1").remove();
    },

    playSpace: function() {
      if (this.childNodes.length > 1) {
        return;
      }
      $(this).append(`<h1 class="gamePiece">${game.currentPlayer.id}</h1>`);
      if (game.currentPlayer === player1) {
        player1.plays.push(this.dataset.location);
        player1.didIWin();
      } else {
        player2.plays.push(this.dataset.location);
        player2.didIWin();
      }
      function draw() {
        var tempArr = [];
        tempArr = player1.plays.concat(player2.plays);
        var tempDraw = [];
        for (let j = 0; j < game.board.length; j++) {
          if (!tempArr.includes(game.board[j])) {
            break;
          } else if (j === game.board.length - 1) {
            $("body").append(`<h1 id='winner'>DRAW!</h1>`);
            $(`#winner`).fadeOut(2500, function() {
              this.remove();
              game.clearBoard();
              game.startPlayer();
            });
            player1.plays = [];
            player2.plays = [];
            game.setId();
          }
        }
      }
      draw();
     
      game.currentPlayer = game.currentPlayer === player1 ? player2 : player1;
      if(game.currentPlayer == player2){
        var timeout = setTimeout(game.player2Go,2000);
      }
    }
    
  };

  $("#board div").click(game.playSpace);
  //$("#letsPlay").click(game.startPlayer);
});
