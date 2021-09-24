function seleccionarTodo(todos){
    var formDeudas = document.getElementById('formDeudas');
    for (i=0; i<formDeudas.elements.length; i++) {
        if(formDeudas.elements[i].type == "checkbox"){
            formDeudas.elements[i].checked = todos; 
        }
    }
}

function setIds(idCliente){
    var txtIdCliente = document.getElementById('idCliente');
    txtIdCliente.value = idCliente;
}

