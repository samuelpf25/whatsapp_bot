import {niveis} from "../main.js"

export function sendWppMessage(client, mensagem, message, nivel, subnivel, stagios) {
    console.log('Acessou envio de mensagem com a seguinte mensagem:\n' + mensagem)
    if (niveis[message.from] != "inicio") {
      //!primeiro_contato &&
      mensagem +=
        "\n\n0️⃣ - Retornar ao menu inicial\n#️⃣ - Falar com um atendente\n*️⃣ - Finalizar o atendimento";
    }
  
    client
      .sendText(message.from, mensagem) // + "\n" + nivel + "\n" + subnivel + "\n" + message.body + "\n" + stagios.toString()
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
  }

 /* module.exports.default = {
    sendWppMessage: sendWppMessage,
  };*/