let gameData;
const main = document.querySelector('main');
const pokemonImage = document.querySelector('#pokemon-image');
const textOverlay = document.querySelector('#text-overlay');
const choices = document.querySelector('#choices');
const playBtn = document.querySelector('#play');
const points = document.querySelector('#points')
const time = document.querySelector('#time')
const qualifierScore = 12; //17 for challenging

let isPlaying = false;
let score = 0;

playBtn.addEventListener('click', startOver);
addAnswerHandler();

function startOver() {
score=0;
let count = 60;
isPlaying = true;

points.innerHTML = `<button>Score: ${score}</button>`
time.innerHTML = `<button>Time: ${count}</button>`

fetchData();

const timer = setInterval(function() {
  count--;
  time.innerHTML = `<button>Time: ${count}</button>`
  if (count === 0) {
    clearInterval(timer);
    isPlaying = false;
  }
}, 1000);
}

async function fetchData() {
  resetImage();
  gameData = await window.getPokeData();
  showSilhouette();
  displayChoices();
}

function resetImage() {
  pokemonImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
  main.classList.add('fetching');
  main.classList.remove('revealed');
}

function showSilhouette() {
  main.classList.remove('fetching');
  pokemonImage.src = gameData.correct.image;
}

function displayChoices() {
  const { pokemonChoices } = gameData;
  const choicesHTML = pokemonChoices.map(({ name }) => {
    return `<button data-name="${name}">${name}</button>`;
  }).join('');

  choices.innerHTML = choicesHTML;
}

function addAnswerHandler() {
  choices.addEventListener('click', e => {
    const { name } = e.target.dataset;
    const resultClass = (name === gameData.correct.name) ?
      'correct' : 'incorrect';
    if (resultClass == 'correct' && isPlaying) {
      score++;
      points.innerHTML = `<button>Score: ${score}</button>`
      if (score >= qualifierScore) {
        points.classList.add('passed');
      }
    }
    e.target.classList.add(resultClass);
    revealPokemon();
  });
}

function revealPokemon() {
  main.classList.add('revealed');
  textOverlay.textContent = `${gameData.correct.name}!`;
  if (isPlaying) fetchData();
}

function loadVoice() {
  window.speechSynthesis.onvoiceschanged = () => {
    window.femaleVoice = speechSynthesis.getVoices()[4];
  };
}

function speakAnswer() {
  const utterance = new SpeechSynthesisUtterance(gameData.correct.name);
  utterance.voice = window.femaleVoice;
  utterance.pitch = 0.9;
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}
