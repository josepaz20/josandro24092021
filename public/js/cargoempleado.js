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

function verDetalle(idCargo) {
    $.get('detalle', {idCargo: idCargo}, setFormulario);
    bloqueoAjax();
}

function verActualizar(idCargo) {
    $.get('actualizar', {idCargo: idCargo}, setFormulario);
    bloqueoAjax();
}

function verEliminar(idCargo) {
    $.get('eliminar', {idCargo: idCargo}, setFormulario);
    bloqueoAjax();
}
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function validarRegistrarCargo() {
    if (confirm(" DESEA REGISTRAR ESTE CARGO DE EMPLEADO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarEditarCargo() {
    if (confirm(" DESEA EDITAR CARGO DE EMPLEADO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

function validarEliminarCargo() {
    if (confirm(" DESEA ELIMINAR ESTE CARGO DE EMPLEADO?")) {
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

function existeNit() {
    var nit = $.trim($("#nit").val());
    if (nit !== '') {
        if ($("#nitOLD").length > 0) {
            if (nit === $.trim($("#nitOLD").val())) {
                return;
            }
        }
        $.get('existeNit', {nit: nit}, setExisteNit, 'json');
        bloqueoAjax();
    }
}

function setExisteNit(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['existe']) === 1) {
            alert("EL NIT<< " + datos['nit'] + " >> \n   YA SE ENCUENTRA REGISTRADO EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR EL REGISTRO DE ESTE CORPORATIVO.");
            $("#nit").val('');
        }
    } else {
        alert("SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE CAMBIO DE TITULAR.");
        $("#nit").val('');
    }
}

//---------------------------------------------------------------------------