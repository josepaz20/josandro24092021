function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        if ($("#padre").val() === '') {
            location.href = partes[0] + '#close';
        } else {
            location.href = partes[0] + '#' + $("#padre").val();
        }
    } else {
        if ($("#padre").val() === '') {
            location.href = '#close';
        } else {
            location.href = '#' + $("#padre").val();
        }
    }
    $("#padre").val('');
}


function verAux(evento) {
    evento.stopPropagation();
}
//------------------------------------------------------------------------------
function activarBloqueoAjax() {
//    $.blockUI.defaults.baseZ = 100000;
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                baseZ: 100000,
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
function verNuevo() {
    $.get('nuevo', {}, setFormulario);
    activarBloqueoAjax();
}
function verDetalle(idTipoDocumento) {
//    console.log(idTipoDocumento);
    $.get('detalle', {idTipoDocumento: idTipoDocumento}, setFormulario);
    activarBloqueoAjax();
}
function verActualizar(idTipoDocumento) {
    $.get('actualizar', {idTipoDocumento: idTipoDocumento}, setFormulario);
    activarBloqueoAjax();
}
function verEliminar(idTipoDocumento) {
    $.get('eliminar', {idTipoDocumento: idTipoDocumento}, setFormulario);
    activarBloqueoAjax();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}
