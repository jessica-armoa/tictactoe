let currentPlayer = "X";
let gameEnd = false;
let playerNames = ["X","O"];
const restart = document.getElementById('btnRestart');
const result = document.getElementById('result');
const inputs = document.querySelectorAll('.playerNames');
const saveNames = document.getElementById('btnSave');
const ranking = document.getElementById('ranking');
const cells = document.querySelectorAll(".cells");

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let scoreboard = {};
getScoreboard();
updateRanking();


/*Logica general */
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (cell.textContent === "") {
      cell.textContent = currentPlayer;
      if (checkWin()) {
        gameEnd = true;
        let ganador = currentPlayer === "X" ? playerNames[0] : playerNames[1];
        result.innerHTML = (`<p id="result">Ganó ${ganador}!</p>`);
        updateScoreboard(ganador);
      } else if (checkTie()) {
        gameEnd = true;
        result.innerHTML = (`<p id="result">Excelente juego, es un empate!</p>`);
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    }
    if (gameEnd) {
      return;
    }
  });
});

function checkWin() {
  //en base a nuestra constante winConditions verificamos si la posición del tablero muestra alguna victoria.
  return winConditions.some(condition => {
    return condition.every(index => {
      return cells[index].textContent === currentPlayer;
    });
  });
}

function checkTie() {
  //en base a nuestras celdas del tablero verificamos que todas las celdas estén ocupadas por alguna ficha.
  return Array.from(cells).every(cell => {
    return cell.textContent !== "";
  });
}

/*Reinicio del juego*/
restart.addEventListener('click', reiniciar);
function reiniciar(){
  Array.from(cells).forEach(cell => {
    cell.textContent = "";
  });
  result.innerHTML = '<p id="result"></p>';
  currentPlayer = "X";
}

/*Para guardar los nombres*/
saveNames.addEventListener('click',() => {
  if (!inputs[0].value || !inputs[1].value) {//Si esta vacio algun campo
    document.getElementById("error").style.display = "block"; //mostrar error
  }else{
    playerNames = [inputs[0].value, inputs[1].value];
    document.getElementById("error").style.display = "none";
  }
  console.log(playerNames);
});

/*Para crear el ranking*/
function updateScoreboard(ganador) {
  // Actualizar el scoreboard
  if (!scoreboard.hasOwnProperty(ganador)) {
    scoreboard[ganador] = 1;
  } else {
    scoreboard[ganador]++;
  }

  // Guardar los datos en localStorage
  localStorage.setItem('scoreboard', JSON.stringify(scoreboard));

  // Actualizar la tabla de ranking
  updateRanking();
}

//Funcion para actualizar la tabla de ranking
function updateRanking() {
  ranking.innerHTML = "";
  const players = Object.entries(scoreboard).map(([jugador, victorias]) => ({ jugador, victorias }));
  players.sort((a, b) => b.victorias - a.victorias);
  for (const { jugador, victorias } of players) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = jugador;
    const winsCell = document.createElement('td');
    winsCell.textContent = victorias;
    row.appendChild(nameCell);
    row.appendChild(winsCell);
    ranking.appendChild(row);
  }
}

// Función para obtener los datos del scoreboard desde localStorage
function getScoreboard() {
  const scoreboardData = localStorage.getItem('scoreboard');
  if (scoreboardData) {
    scoreboard = JSON.parse(scoreboardData);
  }
}