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

function verEditar(idRecaudo) {
    $.get('verEditar', {idRecaudo: idRecaudo}, setFormulario, 'json');
}
function verDetalle(idRecaudo) {
    $.get('verDetalle', {idRecaudo: idRecaudo}, setFormulario, 'json');
}
//------------------------------------------------------------------------------
function setFormulario(datos) {
    switch (parseInt(datos['error'])) {
        case 0:
            $("#infoFormDetalle").html(datos['html']);
            var href = location.href;
            if (href.indexOf('#') !== -1) {
                var partes = href.split('#');
                location.href = partes[0] + '#detalles';
            } else {
                location.href = '#detalles';
            }
            break;
        case 1:
            alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA");
            break;
        case 2:
            alert("NO HAY INFORMACION DE ACTIVACION PARA ESTE RECAUDO");
            break;
    }
}

//------------------------------------------------------------------------------

function getRecaudos() {
    $("#formRecaudos").submit();
}

function guardar() {
    if (confirm("Â¿ DESEA GUARDAR EL COMENTARIO ?")) {
        $("#infoDetalle").attr('action', 'guardar');
        $("#infoDetalle").submit();
    }
}

function setEstado(idRecaudo, estado) {
    if (confirm("¿ DESEA MARCAR ESTE RECAUDO COMO " + estado.toUpperCase() + " ?")) {
        location.href = 'revisar?idRecaudo=' + idRecaudo + '&estadoRecaudo=' + estado + '&tipoCliente=' + $("#tipoClienteBusq").val() + '&anio=' + $("#anioBusq").val() + '&mes=' + $("#mesBusq").val() + '&estado=' + $("#estadoBusq").val();
    }
}

