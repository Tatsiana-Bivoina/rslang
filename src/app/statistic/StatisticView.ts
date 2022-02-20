import '../../sass/statistic.scss';

export default class StatisticView {
  async statisticView(): Promise<HTMLDivElement> {
    const page: HTMLDivElement = document.createElement('div');
    page.classList.add('page-statistic');
    page.innerHTML = `
      <div class="statistic-container">
        <h1>Статистика</h1>
        <h2>Общая статистика за день</h2>
        <div class="statistic day-statistic">
          <div class="statistic-items">
            <p>Кольчество сыгранных игр:</p>
            <span class="all-games-count">0</span>
          </div>
          <div class="statistic-items">
            <p>Кольчество изученных слов:</p>
            <span class="all-learned-words">0</span>
          </div>
          <div class="statistic-items">
            <p>Процент правильных ответов:</p>
            <span class="all-wright-words">0</span>
          </div>
          <div class="statistic-items">
            <p>Самая длинная серия правильных ответов:</p>
            <span class="longest-series">0</span>
          </div>
        </div>
        <h2>Cтатистика по играм</h2>
        <div class="game-statistic">
          <div class="statistic sprint-statistic">
            <h3>Спринт</h3>
            <div class="statistic-items">
              <p>Кольчество сыгранных игр:</p>
              <span class="srint-game-count">0</span>
            </div>
            <div class="statistic-items">
              <p>Кольчество изученных слов:</p>
              <span class="sprint-learned-words">0</span>
            </div>
            <div class="statistic-items">
              <p>Процент правильных ответов:</p>
              <span class="sprint-wright-words">0</span>
            </div>
            <div class="statistic-items">
              <p>Самая длинная серия правильных ответов:</p>
              <span class="sprint-longest-series">0</span>
            </div>
          </div>
          <div class="statistic audiocall-statistic">
            <h3>Аудиовызов</h3>
            <div class="statistic-items">
              <p>Кольчество сыгранных игр:</p>
              <span class="audiocall-game-count">0</span>
            </div>
            <div class="statistic-items">
              <p>Кольчество изученных слов:</p>
              <span class="audiocall-learned-words">0</span>
            </div>
            <div class="statistic-items">
              <p>Процент правильных ответов:</p>
              <span class="audiocall-wright-words">0</span>
            </div>
            <div class="statistic-items">
              <p>Самая длинная серия правильных ответов:</p>
              <span class="audiocall-longest-series">0</span>
            </div>
          </div>
        </div>
      </div>
  
    `;
    return page;
  }
}
