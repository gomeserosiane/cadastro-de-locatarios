import { digits } from './validation.js';

export function bindCEP(card) {
  const input = card.querySelector('[name=cep]');
  const status = card.querySelector('.cep-status');
  let controller;
  let sequence = 0;

  input.addEventListener('input', () => {
    sequence += 1;
    controller?.abort();
    status.textContent = '';
  });

  input.addEventListener('blur', async () => {
    const cep = digits(input.value);

    if (cep.length !== 8) {
      return;
    }

    controller?.abort();
    controller = new AbortController();

    const current = ++sequence;
    const fieldNames = ['endereco', 'bairro', 'cidade', 'estado'];
    const snapshot = Object.fromEntries(
      fieldNames.map((name) => [
        name,
        card.querySelector(`[name=${name}]`).value,
      ]),
    );

    status.textContent = 'Consultando CEP…';

    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        signal: controller.signal,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      if (current !== sequence || !card.isConnected) {
        return;
      }

      if (data.erro) {
        status.textContent =
          'CEP não encontrado. Confira o número ou preencha o endereço manualmente.';
        return;
      }

      const responseFields = {
        endereco: 'logradouro',
        bairro: 'bairro',
        cidade: 'localidade',
        estado: 'uf',
      };

      for (const [name, key] of Object.entries(responseFields)) {
        const field = card.querySelector(`[name=${name}]`);

        if (field.value === snapshot[name]) {
          field.value = data[key] || '';
        }
      }

      status.textContent =
        'Endereço consultado. Confira e complemente com número e complemento.';
    } catch {
      if (current === sequence && card.isConnected) {
        status.textContent =
          'Não foi possível consultar o CEP. Preencha o endereço manualmente.';
      }
    } finally {
      clearTimeout(timeout);
    }
  });

  return () => {
    sequence += 1;
    controller?.abort();
  };
}
