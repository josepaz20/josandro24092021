//******************************************************************************
//**************       C O R P O R A T I V O S         *************************
//******************************************************************************

function setDpto(idDpto) {
    if (idDpto != '') {
        var todos = parseInt($("#todos").val());
        switch (idDpto) {
            case '1':
                if (todos === 1) {
                    $("#idPrefijo option[value=2]").attr("selected", true);
                } else {
                    $("#idPrefijo").html("<option value='2'>DC</option>");
                }
                break;
            case '2':
                if (todos === 1) {
                    $("#idPrefijo option[value=3]").attr("selected", true);
                } else {
                    $("#idPrefijo").html("<option value='3'>DN</option>");
                }
                break;
            case '3':
                if (todos === 1) {
                    $("#idPrefijo option[value=4]").attr("selected", true);
                } else {
                    $("#idPrefijo").html("<option value='4'>DH</option>");
                }
                break;
            case '4':
                if (todos === 1) {
                    $("#idPrefijo option[value=5]").attr("selected", true);
                } else {
                    $("#idPrefijo").html("<option value='5'>DP</option>");
                }
                break;
            case '5':
                if (todos === 1) {
                    $("#idPrefijo option[value=2]").attr("selected", true);
                } else {
                    $("#idPrefijo").html("<option value='2'>DC</option>");
                }
                break;
            case '6':
                $("#idPrefijo option[value='']").attr("selected", true);
                break;
        }
        $.get("getMcpos", {
            idDpto: idDpto
        }, setMcpos, 'json');
    } else {
        $('#idMcpo').html("<option value=''>Seleccione...</option>");
        if (todos === 1) {
            $("#idPrefijo option[value='']").attr("selected", true);
        } else {
            $("#idPrefijo").html("<option value=''>Seleccione...</option>");
        }
    }
}

function setMcpos(datos) {
    $("#idMcpo").html(datos['html']);
}

function setDptoUpdateCorp() {
    var formulario = document.getElementById("formCorporativo");
    formulario.setAttribute("action", "/sw2click/modulos/corporativo/actualizar")
    formulario.submit();
}

function setEstadoCorp(idCorp, estado) {
    var accion = '';
    if (estado == 0) {
        accion = 'DESACTIVAR';
    } else {
        accion = 'ACTIVAR';
    }
    if (confirm('¿Desea ' + accion + ' este Cliente Corporativo?') == true) {
        if (estado == 0) {
            location.href = "/sw2click/modulos/corporativo/desactivar?idCorporativo=" + idCorp;
        } else {
            location.href = "/sw2click/modulos/corporativo/activar?idCorporativo=" + idCorp;
        }
    }
}

function selectClienteCorpContrato(idCorporativo, idPlan, idDpto, tipo) {
    if (tipo == 1) { // Contrato de internet
        parent.opener.location = '/sw2click/modulos/internet/nuevoCorporativo?idCorporativo=' + idCorporativo + '&idPlanInternet=' + idPlan + '&idDpto=' + idDpto;
    } else if (tipo == 2) { // Contrato LAN to LAN
        parent.opener.location = '/sw2click/modulos/lantolan/nuevoCorporativo?idCorporativo=' + idCorporativo + '&idPlanLANtoLAN=' + idPlan + '&idDpto=' + idDpto;
    }
    self.close();
}

function selectClienteCorpFactura(idCorporativo, idContrato) {
    parent.opener.location = '/sw2click/modulos/factura/nuevoCorporativo?idCorporativo=' + idCorporativo + '&idContrato=' + idContrato;
    self.close();
}

function selectClienteCorpFacturaVenta(idCorporativo) {
    parent.opener.location = '/sw2click/modulos/factura/nuevaVenta?idCorporativo=' + idCorporativo;
    self.close();
}

function selectClienteCorp(idCorporativo, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdCorpBusq = parent.opener.document.getElementById('idCorpBusq');
    var txtIdResBusq = parent.opener.document.getElementById('idResBusq');
    txtIdCorpBusq.value = idCorporativo;
    txtIdResBusq.value = 0;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}

function selectClienteRes(idResidencial, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdCorpBusq = parent.opener.document.getElementById('idCorpBusq');
    var txtidResBusq = parent.opener.document.getElementById('idResBusq');
    txtidResBusq.value = idResidencial;
    txtIdCorpBusq.value = 0;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}


//******************************************************************************
//**************      R E S I D E N C I A L E S        *************************
//******************************************************************************

function setDptoNewRes() {
    var formulario = document.getElementById("formResidencial");
    formulario.setAttribute("action", "/sw2click/modulos/residencial/nuevoResidencial")
    formulario.submit();
}

function setDptoUpdateRes() {
    var formulario = document.getElementById("formResidencial");
    formulario.setAttribute("action", "/sw2click/modulos/residencial/actualizar")
    formulario.submit();
}

function setEstadoRes(idRes, estado) {
    var accion = '';
    if (estado == 0) {
        accion = 'DESACTIVAR';
    } else {
        accion = 'ACTIVAR';
    }
    if (confirm('¿Desea ' + accion + ' este Cliente Residencial?') == true) {
        if (estado == 0) {
            location.href = "/sw2click/modulos/residencial/desactivar?idResidencial=" + idRes;
        } else {
            location.href = "/sw2click/modulos/residencial/activar?idResidencial=" + idRes;
        }
    }
}

function selectClienteResContrato(idResidencial, idPlan, idDpto) {
    parent.opener.location = '/sw2click/modulos/internet/nuevoResidencial?idResidencial=' + idResidencial + '&idPlanInternet=' + idPlan + '&idDpto=' + idDpto;
    self.close();
}

function selectClienteResFactura(idResidencial, idContrato) {
    parent.opener.location = '/sw2click/modulos/factura/nuevoResidencial?idResidencial=' + idResidencial + '&idContrato=' + idContrato;
    self.close();
}

function selectClienteResFacturaVenta(idResidencial) {
    parent.opener.location = '/sw2click/modulos/factura/nuevaVenta?idResidencial=' + idResidencial;
    self.close();
}

//******************************************************************************
//**************      R E S I D E N C I A L E S        *************************
//******************************************************************************

function setDptoNewPer() {
    var formulario = document.getElementById("formParticular");
    formulario.setAttribute("action", "/sw2click/modulos/persona/nuevaPersona")
    formulario.submit();
}

function setDptoUpdatePer() {
    var formulario = document.getElementById("formParticular");
    formulario.setAttribute("action", "/sw2click/modulos/persona/actualizar")
    formulario.submit();
}

function setEstadoPer(idPer, estado) {
    var accion = '';
    if (estado == 0) {
        accion = 'DESACTIVAR';
    } else {
        accion = 'ACTIVAR';
    }
    if (confirm('¿Desea ' + accion + ' este Cliente Particular?') == true) {
        if (estado == 0) {
            location.href = "/sw2click/modulos/persona/desactivar?idPersona=" + idPer;
        } else {
            location.href = "/sw2click/modulos/persona/activar?idPersona=" + idPer;
        }
    }
}

function selectClientePerRecaudo(idPersona) {
    parent.opener.location = '/sw2click/modulos/recaudo/recaudarOtros?idPersona=' + idPersona;
    self.close();
}

function getClienteCorp(formulario, accion) {
    document.getElementById('idContrato').value = '';
    document.getElementById('contrato').value = '';
    var href = 'getCorporativo?formulario=' + formulario + '&accion=' + accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getClienteRes(formulario, accion) {
    document.getElementById('idContrato').value = '';
    document.getElementById('contrato').value = '';
    var href = 'getResidencial?formulario=' + formulario + '&accion=' + accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getContratosCorp(formulario, accion, idCorporativo) {
    var href = 'getContratos?formulario=' + formulario + '&accion=' + accion + '&idCorporativo=' + idCorporativo;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getContratosRes(formulario, accion, idResidencial) {
    var href = 'getContratos?formulario=' + formulario + '&accion=' + accion + '&idResidencial=' + idResidencial;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function selectContratoCorp(idContrato, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdContrato = parent.opener.document.getElementById('idContrato');
    txtIdContrato.value = idContrato;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}

function selectContratoRes(idContrato, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdContrato = parent.opener.document.getElementById('idContrato');
    txtIdContrato.value = idContrato;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}

function reporteLlamadasCorp() {
    var txtIdCorporativo = document.getElementById('idCorpBusq');
    if (txtIdCorporativo.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/llamadas');
    form.submit();
}

function reporteOrdenesCorp() {
    var txtIdCorporativo = document.getElementById('idCorpBusq');
    if (txtIdCorporativo.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/ordenes');
    form.submit();
}

function reporteFacturasCorp() {
    var txtIdCorporativo = document.getElementById('idCorpBusq');
    if (txtIdCorporativo.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/facturas');
    form.submit();
}

function reporteRecaudosCorp() {
    var txtIdCorporativo = document.getElementById('idCorpBusq');
    if (txtIdCorporativo.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/recaudos');
    form.submit();
}

function reporteLlamadasRes() {
    var txtIdResidencial = document.getElementById('idResBusq');
    if (txtIdResidencial.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/llamadas');
    form.submit();
}

function reporteOrdenesRes() {
    var txtIdResidencial = document.getElementById('idResBusq');
    if (txtIdResidencial.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/ordenes');
    form.submit();
}

function reporteFacturasRes() {
    var txtIdResidencial = document.getElementById('idResBusq');
    if (txtIdResidencial.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/facturas');
    form.submit();
}

function reporteRecaudosRes() {
    var txtIdResidencial = document.getElementById('idResBusq');
    if (txtIdResidencial.value === '') {
        alert("Debe seleccionar un Cliente");
        document.getElementById('cliente').focus();
        return;
    }
    var form = document.getElementById('formReportes');
    form.setAttribute('action', '/sw2click/modulos/reportes/recaudos');
    form.submit();
}

function verificarNIT() {
    $("#divVerificacionNIT").hide('1000', 'swing');
    var nit = $("#nit").val();
    var nitOLD = -1;
    if ($("#nitOLD").length !== 0) {
        nitOLD = $("#nitOLD").val();
    }
    if (nit !== nitOLD) {
        $.get("verificar_NIT", {
            nit: nit
        }, mostrarVerificacionNIT, 'json');
    }
}

function mostrarVerificacionNIT(datos) {
    if (datos['existe'] === 1) {
        $("#divVerificacionNIT").show('1000', 'swing');
        $("#nit").focus();
        $("#nit").select();
    } else {
        $("#divVerificacionNIT").hide('1000', 'swing');
    }
}

function verificarCedula() {
    $("#divVerificacionCedula").hide('1000', 'swing');
    var cedula = $("#cedula").val();
    var cedulaOLD = -1;
    if ($("#cedulaOLD").length !== 0) {
        cedulaOLD = $("#cedulaOLD").val();
    }
    if (cedula !== cedulaOLD) {
        $.get("verificar_cedula", {
            cedula: cedula
        }, mostrarVerificacionCedula, 'json');
    }
}

function mostrarVerificacionCedula(datos) {
    if (datos['existe'] === 1) {
        $("#divVerificacionCedula").show('1000', 'swing');
        $("#cedula").focus();
        $("#cedula").select();
    } else {
        $("#divVerificacionCedula").hide('1000', 'swing');
    }
}

function verInfoUnicaFactura(valor) {
    if (valor === 'Unica Factura') {
        $("#divInfoUnicaFactura").show('1000', 'swing');
    } else {
        $("#divInfoUnicaFactura").hide('1000', 'swing');
    }
}

function validarReferenciado(){
    $("#referenciadoPor").val('');
    if ($("#referenciado").is(':checked')){
        $("#divReferenciado").show('slow');
        $("#referenciadoPor").attr('required', true);
    } else {
        $("#divReferenciado").hide('slow');
        $("#referenciadoPor").removeAttr('required');
    }
}

function verinfoapp(idCliente, tipo) {
    $.get('verinfoapp', {idCliente: idCliente, tipo: tipo}, mostrarInfoApp, 'json');
    
}
function mostrarInfoApp(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#loginapp").val(datos['login']);
        $("#passwordapp").val(datos['password']);
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalInfoApp';
        } else {
            location.href = '#modalInfoApp';
        }
    } else {
        alert("SE HA PRESENTADO UN ERROR");
    }
}

//------------------------------------------------------------------------------

function validarBusquedaRes() {
    var continuar = 0;
    $("#frmFiltroBusq").find(':input').each(function () {
        if ($(this).attr('type') !== 'submit' && $(this).attr('type') !== 'button' && $(this).val() !== '') {
            continuar++;
        }
    });

    if (parseInt($("#limpiar").val()) !== 0) {
        return true;
    }

    if (continuar > 0) {
        if ($("#clienteResBusq").val().indexOf('--') !== -1) {
            return true;
        } else {
            alert("POR FAVOR LLENE UNO DE LOS CAMPOS DE BUSQUEDA CON LA AYUDA AUTOCOMPLETAR.");
            $("#clienteResBusq").focus();
            return false;
        }
    } else {
        alert("DEBE INDICAR AL MENOS UN FILTRO DE BUSQUEDA");
        $("#clienteResBusq").focus();
        return false;
    }
}

//------------------------------------------------------------------------------

function setLimpiar() {
    $("#clienteResBusq").val('');
    $("#clienteCorpBusq").val('');
}

//------------------------------------------------------------------------------
