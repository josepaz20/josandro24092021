function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#close';
    } else {
        location.href = '#close';
    }
}

function verAux(evento) {
    evento.stopPropagation();
}

//------------------------------------------------------------------------------

function activarBloqueoAjax() {
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff'
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

function depurarServicio(idServicio, idContrato, idFactura) {
    if (confirm("AL DEPURAR ESTE SERVICIO SE REALIZARAN LAS SIGUIENTES ACCIONES: \n\n  1. ELIMINACION DEL SERVICIO (Mover a Historial) \n  2. ANULACION DE FACTURA DE INSTALACION \n  3. ELIMINACION DE INSTALACION (Mover a Historial) \n\n ¿ DESEA CONTINUAR CON ESTA DEPURACION ? \n")) {
        $.post('depurarservicioinstalacion', {idServicio: idServicio, idContrato: idContrato, idFactura: idFactura}, setResultadoDepuracion, 'json');
        activarBloqueoAjax();
    }
    return false;
}

function setResultadoDepuracion(datos) {
    if (parseInt(datos['error']) === 0) {
        alert("EL SERVICIO FUE DEPURADO EXITOSAMENTE");
        location.reload();
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//******************************************************************************
//******************************************************************************

