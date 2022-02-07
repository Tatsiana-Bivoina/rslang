import { Word } from './abstracts';
import SprintService from './SprintService';

export default class SprintController {
  sprintService: SprintService;

  constructor() {
    this.sprintService = new SprintService();
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
    btnsBlock?.addEventListener('click', async (ev) => {
      const btn = ev.target as HTMLElement;
      if (btn.classList.contains('btn-level')) {
        const level: string = (Number(btn.textContent) - 1).toString();
        const page: string = Math.floor(this.getRandomNumber()).toString();
        const res: Word[] = await this.sprintService.getWords(level, page);
        localStorage.setItem('words', JSON.stringify(res));
      }
    });
  }

  private getRandomNumber(): number {
    const min = 0;
    const max = 30;
    return Math.random() * (max - min) + min;
  }
}
