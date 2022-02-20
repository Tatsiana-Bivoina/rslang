export async function mainView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__main');
  page.innerHTML = `
    <section class="section section-intro">
      <div class="wrapper wrapper-intro">
        <h1 class="section__title">RS Lang - выучи английский играючи!</h1>
        <div class="intro">
          <div class="intro__text">
          Занимаясь в нашем приложение по 45 минут в день, 
          уже через месяц Вы будете знать более 3 тысяч слов!
          </div>
        </div>
      </div>
    </section>

    <section class="section section-advantages">
      <div class="wrapper wrapper-advantages">
        <h1 class="section__title">Наши преимущества</h1>
        <div class="advantages">
          <div class="advantage">
            <h3 class="advantage__title">Электронный учебник</h3>
            <p class="advantage__text">Авторизованный пользователь может добавлять сложные слова в словарь</p>
          </div>
          <div class="advantage">
            <h3 class="advantage__title">Игра сприт</h3>
            <p class="advantage__text">Попробуй вспонить правильный перевод слова!</p>
          </div>
          <div class="advantage">
            <h3 class="advantage__title">Игра аудиовызов</h3>
            <p class="advantage__text">Попробуй на слух правильно составить приложение!</p>
          </div>
          <div class="advantage">
            <h3 class="advantage__title">Статистика</h3>
            <p class="advantage__text">Авторизованный пользователь может просматривать свою статистику по изученным словам</p>
          </div>
        </div>
      </div>            
    </section>

    <section class="section section-video">
      <div class="wrapper wrapper-video">
        <h1 class="section__title">Видеопрезентация</h1>
        <div class="video">
          <iframe width="800" height="500" src="https://www.youtube.com/embed/_5g5pe3FvaQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
          </iframe>
        </div>
      </div>      
    </section>
  `;
  return page;
}
