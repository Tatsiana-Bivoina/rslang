export async function dictionaryView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__dictionary');
  page.innerHTML = `Dictionary page`;
  return page;
}
