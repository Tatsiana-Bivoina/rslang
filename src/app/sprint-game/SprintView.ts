import '../../sass/sprint-game.scss';

export default class SprintView {
  async sprintView(): Promise<HTMLDivElement> {
    const page: HTMLDivElement = document.createElement('div');
    page.classList.add('page__sprint');
    page.innerHTML = `
      <button class="btn btn-exit"></button>
      <button class="btn btn-fullscreen"></button>
      <div class="main-content">
        <h2>Sprint</h2>
        <div>
          <p>Choose if the translation matches the suggested word</p>
          <p>Game control:</p>
          <ul>
            <li>Use the mouse</li>
            <li>Use the left or right keys on your keyboard</li>
          </ul>
        </div>
        <p>Select difficulty level:</p>
        <div class="levels">
          <button class="btn-level btn-level1 active">1</button>
          <button class="btn-level btn-level2">2</button>
          <button class="btn-level btn-level3">3</button>
          <button class="btn-level btn-level4">4</button>
          <button class="btn-level btn-level5">5</button>
          <button class="btn-level btn-level6">6</button>
          <button class="btn-start">start</button>
        </div>
      </div>
    `;
    return page;
  }
}

// export async function sprintView(): Promise<HTMLDivElement> {
//   const page: HTMLDivElement = document.createElement('div');
//   page.classList.add('page__sprint');
//   page.innerHTML = `Sprint page`;
//   return page;
// }
