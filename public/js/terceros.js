//------------------------------------------------------------------------------
function bloqueoAjax() {
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff',
                    'z-index': 2000
                }
            }
    );
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario);
    bloqueoAjax();
}
function verActualizar(idTercero) {
    $.get('actualizar', {idTercero: idTercero}, setFormulario);
//    bloqueoAjax();
}
function verEliminar(idTercero) {
    $.get('eliminar', {idTercero: idTercero}, setFormulario);
//  bloqueoAlax();
}
function verDetalles(idTercero) {
    $.get('detalles', {idTercero: idTercero}, setFormulario);
//  bloqueoAlax();
}
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------


