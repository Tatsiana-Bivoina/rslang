import { audioCallView } from './audiocall-game/view';
import { loginView } from './authorization/view';
import { dictionaryView } from './dictionary/view';
import { mainView } from './main/view';
import { sprintView } from './sprint-game/view';
import { Menu } from './abstracts';

const MAIN_BTN = 'button__main';
const AUDIOCALL_BTN = 'button__audio-call';
const SPRINT_BTN = 'button__sprint';
const DICTIONARY_BTN = 'button__dictionary';
const LOGIN_BTN = 'button__login';

export class App {
  async start() {
    const body: HTMLBodyElement = document.getElementsByTagName('body')[0] as HTMLBodyElement;

    // отрисовка меню в хедере
    const header: HTMLDivElement = document.createElement('header') as HTMLDivElement;
    header.classList.add('header');
    header.innerHTML = `
      <span class="menu">${Menu.rsLang}</span>
      <span class="menu">${Menu.textbook}</span>
      <span class="menu">${Menu.dictionary}</span>
      <span class="menu">${Menu.sprint}</span>
      <span class="menu">${Menu.audioCall}</span>
      <span class="menu">${Menu.statistic}</span>
      <span class="menu">${Menu.command}</span>
      <span class="menu">${Menu.login}</span>
    `;

    // отрисовка кнопок на странице
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.innerHTML = `
    <div class="buttons buttons__pages">
      <button class="button ${MAIN_BTN}">Main</button>
      <button class="button ${AUDIOCALL_BTN}">Audio-call</button>
      <button class="button ${SPRINT_BTN}">Sprint</button>
      <button class="button ${DICTIONARY_BTN}">Dictionary</button>
      <button class="button ${LOGIN_BTN}">Login</button>
    </div>
`;
    body.append(header);
    body.appendChild(wrapper);

    const content: HTMLDivElement = document.createElement('main') as HTMLDivElement;
    content.classList.add('page');
    wrapper.appendChild(content);

    // отрисовка первоначального контента
    await this.drawPage(mainView);

    // отрисовка контента в зависимости от нажатой кнопки
    wrapper.addEventListener('click', async (e) => {
      const target = e.target as Element;
      if (target.classList.contains(MAIN_BTN)) await this.drawPage(mainView);
      if (target.classList.contains(AUDIOCALL_BTN)) await this.drawPage(audioCallView);
      if (target.classList.contains(SPRINT_BTN)) await this.drawPage(sprintView);
      if (target.classList.contains(DICTIONARY_BTN)) await this.drawPage(dictionaryView);
      if (target.classList.contains(LOGIN_BTN)) await this.drawPage(loginView);
    });
  }

  async drawPage(view: () => Promise<HTMLDivElement>): Promise<void> {
    const contentHTML = await view();
    const content = document.querySelector('.page') as HTMLDivElement;
    content.innerHTML = '';
    content.appendChild(contentHTML);
  }
}
