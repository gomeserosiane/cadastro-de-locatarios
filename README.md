# ADM Gomes & Rosiane | Cadastro de Locatários

Aplicação estática em HTML5, CSS3 e JavaScript ES6+, sem dependências, backend ou armazenamento persistente.

## Executar

Na pasta do projeto, execute `python3 -m http.server 8080` e abra http://localhost:8080. Use um servidor HTTP: módulos ES não funcionam abrindo index.html diretamente pelo protocolo file.

## Deploy na Vercel

Importe esta pasta em um repositório. Na Vercel, selecione Other, sem comando de build, diretório de saída `.`. O arquivo vercel.json adiciona cabeçalhos de privacidade. Utilize HTTPS. O deploy Vercel exige sua conta; este pacote não inclui credenciais.

## Organização

CSS separado por seção, variáveis, animações e responsividade. JavaScript dividido entre locatários, validação, ViaCEP, documentos, WhatsApp, animações e integração principal. `assets/images` está disponível para a marca oficial.

## Logomarca

Substitua o span `.logo` do header por uma imagem em assets/images, com alt="ADM Gomes & Rosiane". O símbolo atual indica apenas espaço reservado, sem representar marca oficial. Favicon substituível em assets/icons/favicon.svg.

## Fluxo e limitações

Aceita 1–3 locatários. Confirma a exclusão dos últimos cards preenchidos. CPF é validado pelos dígitos verificadores; isso não verifica titularidade. CEP usa ViaCEP com timeout, cancelamento de consultas antigas e edição manual. Informe número e complemento no campo Endereço.

Documentos: JPG, PNG ou PDF até 10 MB, com verificação de assinatura inicial e extensão. Isso não equivale a antivírus nem autenticação documental. Identificação de frente/verso e legibilidade é assistida pelo usuário; nenhum OCR é executado. A câmera depende do dispositivo e pode oferecer seletor de fotos; fotos HEIC devem ser convertidas para JPG/PNG. PDFs mostram o nome do arquivo.

Documentos ficam em memória. URLs de objetos são revogadas ao remover, substituir, limpar ou sair. Recarregar/sair descarta o cadastro. Salve cópias de fotos capturadas antes de sair: o download depende do navegador, especialmente no iOS. Não há analytics, localStorage ou logs de dados pessoais.

Enviar dados abre revisão com mensagem e lista de anexos. Abrir WhatsApp é uma ação explícita e usa encodeURIComponent. Os documentos NÃO são anexados automaticamente. A mensagem precisa ser enviada e os arquivos anexados pelo usuário. Não há confirmação de entrega. Links longos podem encontrar limites no navegador/WhatsApp; nesse caso reduza textos excessivos. O texto codificado é incluído na URL do WhatsApp e pode entrar no histórico. O consentimento é local, sem registro permanente. A operação de tratamento e retenção pelo administrador deve ser definida por ele; não há declaração de conformidade jurídica.

## Verificação

Execute `node tests.mjs` para verificar CPF, máscaras e formato/codificação da mensagem. Verifique manualmente câmera em aparelho real, fluxo WhatsApp, downloads, teclado, erros de rede e layouts em 360, 768 e 1440px antes do uso operacional. Não são simulados resultados de envio.
