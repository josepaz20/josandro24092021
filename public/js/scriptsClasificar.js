function seleccionarTodo(todos){
    var formClasificar = document.getElementById('formClasificar');
    for (i=0; i<formClasificar.elements.length; i++) {
        if(formClasificar.elements[i].type == "checkbox"){
            formClasificar.elements[i].checked = todos; 
        }
    }
}

function clasificarPymes(){
    var formClasificar = document.getElementById('formClasificar');
    var txtClasificacion = document.getElementById('clasificacion');
    var cont = 0;
    var i=0
    while (i<formClasificar.elements.length && cont==0) {
        if(formClasificar.elements[i].type == "checkbox"){
            if(formClasificar.elements[i].checked){
                cont++;
            }
        }
        i++
    }
    if(cont != 0){
        if(confirm(" ¿ Esta seguro de clasificar los clientes seleccionados como PyMES ? ")){
            txtClasificacion.value = 'pymes';
            formClasificar.setAttribute("action", "/sw2click/modulos/clasificar/clasificar");
            formClasificar.submit();
        }
    }else{
        alert('Debe seleccionar AL MENOS UN cliente para clasificarlo como PyMES ! ! !.');
    }
    return false;
}

function clasificarEmpresariales(){
    var formClasificar = document.getElementById('formClasificar');
    var txtClasificacion = document.getElementById('clasificacion');
    var cont = 0;
    var i=0
    while (i<formClasificar.elements.length && cont==0) {
        if(formClasificar.elements[i].type == "checkbox"){
            if(formClasificar.elements[i].checked){
                cont++;
            }
        }
        i++
    }
    if(cont != 0){
        if(confirm(" ¿ Esta seguro de clasificar los clientes seleccionados como EMPRESARIALES ? ")){
            txtClasificacion.value = 'empresarial';
            formClasificar.setAttribute("action", "/sw2click/modulos/clasificar/clasificar");
            formClasificar.submit();
        }
    }else{
        alert('Debe seleccionar AL MENOS UN cliente para clasificarlo como EMPRESARIAL ! ! !.');
    }
    return false;    
}

function setTipoClasificacion(tipo){
    var formClasificar = document.getElementById('formClasificar');
    formClasificar.setAttribute("action", "/sw2click/modulos/clasificar/administracion");
    formClasificar.submit();
}