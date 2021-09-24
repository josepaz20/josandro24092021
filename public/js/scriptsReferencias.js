function enviarForm() {
    if (confirm('¿ Desea Registrar esta Referencia ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'insertar');
        return true;
    }
    return false;
}

function validarUpd() {
    if (confirm('¿ Desea Actualizar esta Referencia ?')) {
        var sub = document.getElementById('formNuevo');
        sub.setAttribute('action', 'editar');
        return true;
    }
    return false;
}
