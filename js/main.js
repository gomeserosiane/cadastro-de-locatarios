import { leave } from './animations.js';
import { bindCEP } from './cep.js';
import { createTenant, hasData } from './tenants.js';
import {
  error,
  maskCEP,
  maskCPF,
  maskPhone,
  validateCard,
} from './validation.js';
import { clearReview, showReview } from './whatsapp.js';

const container = document.querySelector('#tenants');
const form = document.querySelector('form');
const cleanups = new WeakMap();
let changing = false;

function add(tenantNumber) {
  const card = createTenant(tenantNumber);
  container.append(card);
  cleanups.set(card, bindCEP(card));

  card.querySelectorAll('[data-field]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.name === 'cpf') {
        input.value = maskCPF(input.value);
      }

      if (input.name === 'cep') {
        input.value = maskCEP(input.value);
      }

      if (input.name === 'telefone') {
        input.value = maskPhone(input.value);
      }

      error(input, '');
    });
  });
}

add(1);

form.querySelectorAll('[name=quantity]').forEach((radio) => {
  radio.addEventListener('change', async () => {
    if (changing) {
      return;
    }

    const count = Number(radio.value);
    const cards = [...container.children];
    const removed = cards.slice(count);
    const confirmed = !removed.some(hasData) || confirm(
      'Ao reduzir a quantidade, os dados dos últimos locatários serão apagados. Deseja continuar?',
    );

    if (!confirmed) {
      form.querySelector(
        `[name=quantity][value="${cards.length}"]`,
      ).checked = true;
      return;
    }

    changing = true;
    form.querySelectorAll('[name=quantity]').forEach((input) => {
      input.disabled = true;
    });

    for (const card of removed) {
      cleanups.get(card)?.();
      await leave(card);
      card.remove();
    }

    for (let tenantNumber = cards.length + 1; tenantNumber <= count; tenantNumber += 1) {
      add(tenantNumber);
    }

    form.querySelectorAll('[name=quantity]').forEach((input) => {
      input.disabled = false;
    });
    changing = false;
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (changing) {
    return;
  }

  let valid = true;
  const cards = [...container.children];

  for (const card of cards) {
    if (!validateCard(card)) {
      valid = false;
    }
  }

  const consent = document.querySelector('#consent');
  const consentError = document.querySelector('#consent-error');
  consentError.textContent = consent.checked
    ? ''
    : 'Autorize a preparação dos dados para continuar.';
  consent.setAttribute('aria-invalid', String(!consent.checked));

  if (!consent.checked) {
    valid = false;
  }

  if (!valid) {
    form.querySelector('[aria-invalid=true]')?.focus();
    return;
  }

  showReview(cards);
});

document.querySelector('#consent').addEventListener('change', () => {
  document.querySelector('#consent-error').textContent = '';
});

document.querySelector('#close-review').addEventListener('click', () => {
  document.querySelector('#review').close();
});

document.querySelector('#review').addEventListener('close', clearReview);

document.querySelector('#clear').addEventListener('click', () => {
  if (!confirm('Apagar todos os dados deste cadastro?')) {
    return;
  }

  for (const card of container.children) {
    cleanups.get(card)?.();
  }

  container.replaceChildren();
  form.reset();
  document.querySelector('#consent-error').textContent = '';
  clearReview();
  add(1);
  form.querySelector('[name=quantity]').focus();
});

window.addEventListener('pagehide', () => {
  for (const card of container.children) {
    cleanups.get(card)?.();
  }

  form.reset();
  container.replaceChildren();
  clearReview();
  document.querySelector('#review').close();
});

window.addEventListener('pageshow', () => {
  if (!container.children.length) {
    add(1);
  }
});
