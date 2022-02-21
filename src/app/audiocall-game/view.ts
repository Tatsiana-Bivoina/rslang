import { playSound, getWords, questionWords } from './startGame';
import { compareAnswer } from './compareAnswers';
import { timer, stopTimer } from './timer';

export async function audioCallView(): Promise<HTMLDivElement> {
  let page: HTMLDivElement;
  if (document.querySelector('.page__audio-call')) {
    page = document.querySelector('.page__audio-call')!;
  } else {
    page = document.createElement('div');
    page.classList.add('page__audio-call');
  }
  page.innerHTML = `<div class="audio-call-play-wrapper">
  </div>
  <div class="page-audio-call-start-wrapper" style="opacity: 1">
    <div class="page-audio-call-start">
      <div class="describe-card">
        <h1>Аудиовызов</h1>
        <div class="description">Вы должны выбрать перевод услышанного слова.<br> Управление игрой: используйте мышку либо цифры на клавиатуре</div>
        <div class="levels">
          <div class="level level-1">1</div>
          <div class="level level-2">2</div>
          <div class="level level-3">3</div>
          <div class="level level-4">4</div>
          <div class="level level-5">5</div>
          <div class="level level-6">6</div>
        </div>
      </div>
    </div>
  </div>`;
  setTimeout(() => {
    listenerLevel();
  }, 500);
  return page;
}

function listenerLevel(): void {
  const levelButs = document.getElementsByClassName('level');
  for (const item of levelButs) {
    item.addEventListener('click', () => {
      // if (getUsersWords()) {
      // }
      getWords(+item.innerHTML - 1);
    });
  }
}

export function renderRound(): void {
  let page: HTMLDivElement;
  let wrapper: HTMLDivElement | null = document.querySelector('.page-end-audio');
  if (!document.querySelector('.page__audio-call')) {
    document.querySelector('.page')!.innerHTML = ``;
    page = document.createElement('div');
    page.classList.add('page__audio-call');
    page.innerHTML = `<div class="audio-call-play-wrapper">
  </div>
  <div class="page-audio-call-start-wrapper" style="opacity: 1">
  </div>`;
    document.querySelector('.page')?.appendChild(page);
    wrapper = document.querySelector('.page-audio-call-start-wrapper');
  }
  const wrapperAudioPlay = document.querySelector('.audio-call-play-wrapper') as HTMLDivElement;
  const wrapperAudioEnd = document.querySelector('.page-end-audio') as HTMLDivElement;
  const wrapperAudioStart = document.querySelector('.page-audio-call-start-wrapper') as HTMLDivElement;
  if (questionWords.length === 4) {
    questionWords.sort(() => Math.round(Math.random() * 100) - 50);
    wrapperAudioPlay.innerHTML = `<div class="audio-call-play">
    <div class="header-audio">
      <div class="hearts">
        <img src="./images/red-heart.png" alt="heart" class="heart">
        <img src="./images/red-heart.png" alt="heart" class="heart">
        <img src="./images/red-heart.png" alt="heart" class="heart">
        <img src="./images/red-heart.png" alt="heart" class="heart">
        <img src="./images/red-heart.png" alt="heart" class="heart">
      </div>
    </div>
    <div class="close"></div>
    <div class="sound-icon"></div>
    <div class="timer">00:00</div>
    <div class="full-screen"></div>
    <div class="answers">
      <div class="answer">${questionWords[0].wordTranslate}</div>
      <div class="answer">${questionWords[1].wordTranslate}</div>
      <div class="answer">${questionWords[2].wordTranslate}</div>
      <div class="answer">${questionWords[3].wordTranslate}</div>
    </div>
  </div>`;
    removeListener();
    listener();
    timer(30);
    if (wrapper !== document.querySelector('.page-audio-call-start-wrapper')) {
      wrapper = wrapperAudioStart.style.opacity == '1' ? wrapperAudioStart : wrapperAudioEnd;
    }
    setTimeout(() => {
      wrapper!.style.opacity = '0';
    }, 500);
    wrapper!.addEventListener('transitionend', () => {
      wrapper!.style.display = 'none';
      // wrapper?.remove();
      wrapperAudioPlay.style.opacity = '1';
      wrapperAudioPlay.style.display = 'block';
    });
  }
}

export function renderQuestion(): void {
  stopTimer();
  const answers = document.querySelector('.answers') as HTMLElement;
  questionWords.sort(() => Math.round(Math.random() * 100) - 50);
  answers.innerHTML = `<div class="answer">${questionWords[0].wordTranslate}</div>
  <div class="answer">${questionWords[1].wordTranslate}</div>
  <div class="answer">${questionWords[2].wordTranslate}</div>
  <div class="answer">${questionWords[3].wordTranslate}</div>`;
  timer(30);
}

function listener() {
  (document.querySelector('.close') as HTMLElement).addEventListener('click', closeRound);
  (document.querySelector('.sound-icon') as HTMLElement).addEventListener('click', playSound);
  (document.querySelector('.full-screen') as HTMLElement).addEventListener('click', fullScreen);
  (document.querySelector('.answers') as HTMLElement).addEventListener('click', (e: Event) => {
    if ((e.target as HTMLElement).classList.contains('answer')) {
      compareAnswer(e);
    }
  });
  document.onkeydown = (e: KeyboardEvent) => {
    keyBoard(e);
  };
}

function removeListener() {
  (document.querySelector('.close') as HTMLElement).removeEventListener('click', closeRound);
  (document.querySelector('.sound-icon') as HTMLElement).removeEventListener('click', playSound);
  (document.querySelector('.full-screen') as HTMLElement).removeEventListener('click', fullScreen);
  (document.querySelector('.answers') as HTMLElement).removeEventListener('click', (e: Event) => {
    if ((e.target as HTMLElement).classList.contains('answer')) {
      compareAnswer(e);
    }
  });
}

function keyBoard(e: KeyboardEvent) {
  if (e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4') {
    document.querySelectorAll('.answer')[+e.key - 1].classList.add('answer-hover');
    setTimeout(() => {
      compareAnswer(document.querySelectorAll('.answer')[+e.key - 1]!.innerHTML);
    }, 200);
  }
}

function closeRound() {
  const wrapperAudioPlay = document.querySelector('.audio-call-play-wrapper') as HTMLElement;
  const wrapperAudioStart = document.querySelector('.page-audio-call-start-wrapper') as HTMLElement;
  wrapperAudioPlay.style.opacity = '0';
  wrapperAudioPlay.addEventListener('transitionend', () => {
    wrapperAudioPlay.style.display = 'none';
    wrapperAudioPlay.innerHTML = ``;
    wrapperAudioStart.style.opacity = '1';
    wrapperAudioStart.style.display = 'block';
  });
}

function fullScreen() {
  if (!document.fullscreenElement) {
    (document.querySelector('.full-screen') as HTMLElement).classList.add('full-out');
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      (document.querySelector('.full-screen') as HTMLElement).classList.remove('full-out');
      document.exitFullscreen();
    }
  }
}
