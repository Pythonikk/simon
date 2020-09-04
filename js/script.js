const synth = new Tone.Synth().toDestination();

const mp3 = document.querySelector('#incorrect');

const yellowBtn = document.querySelector('#yellow');
const blueBtn = document.querySelector('#blue');
const redBtn = document.querySelector('#red');
const greenBtn = document.querySelector('#green');

const startBtn = document.querySelector('#start-btn');
const dropdown = document.querySelector('#drop-down');
const msgPanel = document.querySelector('.msg-panel>p');


const playingTxt = '🄿 🄻 🄰 🅈 🄸 🄽 🄶'; //This can be a const since it is being used in more than one place
const patternLength = 15;
let clickNum = 0;
let pattern = createPattern();
let round = 1;
let difficulty = 1;
let startPat = null;
let trigger = null;


startBtn.addEventListener('click', () => {
	msgPanel.textContent = playingTxt;
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

dropdown.onchange = function () { //Entire switch can be removed, since the index always matches the difficulty
	difficulty = dropdown.selectedIndex;
};


function signalBtn (button, note) {
	synth.triggerAttackRelease(note, '8n');
	button.classList.add('flash');
	setTimeout(untriggerBtn, 200, button);
};

function untriggerBtn(button) {
	button.classList.remove('flash');
};

function getRandomInt(multiplier) { //This can be a function to reduce redundancy and improve readability
	return Math.floor(Math.random() * multiplier);
};

function getRandomValues() {
	let int = 0;
	let array = [];
	for (i = 0; i < patternLength; i++) {
		int = getRandomInt(10);
		array.push(int);
	};
	return array;
};

function createPattern() {
	let array = getRandomValues();
	let patArray = [];

	function gamble() {
		let array = ['yellow', 'blue', 'red', 'green'];
		let item = array[getRandomInt(array.length)];
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

function getInvervalSpeedByDifficulty(difficulty) { //Breaking new switch() into its own descriptive function also removes the need for the original code comment
	switch(difficulty) {
		case 0:
		return 1000;

		default:
		case 1: //Declaring case 1 instead of just letting it fall into default provides clarity of what normal speed is, should the default ever need to change
		return 800;

		case 2:
		return 600;

		case 3:
		return 400;
	};
};

function displayPattern(patLength, difficulty, trigger) {	
	let patternIndex = 0;
	
	let intervalSpeed = getInvervalSpeedByDifficulty(difficulty)
	trigger = setInterval(loopPattern, intervalSpeed, patLength);
	
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
		if (round == 1) { //This refactoring is a way to cover all difficulties more simply, and provides a default for startPat by just using 'else'
			if (difficulty <= 1) { 
				startPat = 4;
			} else {
				startPat = 5;
			};
			
			/*
				Now, just for fun, if our above statement now looks like this:
				
					if (difficulty <= 1) {
						startPat = 4;
					} else {
						startPat = 5;
					};
				
				we can set startPat in just one spot by delivering the value as a function:
				
					startPat = function() {
						if (difficulty <= 1) {
							return 4;
						} else {
							return 5;
						};
					};
				
				which can then be short-handed even further as such:

					startPat = difficulty <= 1 ? 4 : 5;
				
				Effectively turning 5 or more lines into 1 line =) So it basically now reads like this:

					startPat = difficulty <= 1    "if (difficulty <= 1)"
							? 4           "{ return 4; }"
							: 5;          "else { return 5; }"
				
				The "happy path" value follows the question mark, and the "unhappy path" value follows the colon.
			*/
		} else {
			displayPattern(startPat, difficulty);  //Can be simplified with caution, as this does change functionality when difficulty > 3 (tho not a current scenario)
			
			if (difficulty == 0) {
				startPat += 1;
			} else {
				startPat += difficulty; //Can be simplified with caution, as this does change functionality when difficulty > 3 (tho not a current scenario)
			};
		};
		return startPat;
	};

	if (startPat == null && round > 1) {
			console.error('You must start with round one');
			return;
		};
	
	displayPattern(setStartPat(), difficulty); //Can be simplified with caution, as this does change functionality when difficulty > 3 (tho not a current scenario)
};

function usrClick (buttonColor) {

	function roundAdvance() {
		clickNum = 0;
		round += 1;
		msgPanel.textContent = ('Great! Round ' + round);
		playRoundComp(round, difficulty);
	};

	msgPanel.textContent = playingTxt;

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

