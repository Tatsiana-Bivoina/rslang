import { score } from './compareAnswers';
import { objectArr } from './startGame';
import { staticRound } from './statis';

let interval: NodeJS.Timer;

export function timer(sec: number) {
  interval = setInterval(() => {
    timerDraw(sec);
    if (sec === 1) {
      staticRound(objectArr, score);
      clearInterval(interval);
    }
    sec--;
  }, 1000);
}

export function stopTimer() {
  clearInterval(interval);
}

function timerDraw(sec: number) {
  if (!document.querySelector('.timer')) {
    return stopTimer();
  }
  const secInner = sec < 10 ? `0${sec}` : sec;
  document.querySelector('.timer')!.innerHTML = `00:${secInner}`;
}
