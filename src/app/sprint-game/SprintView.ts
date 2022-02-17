import '../../sass/sprint-game.scss';

export default class SprintView {
  async sprintView(): Promise<HTMLDivElement> {
    const page: HTMLDivElement = document.createElement('div');
    page.classList.add('page__sprint');
    page.innerHTML = `
      <button class="btn btn-exit"></button>
      <button class="btn btn-fullscreen"></button>
      <div class="main-content">
        <h2>Спринт</h2>
        <div>
          <p>Выберите, соответствует ли перевод предложенному слову</p>
          <p>Управление игрой:</p>
          <ul>
            <li>Используйте мышку</li>
            <li>Используйте клавиши влево и вправо на клавиатуре</li>
          </ul>
        </div>
        <p>Выберите уровень сложности слов:</p>
        <div class="levels">
          <button class="btn-level btn-level1">1</button>
          <button class="btn-level btn-level2">2</button>
          <button class="btn-level btn-level3">3</button>
          <button class="btn-level btn-level4">4</button>
          <button class="btn-level btn-level5">5</button>
          <button class="btn-level btn-level6">6</button>
          <button class="btn-start" disabled>Начать</button>
        </div>
      </div>
    `;
    return page;
  }

  sprintGameView() {
    const mainContent: HTMLElement | null = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = '';
      mainContent.innerHTML = `
        <div class="timer">
          <div class="countdown-number">
            <span class="seconds"></span>
          </div>
        </div>
        <div class="word-container">
          <p class="total-points">0</p>
          <p class="bonus">+10 очков</p>
          <div class="checkbox-container">
            <div class="checkbox"></div>
            <div class="checkbox"></div>
            <div class="checkbox"></div>
          </div>
          <div class="progress">
            <div class="progress-item">
              <svg class="progress-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="#8a8686"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"></path>
              </svg>
            </div>
            <div class="progress-item" style="display: none">
              <svg class="progress-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="#ffd600"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"></path>
              </svg>
            </div>
            <div class="progress-item" style="display: none">
              <svg class="progress-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="#ff9800"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"></path>
              </svg>
            </div>
            <div class="progress-item" style="display: none">
              <svg class="progress-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="#f44336"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
              </svg>
            </div>
          </div>
          <p class="word">Word</p>
          <p class="translation">Transcription</p>
        </div>
        <div class="btn-container">
          <button class="btn-false">Неверно</button>
          <button class="btn-true">Верно</button>
        </div>
      `;
    }
  }

  sprintStatisticView() {
    const mainContent: HTMLElement | null = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = '';
      mainContent.innerHTML = `
        <div class="total-points-container">
          <h3 class="total-points-title"></h3>
        </div>
        <div class="words-container">
          <div class="mistakes-block">
            <h5 class="mistakes-title">Слова с ошибками <span></span></h5>
            <ul class="mistakes-list"></ul>
          </div>
          <div class="correct-block">
            <h5 class="correct-title">Изученные слова <span></span></h5>
            <ul class="correct-list"></ul>
          </div>
        </div>
        <div class="statistic-btn-container">
          <button class="btn-leave statistic-btn">Закончить игру</button>
          <button class="btn-restart statistic-btn">Еще раз</button>
        </div>
      `;
    }
  }
}
