import { fieldDefinitions } from './tenants.js';

export function buildMessage(cards) {
  const parts = [
    '*CADASTRO DE LOCATÁRIOS — ADM GOMES & ROSIANE*',
    `Quantidade de locatários: ${cards.length}`,
  ];

  for (const card of cards) {
    parts.push(`*LOCATÁRIO ${card.dataset.tenant.padStart(2, '0')}*`);

    for (const [name, label] of fieldDefinitions) {
      const value = card.querySelector(`[name=${name}]`).value.trim();
      parts.push(`${label}: ${value}`);
    }
  }

  return parts.join('\n\n');
}

export function showReview(cards) {
  const message = buildMessage(cards);

  document.querySelector('#message-preview').textContent = message;
  document.querySelector('#open-whatsapp').href =
    `https://wa.me/5591981643641?text=${encodeURIComponent(message)}`;
  document.querySelector('#review').showModal();
}

export function clearReview() {
  document.querySelector('#open-whatsapp').removeAttribute('href');
  document.querySelector('#message-preview').textContent = '';
}
