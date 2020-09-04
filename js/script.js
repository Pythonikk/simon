const synth = new Tone.Synth().toDestination();

const mp3 = document.querySelector('#incorrect');

const yellowBtn = document.querySelector('#yellow');
const blueBtn = document.querySelector('#blue');
const redBtn = document.querySelector('#red');
const greenBtn = document.querySelector('#green');

const startBtn = document.querySelector('#start-btn');
const dropdown = document.querySelector('#drop-down');
const msgPanel = document.querySelector('.msg-panel>p');


const patternLength = 15;
let clickNum = 0;
let pattern = createPattern();
let round = 1;
let difficulty = 1;
let startPat = null;
let trigger = null;


startBtn.addEventListener('click', () => {
	msgPanel.textContent = '🄿 🄻 🄰 🅈 🄸 🄽 🄶';
	if (startPat !== null) {
		restartGame();
	};
	playRoundComp(round, difficulty);
});

yellowBtn.addEventListener('click', () => {
	signalBtn(yellowBtn, 'C#4');
	usrClick('yellow');
});

blueBtn.addEventListener('click', () => {
	signalBtn(blueBtn, 'E5');
	usrClick('blue');
});

redBtn.addEventListener('click', () => {
	signalBtn(redBtn, 'A4');
	usrClick('red');
});

greenBtn.addEventListener('click', () => {
	signalBtn(greenBtn, 'E4');
	usrClick('green');
});

dropdown.onchange = function () {
	switch (dropdown.selectedIndex) {
		case 0:
		difficulty = 0;
		break;

		case 1:
		difficulty = 1;
		break;

		case 2:
		difficulty = 2;
		break;

		case 3:
		difficulty = 3;
	};
};


function signalBtn (button, note) {
	synth.triggerAttackRelease(note, '8n');
	button.classList.add('flash');
	setTimeout(untriggerBtn, 200, button);
};

function untriggerBtn(button) {
	button.classList.remove('flash');
};

function getRandomValues() {
	let int = 0;
	let array = [];
	for (i = 0; i < patternLength; i++) {
		int = Math.floor(Math.random() * 10);
		array.push(int);
	};
	return array;
};

function createPattern() {
	let array = getRandomValues();
	let patArray = [];

	function gamble() {
		let array = ['yellow', 'blue', 'red', 'green'];
		let item = array[Math.floor(Math.random() * array.length)];
		return item;
	};

	function rmvRepeats() {
		for (i = 0; i < patArray.length; i++) {
	  		while (patArray[i] === patArray[i + 1] && patArray[i] === patArray[i + 2]) {
	    		patArray[i + 1] = gamble();
	    	};  
	  	};
	};

	for (i = 0; i < array.length; i++) {
		if (array[i] == 0 || array[i] == 4) {
			patArray.push('yellow');
		} else if (array[i] == 1 || array[i] == 5) {
			patArray.push('blue');
		} else if (array[i] == 2 || array[i] == 6) {
			patArray.push('red');
		} else if (array[i] == 8 || array[i] == 9) {
			patArray.push(gamble());
		} else {
			patArray.push('green');
		}
	};

	rmvRepeats();
	return patArray;
};

function displayPattern(patLength, difficulty, trigger) {	
	let patternIndex = 0;
	
	// set interval speed for various difficulties:
	if (difficulty == 0) {
		trigger = setInterval(loopPattern, 1000, patLength);
	} else if (difficulty == 2) {
		trigger = setInterval(loopPattern, 600, patLength);
	} else if (difficulty == 3) {
		trigger = setInterval(loopPattern, 400, patLength);
	} else {
		trigger = setInterval(loopPattern, 800, patLength);
	};
	
	function loopPattern(patLength) {
		switch (pattern[patternIndex]) {
			case 'yellow':
			signalBtn(yellowBtn, 'C#4');
			break;

			case 'blue':
			signalBtn(blueBtn, 'E5');
			break;

			case 'red':
			signalBtn(redBtn, 'A4');
			break;

			default:
			case 'green':
			signalBtn(greenBtn, 'E4');
			break;
		};
		patternIndex += 1;
		if (patternIndex == patLength) {
			clearInterval(trigger);
		};
	};
};

function playRoundComp(round, difficulty) {

	function setStartPat() {
		if (round == 1) {
			if (difficulty == 0 || difficulty == 1) {
				startPat = 4;
			} else if (difficulty == 2 || difficulty == 3) {
				startPat = 5;
			};
		} else {
			if (difficulty == 0) {
				displayPattern(startPat, 0);
				startPat += 1;
			} else if (difficulty == 1) {
				displayPattern(startPat, 1)
				startPat += 1;
			} else if (difficulty == 2) {
				displayPattern(startPat, 2);
				startPat += 2;
			} else {
				displayPattern(startPat, 3);
				startPat += 3;
			};
		};
		return startPat;
	};

	if (startPat == null && round > 1) {
			console.error('You must start with round one');
			return;
		};

	if (difficulty == 0) {
		displayPattern(setStartPat(), 0);
	} else if (difficulty == 1) {
		displayPattern(setStartPat(), 1)
	} else if (difficulty == 2) {
		displayPattern(setStartPat(), 2);
	} else {
		displayPattern(setStartPat(), 3);
	};
};

function usrClick (buttonColor) {

	function roundAdvance() {
		clickNum = 0;
		round += 1;
		msgPanel.textContent = ('Great! Round ' + round);
		playRoundComp(round, difficulty);
	};

	msgPanel.textContent = '🄿 🄻 🄰 🅈 🄸 🄽 🄶';

	if (clickNum <= startPat) {
		if (buttonColor == pattern[clickNum]) {
			clickNum += 1;
		} else {
			if (startPat !== null) { // if gameplay has begun
				clearInterval(trigger); // stop pattern if incorrect click
				mp3.play();
				msgPanel.textContent = 'Incorrect. Start at the beginning of the pattern or click Restart to hear a new pattern.'
			};
			clickNum = 0;
		};
	};
	if (clickNum == patternLength) {
		msgPanel.textContent = 'Congratulations! You Win!';
	};

	if (clickNum == startPat) {
		roundAdvance();
	};
};

function restartGame() {
	clickNum = 0;
	round = 1;
	startPat = null;
	pattern = createPattern();
};

