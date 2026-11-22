// ==================== CAMPOS DO CADASTRO ====================

const campoCep = document.getElementById("cep");
const campoCpf = document.getElementById("cpf");
const campoNome = document.getElementById("nome");
const campoTelefone = document.getElementById("telefoneFixo");
const campoCelular = document.getElementById("celular");
const campoLogin = document.getElementById("login");
const campoSenha = document.getElementById("senha");
const campoConfirmarSenha = document.getElementById("confirmarSenha");
const formularioCadastro = document.getElementById("formCadastro");

// ==================== MENSAGENS ====================

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

function mostrarMensagemFormulario(id, texto, tipo) {
    const mensagem = document.getElementById(id);

    if (!mensagem) return;

    mensagem.className = `alert alert-${tipo} mt-3`;
    mensagem.textContent = texto;
}

function mostrarMensagemCadastro(texto, tipo) {
    mostrarMensagemFormulario("mensagemCadastro", texto, tipo);
}

function mostrarMensagemEntrada(texto, tipo) {
    mostrarMensagemFormulario("mensagemLoginEntrada", texto, tipo);
}

function mostrarMensagemInteresse(texto, tipo) {
    mostrarMensagemFormulario("mensagemInteresse", texto, tipo);
}

// ==================== CEP ====================

let consultaCepAtual = 0;
let cepConsultado = "";

if (campoCep) {
    campoCep.addEventListener("input", function () {
        const cep = campoCep.value
            .replace(/\D/g, "")
            .substring(0, 8);

        campoCep.value = cep.replace(/^(\d{5})(\d)/, "$1-$2");

        if (cep.length === 8) {
            buscarCep();
        } else {
            // Impede uma consulta anterior de preencher outro CEP.
            consultaCepAtual++;
            limparEndereco();
        }
    });
}

function limparEndereco() {
    cepConsultado = "";

    ["logradouro", "bairro", "cidade", "uf"].forEach(function (id) {
        const campo = document.getElementById(id);

        if (campo) campo.value = "";
    });
}

async function buscarCep() {
    if (!campoCep) return false;

    const cep = campoCep.value.replace(/\D/g, "");
    const numeroConsulta = ++consultaCepAtual;

    limparEndereco();

    if (cep.length !== 8) {
        mostrarMensagemCadastro(
            "Digite um CEP válido com 8 números.",
            "danger"
        );
        return false;
    }

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            throw new Error("Falha na consulta do CEP.");
        }

        const dados = await resposta.json();

        // Ignora respostas antigas caso o usuário altere o CEP.
        if (numeroConsulta !== consultaCepAtual) return false;

        if (dados.erro) {
            mostrarMensagemCadastro("CEP não encontrado.", "danger");
            return false;
        }

        document.getElementById("logradouro").value =
            dados.logradouro || "";

        document.getElementById("bairro").value =
            dados.bairro || "";

        document.getElementById("cidade").value =
            dados.localidade || "";

        document.getElementById("uf").value =
            dados.uf || "";

        cepConsultado = cep;

        mostrarMensagemCadastro(
            "Endereço preenchido pelo CEP.",
            "success"
        );

        return true;
    } catch (erro) {
        if (numeroConsulta !== consultaCepAtual) return false;

        console.error("Erro ao consultar CEP:", erro);

        mostrarMensagemCadastro(
            "Não foi possível consultar o CEP. Tente novamente.",
            "danger"
        );

        return false;
    }
}

// ==================== CPF ====================

if (campoCpf) {
    campoCpf.addEventListener("input", function () {
        const cpf = campoCpf.value
            .replace(/\D/g, "")
            .substring(0, 11);

        campoCpf.value = cpf
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2");
    });

    campoCpf.addEventListener("blur", validarCPF);
}

function validarCPF() {
    const cpf = campoCpf.value.replace(/\D/g, "");

    if (cpf.length !== 11) {
        mostrarMensagemCampo(
            "mensagemCPF",
            campoCpf,
            "O CPF deve possuir 11 números.",
            "danger"
        );
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        mostrarMensagemCampo(
            "mensagemCPF",
            campoCpf,
            "CPF inválido.",
            "danger"
        );
        return false;
    }

    for (let tamanho = 9; tamanho <= 10; tamanho++) {
        let soma = 0;

        for (let i = 0; i < tamanho; i++) {
            soma += Number(cpf[i]) * (tamanho + 1 - i);
        }

        const resto = soma % 11;
        const digito = resto < 2 ? 0 : 11 - resto;

        if (digito !== Number(cpf[tamanho])) {
            mostrarMensagemCampo(
                "mensagemCPF",
                campoCpf,
                "CPF inválido.",
                "danger"
            );
            return false;
        }
    }

    mostrarMensagemCampo(
        "mensagemCPF",
        campoCpf,
        "CPF válido.",
        "success"
    );

    return true;
}

// ==================== NOME ====================

if (campoNome) {
    campoNome.addEventListener("blur", validarNome);
}

function validarNome() {
    const nome = campoNome.value.trim();

    if (nome.length < 15 || nome.length > 80) {
        mostrarMensagemCampo(
            "mensagemNome",
            campoNome,
            "O nome deve possuir entre 15 e 80 caracteres.",
            "danger"
        );
        return false;
    }

    if (!/^[\p{L} ]+$/u.test(nome)) {
        mostrarMensagemCampo(
            "mensagemNome",
            campoNome,
            "O nome deve conter somente letras e espaços.",
            "danger"
        );
        return false;
    }

    mostrarMensagemCampo(
        "mensagemNome",
        campoNome,
        "Nome válido.",
        "success"
    );

    return true;
}

// ==================== TELEFONES ====================

function aplicarMascaraTelefone(evento) {
    const campo = evento.target;
    const limiteNacional = campo.id === "celular" ? 11 : 10;
    const valorOriginal = campo.value.trim();

    let numero = valorOriginal.replace(/\D/g, "");

    // Remove o código do país quando ele já estiver informado.
    const possuiPrefixo = /^\(?\+55\)?/.test(valorOriginal);
    const possuiCodigoCompleto =
        numero.startsWith("55") && numero.length > limiteNacional;

    if (possuiPrefixo || possuiCodigoCompleto) {
        numero = numero.substring(2);
    }

    numero = numero.substring(0, limiteNacional);

    if (numero === "") {
        campo.value = "";
        return;
    }

    const ddd = numero.substring(0, 2);
    const telefone = numero.substring(2);

    campo.value = "(+55)" + ddd;

    if (telefone !== "") {
        campo.value += "-" + telefone;
    }
}

function validarTelefone(evento) {
    const campo = evento.target;
    const numero = campo.value.replace(/\D/g, "");

    if (campo.id === "telefoneFixo" && numero === "") {
        campo.classList.remove("is-valid", "is-invalid");
        return true;
    }

    const limite = campo.id === "celular" ? 13 : 12;
    const valido =
        numero.startsWith("55") && numero.length === limite;

    campo.classList.toggle("is-valid", valido);
    campo.classList.toggle("is-invalid", !valido);

    return valido;
}

[campoTelefone, campoCelular].forEach(function (campo) {
    if (!campo) return;

    campo.addEventListener("input", aplicarMascaraTelefone);
    campo.addEventListener("blur", validarTelefone);
});

// ==================== LOGIN E SENHA DO CADASTRO ====================

function limitarLetras(campo, limite) {
    if (!campo) return;

    campo.addEventListener("input", function () {
        campo.value = campo.value
            .replace(/[^\p{L}]/gu, "")
            .substring(0, limite);
    });
}

limitarLetras(campoLogin, 6);
limitarLetras(campoSenha, 8);
limitarLetras(campoConfirmarSenha, 8);

if (campoLogin) {
    campoLogin.addEventListener("blur", validarLogin);
}

if (campoSenha) {
    campoSenha.addEventListener("blur", validarSenha);
}

if (campoConfirmarSenha) {
    campoConfirmarSenha.addEventListener(
        "blur",
        validarConfirmacaoSenha
    );
}

function validarLogin() {
    const valido = /^\p{L}{6}$/u.test(campoLogin.value);

    mostrarMensagemCampo(
        "mensagemLoginCadastro",
        campoLogin,
        valido
            ? "Login válido."
            : "O login deve possuir exatamente 6 letras.",
        valido ? "success" : "danger"
    );

    return valido;
}

function validarSenha() {
    const valido = /^\p{L}{8}$/u.test(campoSenha.value);

    mostrarMensagemCampo(
        "mensagemSenha",
        campoSenha,
        valido
            ? "Senha válida."
            : "A senha deve possuir exatamente 8 letras.",
        valido ? "success" : "danger"
    );

    return valido;
}

function validarConfirmacaoSenha() {
    const confirmacao = campoConfirmarSenha.value;

    if (!/^\p{L}{8}$/u.test(confirmacao)) {
        mostrarMensagemCampo(
            "mensagemConfirmarSenha",
            campoConfirmarSenha,
            "A confirmação deve possuir 8 letras.",
            "danger"
        );
        return false;
    }

    const valido = campoSenha.value === confirmacao;

    mostrarMensagemCampo(
        "mensagemConfirmarSenha",
        campoConfirmarSenha,
        valido ? "Senhas iguais." : "As senhas não são iguais.",
        valido ? "success" : "danger"
    );

    return valido;
}

// ==================== SALVAR CADASTRO ====================

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nomeValido = validarNome();
        const cpfValido = validarCPF();
        const loginValido = validarLogin();
        const senhaValida = validarSenha();
        const confirmacaoValida = validarConfirmacaoSenha();

        const telefoneValido = validarTelefone({
            target: campoTelefone
        });

        const celularValido = validarTelefone({
            target: campoCelular
        });

        const logradouro = document.getElementById("logradouro").value;
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = campoCep.value.replace(/\D/g, "");

        const enderecoValido =
            cep.length === 8 &&
            cepConsultado === cep &&
            logradouro.trim() !== "" &&
            bairro.trim() !== "" &&
            cidade.trim() !== "" &&
            uf.trim() !== "";

        if (
            !nomeValido ||
            !cpfValido ||
            !loginValido ||
            !senhaValida ||
            !confirmacaoValida ||
            !telefoneValido ||
            !celularValido ||
            !enderecoValido
        ) {
            mostrarMensagemCadastro(
                "Verifique os campos e aguarde o preenchimento do endereço pelo CEP.",
                "danger"
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

        localStorage.setItem(
            "usuarioCadastrado",
            JSON.stringify(usuario)
        );

        mostrarMensagemCadastro(
            "Cadastro realizado com sucesso!",
            "success"
        );
    });
}

// ==================== LOGIN ====================

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
                "Nenhum usuário cadastrado. Crie uma conta primeiro.",
                "danger"
            );
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        if (
            loginEntrada.value === usuario.login &&
            senhaEntrada.value === usuario.senha
        ) {
            const sessao = {
                nome: usuario.nome,
                login: usuario.login,
                logado: true
            };

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(sessao)
            );

            mostrarMensagemEntrada(
                "Login realizado com sucesso!",
                "success"
            );

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);
        } else {
            mostrarMensagemEntrada(
                "Login ou senha inválidos.",
                "danger"
            );
        }
    });
}

// ==================== ÁREA RESTRITA ====================

const nomeUsuario = document.getElementById("nomeUsuario");
const botaoSair = document.getElementById("botaoSair");
const botaoPerfil = document.getElementById("botaoPerfil");
const areaPerfil = document.getElementById("areaPerfil");
const formularioInteresse = document.getElementById("formInteresse");
const resultadoTipo = document.getElementById("resultadoTipo");

// PROTEÇÃO DAS PÁGINAS
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

        const camposPerfil = {
            perfilNome: usuario.nome,
            perfilCpf: usuario.cpf,
            perfilCidade: usuario.cidade,
            perfilUf: usuario.uf,
            perfilCelular: usuario.celular,
            perfilLogin: usuario.login
        };

        Object.entries(camposPerfil).forEach(function ([id, valor]) {
            const campo = document.getElementById(id);

            if (campo) campo.textContent = valor;
        });

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

// ==================== INTERESSE ====================

const faixaPreco = document.getElementById("faixaPreco");
const valorFaixa = document.getElementById("valorFaixa");
const campoTipoVeiculo = document.getElementById("tipoVeiculo");

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    });
}

if (faixaPreco && valorFaixa) {
    function atualizarValorFaixa() {
        valorFaixa.textContent = formatarPreco(faixaPreco.value);
    }

    atualizarValorFaixa();
    faixaPreco.addEventListener("input", atualizarValorFaixa);
}

// Seleciona a categoria recebida pelo link do catálogo.
if (campoTipoVeiculo) {
    const parametros = new URLSearchParams(window.location.search);
    const tipoRecebido = parametros.get("tipo");

    const tipoExiste = Array.from(campoTipoVeiculo.options).some(
        opcao => opcao.value === tipoRecebido
    );

    if (tipoRecebido && tipoExiste) {
        campoTipoVeiculo.value = tipoRecebido;
    }
}

if (formularioInteresse) {
    formularioInteresse.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const tipo = campoTipoVeiculo.value;
        const uso = document.querySelector(
            'input[name="usoVeiculo"]:checked'
        );

        const cor = document.getElementById("corPreferida").value;
        const observacoes = document
            .getElementById("observacoes")
            .value.trim();

        const caracteristicas = Array.from(
            document.querySelectorAll(".caracteristica:checked")
        ).map(function (caixa) {
            return caixa.value;
        });

        if (tipo === "" || !uso || cor === "") {
            mostrarMensagemInteresse(
                "Preencha os campos obrigatórios antes de continuar.",
                "danger"
            );
            return;
        }

        if (caracteristicas.length === 0) {
            mostrarMensagemInteresse(
                "Selecione pelo menos uma característica importante.",
                "danger"
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

        localStorage.setItem(
            "interesseUsuario",
            JSON.stringify(interesse)
        );

        mostrarMensagemInteresse(
            "Interesse salvo com sucesso!",
            "success"
        );

        setTimeout(function () {
            window.location.href = "resultado.html";
        }, 700);
    });
}

// ==================== RESULTADO ====================

if (resultadoTipo) {
    const interesseSalvo = localStorage.getItem("interesseUsuario");

    const resultadoPreco = document.getElementById("resultadoPreco");
    const resultadoUso = document.getElementById("resultadoUso");
    const resultadoCor = document.getElementById("resultadoCor");

    const resultadoCaracteristicas = document.getElementById(
        "resultadoCaracteristicas"
    );

    const resultadoObservacoes = document.getElementById(
        "resultadoObservacoes"
    );

    if (!interesseSalvo) {
        resultadoTipo.textContent = "Nenhum interesse cadastrado.";

        [
            resultadoPreco,
            resultadoUso,
            resultadoCor,
            resultadoCaracteristicas,
            resultadoObservacoes
        ].forEach(function (campo) {
            if (campo) campo.textContent = "-";
        });
    } else {
        const interesse = JSON.parse(interesseSalvo);

        resultadoTipo.textContent = interesse.tipo;
        resultadoPreco.textContent = formatarPreco(interesse.preco);
        resultadoUso.textContent = interesse.uso;
        resultadoCor.textContent = interesse.cor;

        resultadoCaracteristicas.textContent =
            interesse.caracteristicas.join(", ");

        resultadoObservacoes.textContent =
            interesse.observacoes || "Nenhuma observação informada.";
    }
}

// ==================== ACESSIBILIDADE ====================

const botaoAumentarFonte = document.getElementById("aumentarFonte");
const botaoDiminuirFonte = document.getElementById("diminuirFonte");
const botaoContraste = document.getElementById("alternarContraste");

let tamanhoFonte = Number(localStorage.getItem("tamanhoFonte")) || 0;
tamanhoFonte = Math.min(2, Math.max(0, Math.trunc(tamanhoFonte)));

aplicarTamanhoFonte();

if (localStorage.getItem("altoContraste") === "true") {
    document.body.classList.add("alto-contraste");
}

function aplicarTamanhoFonte() {
    document.body.classList.toggle(
        "fonte-grande",
        tamanhoFonte === 1
    );

    document.body.classList.toggle(
        "fonte-extra-grande",
        tamanhoFonte === 2
    );
}

function alterarTamanhoFonte(variacao) {
    tamanhoFonte = Math.min(
        2,
        Math.max(0, tamanhoFonte + variacao)
    );

    aplicarTamanhoFonte();
    localStorage.setItem("tamanhoFonte", tamanhoFonte);
}

if (botaoAumentarFonte) {
    botaoAumentarFonte.addEventListener("click", function () {
        alterarTamanhoFonte(1);
    });
}

if (botaoDiminuirFonte) {
    botaoDiminuirFonte.addEventListener("click", function () {
        alterarTamanhoFonte(-1);
    });
}

if (botaoContraste) {
    botaoContraste.addEventListener("click", function () {
        document.body.classList.toggle("alto-contraste");

        const ativado = document.body.classList.contains(
            "alto-contraste"
        );

        localStorage.setItem("altoContraste", ativado);
    });
}

// ==================== MENU INICIAL ====================

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

// ==================== MOSTRAR SENHAS ====================

function configurarMostrarSenha(idCampo, idBotao) {
    const campo = document.getElementById(idCampo);
    const botao = document.getElementById(idBotao);

    if (!campo || !botao) return;

    botao.addEventListener("click", function () {
        const mostrar = campo.type === "password";

        campo.type = mostrar ? "text" : "password";
        botao.textContent = mostrar ? "Ocultar" : "Mostrar";
    });
}

configurarMostrarSenha("senha", "mostrarSenha");
configurarMostrarSenha("confirmarSenha", "mostrarConfirmarSenha");
configurarMostrarSenha("senhaEntrada", "mostrarSenhaEntrada");