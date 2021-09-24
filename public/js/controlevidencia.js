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

function activarBloqueoAjax() {
    $.blockUI(
            {
                message: $('#msgBloqueo'),
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
                    opacity: .85,
                    color: '#fff'
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//------------------------------------------------------------------------------

function validarBusqueda() {
    var continuar = 0;
    if ($("#clienteResBusq").val() !== '' && $("#clienteCorpBusq").val() !== '') {
        alert("SOLO SE ADMITE UN FILTRO DE BUSQUEDA.");
        $("#clienteResBusq").focus();
        return false;
    } else {
        $("#frmFiltroBusq").find(':input').each(function () {
            if ($(this).attr('type') !== 'submit' && $(this).attr('type') !== 'button' && $(this).val() !== '') {
                continuar++;
            }
        });

        if (parseInt($("#limpiar").val()) !== 0) {
            return true;
        }

        if (continuar > 0) {
            if ($("#clienteResBusq").val().indexOf('--') !== -1 || $("#clienteCorpBusq").val().indexOf('--') !== -1) {
                return true;
            } else {
                alert("POR FAVOR LLENE UNO DE LOS CAMPOS DE BUSQUEDA CON LA AYUDA AUTOCOMPLETAR.");
                return false;
            }
        } else {
            alert("DEBE INDICAR AL MENOS UN FILTRO DE BUSQUEDA");
            $("#idOrdenBusq").focus();
            return false;
        }
    }
}

//------------------------------------------------------------------------------

function setLimpiar() {
    $("#clienteResBusq").val('');
    $("#clienteCorpBusq").val('');
}

//------------------------------------------------------------------------------

function solicitarPromocion(idServicio) {
    $.get('solicitarPromocion', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------
function verServicio(idServicio, tipoclienteBusq) {
    $.get('verservicio', {idServicio: idServicio, tipoclienteBusq: tipoclienteBusq}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------
function verEvidencia(idContrato) {
    $.get('verevidencia', {idContrato: idContrato}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------

function validarSolicitarPromo() {
    if (confirm("  DESEA SOLICITAR LA PROMOCION PARA ESTE SERVICIO ? ")) {
        activarBloqueoAjax();
        return true;
    }
    return false;
}

//------------------------------------------------------------------------------

function confirmarPromocion(idServicio) {
    $.get('confirmarPromocion', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------

function validarConfirmarPromo() {
    if (confirm("  DESEA CONFIRMAR ESTA PROMOCION ? ")) {
        activarBloqueoAjax();
        return true;
    }
    return false;
}

//------------------------------------------------------------------------------

function rechazarPromocion(idServicio) {
    $.get('rechazarPromocion', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}

//------------------------------------------------------------------------------

function validarRechazarPromo() {
    if (confirm("  DESEA RECHAZAR ESTA PROMOCION ? ")) {
        activarBloqueoAjax();
        return true;
    }
    return false;
}

//------------------------------------------------------------------------------

function marcarrevisadodoc(idServicio) {
    if (confirm("   CONFIRMAR REVISION ?")) {
        $.get('marcarrevisadodoc', {idServicio: idServicio}, setMarcadoRevisadodoc, 'json');
        bloqueoAjax();
    }
}

function setMarcadoRevisadodoc(datos) {
    if (parseInt(datos['ok']) === 1) {
        $("#td_" + datos['idServicio']).html('<i class="fa fa-thumbs-o-up"></i>');
    }
}

//------------------------------------------------------------------------------

