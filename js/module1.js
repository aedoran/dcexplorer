import { hi } from './module2.js';

export function hello(text) {
  const div = document.createElement('div');
  div.textContent = `${hi} ${text}`;
  document.body.appendChild(div);
}
