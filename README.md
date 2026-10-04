# Meu Carro, Minha Vida

Projeto acadêmico de desenvolvimento Front-End da UNISUAM, desenvolvido para simular um portal de veículos com catálogo, cadastro e área do cliente.

O projeto utiliza HTML, CSS e JavaScript. O armazenamento é feito no `localStorage` do navegador, conforme o enunciado da disciplina. Não há servidor, processamento de pagamentos ou envio de reclamações para uma equipe de atendimento.

## Funcionalidades

- Catálogo de veículos dividido em categorias.
- Cadastro com validações de dados e consulta de endereço pelo CEP via ViaCEP.
- Login, identificação do usuário no menu e saída da conta.
- Área do cliente com perfil e formulário de interesse.
- Visualização das preferências enviadas no formulário de interesse.
- Simulação de compras por PIX, cartão e financiamento.
- Número do cartão limitado a 16 dígitos e seleção de parcelas.
- Endereço da compra preenchido a partir do cadastro.
- Histórico de compras e cancelamento com confirmação dentro da página.
- Registro de reclamações relacionadas a compras, com protocolo sequencial e opção de exclusão.
- Controles de contraste e tamanho de fonte.
- Páginas de acesso negado e erro 404.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.8
- API ViaCEP
- localStorage

## Estrutura do projeto

```text
meu-carro-minha-vida/
├── index.html             # Página inicial e catálogo
├── cadastro.html          # Cadastro de usuário
├── login.html             # Entrada na conta
├── dashboard.html         # Perfil, compras e reclamações
├── interesse.html         # Formulário de interesse
├── resultado.html         # Preferências informadas
├── compra.html            # Simulação da compra
├── acesso-negado.html     # Acesso sem autenticação
├── 404.html               # Página de erro
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/                # Imagens e ícones
```

## Como executar

1. Baixe o projeto completo e mantenha a organização das pastas.
2. Abra a pasta em um editor, como o Visual Studio Code.
3. Para desenvolvimento, utilize um servidor local, como a extensão Live Server, e abra `index.html` por ele.
4. Faça o cadastro e entre com o login e a senha cadastrados.
5. Navegue pelo catálogo, simule compras e consulte os registros na Minha área.

É necessária conexão com a internet para carregar o Bootstrap e consultar o CEP. Use sempre o mesmo endereço do site e navegador para consultar os dados salvos. Abrir diretamente os arquivos com `file://` pode apresentar diferenças no compartilhamento do localStorage entre páginas.

## Dados e limitações da simulação

Os dados ficam no navegador utilizado. Limpar os dados do site pode apagar o cadastro, as compras e as reclamações. Os registros não são compartilhados entre navegadores ou dispositivos.

O cadastro e o login são uma simulação acadêmica e não oferecem a segurança de um sistema com servidor. Utilize dados fictícios, especialmente no preenchimento de senhas e números de cartão. Nenhuma compra realiza cobrança, e o cancelamento apenas altera o registro local.

Os protocolos das reclamações seguem uma sequência, como `REC-001` e `REC-002`. A confirmação de exclusão é integrada à página, sem utilizar caixas de diálogo do navegador.
