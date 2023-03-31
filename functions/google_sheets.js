//https://jvvoliveira.medium.com/manipulando-google-sheets-com-node-js-4a551c68b270

import { GoogleSpreadsheet } from 'google-spreadsheet';
import {credenciais,consulta} from "../main.js"
import {sendWppMessage} from "./envia_msg.js"
import { 
    subniveis,
    msgs,
    subnivel,
    modifica_modo_consulta,
    modifica_consultando
} from "../main.js"

let sheet;
var resultado = "consultando..."


export const getDoc = async () => {
    try {
    const doc = new GoogleSpreadsheet(credenciais.id);
    
    await doc.useServiceAccountAuth({
        client_email: credenciais.client_email,
        private_key: credenciais.private_key.replace(/\\n/g, '\n')
    })
    await doc.loadInfo();
    return doc;
    }catch(e){
        console.log('A iniciar google sheets')
    }
}

getDoc().then(doc => {
    //console.log(doc.title);
    //lerDados(doc,'Carimbo de data/hora')
    console.log('Está executando esta parte')
    //resultado = consultaDado(doc,consulta)
});

export {resultado};

function lerDados(doc,coluna){
    sheet = doc.sheetsByIndex[0];
    sheet.getRows().then(rows => {
        rows.map(row => {
            console.log(row[coluna]);
        })
    })
}

export async function consultaDado(codigo,message,client){
    
    var doc = await Promise.resolve(getDoc())
    var dados = {}
    var mensagem=""
    sheet = doc.sheetsByIndex[0];
    sendWppMessage(client, "Certo, agora aguarde um momento que irei fazer a busca dos dados...\n", message, "inicio", "0", 1);
    sheet.getRows().then(rows => {
        rows.map(row => {
            if ((row['Código da UFT']===codigo || row['Ordem de Serviço']===codigo) && codigo!='0') {
                mensagem = "😀Encontrei o seguinte resultado com o número informado:"
                dados.os = row['Ordem de Serviço']
                mensagem += "\n\n☑️OS: " + dados.os

                dados.cod_uft = row['Código da UFT']
                mensagem += "\n\n☑️CÓDIGO UFT: " + dados.cod_uft

                dados.data = row['DATASOL']
                mensagem += "\n\n☑️DATA: " + dados.data

                dados.nome = row['Nome do solicitante']
                mensagem += "\n\n☑️NOME: " + dados.nome

                dados.area = row['Área de Manutenção']
                mensagem += "\n\n☑️ÁREA: " + dados.area

                dados.predio = row['Prédio']
                mensagem += "\n\n☑️PRÉDIO: " + dados.predio

                dados.sala = row['Sala/Local']
                mensagem += "\n\n☑️SALA: " + dados.sala

                dados.status = row['Status']
                mensagem += "\n\n☑️STATUS: " + dados.status

                dados.ult_movimentacao = row['Data do Status']
                mensagem += "\n\n☑️ÚLTIMA MOVIMENTAÇÃO: " + dados.ult_movimentacao

                dados.desc = row['Descrição sucinta']
                mensagem += "\n\n☑️DESCRIÇÃO: " + dados.desc

                dados.obs = row['Observação p/ Solicitante']
                mensagem += "\n\n☑️OBSERVAÇÃO: " + dados.obs
                
                console.log('Encontrou dados da pesquisa!!!')

                
                //console.log('Apresentando resultados: ')
                //console.log(dados)
                msgs[message.from] = mensagem;
                subniveis[message.from] = subnivel;
                modifica_modo_consulta(false)
                modifica_consultando(false)
                sendWppMessage(client, mensagem, message, "inicio", "0", 1);

                
                //return dados
            }
        })
        if (mensagem==""){
            sendWppMessage(client, "🙁Infelizmente não encontrei nada com o código informado.\nPor favor, tente novamente e verifique se o código foi digitado corretamente.\n", message, "inicio", "0", 1);
        }
    })
}

function atualizarDados(doc){
    sheet = doc.sheetsByIndex[0];
    sheet.getRows().then(rows => {
        rows.map(row => {
            if(row.nome === "João Victor"){
                row.nome = "Victor";
                row.idade = 31;
                row.email = "medium@joao.com"
                
                row.save().then(() => {
                    console.log('Dado atualizado!');
                });
            }
        });
    })
}