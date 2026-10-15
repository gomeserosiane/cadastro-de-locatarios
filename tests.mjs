import assert from 'node:assert/strict';
import {
  maskCEP,
  maskCPF,
  maskPhone,
  validCPF,
  validEmail,
} from './js/validation.js';
import { buildMessage } from './js/whatsapp.js';

assert.equal(validCPF('529.982.247-25'), true);

for (const cpf of ['11111111111', '52998224724', '', '123']) {
  assert.equal(validCPF(cpf), false);
}

assert.equal(maskCPF('52998224725'), '529.982.247-25');
assert.equal(maskCEP('66040033'), '66040-033');
assert.equal(maskPhone('91981643641'), '(91) 98164-3641');
assert.equal(maskPhone('9132456789'), '(91) 3245-6789');
assert.equal(validEmail('cliente@example.com'), true);
assert.equal(validEmail('cliente@'), false);

const cards = [1, 2, 3].map((tenant) => ({
  dataset: { tenant: String(tenant) },
  querySelector: () => ({ value: 'Teste & ação + # ?' }),
}));
const message = buildMessage(cards);

assert.ok(message.includes('*LOCATÁRIO 03*'));
assert.ok(message.includes('Nome completo: Teste & ação + # ?\n\nCPF:'));
assert.equal(
  new URL(
    `https://wa.me/5591981643641?text=${encodeURIComponent(message)}`,
  ).searchParams.get('text'),
  message,
);
assert.ok(!/enviados com sucesso/i.test(message));

console.log(
  '14 verificações de CPF, telefone, e-mail, máscaras e mensagem aprovadas.',
);
