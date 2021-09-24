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

function verEnviarFacturatech(idFacturaElectro) {
    $.get('verEnvioFacturatech', {idFacturaElectro: idFacturaElectro}, setFormulario);
    bloqueoAjax();
}
function verHistorialEnvio(idFacturaElectro) {
    $.get('verHistorialEnvio', {idFacturaElectro: idFacturaElectro}, setFormulario);
    bloqueoAjax();
}

function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function validarEnvio() {
    if (confirm("   DESEA ENVIAR ESTA FACTURA AL PROVEEDOR TECNOLOGICO ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }    
}

//------------------------------------------------------------------------------

function confirmarFacturasElectronicas() {
    if (confirm("   DESEA INICIAR EL PROCESO DE ENVIO DE FACTURAS ELECTRONICAS ?")) {
        $.get('enviarFacturatech', {}, setFactelectroConfirmadas, 'json');
        bloqueoAjax();
    }
}
function setFactelectroConfirmadas(datos) {
    if (parseInt(datos['contfacturas']) > 0) {
        alert("\n   FACTURAS POR CONFIRMAR:  " + datos['contfacturas'] + "\n   CONFIRMADAS:  " + datos['ok'] + "\n   ERRORES:  " + datos['error']);
    } else {
        alert("\n   NO SE ENCONTRARON FACTURAS PARA CONFIRMAR.");
    }
//    location.reload();
}

//------------------------------------------------------------------------------

function firmarFacturasElectronicas() {
    if (confirm("   DESEA INICIAR EL PROCESO PARA FIRMAR FACTURAS ELECTRONICAS ?")) {
        $.get('firmarFacturasElectronicas', {}, setFactelectroFirmadas, 'json');
        bloqueoAjax();
    }
}
function setFactelectroFirmadas(datos) {
    if (parseInt(datos['contfacturas']) > 0) {
        alert("\n   FACTURAS POR FIRMAR:  " + datos['contfacturas'] + "\n   FIRMADAS:  " + datos['ok'] + "\n   ERRORES:  " + datos['error']);
    } else {
        alert("\n   NO SE ENCONTRARON FACTURAS PARA FIRMAR.");
    }
//    location.reload();
}

//------------------------------------------------------------------------------

function getCUFES() {
    if (confirm("   DESEA INICIAR EL PROCESO PARA OBTENER CUFES ?")) {
        $.get('getCUFES', {}, setCUFES, 'json');
        bloqueoAjax();
    }
}
function setCUFES(datos) {
    if (parseInt(datos['contfacturas']) > 0) {
        alert("\n   CUFES POR OBTENER:  " + datos['contfacturas'] + "\n   OBTENIDOS:  " + datos['ok'] + "\n   ERRORES:  " + datos['error']);
    } else {
        alert("\n   NO SE ENCONTRARON FACTURAS SIN CUFE.");
    }
//    location.reload();
}

//------------------------------------------------------------------------------

function getQRS() {
    if (confirm("   DESEA INICIAR EL PROCESO PARA OBTENER QRs ?")) {
        $.get('getQRS', {}, setQRS, 'json');
        bloqueoAjax();
    }
}
function setQRS(datos) {
    if (parseInt(datos['contfacturas']) > 0) {
        alert("\n   QRs POR OBTENER:  " + datos['contfacturas'] + "\n   OBTENIDOS:  " + datos['ok'] + "\n   ERRORES:  " + datos['error']);
    } else {
        alert("\n   NO SE ENCONTRARON FACTURAS SIN QR.");
    }
//    location.reload();
}

//------------------------------------------------------------------------------

function enviarMails() {
    var cont = 0;
    $("input[type=checkbox]").each(function () {
        if ($(this).prop('checked')) {
            cont++;
        }
    });
    if (cont === 0) {
        alert('   SELECCIONE AL MENOS UNA FACTURA');
        return false;
    }
    if (confirm('   DESEA ENVIAR POR EMAIL LAS FACTURAS SELECCIONADAS ?')) {
        $("#formMails").attr('action', '../cobros/enviarEmailCorporativo');
        $("#formMails").submit();
    }
}

