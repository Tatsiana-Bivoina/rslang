export async function loginView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__authorization');
  page.innerHTML = `Authorization page`;
  return page;
}
