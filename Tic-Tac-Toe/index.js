const boxes = document.querySelectorAll('.box');
const gameInfo = document.querySelector('.game-info');
const newGameBtn = document.querySelector('.btn');



let currentPlayer;
let gameGrid;

const winningPosition = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];


function initGame() {
	gameGrid = ["","","","","","","","",""];
	currentPlayer = "X";

	// do empty boxes on UI
	boxes.forEach((box, index) => {

		// update the UI
		box.innerText = "";

		// enable the click event
		boxes[index].style.pointerEvents = "all";
		
		// remove the bg color
		box.classList = `box box${index + 1}`;

	});

	newGameBtn.classList.remove('active');
	gameInfo.innerText = `Current Player - ${currentPlayer}`;
	
}



function swapTurn() {
	if (currentPlayer === "X") {
		currentPlayer = "O";
	}
	else {
		currentPlayer = "X";
	}

	// UI update
	gameInfo.innerText = `Current Player - ${currentPlayer}`
}

function checkGameOver() {
	let answer = "";

	winningPosition.forEach((position) => {
		// all three boxes should be non-empty and value should be equal
		if ( ( gameGrid[position[0]] !== "" || gameGrid[position[1]] !== "" || gameGrid[position[2]] !== "") &&
			( ( gameGrid[position[0]] === gameGrid[position[1]] ) && (gameGrid[position[1]] === gameGrid[position[2]] ) ) )
		{

			if (gameGrid[position[0]] === "X") {
				answer = "X";
			}
			else {
				answer = "O";
			}


			// disable pointer event
			boxes.forEach((box) => {
				box.style.pointerEvents = "none";
			})

			// now we know who is winner
			boxes[position[0]].classList.add('win');
			boxes[position[1]].classList.add('win');
			boxes[position[2]].classList.add('win');
		}
	});

	// it means we have a winner
	if (answer !== "") {
		gameInfo.innerText = `Winner Player - ${answer}`;
		newGameBtn.classList.add('active');
		return;
	}

	// when there is no winner
	let fillCount = 0;
	gameGrid.forEach((box) => {
		if (box !== "") fillCount++;
	});

	if (fillCount === 9) {
		gameInfo.innerText = 'Game Tied!';
		newGameBtn.classList.add("active");
	}
}

function handleClick(index) {
	if (gameGrid[index] === "") {
		boxes[index].innerText = currentPlayer;
		gameGrid[index] = currentPlayer;

		boxes[index].style.pointerEvents = "none";

		// swap kro turn
		swapTurn();
		
		// check if game is over or not
		checkGameOver();
	}
}

// event listner on boxes on click
boxes.forEach((box, index) => {
	box.addEventListener('click', () => {
		handleClick(index);
	})
});

initGame();
newGameBtn.addEventListener('click', initGame);
