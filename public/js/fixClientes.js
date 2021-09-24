//------------------------------------------------------------------------------

function activarBloqueoAjax() {
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

function confirmarResidencial(idCliente) {
    var cel1 = $.trim($("#cel1_" + idCliente).val());
    var cel2 = $.trim($("#cel2_" + idCliente).val());
    var cel3 = $.trim($("#cel3_" + idCliente).val());
    if (cel1.length === 0) {
        alert("PARA CONFIRMAR ES OBLIGATORIO REGISTRAR EL CELULAR 1");
        $("#cel1_" + idCliente).focus();
        return;
    } else {
        if (cel1.length !== 10 || cel1.charAt(0) !== '3' || isNaN(cel1)) {
            alert("EL NUMERO REGISTRADO PARA EL CELULAR 1 NO CORRESPONDE A UN NUMERO DE CELULAR VALIDO");
            $("#cel1_" + idCliente).focus();
            return;
        }
    }
    if (cel2.length !== 0) {
        if (cel2.length !== 10 || cel2.charAt(0) !== '3' || isNaN(cel2)) {
            alert("EL NUMERO REGISTRADO PARA EL CELULAR 2 NO CORRESPONDE A UN NUMERO DE CELULAR VALIDO");
            $("#cel2_" + idCliente).focus();
            return;
        }
    }
    if (cel3.length !== 0) {
        if (cel3.length !== 10 || cel3.charAt(0) !== '3' || isNaN(cel3)) {
            alert("EL NUMERO REGISTRADO PARA EL CELULAR 3 NO CORRESPONDE A UN NUMERO DE CELULAR VALIDO");
            $("#cel3_" + idCliente).focus();
            return;
        }
    }
    $.get('confirmarResidencial', {idCliente: idCliente, cel1: cel1, cel2: cel2, cel3: cel3}, setConfirmacion, 'json');
    activarBloqueoAjax();
}
function setConfirmacion(respuestaServer) {
    if (parseInt(respuestaServer['ok']) === 1) {
        $("#confirm_" + respuestaServer['idCliente']).html('<i style="color: #0F0; font-size: 16px" class="fa fa-check"></i>');
    } else {
        $("#confirm_" + respuestaServer['idCliente']).html('<i style="color: #F00; font-size: 16px" class="fa fa-times"></i>');
    }
}

//------------------------------------------------------------------------------

function confirmarCorporativo(idCliente) {
    var cel1 = $.trim($("#cel1_" + idCliente).val());
    var cel2 = $.trim($("#cel2_" + idCliente).val());
    var cel3 = $.trim($("#cel3_" + idCliente).val());
    if (cel1.length === 0) {
        alert("PARA CONFIRMAR ES OBLIGATORIO REGISTRAR EL CELULAR 1");
        $("#cel1_" + idCliente).focus();
        return;
    } else {
        if (cel1.length !== 10 || cel1.charAt(0) !== '3' || isNaN(cel1)) {
            alert("EL NUMERO REGISTRADO PARA EL CELULAR 1 NO CORRESPONDE A UN NUMERO DE CELULAR VALIDO");
            $("#cel1_" + idCliente).focus();
            return;
        }
    }
    if (cel2.length !== 0) {
        if (cel2.length !== 10 || cel2.charAt(0) !== '3' || isNaN(cel2)) {
            alert("EL NUMERO REGISTRADO PARA EL CELULAR 2 NO CORRESPONDE A UN NUMERO DE CELULAR VALIDO");
            $("#cel2_" + idCliente).focus();
            return;
        }
    }
    if (cel3.length !== 0) {
        if (cel3.length !== 10 || cel3.charAt(0) !== '3' || isNaN(cel3)) {
            alert("EL NUMERO REGISTRADO PARA EL CELULAR 3 NO CORRESPONDE A UN NUMERO DE CELULAR VALIDO");
            $("#cel3_" + idCliente).focus();
            return;
        }
    }
    $.get('confirmarCorporativo', {idCliente: idCliente, cel1: cel1, cel2: cel2, cel3: cel3}, setConfirmacion, 'json');
    activarBloqueoAjax();
}
function setConfirmacion(respuestaServer) {
    if (parseInt(respuestaServer['ok']) === 1) {
        $("#confirm_" + respuestaServer['idCliente']).html('<i style="color: #0F0; font-size: 16px" class="fa fa-check"></i>');
    } else {
        $("#confirm_" + respuestaServer['idCliente']).html('<i style="color: #F00; font-size: 16px" class="fa fa-times"></i>');
    }
}

