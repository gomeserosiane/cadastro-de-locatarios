export const fieldDefinitions = [
  ['nome', 'Nome completo', 'wide'],
  ['cpf', 'CPF', ''],
  ['rg', 'RG', ''],
  ['nacionalidade', 'Nacionalidade', ''],
  ['civil', 'Estado civil', 'half'],
  ['profissao', 'Profissão', 'half'],
  ['telefone', 'Telefone (WhatsApp)', 'half'],
  ['email', 'E-mail', 'half'],
  ['cep', 'CEP', ''],
  ['endereco', 'Endereço', 'wide'],
  ['bairro', 'Bairro', ''],
  ['cidade', 'Cidade', ''],
  ['estado', 'Estado', ''],
];

const states =
  'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(
    ' ',
  );
const civilStates = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'Separado(a)',
  'União estável',
];

function createSelect(id, name) {
  const values = name === 'estado' ? states : civilStates;
  const options = values.map((value) => `<option>${value}</option>`).join('');

  return `
    <select
      id="${id}"
      name="${name}"
      required
      data-field
      aria-describedby="${id}-error"
    >
      <option value="">Selecione</option>
      ${options}
    </select>
  `;
}

function createInput(id, name, tenantNumber) {
  const type = name === 'email' ? 'email' : name === 'telefone' ? 'tel' : 'text';
  const maxLengths = {
    cpf: 14,
    cep: 9,
    telefone: 15,
    email: 254,
  };
  const maxlength = maxLengths[name] ?? 160;
  const inputmode = ['cpf', 'cep', 'telefone'].includes(name)
    ? 'numeric'
    : name === 'email'
      ? 'email'
      : '';
  const autocompleteFields = {
    nome: 'name',
    telefone: 'tel',
    email: 'email',
    cep: 'postal-code',
    endereco: 'street-address',
    cidade: 'address-level2',
    estado: 'address-level1',
  };
  const autocomplete = autocompleteFields[name] ?? 'off';

  return `
    <input
      id="${id}"
      name="${name}"
      type="${type}"
      data-field
      required
      maxlength="${maxlength}"
      ${inputmode ? `inputmode="${inputmode}"` : ''}
      autocomplete="section-tenant${tenantNumber} ${autocomplete}"
      aria-describedby="${id}-error"
    >
  `;
}

function field(tenantNumber, [name, label, className]) {
  const id = `t${tenantNumber}-${name}`;
  const control = ['civil', 'estado'].includes(name)
    ? createSelect(id, name)
    : createInput(id, name, tenantNumber);
  const cepStatus =
    name === 'cep' ? '<p class="hint cep-status" role="status"></p>' : '';

  return `
    <div class="field ${className}">
      <label for="${id}">
        ${label}
        <span aria-hidden="true">*</span>
      </label>
      ${control}
      <p class="error" id="${id}-error"></p>
      ${cepStatus}
    </div>
  `;
}

export function createTenant(tenantNumber) {
  const element = document.createElement('section');
  const number = String(tenantNumber).padStart(2, '0');

  element.className = 'tenant';
  element.dataset.tenant = tenantNumber;
  element.setAttribute('aria-labelledby', `tenant-title-${tenantNumber}`);
  element.innerHTML = `
    <div class="card-head">
      <span class="number">${number}</span>
      <div>
        <h2 id="tenant-title-${tenantNumber}">Locatário ${number}</h2>
        <p>Preencha todos os campos marcados com *</p>
      </div>
    </div>
    <div class="card-body">
      <p class="section-label">DADOS PESSOAIS E ENDEREÇO</p>
      <div class="fields">
        ${fieldDefinitions
          .map((definition) => field(tenantNumber, definition))
          .join('')}
      </div>
    </div>
  `;

  return element;
}

export function hasData(card) {
  return [...card.querySelectorAll('[data-field]')].some(
    (input) => input.value,
  );
}
