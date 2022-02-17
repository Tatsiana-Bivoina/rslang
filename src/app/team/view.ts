import { createDiv } from '../utils';
import { TeamMember } from './abstracts';

export async function teamView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = createDiv(
    `
    <div class="page__title">Наша команда</div>
  `,
    'page__team'
  );

  const memberCards: HTMLDivElement = document.createElement('div');
  memberCards.classList.add('member-cards');

  const member1 = new TeamMember(
    'Nick Malysh',
    'github.com/vostavhy',
    'главная, авторизация, backend',
    '../images/team/member1.png'
  );

  const member2 = new TeamMember(
    'Tatsiana Bivoina',
    'github.com/Tatsiana-Bivoina',
    'игра "Спринт", статистика',
    '../images/team/member2.jpg'
  );

  const member3 = new TeamMember(
    'Sotnikova Ekaterina',
    'github.com/katesoo',
    'игра "Аудио-вызов", словарь',
    '../images/team/member3.jpg'
  );

  const members: TeamMember[] = [member1, member2, member3];

  for (const member of members) {
    memberCards.append(createMemberCard(member));
  }

  page.append(memberCards);

  return page;
}

function createMemberCard(member: TeamMember): HTMLDivElement {
  const memberCard = document.createElement('div');
  memberCard.classList.add('member-card');
  memberCard.innerHTML = `
    <img class="member-card__image" src="${member.photoLink}" alt="user-photo">
    <p class="member-card__name">${member.name}<p>
    <a href="https://${member.githubLink}">${member.githubLink}</a>  
    <p class="member-card__responsibility">${member.responsibility}<p>  
  `;

  return memberCard;
}
