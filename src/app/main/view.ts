export async function mainView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__main');
  page.innerHTML = `Main page`;
  return page;
}
