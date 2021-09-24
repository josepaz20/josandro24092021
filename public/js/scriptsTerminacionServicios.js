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

}

//------------------------------------------------------------------------------

function verDetalle(idServicio) {
    $.get('detalle', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        var partesHref = document.location.href.split('#');
        if (partesHref.length > 1) {
            document.location.href = partesHref[0] + '#modalFormulario';
        } else {
            document.location.href += '#modalFormulario';
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}