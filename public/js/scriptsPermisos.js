
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
function verActualizar(idPermiso) {
    $.get('actualizar', {idPermiso: idPermiso}, setFormulario);
//    bloqueoAjax();
}
function verEliminar(idPermiso) {
    $.get('eliminar', {idPermiso: idPermiso}, setFormulario);
//  bloqueoAlax();
}
function verConfirmar(idPermiso) {
    $.get('confirmar', {idPermiso: idPermiso}, setFormulario);
    bloqueoAjax();
}
function verDetalles(idPermiso) {
    $.get('detalles', {idPermiso: idPermiso}, setFormulario);
//  bloqueoAlax();
}
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//-----------------------------------------------------------------------------------

function validarRegistro() {
    if (parseInt($("#dias").val()) === 0 && parseInt($("#horas").val()) === 0 && parseInt($("#minutos").val()) === 0) {
        alert("LOS DIAS, HORAS Y MINUTOS NO PUEDEN SER TODOS CERO.");
        $("#dias").focus();
        return false;
    }
    return confirm(" ¿ DESEA GUARDAR ESTE SOLICITUD DE PERMISO ? ");
}

function validarObservacion() {
    if ($("#estado").val() === 'Denegado' || parseInt($("#descuentanomina").val()) === 0) {
        $("#observacion").attr('required', true);
    } else {
        $("#observacion").removeAttr('required');
    }
}

function validarEliminar() {
    return confirm("ESTA A PUNTO DE ELIMINAR ESTA SOLICITUD DE PERMISO, LA ELIMINACION BORRARA POR COMPLETO LA INFORMACION DE LA SOLICITUD DE LAS BASES DE DATOS. \n ¿ DESEA ELIMINAR ESTA SOLICITUD DE PERMISO ?");
}