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

function verEncuestaInstalacion(idOT, fechaBusq) {
    $.get('verEncuestaInstalacion', {idOT: idOT, fechaBusq: fechaBusq}, setFormulario);
    bloqueoAjax();
}
function verEncuestaIncidente(idIncidente, fechaBusq, solucionadoBusq) {
    $.get('verEncuestaIncidente', {idIncidente: idIncidente, fechaBusq: fechaBusq, solucionadoBusq: solucionadoBusq}, setFormulario);
    bloqueoAjax();
}
function verEncuestaVisitatecnica(idOT, fechaBusq) {
    $.get('verEncuestaVisitatecnica', {idOT: idOT, fechaBusq: fechaBusq}, setFormulario);
    bloqueoAjax();
}

function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function validarRegistrarEncuesta() {
    if (confirm('   DESEA REGISTRAR ESTA ENCUESTA ? ')) {
         bloqueoAjax();
         return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function generarGrafico() {
    if ($("#idPregunta").val() !== '') {
        $.get('generargrafico', {idPregunta: $("#idPregunta").val(), pregunta: $("#idPregunta option:selected").html()}, setGrafico);
        bloqueoAjax();
    } else {
        alert("POR FAVOR SELECCIONE UNA PREGUNTA");
        $("#idPregunta").focus();
    }
}

function setGrafico(html) {
    $("#divGrafico").html(html);
}

//------------------------------------------------------------------------------

function getPreguntasEncuesta() {
    var idTipoEncuesta = parseInt($("#idTipoEncuesta").val());
    var preguntas = '<option value="">Seleccione...</option>';
    switch (idTipoEncuesta) {
        case 1:
            preguntas = '<option value="">Seleccione...</option>' +
                    '<option value="1">Es cliente nuevo ?</option>' +
                    '<option value="2">Le explicaron como se realiza el cobro de su primera factura ?</option>' +
                    '<option value="3">La informacion respecto a su nuevo servicio es clara ?</option>' +
                    '<option value="4">Le indicaron las fechas de pago ?</option>' +
                    '<option value="5">Sabe cuales son los puntos de pagos ?</option>' +
                    '<option value="6">Del 1 al 5 como calificaria la venta del servicio</option>' +
                    '<option value="7">Del 1 al 5 como calificaria nuestro asesor comercial</option>' +
                    '<option value="8">Del 1 al 5 como calificaria la instalacion fisica de su servicio</option>' +
                    '<option value="9">Del 1 al 5 como calificaria la atencion de nuestro personal tecnico</option>' +
                    '<option value="10">Nuestro personal tecnico ingreso con traje de bioseguridad ?</option>' +
                    '<option value="11">Existio algun cobro adicional ?</option>';
            break;
        case 2:
            preguntas = '<option value="">Seleccione...</option>' +
                    '<option value="12">Conoce la fecha de corte de su servicio ?</option>' +
                    '<option value="13">Conoce las fechas de pago ?</option>' +
                    '<option value="14">Sabe cuales son los puntos de pagos autorizados ?</option>' +
                    '<option value="15">Cual medio utilizo para solicitar soporte tecnico ?</option>' +
                    '<option value="17">De 1 a 5 como califica la atencion de su agente de soporte tecnico</option>' +
                    '<option value="18">De 1 a 5 como califica la solucion a su problema tecnico</option>' +
                    '<option value="19">Existio algun cobro adicional ?</option>';
            break;
        case 3:
            preguntas = '<option value="">Seleccione...</option>' +
                    '<option value="20">Del 1 al 5 como calificaria la visita tecnica</option>' +
                    '<option value="21">Del 1 al 5 como calificaria el trato del personal tecnico</option>' +
                    '<option value="22">Del 1 al 5 como calificaria la rapidez de la solucion</option>' +
                    '<option value="10">Nuestro personal tecnico ingreso con traje de bioseguridad ?</option>' +
                    '<option value="11">Existio algun cobro adicional ?</option>';
            break;
    }
    $("#idPregunta").html(preguntas);
}

//------------------------------------------------------------------------------

function marcarllamado(idCliente) {
    if (confirm("   CONFIRMAR LLAMADO ?")) {
        $.get('marcarllamado', {idCliente: idCliente}, setMarcadoLlamado, 'json');
        bloqueoAjax();
    }
}

function setMarcadoLlamado(datos) {
    if (parseInt(datos['ok']) === 1) {
        $("#td_" + datos['idCliente']).html('<i class="fa fa-thumbs-o-up"></i>');
    }
}

//------------------------------------------------------------------------------
