import SprintService from '../SprintService';
import SprintView from '../SprintView';
import GameLogicController from './GameLogicController';

export default class SprintController {
  sprintService: SprintService;

  sprintView: SprintView;

  gameLogicController: GameLogicController;

  constructor() {
    this.sprintService = new SprintService();
    this.sprintView = new SprintView();
    this.gameLogicController = new GameLogicController();
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
        await this.sprintService.getWords(level, page);
      }
      if (btn.classList.contains('btn-start')) {
        this.sprintView.sprintGameView();
        this.gameLogicController.createWordsArr();
        this.gameLogicController.addListenerToBtnTrue();
        this.gameLogicController.addListenerToBtnFalse();
        this.gameLogicController.addListenerToArrows();
        this.gameLogicController.updateWordContainer();
        this.gameLogicController.startTimer();
      }
    });
  }

  private addActiveClass(pressedBtn: HTMLElement, btnStart: HTMLElement): void {
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
}
