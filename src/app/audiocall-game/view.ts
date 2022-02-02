export async function audioCallView(): Promise<HTMLDivElement> {
  const page: HTMLDivElement = document.createElement('div');
  page.classList.add('page__audio-call');
  page.innerHTML = `Audio-call page`;
  return page;
}
