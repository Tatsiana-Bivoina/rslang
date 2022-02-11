import { Word, WordStatistic } from '../abstracts';
import SprintService from '../SprintService';

export default class GameLogicController {
  rand: number;

  wordsArr: string[];

  translationArr: string[];

  wordStatistic: WordStatistic[];

  index: number;

  counter: number;

  pressedBtn: string;

  price: number;

  totalPoints: number;

  checkboxCount: number;

  constructor() {
    this.rand = 0;
    this.wordsArr = [];
    this.translationArr = [];
    this.wordStatistic = [];
    this.index = 0;
    this.pressedBtn = '';
    this.counter = 0;
    this.price = 10;
    this.totalPoints = 0;
    this.checkboxCount = 0;
  }

  startTimer(): void {
    const secondsBlock: HTMLElement | null = document.querySelector('.seconds');
    const countdownNumber: HTMLElement | null = document.querySelector('.countdown-number');
    const num: HTMLElement | null = document.querySelector('.countdown-number span');
    let seconds = 60;

    const intervalId = setInterval(() => {
      if (secondsBlock && countdownNumber && num) {
        secondsBlock.innerHTML = `${seconds}`;
        if (seconds === 10) {
          countdownNumber.setAttribute('style', 'border-color: #f50057');
          num.setAttribute('style', 'color: #f50057');
        }
      }
      seconds -= 1;
      if (seconds < 0) clearInterval(intervalId);
    }, 1000);
  }

  private generateRandomIndexes(): number[] {
    const randomIndex: number[] = [];
    for (let i = 0; i < 9; i++) {
      const randEl = Math.round(Math.random() * 19);
      if (randomIndex.includes(randEl)) {
        i--;
        continue;
      } else {
        randomIndex.push(randEl);
      }
    }
    return randomIndex;
  }

  private shuffleTranslations(arr: string[]): string[] {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  private getRandomTranslations(): void {
    let randTranslation = [];
    const randomIndexArr = this.generateRandomIndexes();
    for (let i = 0; i < randomIndexArr.length; i++) {
      randTranslation.push(this.translationArr[randomIndexArr[i]]);
    }
    randTranslation = this.shuffleTranslations(randTranslation);

    for (let i = 0; i < randomIndexArr.length; i++) {
      this.translationArr[randomIndexArr[i]] = randTranslation[i];
    }
  }

  createWordsArr(): void {
    SprintService.wordCollection.forEach((el) => {
      this.wordsArr.push(el.word);
      this.translationArr.push(el.wordTranslate);
    });
    this.getRandomTranslations();
  }

  updateWordContainer(): void {
    const word: Element | null = document.querySelector('.word');
    const translation: Element | null = document.querySelector('.translation');
    if (word && translation) {
      word.innerHTML = this.wordsArr[this.index];
      translation.innerHTML = this.translationArr[this.index];
    }
  }

  addListenerToBtnTrue(): void {
    const btnTrue: Element | null = document.querySelector('.btn-true');
    btnTrue?.addEventListener('click', () => {
      this.pressedBtn = 'btnTrue';
      this.nextWord();
    });
  }

  addListenerToArrows(): void {
    document.addEventListener('keydown', (event) => {
      if (event.code == 'ArrowRight') {
        this.pressedBtn = 'btnTrue';
        this.nextWord();
      }
      if (event.code == 'ArrowLeft') {
        this.pressedBtn = 'btnFalse';
        this.nextWord();
      }
    });
  }

  addListenerToBtnFalse(): void {
    const btnFalse: Element | null = document.querySelector('.btn-false');
    btnFalse?.addEventListener('click', () => {
      this.pressedBtn = 'btnFalse';
      this.nextWord();
    });
  }

  private nextWord(): void {
    const isRight: boolean = this.checkIfTranslationRight();
    const checkboxes: NodeListOf<Element> = document.querySelectorAll('.checkbox');
    if (isRight) {
      const audioWright: HTMLAudioElement = new Audio('../images/sprint-game/audio/wright.mp3');
      audioWright.play();
      this.counter += 1;
      this.checkboxCount += 1;
      if (this.checkboxCount > 3) {
        this.revokeCheckboxColor(checkboxes);
        this.checkboxCount = 0;
      } else {
        this.paitCheckbox(checkboxes);
      }
      this.changeBonusPrice();
      this.countTotalPoints();
    } else {
      const audioWrong: HTMLAudioElement = new Audio('../images/sprint-game/audio/wrong.mp3');
      audioWrong.play();
      this.counter = 0;
      this.checkboxCount = 0;
      this.revokeCheckboxColor(checkboxes);
      this.changeBonusPrice();
    }
    this.index += 1;
    this.updateWordContainer();
  }

  private checkIfTranslationRight(): boolean {
    const currentWord: string = this.wordsArr[this.index];
    const currentTranslation: string = this.translationArr[this.index];
    const word: Word[] = SprintService.wordCollection.filter((el) => el.word === currentWord);
    const wordInfo = {
      word: word[0].word,
      audio: word[0].audio,
      transcription: word[0].transcription,
      wordTranslate: word[0].wordTranslate,
      isRight: false
    };
    if (word[0].wordTranslate === currentTranslation && this.pressedBtn === 'btnTrue') {
      wordInfo.isRight = true;
    }
    if (word[0].wordTranslate !== currentTranslation && this.pressedBtn === 'btnFalse') {
      wordInfo.isRight = true;
    }
    this.wordStatistic.push(wordInfo);
    return wordInfo.isRight;
  }

  private paitCheckbox(checkboxes: NodeListOf<Element>): void {
    for (let i = 0; i < this.checkboxCount; i++) {
      checkboxes[i].setAttribute(
        'style',
        'background-image: url("../images/sprint-game/svg/circle-check-solid.svg"); background-repeat: no-repeat; bacground-size: cover'
      );
    }
  }

  private revokeCheckboxColor(checkboxes: NodeListOf<Element>): void {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].removeAttribute('style');
    }
  }

  private changeBonusPrice(): void {
    const bonus: Element | null = document.querySelector('.bonus');
    if (this.counter === 0) {
      this.price = 10;
      this.showProgress(0);
    }
    if (this.counter === 4) {
      this.price *= 2;
      this.showProgress(2);
    }
    if (this.counter === 8) {
      this.price *= 5;
      this.showProgress(3);
    }
    if (this.counter === 12) {
      this.price *= 10;
      this.showProgress(4);
    }
    if (bonus) bonus.innerHTML = `+${this.price} очков`;
  }

  private showProgress(count: number) {
    const progressItems: NodeListOf<Element> = document.querySelectorAll('.progress-item');
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        progressItems[i].removeAttribute('style');
      }
    } else {
      for (let i = 1; i < 4; i++) {
        progressItems[i].setAttribute('style', 'display: none');
      }
    }
  }

  private countTotalPoints(): void {
    const totalPoints: Element | null = document.querySelector('.total-points');
    this.totalPoints += this.price;
    if (totalPoints) totalPoints.innerHTML = `${this.totalPoints}`;
  }
}
