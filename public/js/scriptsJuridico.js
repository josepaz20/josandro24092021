function seleccionarTodo(todos){
    var formJuridico = document.getElementById('formJuridico');
    for (i=0; i<formJuridico.elements.length; i++) {
        if(formJuridico.elements[i].type == "checkbox"){
            formJuridico.elements[i].checked = todos; 
        }
    }
}

function verificarCobro(){ 
    var cont = 0;
    var formJuridico = document.getElementById('formJuridico');
    var i=0
    while (i<formJuridico.elements.length && cont<2) {
        if(formJuridico.elements[i].type == "checkbox"){
            if(formJuridico.elements[i].checked){
                cont++;
            }
        }
        i++
    }
    if(cont == 1){
        formJuridico.setAttribute("action", "/sw2click/modulos/juridico/verificarCobro");
        formJuridico.submit();
    }else{
        alert('Debe seleccionar un UNICO cliente para Verificar el Cobro Juridico ! ! !.');
    }
    return false;
}

function insertarDeuda(){
    var tabla = document.getElementById('tablaDeudas');
    var numFilas = document.getElementById('numFilas');
    var ultFila = tabla.rows.length;
    var i = ultFila-1;
    
    var fila = tabla.insertRow(ultFila);
    
    var id = fila.insertCell(0);
    var idDeuda = document.createElement('input');
    idDeuda.name = 'idDeuda-' + i;
    idDeuda.id = 'idDeuda-' + i;
    idDeuda.value = '0';
    idDeuda.readOnly = 'true';
    idDeuda.setAttribute('style', 'width: 80px');
    id.appendChild(idDeuda);
    
    var num = fila.insertCell(1);
    var numFactura = document.createElement('input');
    numFactura.name = 'numFactura-' + i;
    numFactura.id = 'numFactura-' + i;
    numFactura.required = 'true';
    numFactura.setAttribute('style', 'width: 200px');
    num.appendChild(numFactura);
    
    var mes = fila.insertCell(2);
    var periodo = document.createElement('input');
    periodo.name = 'periodoFacturado-' + i;
    periodo.id = 'periodoFacturado-' + i;
    periodo.required = 'true';
    periodo.setAttribute('style', 'width: 200px');
    mes.appendChild(periodo);
    
    numFilas.value++;
}

function eliminarDeuda(){
    var tabla = document.getElementById('tablaDeudas');
    var numFilas = document.getElementById('numFilas');
    var ultFila = tabla.rows.length;
    if(ultFila > 2){
        numFilas.value--;
        tabla.deleteRow(ultFila-1);
    }
}

function verVistaPrevia(){
    var formDeudas = document.getElementById('formDeudas');
    formDeudas.setAttribute("action", "/sw2click/modulos/juridico/verVistaPrevia");
    formDeudas.setAttribute("target", "_BLANK");
    formDeudas.submit();
}

function enviarEmailIndividual(){
    var formDeudas = document.getElementById('formDeudas');
    formDeudas.removeAttribute("target");
    formDeudas.setAttribute("action", "/sw2click/modulos/juridico/enviarEmail");
    formDeudas.submit();
}

function setIds(idCliente){
    var txtIdCliente = document.getElementById('idCliente');
    txtIdCliente.value = idCliente;
}

function setVerificarCobro(){
    var formJuridico = document.getElementById('formJuridico');
    var txtIdCliente = document.getElementById('idCliente');
    for (i=0; i<formJuridico.elements.length; i++ ) {
        if(formJuridico.elements[i].type == "checkbox"){
            if(formJuridico.elements[i].value == txtIdCliente.value){
                formJuridico.elements[i].checked = true;
            }else{
                formJuridico.elements[i].checked = false;
            }
        }
    }
    verificarCobro();
}

function setEnviarEmail(){
    var formJuridico = document.getElementById('formJuridico');
    var txtIdCliente = document.getElementById('idCliente');
    for (i=0; i<formJuridico.elements.length; i++ ) {
        if(formJuridico.elements[i].type == "checkbox"){
            if(formJuridico.elements[i].value == txtIdCliente.value){
                formJuridico.elements[i].checked = true;
            }else{
                formJuridico.elements[i].checked = false;
            }
        }
    }
    enviarEmail();
}

function enviarEmail(){
    var formJuridico = document.getElementById('formJuridico');
    var cont = 0;
    var i=0
    while (i<formJuridico.elements.length && cont==0) {
        if(formJuridico.elements[i].type == "checkbox"){
            if(formJuridico.elements[i].checked){
                cont++;
            }
        }
        i++
    }
    if(cont != 0){
        formJuridico.setAttribute("action", "/sw2click/modulos/juridico/enviarEmail");
        formJuridico.submit();
    }else{
        alert('Debe seleccionar AL MENOR UN cliente para Enviar Email ! ! !.');
    }
    return false;
}

function retirarCliente(){
    var cont = 0;
    var formJuridico = document.getElementById('formJuridico');
    var i=0
    while (i<formJuridico.elements.length && cont<2) {
        if(formJuridico.elements[i].type == "checkbox"){
            if(formJuridico.elements[i].checked){
                cont++;
            }
        }
        i++
    }
    if(cont == 1){
        if(confirm(" ¿ Desea colocar este Cliente en la lista de CLIENTES PARA RETIRAR ? ")){
            formJuridico.setAttribute("action", "/sw2click/modulos/juridico/retirar");
            formJuridico.submit();
        }
    }else{
        alert('Debe seleccionar un UNICO cliente para Verificar el Cobro Juridico ! ! !.');
    }
    return false;
}

function setRetirarCliente(){
    var formJuridico = document.getElementById('formJuridico');
    var txtIdCliente = document.getElementById('idCliente');
    for (i=0; i<formJuridico.elements.length; i++ ) {
        if(formJuridico.elements[i].type == "checkbox"){
            if(formJuridico.elements[i].value == txtIdCliente.value){
                formJuridico.elements[i].checked = true;
            }else{
                formJuridico.elements[i].checked = false;
            }
        }
    }
    retirarCliente();
}