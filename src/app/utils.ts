export function createButton(innerText: string, ...classes: string[]): HTMLButtonElement {
  const button = document.createElement('button');
  for (const _class of classes) {
    button.classList.add(_class);
  }
  button.innerText = innerText;
  return button;
}

export function createDiv(innerHTML: string, ...classes: string[]): HTMLDivElement {
  const div = document.createElement('div');
  for (const _class of classes) {
    div.classList.add(_class);
  }
  div.innerHTML = innerHTML;
  return div;
}

export function createSpan(innerHTML: string, ...classes: string[]): HTMLSpanElement {
  const span = document.createElement('span');
  for (const _class of classes) {
    span.classList.add(_class);
  }
  span.innerHTML = innerHTML;
  return span;
}
