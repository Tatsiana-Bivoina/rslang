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
}

// export async function sprintView(): Promise<HTMLDivElement> {
//   const page: HTMLDivElement = document.createElement('div');
//   page.classList.add('page__sprint');
//   page.innerHTML = `Sprint page`;
//   return page;
// }
