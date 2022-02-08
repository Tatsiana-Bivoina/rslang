import { Word } from './abstracts';
import SprintService from './SprintService';
import SprintView from './SprintView';

export default class SprintController {
  sprintService: SprintService;

  sprintView: SprintView;

  constructor() {
    this.sprintService = new SprintService();
    this.sprintView = new SprintView();
  }

  async toggleFullScreen(): Promise<void> {
    const btnFullScreen: HTMLElement | null = document.querySelector('.btn-fullscreen');
    btnFullScreen?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  async chooseLevel(): Promise<void> {
    const btnsBlock: HTMLElement | null = document.querySelector('.levels');
    const btnStart: HTMLElement | null = document.querySelector('.btn-start');

    btnsBlock?.addEventListener('click', async (ev) => {
      const btn = ev.target as HTMLElement;
      if (btn.classList.contains('btn-level')) {
        btnStart?.removeAttribute('disabled');
        if (btnStart) this.addActiveClass(btn, btnStart);
        const level: string = (Number(btn.textContent) - 1).toString();
        const page: string = Math.floor(this.getRandomNumber()).toString();
        const res: Word[] = await this.sprintService.getWords(level, page);
        localStorage.setItem('words', JSON.stringify(res));
      }
      if (btn.classList.contains('btn-start')) {
        this.sprintView.sprintGameView();
        this.startTimer();
      }
    });
  }

  private addActiveClass(pressedBtn: HTMLElement, btnStart: HTMLElement) {
    const levelBtns: NodeListOf<Element> = document.querySelectorAll('.btn-level');
    levelBtns.forEach((el) => {
      el.classList.remove('active');
    });
    pressedBtn.classList.add('active');
    btnStart.classList.add('active');
  }

  private getRandomNumber(): number {
    const min = 0;
    const max = 30;
    return Math.random() * (max - min) + min;
  }

  startTimer() {
    const secondsBlock: HTMLElement | null = document.querySelector('.seconds');
    const countdownNumber: HTMLElement | null = document.querySelector('.countdown-number');
    const num: HTMLElement | null = document.querySelector('.countdown-number span');
    let seconds = 60;

    const intervalId = setInterval(() => {
      if (secondsBlock && countdownNumber && num) {
        secondsBlock.innerHTML = `${seconds}`;
        if (seconds === 10) {
          countdownNumber.setAttribute('style', 'border-color: #fa0303');
          num.setAttribute('style', 'color: #fa0303');
        }
      }
      seconds -= 1;
      if (seconds < 0) clearInterval(intervalId);
    }, 1000);
  }
}
