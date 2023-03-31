export function gerar_protocolo() {
  const date = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();
  const milisegundos = new Date().getMilliseconds();
  const dia_mes = new Date().getUTCDate()
  //console.log(dia_mes)
  var data = date.toString();
  //data = data.replace("/","").replace("/","")
  //data = data.substring(0,4) + data.substring(6,8)
  data = hora.toString().replace(":", "").replace(":", "");
  data = milisegundos + data //+ dia_mes.toString();
  //console.log(data)
  return data;
}
//gerar_protocolo()
//console.log(milisegundos)
