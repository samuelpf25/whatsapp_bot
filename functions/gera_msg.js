import {  clientes,
    niveis,
    subniveis,
    msgs,
    primeiro_contatos,
    atendentes,
    cliente,
    nivel,
    subnivel,
    stagios,
    primeiro_contato,
    atendente,
    mensagens,
    modo_consulta,
    modifica_modo_consulta,
    modifica_consulta,
    modifica_consultando,
    modifica_atendente,
    protocolos } from "../main.js"

var mensagem = ""
import {consultaDado, getDoc, resultado} from "./google_sheets.js"
import {gerar_protocolo} from "./protocolo.js"


export function gerar_mensagem(client, message, nivel, subnivel, primeiro_contato) {
    console.log("CLIENTE " + client);
    console.log("MESSAGE " + message);
    console.log("MESSAGE FROM " + message.from);
    console.log("NIVEL " + nivel);
    console.log("SUBNIVEL " + subnivel);
    console.log("PRIMEIRO CONTATO " + primeiro_contato);
  
    if (
      clientes[message.from] == client &&
      primeiro_contatos[message.from] != undefined
    ) {
      console.log("CLIENTE EXISTENTE!");
      primeiro_contato = primeiro_contatos[message.from];
      nivel = niveis[message.from];
      subnivel = subniveis[message.from];
    }
    console.log(primeiro_contato);
  
    if (message.body === "#") {
      //encaminhar para atendente
      console.log("ENCAMINHAR PARA ATENDENTE!");
      client.markUnseenMessage(message.from);
      mensagem =
        "Tudo bem, estarei encaminhando você para um de nossos atendentes, em breve eles irão respondê-lo. Obrigado🙂!";
      //nivel, subnivel, primeiro_contato = inicio()
      nivel = "inicio";
      subnivel = "0";
      primeiro_contato = true;
      msgs[message.from] = mensagem;
      //clientes[message.from] = client
      niveis[message.from] = nivel;
      subniveis[message.from] = subnivel;
      atendentes[message.from] = true;
      atendente = atendentes[message.from];
    } else if (message.body === "*") {
      console.log("FINALIZAR ATENDIMENTO!");
      mensagem =
        "Atendimento finalizado! Agradecemos o seu contato😉.\nA qualquer momento nos envie uma nova mensagem para iniciar outro atendimento😎.";
      mensagem += "\n\nprotocolo de atendimento: " + protocolos[message.from] 
      //nivel, subnivel, primeiro_contato = inicio()
      nivel = "inicio";
      subnivel = "0";
      primeiro_contato = true;
      primeiro_contatos[message.from] = primeiro_contato;
      msgs[message.from] = mensagem;
      //clientes[message.from] = client
      niveis[message.from] = nivel;
      subniveis[message.from] = subnivel;
      atendentes[message.from] = false;
      modifica_atendente(atendentes[message.from])
      //atendente = atendentes[message.from];
    } else if(modo_consulta){
      //pesquisar dados
      modifica_consulta((message.body).replace(' ',''))
      modifica_consultando(true)
      consultaDado(message.body,message,client)/*.then(resultado => {
        console.log('consultando dados de pesquisa...')        
        nivel = "inicio"
        subnivel = "0"
        modifica_modo_consulta(false)
        console.log('Apresentando resultados: ')
        console.log(resultado)
      })

      console.log('finalizou a consulta!')*/
      nivel = "inicio";
      subnivel = "0";
      primeiro_contato = false;


    }else {
      if (primeiro_contato) {
        //PRIMEIRO CONTATO
        console.log("PRIMEIRO CONTATO!");
        protocolos[message.from] = gerar_protocolo()
        primeiro_contatos[message.from] = false;
        mensagem = mensagens[nivel][subnivel];
        mensagem += "\n\nprotocolo de atendimento: " + protocolos[message.from] 
        msgs[message.from] = mensagem;
        clientes[message.from] = client;
        niveis[message.from] = nivel;
        subniveis[message.from] = subnivel;
        
      } else {
        if (nivel != "inicio") {
          //nivel atribuído
          //atribuindo subníveis
  
          if (mensagens[nivel][subnivel + "." + message.body] != undefined) {
            console.log("ATRIBUINDO SUBNÍVEIS!");
            //opção válida
            subnivel = subnivel + "." + message.body;

            mensagem = mensagens[nivel][subnivel];
  
            msgs[message.from] = mensagem;
            subniveis[message.from] = subnivel;

            if (subnivel==="1.1"){
              modifica_modo_consulta(true)
            }

          } else {
            if (message.body === "0") {
              //retornar ao menu inicial
              console.log("RETORNANDO AO MENU INICIAL");
              //nivel, subnivel, primeiro_contato = inicio()
              nivel = "inicio";
              subnivel = "0";
              primeiro_contato = false;
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              primeiro_contatos[message.from] = primeiro_contato;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
  
              console.log("***NIVEL " + nivel);
              console.log("***SUBNIVEL " + subnivel);
              console.log("***PRIMEIRO CONTATO " + primeiro_contato);
            } else {
              //opção inexistente
              mensagem = "Por favor, selecione uma opção válida.";
              msgs[message.from] = mensagem;
            }
          }
        } else {
          //atribuindo niveis
          console.log("ATRIBUINDO NÍVEL!");
          if (mensagens[nivel][subnivel] != undefined) {
            //opção válida
  
            if (message.body === "1") {
              nivel = "manutencao";
              subnivel = "1";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else if (message.body === "2") {
              nivel = "limpeza";
              subnivel = "2";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else if (message.body === "3") {
              nivel = "rurais";
              subnivel = "3";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else if (message.body === "4") {
              nivel = "transporte";
              subnivel = "4";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else if (message.body === "5") {
              nivel = "agua";
              subnivel = "5";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else if (message.body === "6") {
              nivel = "seguranca";
              subnivel = "6";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else if (message.body === "7") {
              nivel = "ajuda";
              subnivel = "7";
  
              niveis[message.from] = nivel;
              subniveis[message.from] = subnivel;
              mensagem = mensagens[nivel][subnivel];
              msgs[message.from] = mensagem;
            } else {
              mensagem = "Por favor, selecione uma opção válida.";
              msgs[message.from] = mensagem;
            }
          } else {
            //opção inexistente
            mensagem = "Por favor, selecione uma opção válida.";
            msgs[message.from] = mensagem;
          }
        }
      }
    }
    return msgs[message.from];
  }