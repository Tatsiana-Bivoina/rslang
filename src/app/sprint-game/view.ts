export async function sprintView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__sprint');
  page.innerHTML = `Sprint page`;
  return page;
}
