import { audioCallView } from './audiocall-game/view';
import { loginView } from './authorization/view';
import { dictionaryView } from './dictionary/view';
import { mainView } from './main/view';
import SprintView from './sprint-game/SprintView';
import SprintController from './sprint-game/SprintController';
import { Menu } from './abstracts';
import { drawUserInfo } from './authorization/controller';

export class App {
  async start() {
    const body: HTMLBodyElement = document.getElementsByTagName('body')[0] as HTMLBodyElement;

    // отрисовка меню в хедере
    const header: HTMLDivElement = document.createElement('header') as HTMLDivElement;
    header.classList.add('header');
    header.innerHTML = `
      <span class="menu">${Menu.rsLang}</span>
      <span class="menu">${Menu.dictionary}</span>
      <span class="menu">${Menu.sprint}</span>
      <span class="menu">${Menu.audioCall}</span>
      <span class="menu">${Menu.statistic}</span>
      <span class="menu">${Menu.command}</span>
      <span class="menu login">${Menu.login}</span>
    `;

    const main: HTMLDivElement = document.createElement('main') as HTMLDivElement;
    main.classList.add('page');

    body.append(header);
    body.append(main);

    // отрисовка первоначального контента
    await drawPage(mainView);

    // отрисовка приветствия, если есть данные о пользователе в local storage
    drawUserInfo();

    // отрисовка контента в зависимости от нажатой кнопки
    header.addEventListener('click', async (e) => {
      const target = e.target as Element;
      switch (target.textContent) {
        case Menu.rsLang:
          await drawPage(mainView);
          break;
        case Menu.audioCall:
          await drawPage(audioCallView);
          break;
        case Menu.sprint:
          const sprint = new SprintView();
          const sprintController = new SprintController();
          await drawPage(sprint.sprintView);
          await sprintController.toggleFullScreen();
          await sprintController.chooseLevel();
          break;
        case Menu.dictionary:
          await drawPage(dictionaryView);
          break;
        case Menu.login:
          await drawPage(loginView);
          break;
      }
    });
  }
}

export async function drawPage(view: () => Promise<HTMLDivElement>): Promise<void> {
  const contentHTML = await view();
  const content = document.querySelector('.page') as HTMLDivElement;
  content.innerHTML = '';
  content.appendChild(contentHTML);
}
