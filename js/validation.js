export const digits=v=>v.replace(/\D/g,'');
export function validCPF(value){const s=digits(value);if(!/^\d{11}$/.test(s)||/^(\d)\1{10}$/.test(s))return false;return [9,10].every(n=>{let sum=0;for(let i=0;i<n;i++)sum+=Number(s[i])*(n+1-i);const d=(sum*10)%11;return Number(s[n])===(d===10?0:d)});}
export function maskCPF(v){return digits(v).slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2')}
export function maskCEP(v){return digits(v).slice(0,8).replace(/(\d{5})(\d)/,'$1-$2')}
export function error(input,message){input.setAttribute('aria-invalid',message?'true':'false');document.getElementById(input.id+'-error').textContent=message;}
export function validateCard(card){let ok=true;card.querySelectorAll('[data-field]').forEach(input=>{let msg='';if(!input.value.trim())msg='Preencha este campo.';else if(input.name==='cpf'&&!validCPF(input.value))msg='Informe um CPF válido.';else if(input.name==='cep'&&digits(input.value).length!==8)msg='Informe um CEP com 8 dígitos.';else if(input.name==='nome'&&input.value.trim().split(/\s+/).length<2)msg='Informe o nome completo.';error(input,msg);if(msg)ok=false;});return ok;}
