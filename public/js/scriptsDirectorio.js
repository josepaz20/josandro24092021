function setDptoNewDirectorio(){
    var formulario = document.getElementById("formDirectorio");
    formulario.setAttribute("action", "/sw2click/modulos/directorio/nuevo")
    formulario.submit();
}

function setDptoUpdtDirectorio(){
    var formulario = document.getElementById("formDirectorio");
    formulario.setAttribute("action", "/sw2click/modulos/directorio/actualizar")
    formulario.submit();
}