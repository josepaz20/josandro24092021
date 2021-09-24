function enviarForm() {
    if (confirm('¿ Desea Registrar esta Certificacion ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'insertar');
        return true;
    }
    return false;
}

function validarUpd() {
    if (confirm('¿ Desea Actualizar esta Certificacion ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'editar');
        return true;
    }
    return false;
}
