function getMcposXdpto(idDpto) {
    if (idDpto != '') {
        //        switch (idDpto) {
        //            case '1':
        //                $("#idPrefijo option[value=2]").attr("selected", true);
        //                break;
        //            case '2':
        //                $("#idPrefijo option[value=3]").attr("selected", true);
        //                break;
        //            case '3':
        //                $("#idPrefijo option[value=4]").attr("selected", true);
        //                break;
        //            case '4':
        //                $("#idPrefijo option[value=5]").attr("selected", true);
        //                break;
        //            case '5':
        //                $("#idPrefijo option[value=2]").attr("selected", true);
        //                break;
        //            case '6':
        //                $("#idPrefijo option[value='']").attr("selected", true);
        //                break;
        //        }
        $.get("getMcposXdpto", {
            idDpto: idDpto
        }, mostrarMcpos);
    } else {
        $('#idMcpo').html("<option value=''>Seleccione...</option>");
        $("#idPrefijo option[value='']").attr("selected", true);
    }
}

function mostrarMcpos(mcpos) {
    $("#idMcpo").html(mcpos);
}

function setDptoEditContratoIntC() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "/sw2click/modulos/internet/actualizarCorp")
    formulario.submit();
}

function setDptoNewContratoIntR() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "/sw2click/modulos/internet/nuevoResidencial")
    formulario.submit();
}

function setDptoEditContratoIntR() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "/sw2click/modulos/internet/actualizarRes")
    formulario.submit();
}

function setDptoNewContratoLanC() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "/sw2click/modulos/lantolan/nuevoCorporativo")
    formulario.submit();
}

function getNombreServicio() {
    $("#nombreServicio").val($("#nombrePlan").val());
}

function getEmailCliente() {
    if ($("#emailFacturacionContra").val().trim().length === 0) {
        $("#emailFacturacionContra").val($("#emailCliente").val());
    }
}

function getEmailCliente_1() {
    if ($("#emailFacturacionContra1").val().trim().length === 0) {
        $("#emailFacturacionContra1").val($("#emailCliente1").val());
    }
}

function getEmailClienteServ() {
    if ($("#emailFacturacion").val().trim().length === 0) {
        if ($("#tipoFacturacion").val() === 'NO' || $("#tipoFacturacion").val() === 'Multiples Facturas') {
            $("#emailFacturacion").val($("#emailCliente").val());
        } else {
            $("#emailFacturacion").val($("#emailFacturacionContra").val());
        }
    }
}

function getEmailClienteServ_1() {
    if ($("#emailFacturacion1").val().trim().length === 0) {
        if ($("#tipoFacturacion").val() === 'NO' || $("#tipoFacturacion").val() === 'Multiples Facturas') {
            $("#emailFacturacion1").val($("#emailCliente1").val());
        } else {
            $("#emailFacturacion1").val($("#emailFacturacionContra1").val());
        }
    }
}

function setNuevoPlan() {
    document.formContratos.idPlanInternet.value = '-1';
    var mcpoPlan = document.getElementById('municipioPlan');
    var lbMcpoPlan = document.getElementById('lbMcpoPlan');
    var nombrePlan = document.getElementById('nombrePlan');
    var velSubida = document.getElementById('velSubida');
    var velBajada = document.getElementById('velBajada');
    var cargoFijoMes = document.getElementById('cargoFijoMes');
    var iva = document.getElementById('iva');
    var totalPago = document.getElementById('totalPago');
    var tipoPlan = document.getElementById('tipoPlan');
    var tipoPlanSelect = document.getElementById('tipoPlanSelect');

    mcpoPlan.value = 'NO';
    mcpoPlan.hidden = true;
    lbMcpoPlan.hidden = true;

    nombrePlan.readOnly = false;
    nombrePlan.required = true;
    nombrePlan.value = '';

    velSubida.readOnly = false;
    velSubida.required = true;
    velSubida.value = '';

    velBajada.readOnly = false;
    velBajada.required = true;
    velBajada.value = '';

    cargoFijoMes.readOnly = false;
    cargoFijoMes.required = true;
    cargoFijoMes.value = '';

    iva.value = '';
    totalPago.value = '';

    tipoPlan.hidden = true;
    tipoPlanSelect.required = true;
    tipoPlanSelect.hidden = false;
}

function setTipoPlan() {
    var tipoPlan = document.getElementById('tipoPlan');
    var tipoPlanSelect = document.getElementById('tipoPlanSelect');

    tipoPlan.value = tipoPlanSelect.value;
}

function setValores() {
    var cargoFijoMes = document.getElementById('cargoFijoMes');
    var iva = document.getElementById('iva');
    var totalPago = document.getElementById('totalPago');

    var cargoFijo = cargoFijoMes.value;
    var ivaAux = 0;
    var total = 0;

    if (cargoFijo != '' && !isNaN(cargoFijo)) {
        ivaAux = parseFloat(cargoFijo) * 0.16;
        total = parseFloat(cargoFijo) + ivaAux;
    }

    iva.value = ivaAux;
    totalPago.value = total;
}

function limita(elEvento, maximoCaracteres) {
    var elemento = document.getElementById("observacion");

    // Obtener la tecla pulsada 
    var evento = elEvento || window.event;
    var codigoCaracter = evento.charCode || evento.keyCode;
    // Permitir utilizar las teclas con flecha horizontal
    if (codigoCaracter == 37 || codigoCaracter == 39) {
        return true;
    }

    // Permitir borrar con la tecla Backspace y con la tecla Supr.
    if (codigoCaracter == 8 || codigoCaracter == 46) {
        return true;
    }
    else if (elemento.value.length >= maximoCaracteres) {
        return false;
    }
    else {
        return true;
    }
}

function actualizaInfo(maximoCaracteres) {
    var elemento = document.getElementById("observacion");
    var info = document.getElementById("info");

    if (elemento.value.length >= maximoCaracteres) {
        info.innerHTML = "Maximo " + maximoCaracteres + " caracteres";
    }
    else {
        info.innerHTML = "Maximo " + (maximoCaracteres - elemento.value.length) + " caracteres";
    }
}

function generarOrden() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "/sw2click/modulos/internet/generarOrden");
    formulario.setAttribute("target", "_blank");
    formulario.submit();

}

function activarContrato() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "/sw2click/modulos/internet/activarContrato");
    formulario.removeAttribute("target");
    formulario.submit();
}

function setIds(idContrato) {
    var txtIdContrato = document.getElementById('idContrato');
    txtIdContrato.value = idContrato;
}

function agregarServicioCorp() {
    $('#formContratos').attr('action', 'agregarServicioCorp');
    $('#formContratos').removeAttr("target");
    $('#formContratos').submit();
    document.location = "#close";
}

function agregarServicioRes() {
    $('#formContratos').attr('action', 'agregarServicioRes');
    $('#formContratos').removeAttr("target");
    $('#formContratos').submit();
    document.location = "#close";
}

function eliminarContratoCorp() {
    if (confirm('¿Desea ELIMINAR este Contrato del Sistema?') == true) {
        var formContratos = document.getElementById('formContratos');
        formContratos.setAttribute('action', 'eliminarCorporativo');
        formContratos.removeAttribute("target");
        formContratos.submit();
        document.location = "#close";
    }
}

function eliminarContratoRes() {
    if (confirm('¿Desea ELIMINAR este Contrato del Sistema?') == true) {
        var formContratos = document.getElementById('formContratos');
        formContratos.setAttribute('action', 'eliminarResidencial');
        formContratos.removeAttribute("target");
        formContratos.submit();
        document.location = "#close";
    }
}

function actualizarContratoCorp() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "actualizarCorp");
    formContratos.removeAttribute("target");
    formulario.submit();
    document.location = "#close";
}

function actualizarContratoRes() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "actualizarRes");
    formContratos.removeAttribute("target");
    formulario.submit();
    document.location = "#close";
}

function imprimirContratoCorp() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("target", "_blank");
    formulario.setAttribute("action", "imprimirContratoCorp");
    formulario.submit();
    document.location = "#close";
}

function imprimirContratoRes() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("target", "_blank");
    formulario.setAttribute("action", "imprimirContratoRes");
    formulario.submit();
}

function verInfoContrato() {
    var formulario = document.getElementById("formContratos");
    formulario.setAttribute("action", "verInfoContrato");
    formContratos.removeAttribute("target");
    formulario.submit();
}

function calcularValoresInstalacion(iva) {
    var total = 0;
    for (i = 1; i <= parseInt($("#numConceptos").val()); i++) {
        total = total + parseInt($("#vlr_" + i).val());
    }
    $("#valorInstalacion").val(total);
    if (total !== 0) {
        $("#instalarGratis").val(0);
    }
}

function getClienteCorp() {
    var href = '/sw2click/modulos/internet/getCorporativo';
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getClienteRes() {
    var href = '/sw2click/modulos/internet/getResidencial';
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function setNuevoConcepto(iva) {
    var tabla = document.getElementById('tablaConceptos');
    var ultFila = tabla.rows.length;
    var i = ultFila;

    var fila = tabla.insertRow(ultFila);

    //    fila.insertCell(0);
    var concepto = fila.insertCell(0);
    var inConcepto = document.createElement('input');
    inConcepto.name = 'concepto_' + i;
    inConcepto.id = 'concepto_' + i;
    inConcepto.required = 'true';
    inConcepto.setAttribute('style', 'width: 380px');
    concepto.appendChild(inConcepto);

    var valor = fila.insertCell(1);
    var inValor = document.createElement('input');
    inValor.name = 'vlr_' + i;
    inValor.value = '0';
    inValor.id = 'vlr_' + i;
    inValor.required = 'true';
    inValor.setAttribute('style', 'width: 100px');
    inValor.setAttribute('pattern', '[0-9]{1,10}');
    inValor.setAttribute('onchange', 'calcularValoresInstalacion(' + iva + ')');
    valor.appendChild(inValor);

    var txtNumConceptos = document.getElementById('numConceptos');
    txtNumConceptos.value++;
}

function eliminarConcepto() {
    var tabla = document.getElementById('tablaConceptos');
    var ultFila = tabla.rows.length;
    if (ultFila > 2) {
        tabla.deleteRow(ultFila - 1);
        var txtNumConceptos = document.getElementById('numConceptos');
        txtNumConceptos.value--;
        calcularValoresInstalacion();
    }
}

function selectContrato(idContrato, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdContratoBusq = parent.opener.document.getElementById('idContratoBusq');
    txtIdContratoBusq.value = idContrato;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}

//function getContratosFiltro(){
//    var formulario = parent.opener.document.getElementById('filtroContratos');
//    
//}

function getPlanInternet(tipo) {
    var href = '/sw2click/modulos/internet/getPlanInternet?tipo=' + tipo; // tipo=1-->Corporativo; tipo=2-->Residencial
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function validarCorp() {
    if (confirm("¿ Seguro que desea CREAR este Contrato ?")) {
        var formulario = document.getElementById("formContratos");
        formulario.setAttribute("action", "insertar_corporativo");
        formContratos.removeAttribute("target");
        return true;
    } else {
        return false;
    }
}

function validarRes() {
    if (confirm("¿ Seguro que desea CREAR este Contrato ?")) {
        var formulario = document.getElementById("formContratos");
        formulario.setAttribute("action", "insertar_residencial");
        formContratos.removeAttribute("target");
        return true;
    } else {
        return false;
    }
}

function habilitarNuevo() {
    var elements = document.getElementsByName('formNuevo');
    elements[0].removeAttribute('hidden');
    var id = document.getElementById('idPlanInternet');
    id.focus();
}

function setFechaFinalizacion() {
    var fechaInicio = $("#fechaInicio").val();
    var duracion = $("#duracion").val();
    //    alert("Duracion: " + duracion + " -- FechaIni: " + fechaInicio);
    if (fechaInicio != '' && duracion != '') {
        var fechaAux_1 = fechaInicio.split('-');
        var anio = fechaAux_1[0];
        var mes = fechaAux_1[1] - 1;
        var dia = fechaAux_1[2];
        var fechaAux = new Date();
        fechaAux.setFullYear(anio, mes, dia);
        duracion = parseInt(duracion) + parseInt(mes);
        fechaAux.setMonth(duracion);
        anio = fechaAux.getFullYear();
        mes = fechaAux.getMonth() + 1;
        dia = fechaAux.getDate();
        if (dia < 10) {
            dia = '0' + dia;
        }
        if (mes < 10) {
            mes = '0' + mes;
        }
        $("#fechaFin").val(anio + "-" + mes + "-" + dia);
    } else {
        $("#fechaFin").val('');
    }
}

function setFechaFinalizacionContrato() {
    var fechaInicio = $("#fechaInicioContrato").val();
    var duracion = $("#duracionContrato").val();
    //    alert("Duracion: " + duracion + " -- FechaIni: " + fechaInicio);
    if (fechaInicio != '' && duracion != '') {
        var fechaAux_1 = fechaInicio.split('-');
        var anio = fechaAux_1[0];
        var mes = fechaAux_1[1] - 1;
        var dia = fechaAux_1[2];
        var fechaAux = new Date();
        fechaAux.setFullYear(anio, mes, dia);
        duracion = parseInt(duracion) + parseInt(mes);
        fechaAux.setMonth(duracion);
        anio = fechaAux.getFullYear();
        mes = fechaAux.getMonth() + 1;
        dia = fechaAux.getDate();
        if (dia < 10) {
            dia = '0' + dia;
        }
        if (mes < 10) {
            mes = '0' + mes;
        }
        $("#fechaFinContrato").val(anio + "-" + mes + "-" + dia);
    } else {
        $("#fechaFinContrato").val('');
    }
}

function setClienteCorp(idCorporativo) {
    $.get("getClienteCorp", {
        idCorporativo: idCorporativo
    }, mostrarClienteCorp, 'json');
}

function mostrarClienteCorp(datos) {
    //    var datos = cliente.split('#@');
    parent.opener.document.getElementById('infoCorporativo').innerHTML = datos['html'];
    parent.opener.document.getElementById('idCorporativo').value = datos['idCliente'];
    if (datos['tipoFacturacion'] === 'Unica Factura') {
        parent.opener.document.getElementById('tipoFacturacion').innerHTML = "<option value='NO'>Todos los Contratos en Unica Factura</option>";
        //        parent.opener.document.getElementById('divEmailsFacturasServicio').setAttribute('hidden', 'true');
        //        parent.opener.document.getElementById('emailFacturacion').removeAttribute('required');
    } else {
        parent.opener.document.getElementById('tipoFacturacion').innerHTML = "<option value=''>Seleccione...</option><option>Unica Factura</option><option>Multiples Facturas</option>";
        //        parent.opener.document.getElementById('divEmailsFacturasServicio').removeAttribute('hidden');
        //        parent.opener.document.getElementById('emailFacturacion').setAttribute('required', 'true');
    }
    var idDpto = parseInt(datos['idDpto']);
    var todos = datos['todos'];
//    if (todos == 0) {
//        switch (idDpto) {
//            case 1:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
//                break;
//            case 2:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="3">DN</option>';
//                break;
//            case 3:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="4">DH</option>';
//                break;
//            case 4:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="5">DP</option>';
//                break;
//            case 5:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
//                break;
//            case 6:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
//                break;
//            default:
//                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
//                break;
//        }
//    } else {
//        switch (idDpto) {
//            case 1:
//                parent.opener.document.getElementById('idPrefijo').value = 2;
//                break;
//            case 2:
//                parent.opener.document.getElementById('idPrefijo').value = 3;
//                break;
//            case 3:
//                parent.opener.document.getElementById('idPrefijo').value = 4;
//                break;
//            case 4:
//                parent.opener.document.getElementById('idPrefijo').value = 5;
//                break;
//            case 5:
//                parent.opener.document.getElementById('idPrefijo').value = 2;
//                break;
//            case 6:
//                parent.opener.document.getElementById('idPrefijo').value = 2;
//                break;
//            default:
//                parent.opener.document.getElementById('idPrefijo').value = 2;
//                break;
//        }
//    }
    if (datos['numContratos'] > 0) {
        parent.opener.document.getElementById('infoContratos').removeAttribute('hidden');
    } else {
        parent.opener.document.getElementById('infoContratos').setAttribute('hidden', 'true');
    }
    self.close();
}

function setClienteRes(idResidencial) {
    $.get("getClienteRes", {
        idResidencial: idResidencial
    }, mostrarClienteRes, 'json');
}

function mostrarClienteRes(datos) {
    //    var datos = cliente.split('#@');
    parent.opener.document.getElementById('infoResidencial').innerHTML = datos['html'];
    parent.opener.document.getElementById('idResidencial').value = datos['idCliente'];
    if (datos['tipoFacturacion'] === 'Unica Factura') {
        parent.opener.document.getElementById('tipoFacturacion').innerHTML = "<option value='NO'>Todos los Contratos en Unica Factura</option>";
        //        parent.opener.document.getElementById('divEmailsFacturasServicio').setAttribute('hidden', 'true');
        //        parent.opener.document.getElementById('emailFacturacion').removeAttribute('required');
    } else {
        parent.opener.document.getElementById('tipoFacturacion').innerHTML = "<option value=''>Seleccione...</option><option>Unica Factura</option><option>Multiples Facturas</option>";
        //        parent.opener.document.getElementById('divEmailsFacturasServicio').removeAttribute('hidden');
        //        parent.opener.document.getElementById('emailFacturacion').setAttribute('required', 'true');
    }
    var idDpto = parseInt(datos['idDpto']);
    var todos = datos['todos'];
    if (todos == 0) {
        switch (idDpto) {
            case 1:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
                break;
            case 2:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="3">DN</option>';
                break;
            case 3:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="4">DH</option>';
                break;
            case 4:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="5">DP</option>';
                break;
            case 5:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
                break;
            case 6:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
                break;
            default:
                parent.opener.document.getElementById('idPrefijo').innerHTML = '<option value="2">DC</option>';
                break;
        }
    } else {
        switch (idDpto) {
            case 1:
                parent.opener.document.getElementById('idPrefijo').value = 2;
                break;
            case 2:
                parent.opener.document.getElementById('idPrefijo').value = 3;
                break;
            case 3:
                parent.opener.document.getElementById('idPrefijo').value = 4;
                break;
            case 4:
                parent.opener.document.getElementById('idPrefijo').value = 5;
                break;
            case 5:
                parent.opener.document.getElementById('idPrefijo').value = 2;
                break;
            case 6:
                parent.opener.document.getElementById('idPrefijo').value = 2;
                break;
            default:
                parent.opener.document.getElementById('idPrefijo').value = 2;
                break;
        }
    }
    self.close();
}

function setPlanInternet(idPlan) {
    $.get("ajaxGetPlanInt", {idPlanInternet: idPlan}, mostrarPlanInternet, 'json');
}
function mostrarPlanInternet(datos) {
    parent.opener.document.getElementById('infoPlan').innerHTML = datos['html'];
    parent.opener.document.getElementById('idPlanInternet').value = datos['idPlan'];
    self.close();
    var href = parent.opener.document.location.href;
    var modal = "close";
    if (href.indexOf("agregarServicioCorp") >= 0 || href.indexOf("agregarServicioRes") >= 0) {
        modal = '#close';
    } else {
        modal = '#openModal';
    }
    var partesHref = href.split('#');
    if (partesHref.length > 1) {
        parent.opener.document.location.href = partesHref[0] + modal;
    } else {
        parent.opener.document.location.href += modal;
    }
}

function mostrarPlanInternetAddServ(datos) {
    parent.opener.document.getElementById('infoPlan').innerHTML = datos['html'];
    parent.opener.document.getElementById('idPlanInternetNew').value = datos['idPlan'];
    self.close();
    var partesHref = parent.opener.document.location.href.split('#');
    if (partesHref.length > 1) {
        parent.opener.document.location.href = partesHref[0] + '#close';
    } else {
        parent.opener.document.location.href += '#close';
    }
}

function validarSetServicio(tipoCliente) { // tipoCliente=1 --> Corporativo; tipoCliente=2 --> Residencial
    if (jQuery.trim($('#idPlanInternet').val()).length <= 0) {
        alert("Seleccione un Plan de Internet");
        $('#idPlanInternet').focus();
        return false;
    }
    if (!validarPlanMunicipio()) {
        return false;
    }
    if (confirm(" Esta seguro que desea ADICIONAR este Servicio al Contrato ?")) {
        var mensualidad = 0;
        var duracion = parseInt($("#duracion").val());
        var vlrInstalacion = parseInt($("#valorInstalacion").val());
        var cfm = parseInt($("#cargoFijoMes").val().replace(/\,/g, ''));
        mensualidad = cfm;
        //        alert("Mensualidad: " + mensualidad + " -- Duracion: " + duracion + " -- vlrInstall: " + vlrInstalacion + " -- cfm: " + cfm + " -- tipoPlan: " + $("#tipoPlan").val());
        var totalContrato = (Math.round(mensualidad) * duracion) + vlrInstalacion;
        $("#vlrTotalContrato").val(parseInt($("#vlrTotalContrato").val()) + totalContrato);

        //TELEVISION
        var tv = 0;
        var numDecos = 0;
        if ($("#tipoVentaServicio").val() === 'TV' || $("#tipoVentaServicio").val() === 'COMBO') {
            tv = 1;
            if ($("#tipoTV").val() === 'DIGITAL') {
                numDecos = $("#numDecos").val();
            } else {
                numDecos = 999;
            }
        }

        var nuevaFila = '<tr>' +
                '<td>' + $("#idServicios").val() + '</td>' +
                '<td>' + $("#idPlanInternet").val() + '</td>' +
                '<td>' + $("#idMcpo").val() + '_' + $("#idMcpo option:selected").text() + '-' + $("#idDpto option:selected").text() + '</td>' +
                '<td>' + $("#dirInstalacion").val() + '</td>' +
                '<td>' + $("#fechaInicio").val() + '</td>' +
                '<td>' + $("#duracion").val() + '</td>' +
                '<td>' + $("#fechaFin").val() + '</td>' +
                '<td>' + $("#disponibilidad").val() + '</td>' +
                '<td>' + $("#dedicado").is(':checked') + '</td>' +
                '<td>' + $("#valorInstalacion").val() + '</td>' +
                '<td>' + totalContrato + '</td>' +
                '<td>' + $("#nombreServicio").val() + '</td>' +
                '<td>' + $("#emailFacturacion").val() + ', ' + $("#emailFacturacion1").val() + '</td>';
        if (tv === 1) {
            nuevaFila += '<td>SI</td>';
        } else {
            nuevaFila += '<td>NO</td>';
        }
        nuevaFila += '<td>' + numDecos + '</td>';
        nuevaFila += '<td><a href="#" onclick="eliminarServicio(' + $("#idServicios").val() + ')">X</a></td>' +
                '</tr>';
        $("#tablaServicios").find('tbody').append(nuevaFila);

        var referenciado = 0;
        if ($("#referenciado").is(':checked')) {
            referenciado = 1;
        }
        var idServicios = $("#idServicios").val();
        var infoCampo = $("#idPlanInternet").val()
                + '&&' + $("#idMcpo").val()
                + '&&' + $("#dirInstalacion").val()
                + '&&' + $("#fechaInicio").val()
                + '&&' + $("#duracion").val()
                + '&&' + $("#fechaFin").val()
                + '&&' + $("#disponibilidad").val()
                + '&&' + $("#dedicado").is(':checked')
                + '&&' + $("#valorInstalacion").val()
                + '&&' + $("#nombreServicio").val()
                + '&&' + $("#emailFacturacion").val()
                + '&&' + $("#emailFacturacion1").val()
                + '&&' + $("#obsServicio").val()
                + '&&' + $("#facturar").val()
                + '&&' + referenciado
                + '&&' + $("#referenciadoPor").val()
                + '&&' + $("#instalarGratis").val()
                + '&&' + tv
                + '&&' + numDecos;
        var nuevoCampo = "<input type='hidden' name='servicio_" + idServicios + "' id='servicio_" + idServicios + "' value='" + infoCampo + "'>";
        $("#formContrato").append(nuevoCampo);
        $("#idServicios").val(parseInt(idServicios) + 1);

        var numConceptos = parseInt($("#numConceptos").val());
        var conceptosFactura = '';
        for (i = 1; i <= numConceptos; i++) {
            conceptosFactura = conceptosFactura + $("#concepto_" + i).val().replace(/\;/g, ',') + ';' + $("#vlr_" + i).val() + '&&';
        }
        var nuevoConceptoFactura = "<input type='hidden' name='conceptoFactura_" + idServicios + "' id='conceptoFactura_" + idServicios + "' value='" + conceptosFactura + "'>";
        $("#formContrato").append(nuevoConceptoFactura);

        var numServicios = $("#numServicios").val();
        $("#numServicios").val(parseInt(numServicios) + 1);

        location.href += '#close';
        return false;
    } else {
        return false;
    }
}

function setNumCuotas() {
    if ($("#pagoCuotas").is(':checked')) {
        $("#divNumCuotas").show(1200, 'swing');
        $("#numCuotas").attr('required', 'true');
    } else {
        $("#divNumCuotas").hide(1500, 'swing');
        $("#numCuotas").removeAttr('required');
    }
}

function setEmailsFactura(vlr) {
    if (vlr === 'Unica Factura') {
        $("#divEmailsFacturas").show(800, 'swing');
        $("#emailFacturacionContra").attr('required', 'true');
    } else {
        $("#divEmailsFacturas").hide(800, 'swing');
        $("#emailFacturacionContra").removeAttr('required');
    }
}

function limpiarServicio(idCliente) {
    if (jQuery.trim($('#' + idCliente).val()).length <= 0) {
        alert("Seleccione un Cliente");
        $('#' + idCliente).focus();
        return false;
    }
    if ($("#tipoFacturacion").val() === '') {
        alert("Seleccione un Tipo de Facturacion [ FACTURAR EN ]");
        $("#tipoFacturacion").focus();
        $("#tipoFacturacion").focus();
        return false;
    }

    $("#idPlanInternet").val('');
    $("#infoPlan").html('');
    $("#idDpto").val('');
    $("#idMcpo").val('');
    $("#dirInstalacion").val('');
//    $("#fechaInicio").val('');
//    $("#duracion").val('');
//    $("#fechaFin").val('');
    $("#disponibilidad").val('95.0');
    $("#dedicado").removeAttr('checked');
    $("#numConceptos").val('1');
    $("#tablaConceptos tbody").find('tr').each(function () {
        if ($(this).attr('id') !== 'filaBase') {
            this.remove();
        } else {
            $("#vlr_1").val('');
            $("#valor_1").val('');
        }
    });
    $("#valorInstalacion").val('');
    $("#ivaPago").val('');
    $("#totalFactura").val('');
    $("#nombreServicio").val('');
    $("#emailFacturacion").val('');
    $("#emailFacturacion1").val('');
    if (parseInt($("#idPrefijo").val()) !== 6) {
        $("#facturar").val(1);
    } else {
        $("#facturar").val('');
    }

    $("#idPlanInternet").focus();
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#openModal';
    } else {
        document.location.href += '#openModal';
    }
}

function eliminarServicio(idSercivio) {
    if (confirm("¿ Esta seguro que NO desea INCLUIR este Servicio en el Contrato ?")) {
        $("#tablaServicios tbody tr").each(function () {
            var columnas = $(this).children('td');
            if (parseInt(columnas[0].innerHTML) == parseInt(idSercivio)) {
                this.remove();
                var numServicios = $("#numServicios").val();
                $("#numServicios").val(parseInt(numServicios) - 1);
                $("#servicio_" + idSercivio).remove();
                var totalContrato = parseInt(columnas[10].innerHTML);
                var vlrTotalContrato = parseInt($("#vlrTotalContrato").val());
                if (vlrTotalContrato >= totalContrato) {
                    $("#vlrTotalContrato").val(vlrTotalContrato - totalContrato);
                } else {
                    $("#vlrTotalContrato").val(0);
                }
                return;
            }
        });
    }
}

function validarContrato(idCliente, tipo) { // tipo=1-->Corporativo;   tipo=2-->Residencial
    if (jQuery.trim($('#' + idCliente).val()).length <= 0) {
        alert("Seleccione un Cliente");
        $('#' + idCliente).focus();
        return false;
    }
//    if (parseInt($("#vlrTotalContrato").val()) <= 0) {
//        alert("El Valor Total del Contrato DEBE ser Mayor que CERO");
//        $('#vlrTotalContrato').focus();
//        return false;
//    }
    if (parseInt($("#numServicios").val()) <= 0) {
        alert("El Numero de Servicios DEBE ser Mayor que CERO");
        $('#numServicios').focus();
        return false;
    }
    if (confirm("Esta a punto de REGISTRAR un nuevo contrato. \n\n\[ * ] Por favor, REVISE LA INFORMACION del mismo antes de proceder a Registrarlo. \n\n\[ * ] Tenga en cuenta que una vez Registrado el contrato NO PODRA REALIZAR CAMBIOS AL MISMO. \n\n\     ¿ Esta seguro que desea REGISTRAR este Contrato ?")) {
        if (tipo == 1) {
            $("#formContrato").attr('action', 'insertar_corporativo');
        } else {
            $("#formContrato").attr('action', 'insertar_residencial');
        }
        return true;
    } else {
        return false;
    }
}

function verServicio(idServicio) {
    $.get('getServicio', {
        idServicio: idServicio
    }, mostrarServicio, 'json');
}

function mostrarServicio(datos) {
    $("#idPlanInternetVer").val(datos['idPlanInternet']);
    $("#ubicacionPlanVer").val(datos['ubicacionPlan']);
    $("#nombrePlanVer").val(datos['nombrePlan']);
    $("#velBajadaVer").val(datos['velBajada']);
    $("#velSubidaVer").val(datos['velSubida']);
    $("#cargoFijoMesVer").val(datos['cargoFijoMes']);
    $("#ivaVer").val(datos['iva']);
    $("#totalPagoVer").val(datos['totalPago']);
    $("#tipoPlanVer").val(datos['tipoPlan']);
    $("#ubicacionServVer").val(datos['ubicacion']);
    $("#dirInstalacionVer").val(datos['dirInstalacion']);
    $("#fechaInicioServVer").val(datos['fechaInicio']);
    $("#duracionServVer").val(datos['duracion']);
    $("#fechaFinServVer").val(datos['fechaFin']);
    $("#disponibilidadServVer").val(datos['disponibilidad']);
    $("#dedicadoServVer").val(datos['dedicado']);
    $("#valorInstalacionServVer").val(datos['valorInstalacion']);
    $("#conceptoFacturacionVer").val(datos['conceptoFacturacion']);
    $("#emailFacturacionServVer").val(datos['emailFacturacion']);
    $("#emailFacturacionServ1Ver").val(datos['emailFacturacion1']);
    $("#observacionServVer").val(datos['observacion']);
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#openModal';
    } else {
        document.location.href += '#openModal';
    }
}

function mostrarAyuda(ayuda) {
    var textoAyuda = "";
    var textoTitulo = "";
    switch (ayuda) {
        case 1:
            textoAyuda = "La <ins>Facturacion Automatica</ins> es aquella que es generada por Josandro el primer dia de cada mes. <br><br>La <ins>Facturacion Manual</ins> es aquella que debe ser generada por el usuario, utilizando el Modulo de Facturacion de Josandro.";
            textoTitulo = "Facturacion Automatica o Manual";
            break;
        case 2:
            textoAyuda = "Prefijo DC: Clientes Cauca <br>Prefijo DN: Clientes Nariño <br>Prefijo DH: Clientes Huila <br>Prefijo DP: Clientes Putumayo <br>Prefijo CP: Clientes Corporativos (Empresas, Alcaldias. E.S.Es, etc.)";
            textoTitulo = "Prefijo de Facturacion";
            break;
        case 3:
            textoAyuda = "<ins>Anticipada:</ins> Se factura y luego se consume el servicio<br> <ins>Transcurrida:</ins> Se Factura el mismo mes en que se consume el servicio<br> <ins>Vencida:</ins> Se consume el servicio y luego se factura";
            textoTitulo = "Forma de Facturacion";
            break;
        case 4:
            textoAyuda = "* <ins>Unica Factura:</ins> Los servicios vinculados a este contrato se facturan en una sola factura<br> * <ins>Multiples Facturas:</ins> Los servicios asociados a este contrato se facturan cada uno por separado<br> * <ins>Todos los Contratos en Unica Factura:</ins> El cliente asociado a este contrato tiene facturacion en FACTURA UNICA";
            textoTitulo = "Facturar En";
            break;
        case 5:
            textoAyuda = "* <ins>Mensualidad:</ins> Se genera facturacion por cada mes, mientras dure el contrato <br>* <ins>Cuotas:</ins> Se genera facturacion de acuerdo al Numero de Cuotas establecidas";
            textoTitulo = "Forma de Pago";
            break;
        case 6:
            textoAyuda = "* <ins>Normal:</ins> El valor de la factura sera determinado de acuerdo al plan de internet<br>* <ins>Disponibilidad:</ins> El valor de la factura sera determinado de acuerdo al porcentaje de disponibilidad del servicio <br>* <ins>ANS:</ins> El valor de la factura sera determinado segun Acuerdo de Nivel de Servicio(ANS) pactado en el contrato";
            textoTitulo = "Forma de Cobro";
            break;
    }
    if (ayuda < 5) {
        $("#divTextoAyuda").html(textoAyuda);
        $("#tituloAyuda").html(textoTitulo);
        $("#divAyudaInfoFacturacion").show('1500', 'swing');
    } else if (ayuda >= 5) {
        $("#divTextoAyuda_1").html(textoAyuda);
        $("#tituloAyuda_1").html(textoTitulo);
        $("#divAyudaInfoFacturacion_1").show('1500', 'swing');
    }
}

function ocultarAyuda() {
    $("#divAyudaInfoFacturacion").hide('1000', 'swing');
    $("#divAyudaInfoFacturacion_1").hide('1000', 'swing');
}

function validarAddServicio(tipo) { // tipo=1 --> Corporativo;  tipo=2 --> Residencial
    if ($.trim($("#idPlanInternet").val()).length === 0) {
        alert("Debe seleccionar un Plan de Internet");
        $("#idPlanInternet").focus();
        return false;
    }
    if (!validarPlanMunicipio()) {
        return false;
    }
    if (confirm("¿ Esta seguro que desea AGREGAR este Servicio al Contrato ?")) {
        if (tipo === 1) {
            $("#formServicio").attr('action', 'adicionarServicioCorp');
        } else {
            $("#formServicio").attr('action', 'adicionarServicioRes');
        }
        return true;
    } else {
        $("#formServicio").removeAttr('action');
        return false;
    }
}

function setGenerarFactInstal() {
    if (parseInt($("#idPrefijo").val()) !== 6) {
        $("#facturar").val(1);
    }
}

function eliminarServicio(idServicio, tipoServicio) {
    if (confirm("¿ Desea ELIMINAR este Servicio ? \n\nEl servicio será DESACTIVADO y la informacion se guardará en el Historico de la Base de Datos")) {
        if (tipoServicio === "Internet Corporativo") {
            $("#formContrato").attr('action', 'eliminarCorporativo');
        } else {
            $("#formContrato").attr('action', 'eliminarResidencial');
        }
        $("#idServicio").val(idServicio);
        $("#formContrato").submit();
    }
}

function validarReferenciado() {
    $("#referenciadoPor").val('');
    if ($("#referenciado").is(':checked')) {
        $("#divReferenciado").show('slow');
        $("#referenciadoPor").attr('required', true);
    } else {
        $("#divReferenciado").hide('slow');
        $("#referenciadoPor").removeAttr('required');
    }
}

function guardarCambios() {
    if (confirm("� DESEA GUARDAR LOS CAMBIOS ?")) {
        $.get('guardarCambios', {
            idContrato: $("#idContrato").val(),
            vlrTotalContrato: $("#vlrTotalContrato").val(),
            fechaInicioContrato: $("#fechaInicioContrato").val(),
            duracionContrato: $("#duracionContrato").val(),
            fechaFinContrato: $("#fechaFinContrato").val(),
            formaFacturacion: $("#formaFacturacion").val()
        }, confirmGuardarCambios, 'json');
    }
    return false;
}
function confirmGuardarCambios(datos) {
    if (parseInt(datos['error']) === 0) {
        alert(" LOS CAMBIOS FUERON GUARDADOS EN EL SISTEMA ");
    } else {
        alert(" ERROR DEL SISTEMA. OPERACION NO REALIZADA ");
    }
    location.reload();
}

function validarPlanMunicipio() {
//    if ($("#idMcpoPlan").length > 0 && $("#idMcpo").val() !== '') {
//        if ($("#idMcpo").val() !== $("#idMcpoPlan").val()) {
//            alert("EL PLAN SELECCIONADO NO CORRESPONDE CON EL MUNICIPIO EN EL CUAL SE REALIZARA LA INSTALACION DEL SERVICIO");
//            $("#idMcpo").focus();
//            return false;
//        }
//    }
    return true;
}

function setInstalacionGratis(gratis) {
    if (parseInt(gratis) === 1) {
        if (parseInt($("#valorInstalacion").val()) !== 0) {
            $("#instalarGratis").val(0);
            alert("NO SE POSIBLE TENER INSTALACION GRATIS SI SE HAN CARGADO VALORES A LA FACTURA DE INSTALACION ANTERIOR. PARA GENERAR LA INSTALACION GRATIS, POR FAVOR, ELIMINE LOS CONCEPTOS DE FACTURA CARGADOS ANTERIORMENTE O COLOQUELOS EN CERO PESOS.");
        }
    }
}

function verCambioCorte(idServicio, idContrato) {
    $("#idServicioCorte").val(idServicio);
    $("#idContratoCorte").val(idContrato);
    $("#diaCorte").val('');
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#modalFormulario';
    } else {
        location.href = '#modalFormulario';
    }
    $("#diaCorte").focus();
}

//TELEVISION
function validarTV() {
      $("#divTV").hide('slow');
      $("#numDecos").removeAttr('required');
      $("#numDecos").val('');
      if ($("#tipoVentaServicio").val() === 'INTERNET') {            
          $("#divTipoTV").hide('slow');
          $("#tipoTV").removeAttr('required');
          $("#tipoTV").val('');            
      } else {
          $("#tipoTV").attr('required', true);
          $("#tipoTV").val('');
          $("#divTipoTV").show('slow');            
      }
}

function validarTipoTV(){
      if ($("#tipoTV").val() === 'ANALOGA') {
          $("#divTV").hide('slow');
          $("#numDecos").removeAttr('required');
          $("#numDecos").val('');
      } else {
          $("#divTV").show('slow');
          $("#numDecos").attr('required', true);
      }
}

function verCambiarNumDecos(idServicio, idContrato, numDecosOLD) {
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#modalFormulario1';
    } else {
        document.location.href += '#modalFormulario1';
    }
    $("#idServicioNumDecos").val(idServicio);
    $("#idContratoNumDecos").val(idContrato);
    $("#numDecosOLD").val(numDecosOLD);
    $("#numDecos").val('');
}

function cambiarNumDecos() {
    if (parseInt($("#numDecos").val()) > 0 && $("#numDecos").val() !== '') {
        if (parseInt($("#numDecos").val()) !== parseInt($("#numDecosOLD").val())) {
            if (confirm(" ¿ DESEA CAMBIAR EL NUMERO DE DECOS ? ")) {
                $.post('cambiarnumdecos', {idServicio: $("#idServicioNumDecos").val(), numDecos: $("#numDecos").val()}, setCambiarNumDecos, 'json');
            } else {
                return false;
            }
        } else {
            alert("EL NUMERO DE DECOS A CAMBIAR DEBE SER DIFERENTE AL NUMERO DE DECOS ACTUALES DEL SERVICIO !");
            $("#numDecos").val('');
            $("#numDecos").focus();
            return false;
        }
    } else {
        alert("POR FAVOR INGRESE UN NUMERO DE DECOS VALIDO !");
        $("#numDecos").focus();
    }
}
function setCambiarNumDecos(msg) {
    if (parseInt(msg) === 1) {
        alert("NUMERO DE DECOS CAMBIADO EXITOSAMENTE EN JOSANDRO !");
    } else {
        alert("ERROR. SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA.\n\nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA !");
    }
    location.reload();
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

function validarEliminarContrato() {
    if (confirm("   DESEA ELIMINAR ESTE CONTRATO ? ")) {
        $("#btnEliminarContrato").attr('disabled', true);
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------
