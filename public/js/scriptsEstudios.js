function enviarForm() {
    if (confirm('¿ Desea Registrar este Estudio ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'insertar');
        return true;
    }
    return false;
}

function setAreaEstudio(idTipo){
    var areaEstudio = document.getElementById('areaEstudio');
    var idAreaEstudio = document.getElementById('idAreaEstudio');
    if(idTipo != 1 && idTipo != 2){
        areaEstudio.removeAttribute('hidden');
        idAreaEstudio.setAttribute('required', 'true');
    }else{
        areaEstudio.setAttribute('hidden', 'true');
        idAreaEstudio.removeAttribute('required');
    }
}

function setCompleto(valor){
    var completo = document.getElementById('completo');
    var fechaFin = document.getElementById('fechaFin');
    if(valor == 1){
        completo.removeAttribute('hidden');
        fechaFin.setAttribute('required', 'true');
    }else{
        completo.setAttribute('hidden', 'true');
        fechaFin.removeAttribute('required');
        fechaFin.value = "0000-00-00";
    }
}

function validarUpd() {
    if (confirm('¿ Desea Actualizar este Estudio ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'editar');
        return true;
    }
    return false;
}
