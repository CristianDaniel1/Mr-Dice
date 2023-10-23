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

// Declaração das variáveis globais
let currentScore, activePlayer, scores, playing, activeAnimation;
let randomDice = [0, 0];

//////// Condições iniciais do jogo ////////
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

//////// Arrays de frases de Mr Dice ////////
const mrDiceRoll = [
  'Quer arriscar ou manter seus pontos?',
  'Ok, ainda é a sua vez',
  'Talvez seja melhor salvar seus pontos, o que deseja fazer?',
  'Podia ser pior e podia ser melhor, e agora?',
  'Pense bem, esses dados são aleatórios, que nem minhas frases',
  'Mais uma vez?',
  'Esses dados são injustos, pode acontecer qualquer coisa',
  'Quer que eu lance os dados outra vez?',
  'Posso jogar os dados mais uma vez, você decide',
];

const mrDiceLuck = [
  'Ok, isso foi sorte',
  'Pelo visto os dados tem um jogador favorito',
  'Duplo 6! Baita sorte',
  'Bons dados! Não acha melhor parar ai?',
];

const mrDiceUnlucky = [
  'Dados azuis, Isso não é bom',
  'O jogo não foi feito para ser justo...',
  'Haha! Adoro quando isso acontece!',
  'Auch! Duplo errado né?',
];

const mrDiceGreen = [
  'Duplo 3! Soma +6 nos Pontos Totais!',
  'Dados verdes! +6 pontos garantidos',
];

const mrDiceSwitch = [
  'Que pena! Vez do próximo jogador',
  'Dado com 1, bem fácil de acontecer. Próximo!',
  'Hora da troca de jogador!',
];

const mrDiceHold = [
  'Salvando pontos! Próximo jogador',
  'Ok, pontos mantidos. Próximo',
  'Talvez seja o melhor mesmo...Seguinte!',
];

// Seleção aleatória de uma array de mensagens de Mr Dice
const message = msgs => {
  const msg = Math.trunc(Math.random() * msgs.length);
  return (msgMrDice.textContent = msgs[msg]);
};

// Atualiza a pontuação atual do jogador
const updateCurrent = player =>
  (document.getElementById(`current-score-${player}`).textContent =
    currentScore);

// Funcionalidade de trocar de jogador
const switchPlayer = () => {
  currentScore = 0;
  updateCurrent(activePlayer);
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle('active-player');
  player1.classList.toggle('active-player');
};

// Temporizador para remover animação
const DicetimerOut = (index, animation, time) => {
  setTimeout(() => dices[index].classList.remove(animation), time);
};

// Exibir os dados duplos de acordo com os argumentos (dados aleatórios iguais)
const doubleDice = random =>
  dices.forEach((_, i) => {
    dices[i].classList.add('double-animation');
    dices[i].src = `images/dice-${random[i]}-${random[i]}.png`;
    DicetimerOut(i, 'double-animation', 1200);
  });

// ADD de animação "girar" cada 0.5s
const rotateAnimation = () => {
  activeAnimation = true;
  dices.forEach((_, i) => {
    dices[i].classList.add('rotate-animation');
    DicetimerOut(i, 'rotate-animation', 500);
  });
};

// Animação de "dano", ocorre quando perde os pontos atuais
const damageAnimation = () => {
  const currentAnimation = document.getElementById(
    `current-score-${activePlayer}`
  );
  currentAnimation.classList.add('damage-animation');
  setTimeout(() => currentAnimation.classList.remove('damage-animation'), 1000);
};

// Animação de "Manter" pontos ou transferir para pontos totais
const holdAnimation = () => {
  const totScoreAnimation = document.getElementById(
    `total-score-${activePlayer}`
  );
  totScoreAnimation.classList.add('hold-animation');
  setTimeout(() => totScoreAnimation.classList.remove('hold-animation'), 1500);
};

// Funcianalidade para verificar dados duplos
const everyDoubleDice = double => {
  if (randomDice.every(dice => dice === double)) {
    doubleDice(randomDice);
    return true;
  }
};

//////// Funcionalidade de jogar/rolar os dados ////////
btnRoll.addEventListener('click', function () {
  // Se ainda estiverem jogando e a animação dos dados estar finalizada
  if (playing && !activeAnimation) {
    // Temporuzador para rolar dados
    setTimeout(() => (activeAnimation = false), 500);
    randomDice = [
      Math.trunc(Math.random() * 6) + 1,
      Math.trunc(Math.random() * 6) + 1,
    ];
    // Loop nos dados aleatórios para sua exibição
    dices.forEach((_, i) => {
      dices[i].classList.remove('hidden');
      dices[i].src = `images/dice-${randomDice[i]}.png`;
      rotateAnimation();
    });
    // Seleção dos pontos totais do jogador atual
    const totalScoreActive = document.getElementById(
      `total-score-${activePlayer}`
    );

    // Verifica se o jogador atual teve sorte (duplo 6)
    if (everyDoubleDice(6)) {
      // No caso de que pontos = 0, não multiplicará x2
      if (currentScore === 0) currentScore += 12;
      else (currentScore *= 2) + 12;
      message(mrDiceLuck);
      // Se o jogador conseguir duplo 3
    } else if (everyDoubleDice(3)) {
      scores[activePlayer] += 6;
      totalScoreActive.textContent = scores[activePlayer];
      holdAnimation();
      message(mrDiceGreen);
      // Verifica se todos os dados > 1, somando pontos
    } else if (randomDice.every(dice => dice > 1)) {
      currentScore += randomDice.reduce((acc, cur) => acc + cur, 0);
      message(mrDiceRoll);
    } else {
      // Se o jogador atual teve azar (duplo 1)
      if (everyDoubleDice(1)) {
        scores[activePlayer] /= 2;
        totalScoreActive.textContent = scores[activePlayer];
        message(mrDiceUnlucky);
        // No caso de que pelo menos um dado inclua "1"
      } else if (randomDice.includes(1)) message(mrDiceSwitch);
      // Troca de jogador e exibe animação de perda de pontos
      damageAnimation();
      switchPlayer();
    }
    // Atualiza a pontuação atual do jogador atual
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
    // Finaliza o jogo se o jogador tiver >= 150 pontos
    if (scores[activePlayer] >= 150) {
      playing = false;
      currentScore = 0;
      updateCurrent(activePlayer);
      // Loop para esconder dados
      dices.forEach((_, i) => dices[i].classList.add('hidden'));
      msgMrDice.textContent = `Fim de jogo! E o vencedor é o Jogador ${
        activePlayer + 1
      }!`;
      document
        .querySelector(`.player-${activePlayer}`)
        .classList.add('player-winner');
      document
        .querySelector(`.player-${activePlayer}`)
        .classList.remove('active-player');
    } else {
      message(mrDiceHold);
      switchPlayer();
    }
  }
});

// Reiniciar o jogo (Aplicar condições iniciais)
btnRestart.addEventListener('click', start);

//////// funcionalidade de abrir janela de regras do jogo ////////
btnRules.addEventListener('click', function () {
  rules.classList.remove('hidden');
  backgroundCloseRules.classList.remove('hidden');
});

//////// Funcionalidade de fechar a janela de regras ////////
const closeRules = () => {
  rules.classList.add('hidden');
  backgroundCloseRules.classList.add('hidden');
};

btnRulesClose.addEventListener('click', closeRules);
backgroundCloseRules.addEventListener('click', closeRules);
// Fechar as regras através da tecla "Esc"
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (!rules.classList.contains('hidden')) closeRules();
  }
});
