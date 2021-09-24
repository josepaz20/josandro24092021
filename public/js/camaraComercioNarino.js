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

function verDetalles(pk_registro_id) {
    $.get('verDetalles', {pk_registro_id: pk_registro_id}, setDetalles, 'json');
}
function setDetalles(datos) {
    $("#infoDetalle").html(datos['html']);
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#detalles';
    } else {
        location.href = '#detalles';
    }
}

