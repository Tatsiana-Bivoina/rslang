import { Word } from './models';
import { answerArr } from './compareAnswers';
import { getAudio, getWords, objectArr, playSound } from './startGame';
import { stopTimer } from './timer';
import { audioCallView } from './view';

const audioArr: string[] = [];

export function staticRound(arr: Word[], score: number) {
  audioArr.length = 0;
  stopTimer();
  const rightWords: Word[] = [];
  const wrongWords: Word[] = [];
  const pageWrap = document.querySelector('.page__audio-call') as HTMLElement;
  const endPage = document.createElement('div');
  endPage.classList.add('page-end-audio');
  const fragmentWrong = document.createDocumentFragment();
  const fragmentRight = document.createDocumentFragment();
  for (let i = 0; i < arr.length; i++) {
    arr[i].wordTranslate === answerArr[i] ? rightWords.push(arr[i]) : wrongWords.push(arr[i]);
  }
  wrongWords.map((result) => {
    audioArr.push(result.audio);
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultDiv.innerHTML = `
      <div class="sound-icon"><img src="../../images/outline_volume_up_white_24dp.png" alt="audio" class="audio"></div>
      <div class="word-result">${result.word}</div>
      <div class="transcription">${result.transcription}</div>
      <div class="translate">${result.wordTranslate}</div>`;
    fragmentWrong.appendChild(resultDiv);
  });
  rightWords.map((result) => {
    audioArr.push(result.audio);
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultDiv.innerHTML = `
      <div class="sound-icon"><img src="../../images/outline_volume_up_white_24dp.png" alt="audio" class="audio"></div>
      <div class="word-result">${result.word}</div>
      <div class="transcription">${result.transcription}</div>
      <div class="translate">${result.wordTranslate}</div>`;
    fragmentRight.appendChild(resultDiv);
  });
  endPage.innerHTML = `<div class ="end-page-wrapper">
    <div class="results">
    <div class="score">Полученные баллы: +${score}</div>
    <div class="results-wrong"><div class="wrong-header">Ошибки: <span class="wrong-span"> ${wrongWords.length} </span></div></div>
    <div class="results-right"><div class="right-header">Изученные слова: <span class="right-span"> ${rightWords.length} </span></div></div>
    </div>
    <div class="close"></div>
    <div class="repeat"><img src="../images/replay.png" class="repeat-img"></div></div>`;
  endPage.querySelector('.results-wrong')?.append(fragmentWrong);
  endPage.querySelector('.results-right')?.append(fragmentRight);
  const wrapperAudioPlay = document.querySelector('.audio-call-play-wrapper') as HTMLElement;
  wrapperAudioPlay.style.opacity = '0';
  wrapperAudioPlay.addEventListener('transitionend', () => {
    wrapperAudioPlay.style.display = 'none';
    wrapperAudioPlay.innerHTML = ``;
    pageWrap.append(endPage);
    endPage.style.opacity = '1';
    endPage.style.display = 'flex';
    document.querySelector('.close')?.addEventListener('click', () => {
      endPage.style.opacity = '0';
      endPage.addEventListener('transitionend', () => {
        endPage.style.display = 'none';
        audioCallView();
      });
    });
    document.querySelector('.repeat')?.addEventListener('click', () => {
      console.log('repeat');
      getWords(Number(localStorage.getItem('group')), Number(localStorage.getItem('page')));
    });
    listenerSound();
  });
  objectArr.length = 0;
  answerArr.length = 0;
}

function listenerSound() {
  Array.from(document.querySelectorAll('.sound-icon')).forEach((icon, i) => {
    icon.addEventListener('click', () => {
      getAudio(audioArr[i]);
      playSound();
    });
  });
}
