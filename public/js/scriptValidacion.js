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


function verValidar(idAsignada) {
    $.get('vervalidar', {idAsignada: idAsignada}, setFormulario);
    bloqueoAjax();
}
function validadorRecurso(idRecursoInv, idOrden) {
    $.get('vervalidadorrecurso', {idRecursoInv: idRecursoInv, idOrden: idOrden}, setValidacionRecurso);
    bloqueoAjax();
}
function validadorMaterial(idMaterial) {
    $.get('vervalidadormaterial', {idMaterial: idMaterial}, setValidacionMaterial);
    bloqueoAjax();
}


//------------------------------------------------------------------------------

function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//---------------------------------------------------------------------------
function setValidacionRecurso(respuesta) {
    $("#divInfovalidacionRecurso").html(respuesta);
    $('#modalValidacionRecurso').modal('show');
}
function setValidacionMaterial(respuesta) {
    $("#divInfovalidacionMaterial").html(respuesta);
    $('#modalValidacionMaterial').modal('show');
}

//---------------------------------------------------------------------------
function validarRecurso() {
    if (confirm("   DESEA VALIDAR ESTE RECURSO ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//---------------------------------------------------------------------------
function validarMaterial() {
    if (confirm("   DESEA VALIDAR ESTE MATERIAL ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//---------------------------------------------------------------------------
function validarEstadoRecurso(validado) {
    if (validado > 0) {
        $('#observacionrecurso').removeAttr("required");
    } else {
        $('#observacionrecurso').prop("required", true);
    }
}
//---------------------------------------------------------------------------
function validarEstadoMaterial(validado) {
    if (validado > 0) {
        $('#observacionmaterial').removeAttr("required");
        $('#cantidadvalidada').removeAttr("required");
        document.getElementById('cantidadvalidada').value = document.getElementById('cantidad').value;
    } else {
        $('#observacionmaterial').prop("required", true);
        $('#cantidadvalidada').prop("required", true);
        document.getElementById('cantidadvalidada').value = '';
    }
}
//---------------------------------------------------------------------------
