var board = new Array(9);

function init() {

    /* Использование сенсорных событий, если они поддерживаются, в противном случае использовать мышь */
  var down = "mousedown"; var up = "mouseup";
  if ('createTouch' in document) { down = "touchstart"; up ="touchend"; }


    /* Добавить слушателей событий */
  document.querySelector("input.button").addEventListener(up, newGame, false);
  var squares = document.getElementsByTagName("td");
  for (var s = 0; s < squares.length; s++) {
    squares[s].addEventListener(down, function(evt){squareSelected(evt, getCurrentPlayer());}, false);
  }

  
   /* Создаём доску и установливаем начального игрока */ 
  createBoard();
  setInitialPlayer();
}


function createBoard() {
 
    /* Создаём доску из сохраненной версии, если сохраненной версии существует */
  if (window.localStorage && localStorage.getItem('tic-tac-toe-board')) {

    
      /* Разбиваем строку, которая представляет нашу игровую доску в массив */
    board = (JSON.parse(localStorage.getItem('tic-tac-toe-board')));
    for (var i = 0; i < board.length; i++) {
      if (board[i] != "") {
        fillSquareWithMarker(document.getElementById(i), board[i]);// установка в клетку соотв. значения
      }                                                            // из сохранённой в JSON карты
    }
  }
  
    /* В противном случае создаём чистую доску */
  else {
    for (var i = 0; i < board.length; i++) {
      board[i] = "";                             //чистим массив со значениями
      document.getElementById(i).innerHTML = ""; //чистим значения в html
    }
  }
}

function squareSelected(evt, currentPlayer) {
  var square = evt.target; // evt.target содержит клетку, на которую мы нажали
  
    /* Проверяем, если квадрат уже содержит X или O-маркер */
  if (square.className.match(/marker/)) {
    alert("Извините, эта ячейка уже занята, выберите другую");
    return;
  }
  
    /* Если квадрат не отмечен, отметчаем его, обновляем массив, который отслеживает нашу доску, проверяем победителя, и переключатель игроков */
  else {
    fillSquareWithMarker(square, currentPlayer); // заполняем клетку символом текущего игрока
    updateBoard(square.id, currentPlayer); // обновляем доску после нажатия на клетку с id = square.id
    checkForWinner();                      // проверяем, выиграл-ли кто-нибудь
    switchPlayers();                       // меняем игроков
  }
}

// заполняет клетку square значением игрока player
function fillSquareWithMarker(square, player) {
  var marker = document.createElement('div'); // создаём div 
  
    /* Установить имя класса новому div до X-маркера или O-маркера, в зависимости от текущего игрока */
	
  marker.className = player + "-marker"; // устанавливаем у div-а class
  square.appendChild(marker);            //помещаем этот div внутрь td, на который кликнули, О или Х                                                //добавится в css в зависимости от того, какой игрок нажмёт
}                                       

function updateBoard(index, marker) {
  board[index] = marker;

  
    /* Локальное хранилище HTML5 допускает только хранение строк - преобразовываем наш массив в строку */
  var boardstring = JSON.stringify(board); // пихаем все клетки в JSON
 
    /* эта строка для локального хранения, вместе с последним игроком, который отмечен квадратом */
  localStorage.setItem('tic-tac-toe-board', boardstring);
  localStorage.setItem('last-player', getCurrentPlayer());
}


function declareWinner() {
  alert("Вы  выиграли !")
    newGame();
  
}

// проверяет таблицу на непустоту и на равенство 3-х клеток. Если выполнено - объявляем победу
function weHaveAWinner(a, b, c) {
  if ((board[a] === board[b]) && (board[b] === board[c]) && (board[a] != "" || board[b] != "" || board[c] != "")) {
    setTimeout(declareWinner(), 100);
    return true;
  }
  else
    return false;
}

function checkForWinner() {
    /* Проверка строки */
  var a = 0; var b = 1; var c = 2;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=3; b+=3; c+=3;
  }
    /* Проверка столбца */
  a = 0; b = 3; c = 6;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=1; b+=1; c+=1;
  }

    /* Проверка правой диагонали */
  if (weHaveAWinner(0, 4, 8)) {
    return;
  }
  
    /* Проверка левой диагонали */
  if (weHaveAWinner(2, 4, 6)) {
    return;
  }

  
    /* Если нет победителя, но доска заполнена, спросить пользователей, если они хотят,  начать новую игру */
  if (!JSON.stringify(board).match(/,"",/)) {
    alert("Ничья");
      newGame();
    
  }
}

 // возвращает id игрока, у которого в css указан селектор .current-player
function getCurrentPlayer() {
  return document.querySelector(".current-player").id;
}

// Функция проверяет в локальном хранилище последнего игрока
function setInitialPlayer() {
  var playerX = document.getElementById("X"); // Х-игрок
  var playerO = document.getElementById("O"); // О-игрок
  playerX.className = "";                     // обнуляем имена их классов
  playerO.className = "";

    /* Если нет локального хранения, или не последний игрок находится в LocalStorage, всегда устанавливается первым игроком в X по умолчанию */
  if (!window.localStorage || !localStorage.getItem('last-player')) {
    playerX.className = "current-player";
    return;
  }

  var lastPlayer = localStorage.getItem('last-player');
  if (lastPlayer == 'X') {
    playerO.className = "current-player";
  }
  else {
    playerX.className = "current-player";
  }
}

// Меняет игроков, делает крупным имя того игрока, который должен сделать ход
function switchPlayers() {
  var playerX = document.getElementById("X"); // Получили игрока с Х
  var playerO = document.getElementById("O"); // Получили игрока с О

  if (playerX.className.match(/current-player/)) { // если у Х-игрока было имя класса - current-player
    playerO.className = "current-player"; // присваиваем это имя класса О-игроку
    playerX.className = ""; // обнуляем имя класса у Х-игрока
  }
  else {
    playerX.className = "current-player"; // иначе наоборот
    playerO.className = "";
  }
}

function newGame() {
  
    /* Очистить текущее сохранение игры из локального запоминающего устройства */
  localStorage.removeItem('tic-tac-toe-board');
  localStorage.removeItem('last-player');

     /* Создать новую игру */
  createBoard();
}
