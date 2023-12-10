'use strict';

// Seleção de elementos
const player0 = document.querySelector('.player-0');
const player1 = document.querySelector('.player-1');
const totalScore0 = document.querySelector('#total-score-0');
const totalScore1 = document.querySelector('#total-score-1');
const curScore0 = document.getElementById('current-score-0');
const curScore1 = document.getElementById('current-score-1');
const msgMrDice = document.querySelector('.balao');
const dices = document.querySelectorAll('.dice');

const rules = document.querySelector('.container-rules');
const backgroundCloseRules = document.querySelector('.rules-background');
const btnRulesClose = document.querySelector('.close-rules');
const btnRules = document.querySelector('.btn-rules');
const btnRoll = document.querySelector('.btn-roll');
const btnHold = document.querySelector('.btn-hold');
const btnRestart = document.querySelector('.btn-restart');
const btnConfig = document.querySelector('.btn-costumization');

const playerName0 = document.getElementById('name-1');
const playerName1 = document.getElementById('name-2');

let currentScore,
  activePlayer,
  scores,
  playing,
  activeAnimation,
  totalScoreActive;

let randomDice = [0, 0];
let winPoints = 150;

///////////// Condições iniciais do jogo //////////////
const start = function () {
  playing = true;
  currentScore = 0;
  activePlayer = 0;
  scores = [0, 0];

  totalScore0.textContent = 0;
  totalScore1.textContent = 0;
  curScore0.textContent = 0;
  curScore1.textContent = 0;
  msgMrDice.textContent = 'Vamos jogar os dados!';

  dices.forEach((_, i) => dices[i].classList.add('hidden'));
  player0.classList.remove('player-winner');
  player1.classList.remove('player-winner');
  player0.classList.add('active-player');
  player1.classList.remove('active-player');
};
start();

/////////////// Frases de Mr Dice //////////////////////
const mrDiceTalks = {
  roll: [
    'Quer arriscar ou manter seus pontos?',
    'Ok, ainda é a sua vez',
    'Talvez seja melhor salvar seus pontos, o que deseja fazer?',
    'Podia ser pior e podia ser melhor, e agora?',
    'Pense bem, esses dados são aleatórios, que nem minhas frases',
    'Mais uma vez?',
    'Esses dados são injustos, pode acontecer qualquer coisa',
    'Quer que eu lance os dados outra vez?',
    'Posso jogar os dados mais uma vez, você decide',
  ],
  luck: [
    'Ok, isso foi sorte',
    'Pelo visto os dados tem um jogador favorito',
    'Duplo 6! Baita sorte',
    'Bons dados! Não acha melhor parar ai?',
  ],
  unlucky: [
    'Dados azuis, Isso não é bom',
    'O jogo não foi feito para ser justo...',
    'Haha! Adoro quando isso acontece!',
    'Auch! Duplo errado né?',
  ],
  greenDices: [
    'Duplo 3! Soma +6 nos Pontos Totais!',
    'Dados verdes! +6 pontos garantidos',
  ],
  switchPlayer: [
    'Que pena! Vez do próximo jogador',
    'Dado com 1, bem fácil de acontecer. Próximo!',
    'Hora da troca de jogador!',
  ],
  hold: [
    'Salvando pontos! Próximo jogador',
    'Ok, pontos mantidos. Próximo',
    'Talvez seja o melhor mesmo...Seguinte!',
  ],
};

// Seleção aleatória de uma array de mensagens de Mr Dice
const message = msgs => {
  const msg = Math.trunc(Math.random() * msgs.length);
  msgMrDice.textContent = msgs[msg];
};

const updateCurrent = player =>
  (document.getElementById(`current-score-${player}`).textContent =
    currentScore);

const switchPlayer = () => {
  currentScore = 0;
  updateCurrent(activePlayer);
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle('active-player');
  player1.classList.toggle('active-player');
};

/////////////////  Animações  ////////////////////
const DicetimerOut = (index, animation, time) => {
  setTimeout(() => dices[index].classList.remove(animation), time);
};

const rotateAnimation = () => {
  activeAnimation = true;
  dices.forEach((_, i) => {
    dices[i].classList.add('rotate-animation');
    DicetimerOut(i, 'rotate-animation', 500);
  });
};

const damageAnimation = () => {
  const currentAnimation = document.getElementById(
    `current-score-${activePlayer}`
  );
  currentAnimation.classList.add('damage-animation');
  setTimeout(() => currentAnimation.classList.remove('damage-animation'), 1000);
};

const holdAnimation = () => {
  const totScoreAnimation = document.getElementById(
    `total-score-${activePlayer}`
  );
  totScoreAnimation.classList.add('hold-animation');
  setTimeout(() => totScoreAnimation.classList.remove('hold-animation'), 1500);
};

////////////////////////////////////////////////////
const rollDices = () => {
  randomDice = [
    Math.trunc(Math.random() * 6) + 1,
    Math.trunc(Math.random() * 6) + 1,
  ];
};

const doubleDice = random =>
  dices.forEach((_, i) => {
    dices[i].classList.add('double-animation');
    dices[i].src = `img/dice-${random[i]}-${random[i]}.png`;
    DicetimerOut(i, 'double-animation', 1200);
  });

const renderDices = () => {
  dices.forEach((_, i) => {
    dices[i].classList.remove('hidden');

    dices[i].src = `img/dice-${randomDice[i]}.png`;
    rotateAnimation();
  });
};

// Funcianalidade para verificar dados duplos
const everyDoubleDice = double => {
  if (randomDice.every(dice => dice === double)) {
    doubleDice(randomDice);
    return true;
  }
};

const checkDiceZero = () => {
  if (randomDice.includes(1)) {
    if (everyDoubleDice(1)) {
      scores[activePlayer] /= 2;
      totalScoreActive.textContent = scores[activePlayer];

      message(mrDiceTalks.unlucky);
    } else message(mrDiceTalks.switchPlayer);

    damageAnimation();
    switchPlayer();

    return true;
  }
};

//////// Funcionalidade de jogar/rolar os dados ////////
btnRoll.addEventListener('click', function () {
  if (activeAnimation) return;

  if (playing) {
    setTimeout(() => (activeAnimation = false), 500);

    totalScoreActive = document.getElementById(`total-score-${activePlayer}`);

    rollDices();
    renderDices();
    if (checkDiceZero()) return;

    if (everyDoubleDice(6)) {
      currentScore === 0
        ? (currentScore += 12)
        : (currentScore += (currentScore *= 2) + 12);

      message(mrDiceTalks.luck);
    } else if (everyDoubleDice(3)) {
      scores[activePlayer] += 6;
      totalScoreActive.textContent = scores[activePlayer];
      holdAnimation();

      message(mrDiceTalks.greenDices);
    } else if (randomDice.every(dice => dice > 1)) {
      currentScore += randomDice.reduce((acc, cur) => acc + cur, 0);

      message(mrDiceTalks.roll);
    }

    updateCurrent(activePlayer);
  }
});

//////// Funcionalidade de manter pontos atuais ////////
btnHold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;

    document.getElementById(`total-score-${activePlayer}`).textContent =
      scores[activePlayer];

    holdAnimation();
    // Jogador vence o jogo
    if (scores[activePlayer] >= winPoints) {
      playing = false;
      currentScore = 0;
      updateCurrent(activePlayer);

      dices.forEach((_, i) => dices[i].classList.add('hidden'));

      msgMrDice.textContent = `Fim de jogo! ${
        activePlayer === 0 ? playerName0.value : playerName1.value
      } é o Vencedor!`;

      document
        .querySelector(`.player-${activePlayer}`)
        .classList.add('player-winner');
      document
        .querySelector(`.player-${activePlayer}`)
        .classList.remove('active-player');
    } else {
      message(mrDiceTalks.hold);
      switchPlayer();
    }
  }
});

// Reiniciar o jogo (Aplicar condições iniciais)
btnRestart.addEventListener('click', start);

//////////////////// Regras do jogo ///////////////////////
btnRules.addEventListener('click', function () {
  rules.classList.remove('hidden');
  backgroundCloseRules.classList.remove('hidden');
});

const closeRules = () => {
  rules.classList.add('hidden');
  backgroundCloseRules.classList.add('hidden');
};

btnRulesClose.addEventListener('click', closeRules);
backgroundCloseRules.addEventListener('click', closeRules);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (!rules.classList.contains('hidden')) closeRules();
  }
});

//////////////////////  UPDATE 1.3  ////////////////////////
const changeName = name => {
  if (name.value && name.value.length < 15)
    document.getElementById(`player-${name.id}`).textContent = name.value;
};

btnConfig.addEventListener('click', function () {
  document.querySelector('.container-costumization').classList.toggle('hidden');
  changeName(playerName0);
  changeName(playerName1);
});

const containerPoints = document.querySelector('.container-points');
containerPoints.addEventListener('click', function (e) {
  const points = e.target.closest('.input-points');
  if (!points) return;

  winPoints = points.value;
});

// Opções de estilos visuais
const styleContainer = document.querySelector('.style-container');
const pigGameStyle = {
  primaryColor: '#c7365f',
  secondaryColor: '#c7365f',
  gradientColor: 'linear-gradient(to top left, #753682 0%, #bf2e34 100%)',
};

const classicStyle = {
  primaryColor: '#59067a',
  secondaryColor: '#8600bb',
  gradientColor: 'linear-gradient(to top right, #3b0152, #7800bd)',
};

const blueStyle = {
  primaryColor: '#0010a3',
  secondaryColor: '#0067bb',
  gradientColor: 'linear-gradient(45deg, #042563, #0068bd)',
};

const applyStyle = function (styleColor) {
  styleProperty('--gradient', styleColor.gradientColor);
  styleProperty('--color-primary', styleColor.primaryColor);
  styleProperty('--color-secondary', styleColor.secondaryColor);
};

const styleProperty = function (property, color) {
  document.documentElement.style.setProperty(property, color);
};

const ChangeStyleGame = styleContainer.addEventListener('click', function (e) {
  const id = e.target.id;
  if (!id) return;

  if (id === 'pig') applyStyle(pigGameStyle);
  if (id === 'sky') applyStyle(blueStyle);
  if (id === 'classic') applyStyle(classicStyle);
});
