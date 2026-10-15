export const digits = (value) => value.replace(/\D/g, '');

export function validCPF(value) {
  const cpf = digits(value);

  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  return [9, 10].every((position) => {
    let sum = 0;

    for (let index = 0; index < position; index += 1) {
      sum += Number(cpf[index]) * (position + 1 - index);
    }

    const digit = (sum * 10) % 11;
    return Number(cpf[position]) === (digit === 10 ? 0 : digit);
  });
}

export function maskCPF(value) {
  return digits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCEP(value) {
  return digits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskPhone(value) {
  const phone = digits(value).slice(0, 11);

  if (phone.length <= 2) {
    return phone.replace(/^(\d{1,2})/, '($1');
  }

  if (phone.length <= 6) {
    return phone.replace(/^(\d{2})(\d+)/, '($1) $2');
  }

  if (phone.length <= 10) {
    return phone.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  }

  return phone.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
}

export function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function error(input, message) {
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  document.getElementById(`${input.id}-error`).textContent = message;
}

export function validateCard(card) {
  let valid = true;

  card.querySelectorAll('[data-field]').forEach((input) => {
    let message = '';

    if (!input.value.trim()) {
      message = 'Preencha este campo.';
    } else if (input.name === 'cpf' && !validCPF(input.value)) {
      message = 'Informe um CPF válido.';
    } else if (
      input.name === 'telefone' &&
      ![10, 11].includes(digits(input.value).length)
    ) {
      message = 'Informe um telefone com DDD.';
    } else if (input.name === 'email' && !validEmail(input.value)) {
      message = 'Informe um e-mail válido.';
    } else if (input.name === 'cep' && digits(input.value).length !== 8) {
      message = 'Informe um CEP com 8 dígitos.';
    } else if (
      input.name === 'nome' &&
      input.value.trim().split(/\s+/).length < 2
    ) {
      message = 'Informe o nome completo.';
    }

    error(input, message);

    if (message) {
      valid = false;
    }
  });

  return valid;
}
