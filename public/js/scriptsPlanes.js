function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#close';
    } else {
        location.href = '#close';
    }
}

//function verAux(evento) {
//    evento.stopPropagation();
//}

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
}

////******************************************************************************
//**************   P L A N E S   I N T E R N E T   *****************************
//******************************************************************************

function setDpto(idDpto) {
    $.get('getMcpos', {idDpto: idDpto}, mostrarMcpos, 'json');
    activarBloqueoAjax();
}

function mostrarMcpos(datos) {
    $("#idMcpo").html(datos['html']);
}

function setDptoBusq(idDpto) {
    $.get('getMcposBusq', {idDpto: idDpto}, mostrarMcposBusq, 'json');
    activarBloqueoAjax();
}

function mostrarMcposBusq(datos) {
    $("#idMcpo").html(datos['html']);
}

function setDptoUpdatePlanInt() {
    var formulario = document.getElementById("formPlanes");
    formulario.setAttribute("action", "/sw2click/modulos/planInternet/actualizar")
    formulario.submit();
}

function setValores() {
    var cargoFijo = $.trim($("#cargoFijoMes").val());
    var tipoPlan = $.trim($("#tipoPlan").val());
    if (cargoFijo.length === 0 || tipoPlan.length === 0) {
        return;
    }
    var iva = 0;
    var totalPago = 0;
    if ($.isNumeric(cargoFijo)) {
        if (tipoPlan === 'Corporativo') {
            totalPago = Math.round(parseFloat(cargoFijo) * 1.19);
        } else {
            totalPago = parseFloat(cargoFijo);
        }
        iva = totalPago - parseFloat(cargoFijo);
    }
    $("#iva").val(formatoMoneda(iva, 0));
    $("#totalPago").val(formatoMoneda(totalPago, 0));
}

function selectPlanIntCorpContrato(idPlanInternet, idCorporativo, idDpto, nuevo, idContrato) {
    if (nuevo == 1) {
        parent.opener.location = '/sw2click/modulos/internet/nuevoCorporativo?idPlanInternet=' + idPlanInternet + '&idCorporativo=' + idCorporativo + '&idDpto=' + idDpto;
    } else {
        parent.opener.location = '/sw2click/modulos/internet/actualizarCorp?idPlanInternet=' + idPlanInternet + '&idCorporativo=' + idCorporativo + '&idDpto=' + idDpto + '&idContrato=' + idContrato;
    }
    self.close();
}

function selectPlanIntResContrato(idPlanInternet, idResidencial, idDpto, nuevo, idContrato) {
    if (nuevo == 1) {
        parent.opener.location = '/sw2click/modulos/internet/nuevoResidencial?idPlanInternet=' + idPlanInternet + '&idResidencial=' + idResidencial + '&idDpto=' + idDpto;
    } else {
        parent.opener.location = '/sw2click/modulos/internet/actualizarRes?idPlanInternet=' + idPlanInternet + '&idResidencial=' + idResidencial + '&idDpto=' + idDpto + '&idContrato=' + idContrato;
    }
    self.close();
}

//******************************************************************************
//************   P L A N E S   L A N   T O   L A N   ***************************
//******************************************************************************

function setDptoNewPlanLAN() {
    var formulario = document.getElementById("formPlanes");
    formulario.setAttribute("action", "/sw2click/modulos/planLANtoLAN/nuevoPlan")
    formulario.submit();
}

function setDptoUpdatePlanLAN() {
    var formulario = document.getElementById("formPlanes");
    formulario.setAttribute("action", "/sw2click/modulos/planLANtoLAN/actualizar")
    formulario.submit();
}

function selectPlanLanCorpContrato(idPlanLANtoLAN, idCorporativo, idDpto) {
    parent.opener.location = '/sw2click/modulos/lantolan/nuevoCorporativo?idPlanLANtoLAN=' + idPlanLANtoLAN + '&idCorporativo=' + idCorporativo + '&idDpto=' + idDpto;
    self.close();
}

function selectPlanInternet(idPlan, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdPlanBusq = parent.opener.document.getElementById('idPlanBusq');
    txtIdPlanBusq.value = idPlan;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}

function formatoMoneda(cnt, cents) {
    cnt = cnt.toString().replace(/\$|\u20AC|\,/g, '');
    if (isNaN(cnt))
        return 0;
    var sgn = (cnt == (cnt = Math.abs(cnt)));
    cnt = Math.floor(cnt * 100 + 0.5);
    cvs = cnt % 100;
    cnt = Math.floor(cnt / 100).toString();
    if (cvs < 10)
        cvs = '0' + cvs;
    for (var i = 0; i < Math.floor((cnt.length - (1 + i)) / 3); i++)
        cnt = cnt.substring(0, cnt.length - (4 * i + 3)) + ','
                + cnt.substring(cnt.length - (4 * i + 3));

    return (((sgn) ? '' : '-') + cnt) + (cents ? '.' + cvs : '');
}


//--------------------------------------------------------------------------------------
function agregarMunicipio() {
    if ($("#idMcpo").val() !== '') {
        var partes = $("#idMcpo").val().split('_');
        var idMunicipio = partes[0];

        if ($("#idsMunicipiosAgregados").val().indexOf(idMunicipio) !== -1) {
            alert("ESTE MUNICIPIO YA HA SIDO AGREGADO PREVIAMENTE \n\n NO ES POSIBLE AGREGARLO DE NUEVO");
            return;
        }

        var nuevaFila = '<tr>' +
                '<td>' + idMunicipio + '</td>' +
                '<td>' + $("#idMcpo option:selected").text() + '</td>' +
                '<td><a href="#" class="quitar">X</a></td>' +
                '</tr>';
        $("#tblMunicipios").find('tbody').append(nuevaFila);
        var ids = $("#idsMunicipiosAgregados").val();
        if (ids === '') {
            ids = idMunicipio;
        } else {
            ids = ids + ',' + idMunicipio;
        }
        $("#idsMunicipiosAgregados").val(ids);
//        $("#numRecursos").val(parseInt($("#numRecursos").val()) + 1);
    } else {
        alert('Debe seleccionar un Municipio');
        $("#idMcpo").focus();
    }
}

function validarPlan() {
    if ($("#idsMunicipiosAgregados").val() === '') {
        alert('Para poder continuar usted debe Agregar por lo menos un Municipio');
        $("#agregar").focus();
        return false;
    }
    if (confirm("¿ Esta seguro que desea REGISTRAR este Plan de Internet ?")) {
        $("#formPlanes").attr('action', 'insertar');
        return true;
    }
    return false;
}

function eliminarMunicipioPlanInternet(idPlanInternet, idMcpo) {
    if (confirm("¿ DESEA ELIMINAR ESTE MUNICIPIO DEL PLAN ACTUAL ?")) {
        $.get('eliminarmunicipioplaninternet', {idPlanInternet: idPlanInternet, idMcpo: idMcpo}, setEliminarMunicipioPlanInternet, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminarMunicipioPlanInternet(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['eliminado']) === 1) {
            alert("MUNICIPIO ELIMINADO EXITOSAMENTE DEL PLAN ACTUAL !");
        } else {
            alert("¡ ERROR. EL MUNICIPIO NO PUDO SER ELIMINADO DEL PLAN ACTUAL !");
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    location.reload();
}

function agregarMunicipioPlanInternet(idPlanInternet) {
    if ($("#idMcpo").val() !== '') {
        if (confirm("¿ DESEA AGREGAR ESTE MUNICIPIO AL PLAN ACTUAL ?")) {
            $.get('agregarmunicipioplaninternet', {idPlanInternet: idPlanInternet, idMcpo: $("#idMcpo").val()}, setAgregarMunicipioPlanInternet, 'json');
            activarBloqueoAjax();
        } else {
            return false;
        }
    } else {
        alert("POR FAVOR SELECCIONE UN MUNICIPIO !");
        $("#idMcpo").focus();
        return false;
    }
}
function setAgregarMunicipioPlanInternet(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['agregado']) === 1) {
            alert("MUNICIPIO AGREGADO EXITOSAMENTE !");
        } else {
            alert("¡ ERROR. EL MUNICIPIO NO PUDO SER AGREGADO !\n\n ES POSIBLE QUE ESTE MUNICIPIO YA EXISTA.");
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    location.reload();
}

function setValoresCombo() {
    var cargoFijo = parseInt($.trim($("#cargoFijoMes").val()));
    var tipoPlan = $.trim($("#tipoPlan").val());
    if (cargoFijo.length === 0 || tipoPlan.length === 0) {
        return;
    }
    var iva = 0;
    var totalPago = 0;
    if ($.isNumeric(cargoFijo)) {
        if (tipoPlan === 'Corporativo') {
            totalPago = Math.round(cargoFijo * 1.19);
        } else {
            totalPago = cargoFijo;
        }
        iva = totalPago - cargoFijo;
    }
    $("#iva").val(formatoMoneda(iva, 0));
    $("#totalPago").val(formatoMoneda(totalPago, 0));
}

function validarCombo() {
    if ($("#idsMunicipiosAgregados").val() === '') {
        alert('Para poder continuar usted debe Agregar por lo menos un Municipio');
        $("#agregar").focus();
        return false;
    }
    if (confirm(" DESEA REGISTRAR ESTE COMBO INTERNET + TV ?")) {
        $("#formPlanes").attr('action', 'insertarCombo');
        return true;
    }
    return false;
}

function eliminarCombo(idPlanInternet) {
    if (confirm(" DESEA ELIMINAR ESTE COMBO ?")) {
        $.get('eliminarcombo', {idPlanInternet: idPlanInternet}, setEliminarCombo, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminarCombo(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['eliminado']) === 1) {
            alert("COMBO ELIMINADO EXITOSAMENTE !");
        } else {
            alert("� ERROR. EL COMBO NO PUDO SER ELIMINADO !");
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    location.reload();
}
