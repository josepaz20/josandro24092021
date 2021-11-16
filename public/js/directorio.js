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
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario);
    bloqueoAjax();
}

function verDetalle(idDirectorio) {
    $.get('detalle', {idDirectorio: idDirectorio}, setFormulario);
    bloqueoAjax();
}

function verActualizar(idDirectorio) {
    $.get('actualizar', {idDirectorio: idDirectorio}, setFormulario);
    bloqueoAjax();
}

function verEliminar(idDirectorio) {
    $.get('eliminar', {idDirectorio: idDirectorio}, setFormulario);
    bloqueoAjax();
}
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function validarRegistrarDirectorio() {
    if (confirm(" DESEA REGISTRAR ESTE DIRECTORIO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarEditarDirectorio() {
    if (confirm(" DESEA EDITAR ESTE DIRECTORIO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

function validarEliminarDirectorio() {
    if (confirm(" DESEA ELIMINAR ESTE DIRECTORIO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function getMunicipios(idDpto) {
    $("#idMcpo").html('<option value="">Seleccione...</option>');
    if (idDpto !== '') {
        $.get('getMunicipios', {idDpto: idDpto}, setMunicipios);
        bloqueoAjax();
    }
}

function setMunicipios(datos) {
    $("#idMcpo").html(datos);
}

//------------------------------------------------------------------------------

function seleccionarlista() {
    var idViabilidad = $("#idViabilidad").val();
    $.get('seleccionarlista', {idViabilidad: idViabilidad});
}

//------------------------------------------------------------------------------

function setReferenciado() {
    var referenciadoPor = $("#referenciado").val();
    if (referenciadoPor === '1') {
        $("#referenciadoPor").attr("required", "true");
        $("#referenciadoactual").show('slow');
        $("#referenciadoPor").show('slow');
        return;
    } else {
        $("#referenciadoactual").hide('slow');
        $("#referenciadoPor").hide('slow');
        return;
    }
}

//---------------------------------------------------------------------------

function existeIdentificacion() {
    var identificacion = $.trim($("#identificacion").val());
    if (identificacion !== '') {
        $.get('existeIdentificacion', {identificacion: identificacion}, setExisteIdentificacion, 'json');
        bloqueoAjax();
    }
}

function setExisteIdentificacion(datos) {
    if (parseInt(datos['error']) === 0) {
        
        if (parseInt(datos['existe']) === 1) {
            
            alert("LA IDENTIFICACION<< " + datos['identificacion'] + " >> \n   YA SE ENCUENTRA REGISTRADA EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR EL REGISTRO DE ESTE DIRECTORIO.");
            $("#identificacion").val('');
            
        } else {
            
        }
    } else {
        alert("SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE REGISTRO DE DIRECTORIO");
        $("#identificacion").val('');
    }
}

//---------------------------------------------------------------------------