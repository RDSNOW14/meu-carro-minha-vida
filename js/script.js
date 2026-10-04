// ==================== CADASTRO ====================

const campoCep = document.getElementById("cep");
const campoCpf = document.getElementById("cpf");
const campoNome = document.getElementById("nome");
const campoTelefone = document.getElementById("telefoneFixo");
const campoCelular = document.getElementById("celular");
const campoLogin = document.getElementById("login");
const campoSenha = document.getElementById("senha");
const campoConfirmarSenha = document.getElementById("confirmarSenha");
const formularioCadastro = document.getElementById("formCadastro");

// CEP
if (campoCep) {
    campoCep.addEventListener("input", function () {
        const cep = campoCep.value.replace(/\D/g, "");
        if (cep.length === 8) buscarCep();
        else limparEndereco();
    });
}

async function buscarCep() {
    const cep = campoCep.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        mostrarMensagemCadastro("Digite um CEP válido com 8 números.", "danger");
        return false;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            mostrarMensagemCadastro("CEP não encontrado.", "danger");
            limparEndereco();
            return false;
        }

        document.getElementById("logradouro").value = dados.logradouro;
        document.getElementById("bairro").value = dados.bairro;
        document.getElementById("cidade").value = dados.localidade;
        document.getElementById("uf").value = dados.uf;
        return true;
    } catch (erro) {
        console.error("Erro ao consultar CEP:", erro);
        mostrarMensagemCadastro("Não foi possível consultar o CEP.", "danger");
        return false;
    }
}

function limparEndereco() {
    ["logradouro", "bairro", "cidade", "uf"].forEach(function (id) {
        document.getElementById(id).value = "";
    });
}

// CPF
if (campoCpf) {
    campoCpf.addEventListener("input", function () {
        let cpf = campoCpf.value.replace(/\D/g, "").substring(0, 11);

        if (cpf.length <= 3) {
            campoCpf.value = cpf;
        } else if (cpf.length <= 6) {
            campoCpf.value = cpf.substring(0, 3) + "." + cpf.substring(3);
        } else if (cpf.length <= 9) {
            campoCpf.value = cpf.substring(0, 3) + "." +
                cpf.substring(3, 6) + "." + cpf.substring(6);
        } else {
            campoCpf.value = cpf.substring(0, 3) + "." +
                cpf.substring(3, 6) + "." +
                cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
        }
    });

    campoCpf.addEventListener("blur", validarCPF);
}

function validarCPF() {
    const cpf = campoCpf.value.replace(/\D/g, "");

    if (cpf.length !== 11) {
        mostrarMensagemCampo("mensagemCPF", campoCpf,
            "O CPF deve possuir 11 números.", "danger");
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        mostrarMensagemCampo("mensagemCPF", campoCpf, "CPF inválido.", "danger");
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = soma % 11;
    const primeiroDigito = resto < 2 ? 0 : 11 - resto;

    if (primeiroDigito !== Number(cpf[9])) {
        mostrarMensagemCampo("mensagemCPF", campoCpf, "CPF inválido.", "danger");
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = soma % 11;
    const segundoDigito = resto < 2 ? 0 : 11 - resto;

    if (segundoDigito !== Number(cpf[10])) {
        mostrarMensagemCampo("mensagemCPF", campoCpf, "CPF inválido.", "danger");
        return false;
    }

    mostrarMensagemCampo("mensagemCPF", campoCpf, "CPF válido.", "success");
    return true;
}

// NOME
if (campoNome) campoNome.addEventListener("blur", validarNome);

function validarNome() {
    const nome = campoNome.value.trim();

    if (nome.length < 15 || nome.length > 80) {
        mostrarMensagemCampo("mensagemNome", campoNome,
            "O nome deve possuir entre 15 e 80 caracteres.", "danger");
        return false;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        mostrarMensagemCampo("mensagemNome", campoNome,
            "O nome deve conter somente letras.", "danger");
        return false;
    }

    mostrarMensagemCampo("mensagemNome", campoNome, "Nome válido.", "success");
    return true;
}

// TELEFONES
function aplicarMascaraTelefone(evento) {
    let numero = evento.target.value.replace(/\D/g, "").substring(0, 12);

    if (numero === "") {
        evento.target.value = "";
        return;
    }

    let resultado = "(+55)";
    if (numero.length > 2) resultado += numero.substring(2, 4);
    if (numero.length > 4) resultado += "-" + numero.substring(4);

    evento.target.value = resultado;
}

function validarTelefone(evento) {
    const valido = evento.target.value.replace(/\D/g, "").length === 12;
    evento.target.classList.toggle("is-valid", valido);
    evento.target.classList.toggle("is-invalid", !valido);
    return valido;
}

[campoTelefone, campoCelular].forEach(function (campo) {
    if (campo) {
        campo.addEventListener("input", aplicarMascaraTelefone);
        campo.addEventListener("blur", validarTelefone);
    }
});

// LOGIN E SENHA
function limitarLetras(campo, limite) {
    if (!campo) return;

    campo.addEventListener("input", function () {
        campo.value = campo.value
            .replace(/[^A-Za-zÀ-ÿ]/g, "")
            .substring(0, limite);
    });
}

limitarLetras(campoLogin, 6);
limitarLetras(campoSenha, 8);
limitarLetras(campoConfirmarSenha, 8);

if (campoLogin) campoLogin.addEventListener("blur", validarLogin);
if (campoSenha) campoSenha.addEventListener("blur", validarSenha);
if (campoConfirmarSenha)
    campoConfirmarSenha.addEventListener("blur", validarConfirmacaoSenha);

function validarLogin() {
    if (campoLogin.value.length !== 6) {
        mostrarMensagemCampo("mensagemLoginCadastro", campoLogin,
            "O login deve possuir exatamente 6 letras.", "danger");
        return false;
    }

    mostrarMensagemCampo("mensagemLoginCadastro", campoLogin,
        "Login válido.", "success");
    return true;
}

function validarSenha() {
    if (campoSenha.value.length !== 8) {
        mostrarMensagemCampo("mensagemSenha", campoSenha,
            "A senha deve possuir exatamente 8 letras.", "danger");
        return false;
    }

    mostrarMensagemCampo("mensagemSenha", campoSenha, "Senha válida.", "success");
    return true;
}

function validarConfirmacaoSenha() {
    const confirmacao = campoConfirmarSenha.value;

    if (confirmacao.length !== 8) {
        mostrarMensagemCampo("mensagemConfirmarSenha", campoConfirmarSenha,
            "A confirmação deve possuir 8 letras.", "danger");
        return false;
    }

    if (campoSenha.value !== confirmacao) {
        mostrarMensagemCampo("mensagemConfirmarSenha", campoConfirmarSenha,
            "As senhas não são iguais.", "danger");
        return false;
    }

    mostrarMensagemCampo("mensagemConfirmarSenha", campoConfirmarSenha,
        "Senhas iguais.", "success");
    return true;
}

// MENSAGENS
function mostrarMensagemCampo(id, campo, texto, tipo) {
    let mensagem = document.getElementById(id);

    if (!mensagem) {
        mensagem = document.createElement("div");
        mensagem.id = id;
        campo.parentNode.appendChild(mensagem);
    }

    mensagem.className = `mt-1 text-${tipo}`;
    mensagem.textContent = texto;
}

function mostrarMensagemCadastro(texto, tipo) {
    const mensagem = document.getElementById("mensagemCadastro");
    if (!mensagem) return;

    mensagem.className = `alert alert-${tipo} mt-3`;
    mensagem.textContent = texto;
}

// SALVAR CADASTRO
if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nomeValido = validarNome();
        const cpfValido = validarCPF();
        const loginValido = validarLogin();
        const senhaValida = validarSenha();
        const confirmacaoValida = validarConfirmacaoSenha();

        const telefoneValido =
            campoTelefone.value.replace(/\D/g, "").length === 12;
        const celularValido =
            campoCelular.value.replace(/\D/g, "").length === 12;

        const logradouro = document.getElementById("logradouro").value;
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;

        const enderecoValido =
            logradouro !== "" && bairro !== "" && cidade !== "" && uf !== "";

        if (!nomeValido || !cpfValido || !loginValido ||
            !senhaValida || !confirmacaoValida ||
            !telefoneValido || !celularValido || !enderecoValido) {

            mostrarMensagemCadastro(
                "Verifique os campos do cadastro antes de continuar.", "danger"
            );
            return;
        }

        const usuario = {
            nome: campoNome.value.trim(),
            cpf: campoCpf.value,
            cep: campoCep.value,
            logradouro: logradouro,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            telefoneFixo: campoTelefone.value,
            celular: campoCelular.value,
            login: campoLogin.value,
            senha: campoSenha.value
        };

        localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));
        mostrarMensagemCadastro("Cadastro realizado com sucesso!", "success");
    });
}

//  LOGIN 

const formularioLogin = document.getElementById("formLogin");
const loginEntrada = document.getElementById("loginEntrada");
const senhaEntrada = document.getElementById("senhaEntrada");

limitarLetras(loginEntrada, 6);
limitarLetras(senhaEntrada, 8);

if (formularioLogin) {
    formularioLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const usuarioSalvo = localStorage.getItem("usuarioCadastrado");

        if (!usuarioSalvo) {
            mostrarMensagemEntrada(
                "Nenhum usuário cadastrado. Crie uma conta primeiro.", "danger"
            );
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        if (loginEntrada.value === usuario.login &&
            senhaEntrada.value === usuario.senha) {

            const sessao = {
                nome: usuario.nome,
                login: usuario.login,
                logado: true
            };

            localStorage.setItem("usuarioLogado", JSON.stringify(sessao));
            mostrarMensagemEntrada("Login realizado com sucesso!", "success");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);
        } else {
            mostrarMensagemEntrada("Login ou senha inválidos.", "danger");
        }
    });
}

function mostrarMensagemEntrada(texto, tipo) {
    const mensagem = document.getElementById("mensagemLoginEntrada");
    if (!mensagem) return;

    mensagem.className = `alert alert-${tipo} mt-3`;
    mensagem.textContent = texto;
}


//  ÁREA RESTRITA 

const nomeUsuario = document.getElementById("nomeUsuario");
const botaoSair = document.getElementById("botaoSair");
const botaoPerfil = document.getElementById("botaoPerfil");
const areaPerfil = document.getElementById("areaPerfil");
const formularioInteresse = document.getElementById("formInteresse");
const resultadoTipo = document.getElementById("resultadoTipo");

// PROTEÇÃO
if (nomeUsuario || formularioInteresse || resultadoTipo) {
    const sessaoSalva = localStorage.getItem("usuarioLogado");

    if (!sessaoSalva) {
        window.location.href = "acesso-negado.html";
    } else {
        const sessao = JSON.parse(sessaoSalva);

        if (sessao.logado !== true) {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "acesso-negado.html";
        } else if (nomeUsuario) {
            nomeUsuario.textContent = sessao.nome;
        }
    }
}

// PERFIL
if (botaoPerfil && areaPerfil) {
    botaoPerfil.addEventListener("click", function () {
        if (!areaPerfil.classList.contains("d-none")) {
            areaPerfil.classList.add("d-none");
            botaoPerfil.textContent = "Ver meus dados";
            return;
        }

        const usuarioSalvo = localStorage.getItem("usuarioCadastrado");
        if (!usuarioSalvo) return;

        const usuario = JSON.parse(usuarioSalvo);

        document.getElementById("perfilNome").textContent = usuario.nome;
        document.getElementById("perfilCpf").textContent = usuario.cpf;
        document.getElementById("perfilCidade").textContent = usuario.cidade;
        document.getElementById("perfilUf").textContent = usuario.uf;
        document.getElementById("perfilCelular").textContent = usuario.celular;
        document.getElementById("perfilLogin").textContent = usuario.login;

        areaPerfil.classList.remove("d-none");
        botaoPerfil.textContent = "Ocultar meus dados";
    });
}

// LOGOUT
if (botaoSair) {
    botaoSair.addEventListener("click", function () {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

//  INTERESSE 

const faixaPreco = document.getElementById("faixaPreco");
const valorFaixa = document.getElementById("valorFaixa");

if (faixaPreco && valorFaixa) {
    function atualizarValorFaixa() {
        valorFaixa.textContent = Number(faixaPreco.value).toLocaleString(
            "pt-BR",
            { style: "currency", currency: "BRL", maximumFractionDigits: 0 }
        );
    }

    atualizarValorFaixa();
    faixaPreco.addEventListener("input", atualizarValorFaixa);
}

if (formularioInteresse) {
    formularioInteresse.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const tipo = document.getElementById("tipoVeiculo").value;
        const uso = document.querySelector('input[name="usoVeiculo"]:checked');
        const cor = document.getElementById("corPreferida").value;
        const observacoes = document.getElementById("observacoes").value.trim();

        const caracteristicas = Array.from(
            document.querySelectorAll(".caracteristica:checked")
        ).map(function (caixa) {
            return caixa.value;
        });

        if (tipo === "" || !uso || cor === "") {
            mostrarMensagemInteresse(
                "Preencha os campos obrigatórios antes de continuar.", "danger"
            );
            return;
        }

        if (caracteristicas.length === 0) {
            mostrarMensagemInteresse(
                "Selecione pelo menos uma característica importante.", "danger"
            );
            return;
        }

        const interesse = {
            tipo: tipo,
            preco: Number(faixaPreco.value),
            uso: uso.value,
            caracteristicas: caracteristicas,
            cor: cor,
            observacoes: observacoes
        };

        localStorage.setItem("interesseUsuario", JSON.stringify(interesse));
        mostrarMensagemInteresse("Interesse salvo com sucesso!", "success");

        setTimeout(function () {
            window.location.href = "resultado.html";
        }, 700);
    });
}

function mostrarMensagemInteresse(texto, tipo) {
    const mensagem = document.getElementById("mensagemInteresse");
    if (!mensagem) return;

    mensagem.className = `alert alert-${tipo} mt-3`;
    mensagem.textContent = texto;
}

//  RESULTADO 

if (resultadoTipo) {
    const interesseSalvo = localStorage.getItem("interesseUsuario");

    const resultadoPreco = document.getElementById("resultadoPreco");
    const resultadoUso = document.getElementById("resultadoUso");
    const resultadoCor = document.getElementById("resultadoCor");
    const resultadoCaracteristicas =
        document.getElementById("resultadoCaracteristicas");
    const resultadoObservacoes =
        document.getElementById("resultadoObservacoes");

    if (!interesseSalvo) {
        resultadoTipo.textContent = "Nenhum interesse cadastrado.";
        resultadoPreco.textContent = "-";
        resultadoUso.textContent = "-";
        resultadoCor.textContent = "-";
        resultadoCaracteristicas.textContent = "-";
        resultadoObservacoes.textContent = "-";
    } else {
        const interesse = JSON.parse(interesseSalvo);

        resultadoTipo.textContent = interesse.tipo;
        resultadoPreco.textContent = interesse.preco.toLocaleString(
            "pt-BR",
            { style: "currency", currency: "BRL", maximumFractionDigits: 0 }
        );

        resultadoUso.textContent = interesse.uso;
        resultadoCor.textContent = interesse.cor;
        resultadoCaracteristicas.textContent =
            interesse.caracteristicas.join(", ");

        resultadoObservacoes.textContent =
            interesse.observacoes !== ""
                ? interesse.observacoes
                : "Nenhuma observação informada.";
    }
}

//  ACESSIBILIDADE 

const botaoAumentarFonte = document.getElementById("aumentarFonte");
const botaoDiminuirFonte = document.getElementById("diminuirFonte");
const botaoContraste = document.getElementById("alternarContraste");

let tamanhoFonte = Number(localStorage.getItem("tamanhoFonte")) || 0;
const contrasteSalvo = localStorage.getItem("altoContraste");

aplicarTamanhoFonte();

if (contrasteSalvo === "true") {
    document.body.classList.add("alto-contraste");
}

if (botaoAumentarFonte) {
    botaoAumentarFonte.addEventListener("click", function () {
        if (tamanhoFonte < 2) {
            tamanhoFonte++;
            aplicarTamanhoFonte();
            localStorage.setItem("tamanhoFonte", tamanhoFonte);
        }
    });
}

if (botaoDiminuirFonte) {
    botaoDiminuirFonte.addEventListener("click", function () {
        if (tamanhoFonte > 0) {
            tamanhoFonte--;
            aplicarTamanhoFonte();
            localStorage.setItem("tamanhoFonte", tamanhoFonte);
        }
    });
}

function aplicarTamanhoFonte() {
    document.body.classList.remove("fonte-grande", "fonte-extra-grande");

    if (tamanhoFonte === 1)
        document.body.classList.add("fonte-grande");

    if (tamanhoFonte === 2)
        document.body.classList.add("fonte-extra-grande");
}

if (botaoContraste) {
    botaoContraste.addEventListener("click", function () {
        document.body.classList.toggle("alto-contraste");

        const ativado =
            document.body.classList.contains("alto-contraste");

        localStorage.setItem("altoContraste", ativado);
    });
}

//  MENU INICIAL

const linkConta = document.getElementById("linkConta");

if (linkConta) {
    const sessaoSalva = localStorage.getItem("usuarioLogado");

    if (sessaoSalva) {
        const sessao = JSON.parse(sessaoSalva);

        if (sessao.logado === true) {
            linkConta.textContent = "Minha área";
            linkConta.href = "dashboard.html";
        }
    }
}

// MOSTRAR SENHAS

function configurarMostrarSenha(idCampo, idBotao) {
    const campo = document.getElementById(idCampo);
    const botao = document.getElementById(idBotao);

    if (!campo || !botao) return;

    botao.addEventListener("click", function () {
        if (campo.type === "password") {
            campo.type = "text";
            botao.textContent = "Ocultar";
        } else {
            campo.type = "password";
            botao.textContent = "Mostrar";
        }
    });
}

configurarMostrarSenha("senha", "mostrarSenha");
configurarMostrarSenha("confirmarSenha", "mostrarConfirmarSenha");
configurarMostrarSenha("senhaEntrada", "mostrarSenhaEntrada");

// Selecionar tipo do carro
const campoTipoVeiculo = document.getElementById("tipoVeiculo");

if (campoTipoVeiculo) {
    const parametros = new URLSearchParams(window.location.search);
    const tipoRecebido = parametros.get("tipo");

    if (tipoRecebido) {
        campoTipoVeiculo.value = tipoRecebido;
    }
}