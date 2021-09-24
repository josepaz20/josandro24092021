function validarEnvioSMS() {
    if (confirm("   DESEA ENVIAR ESTE MENSAJE ?")) {
        $("#enviarSMS").attr('disabled', true);
        return true;
    } else {
        $("#enviarSMS").removeAttr('disabled');
        return false;
    }
}