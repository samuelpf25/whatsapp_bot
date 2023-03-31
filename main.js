// Supports ES6
// import { create, Whatsapp } from '@wppconnect-team/wppconnect';
//wppconnect = require("@wppconnect-team/wppconnect");
import wppconnect from "@wppconnect-team/wppconnect";
//import mensagens from './mensagens.json' assert {type: 'json'};
import { readFile } from "fs/promises";
import { readFileSync, writeFileSync } from "fs";
let credenciais = JSON.parse(readFileSync("./sheets.json", "utf8"));

// read file and make object
let mensagens = JSON.parse(readFileSync("./mensagens.json", "utf8"));
// edit or add property
//mensagens.expiry_date = 999999999999;
//write file

//var mensagens = require("./mensagens.json");
//https://emojiterra.com/pt/tecla-do-numero-1/
//const sendWpp = require("./functions/sendWpp")
//const sendWppMessage =  sendWpp.sendWppMessage
import { sendWppMessage } from "./functions/envia_msg.js";
import { gerar_mensagem } from "./functions/gera_msg.js";

/*mensagens = {
    "inicio": { "0": "👋 Olá, como vai? \n\nEu sou o *assistente virtual* da COINFRA. \n*Selecione uma opção abaixo:* 🙋‍♂️\n-----------------------------------\n1️⃣ - Manutenção Predial \n2️⃣ - Limpeza\n3️⃣ - Serviços Rurais\n4️⃣ - Transporte de Materiais \n" },
    "manutencao": {
      "1": "\nMANUTENÇÃO PREDIAL\n1️⃣ - Status atual de uma OS\n2️⃣ - Gostaria de agendar a execução de uma OS\n3️⃣ - Como faço para solicitar uma OS?\n4️⃣ - Erro de permissão nessária no formulário\n5️⃣- Nenhuma das opções anteriores\n0️⃣- Retornar ao menu inicial\n",
      "1.1": "Você pode consultar o Status de sua OS no seguinte link https://tinyurl.com/ConsultaManutencao\n\n",
      "1.2": "Para agendar uma OS você precisará informar o número da OS ou código da UFT. Com essa informação em mãos, basta acessar o link a seguir e preencher os dados solicitados https://tinyurl.com/AgendamentoManutencao\n\n",
      "1.3": "Para solicitar uma OS você precisará estar logado em seu e-mail institucional da UFT para realizar a solicitação por meio do seguinte formulário https://tinyurl.com/manutencaoPredialUFT\n\n",
      "1.4": "O Erro de Permissão Necessária acontece pois é necessário estar logado no e-mail institucional da UFT para acessar os formulários.\n Caso você já esteja logado no e-mail institucional e o erro persista, você pode tentar seguir as instruções do seguinte vídeo para resolução do problema https://tinyurl.com/ErroPermissao\n\n",
    },
    "limpeza": {
      "2": "\nLIMPEZA\n1️⃣ - Gostaria de fazer uma solicitação de limpeza\n2️⃣ - Estou tendo problemas com a rotina de limpeza em minha sala\n3️⃣",
      "2.1": "Existem rotinas de limpeza previstas para as edificações do Campus. Dessa forma, as solicitações de limpeza são somente para ocasiões excepcionais como Eventos e similares.\nCaso as rotinas de limpeza em sua edificação não estejam sendo seguidas adequadamente, você pode registrar uma reclamação para apurarmos.",
      "2.2": "Nesse caso você poderá registrar uma reclamação para nos informar o ocorrido."
    }
  }*/

var clientes = [];
var niveis = [];
var subniveis = [];
var msgs = [];
var primeiro_contatos = [];
var atendentes = [];
var consulta = "";
var protocolos = [];
var modo_consulta = false;
var consultando = false;

export function modifica_modo_consulta(dad) {
  modo_consulta = dad;
}

export function modifica_consultando(dad) {
  consultando = dad;
}

export function modifica_consulta(dad) {
  consulta = dad;
}

export function modifica_atendente(dad) {
  atendente = dad;
}

var cliente = "";
var nivel = "inicio";
var subnivel = "0";
var stagios = 0;
var mensagem = "";
var primeiro_contato = true;
var atendente = false;

export {
  clientes,
  niveis,
  subniveis,
  msgs,
  primeiro_contatos,
  atendentes,
  cliente,
  nivel,
  subnivel,
  stagios,
  mensagem,
  primeiro_contato,
  atendente,
  mensagens,
  credenciais,
  consulta,
  modo_consulta,
  protocolos
};

wppconnect
  .create({
    session: "sessionName", //Pass the name of the client you want to start the bot
    catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
      console.log("Number of attempts to read the qrcode: ", attempts);
      console.log("Terminal qrcode: ", asciiQR);
      console.log("base64 image string qrcode: ", base64Qrimg);
      console.log("urlCode (data-ref): ", urlCode);
    },
    statusFind: (statusSession, session) => {
      console.log("Status Session: ", statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      //Create session wss return "serverClose" case server for close
      console.log("Session name: ", session);
    },
    onLoadingScreen: (percent, message) => {
      console.log("LOADING_SCREEN", percent, message);
    },
    headless: false, // Headless chrome
    devtools: false, // Open devtools by default
    useChrome: true, // If false will use Chromium instance
    debug: false, // Opens a debug session
    logQR: true, // Logs QR automatically in terminal
    browserWS: "", // If u want to use browserWSEndpoint
    browserArgs: [""], // Parameters to be added into the chrome browser instance
    puppeteerOptions: {}, // Will be passed to puppeteer.launch
    disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
    updatesLog: true, // Logs info updates automatically in terminal
    autoClose: 60000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
    tokenStore: "file", // Define how work with tokens, that can be a custom interface
    folderNameToken: "./tokens", //folder name when saving tokens
    // BrowserSessionToken
    // To receive the client's token use the function await clinet.getSessionTokenBrowser()
    sessionToken: {
      WABrowserId: '"UnXjH....."',
      WASecretBundle:
        '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
      WAToken1: '"0i8...."',
      WAToken2: '"1@lPpzwC...."',
    },
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage((message) => {
    //writeFileSync('./mensagens.json', JSON.stringify(mensagens));
    mensagens = JSON.parse(readFileSync("./mensagens.json", "utf8"));

    clientes[message.from] = client;
    nivel = niveis[message.from];
    subnivel = subniveis[message.from];
    mensagem = msgs[message.from];
    primeiro_contato = primeiro_contatos[message.from];
    if (atendentes[message.from] == undefined) {
      atendentes[message.from] = false;
    }

    if (message.body === "*") {
      //finalizar o chat
      atendentes[message.from] = false;
    }
    atendente = atendentes[message.from];

    if (nivel == undefined) {
      nivel = "inicio";
      subnivel = "0";
      primeiro_contato = true;
    }
    console.log(nivel + " - " + subnivel);
    if (!message.isGroupMsg && !atendente) {
      mensagem = gerar_mensagem(
        client,
        message,
        nivel,
        subnivel,
        primeiro_contato
      );
      stagios += 1;
      
      if (!consultando) {
        sendWppMessage(client, mensagem, message, nivel, subnivel, stagios);
      }
     
    }
  });
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function inicio() {
  nivel = "inicio";
  subnivel = "0";
  primeiro_contato = true;
  return nivel, subnivel, primeiro_contato;
}
