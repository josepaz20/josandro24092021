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

function setNuevoConcepto() {
    var numConceptos = $("#numConceptos").val();
    var i = $("#ctrlConceptos").val();
    //    var numContratos = document.formFactura.numContratos.value;

    var nuevaFila = '<tr>' +
            '<td><input name="idServicio_' + i + '" id="idServicio_' + i + '" value="0" style="width: 50px" readonly></td>' +
            '<td><input name="concepto_' + i + '" id="concepto_' + i + '" value="" style="width: 550px" autofocus required></td>' +
            '<td><input name="valor_' + i + '" id="valor_' + i + '" value="" pattern="[0-9]{1,10}" onblur="calcularTotales()" style="width: 100px" required></td>' +
            '<td><a style="cursor: pointer; color: #00F" onclick="eliminarConcepto(0, \'idServicio_' + i + '\')">X</a></td>' +
            '</tr>';
    $("#tablaConceptos tbody").append(nuevaFila);
    $("#numConceptos").val(parseInt(numConceptos) + 1);
    $("#ctrlConceptos").val(parseInt(i) + 1);
}

function eliminarConcepto(idServicio, idConcepto) {
    if (confirm("Â¿ Esta Seguro que desea ELIMINAR este Concepto de la Factura ?")) {
        $('#tablaConceptos tbody tr').each(function (i, row) {
            var tds = $(row).find('td');
            var input = tds.find('input');
            if (input.attr('id') == idConcepto) {
                $(row).fadeOut(1200, 'swing', function () {
                    $(row).remove();
                    if (parseInt(idServicio) != 0) {
                        var idsServicios = $("#idsServicios").val();
                        var partes = idsServicios.split(',');
                        var idsServiciosAux = '';
                        for (i = 0; i < (partes.length - 1); i++) {
                            if (parseInt(partes[i]) != parseInt(idServicio)) {
                                idsServiciosAux += partes[i] + ',';
                            }
                        }
                        $("#idsServicios").val(idsServiciosAux);
                        $("#numServicios").val($("#numServicios").val() - 1);
                    }
                    $("#numConceptos").val($("#numConceptos").val() - 1);
                    calcularTotales();
                });
            }
        });
        $("#periodoFacturado").val('');
        $("#verificacionFacturado").hide();
    }
    return false;
}

function eliminarConceptoEdit() {
    if (document.formFactura.numConceptos.value == 1) {
        alert("RECUERDE QUE LA FACTURA NECESITA TENER AL MENOS UN CONCEPTO");
    }
    var tabla = document.getElementById('tablaConceptos');
    var ultFila = tabla.rows.length;
    var idFila = 'id_' + (ultFila - 1);
    var fila = document.getElementById(idFila);
    if (ultFila > 1) {
        //        if(fila.value == 0){
        document.formFactura.numConceptos.value--;
        tabla.deleteRow(ultFila - 1);
        //        var idsConceptos = formFactura.idsContratos.value;
        //        formFactura.idsContratos.value = '';
        //        var partes = idsConceptos.split('@');
        //        for(i = 0; i < (partes.length - 2); i++ ){
        //            formFactura.idsContratos.value += partes[i] + '@';
        //        }
    }
    //    }
    calcularTotales();

}

//***************************************************************************

function buscarClienteFactura(tipo) { // 1: Corporativo,   2: Residencial
    if (tipo == 1) {
        var nit = document.formFactura.nit.value;
        location.href = '/sw2click/modulos/factura/nuevaCorporativo?nit=' + nit;
    } else {
        var cedula = document.formFactura.cedula.value;
        location.href = '/sw2click/modulos/factura/nuevaResidencial?cedula=' + cedula;
    }
}

//Funcion utiliza para calcular los totales de la factura cuando se va a 
//insertar una nueva factura de forma manual.
function calcularTotales() {
    var max = parseInt($("#ctrlConceptos").val());

    var totalFactura = 0;
    var baseImponible = 0;
    var iva = 1;
    var ivaPago = 0;
    var retefuentePago = 0;

    var i = 0;
    for (i = 0; i < max; i++) {
        if ($("#idServicio_" + i).length != 0) {
            var valor = $.trim($("#valor_" + i).val());
            var concepto = $.trim($("#concepto_" + i).val());
            if (concepto.length === 0) {
                alert("Los CONCEPTOS a facturar NO pueden ser VACIOS");
                $("#concepto_" + i).focus();
                return 0;
            }

            if (valor.length === 0) {
                alert("Los VALORES a facturar NO pueden ser VACIOS");
                $("#valor_" + i).focus();
                return 0;
            } else if (!$.isNumeric((valor))) {
                alert("Los VALORES a facturar deben ser datos NUMERICOS");
                $("#valor_" + i).focus();
                $("#valor_" + i).select();
                return 0;
            }
            baseImponible += parseInt(valor);
        }
    }

    var subtotal = parseInt(baseImponible);
    if ($("#aplicarIva").is(':checked')) {
        ivaPago = subtotal * 0.19;
        iva = 1.19;
    }

//    if (document.formFactura.aplicarRetefuente.checked && parseInt(baseImponible) > 82000) {
//        retefuentePago = baseImponible * 0.04;
//    }
    var vlrProntoPago = 0;
    totalFactura = subtotal * iva;
    vlrProntoPago = totalFactura;
    if ($("#tipoCliente").length != 0) {
        if ($("#prontoPago").is(':checked')) {
            if ($("#tipoCliente").val() == 'Corporativo' && $("#clasificacion").val() == 2) {
                vlrProntoPago = totalFactura - (totalFactura * 0.068965);
            } else {
                vlrProntoPago = totalFactura;
            }
        } else {
            vlrProntoPago = totalFactura;
        }
    } else {
        vlrProntoPago = totalFactura;
    }
    $("#totalFactura").val(formatoMoneda(Math.round(totalFactura), 0));
    $("#baseImponible").val(formatoMoneda(baseImponible, 0));
    $("#subtotal").val(formatoMoneda(Math.round(subtotal), 0));
    $("#vlrProntoPago").val(formatoMoneda(Math.round(vlrProntoPago), 0));
    $("#ivaPago").val(formatoMoneda(Math.round(ivaPago), 0));
//    $("#retefuentePago").val(Math.round(retefuentePago));
    return 1;
}

function setNewFactVenta() {
    var formulario = document.getElementById("formFactura");
    formulario.setAttribute("action", "/sw2click/modulos/factura/nuevaVenta")
    formulario.submit();
}

function getInfoServicio(idServicio) {
//    console.log('ID:' + idServicio + ';');
    if (idServicio != '') {
        $.get("getInfoServicio", {idServicio: idServicio}, mostrarInfoServicio, 'json');
    } else {
        $('#infoServicio').html('');
    }
}

function mostrarInfoServicio(datos) {
//    console.log(datos['idServicio']);
    $('#infoServicio').html(datos['html']);
    $("#prefijo").val(datos['prefijo']);
    $("#idPrefijo").val(datos['idPrefijo']);
}

function setNewFactRes() {
    var formulario = document.getElementById("formFactura");
    formulario.setAttribute("action", "/sw2click/modulos/factura/nuevoResidencial")
    formulario.submit();
}

function agregarAfactura() {
//    var tipoFacturacion = document.formFactura.tipoFacturacion.value;
    var facturado = $("#facturado").val();

    if (facturado == "SI") {
        var periodoFact = $("#periodoFact").val();
        var anioFact = $("#anioFact").val();
        alert(" A D V E R T E N C I A !!!. \n\nEste Contrato YA fue Facturado para " + periodoFact + " de " + anioFact
                + ". \nSi usted intenta facturar este Contrato para este mismo Periodo y AÃ±o el sistema NO le permitira ejecutar tal operacion.");
    }

//    if (tipoFacturacion == "Multiples Facturas") {
//        var numContratos = document.formFactura.numContratos.value;
//        if (numContratos > 0) {
//            alert("NO ES POSIBLE AGREGAR MAS CONTRATOS A LA FACTURA. \n\nEl cliente factura con FACTURAS MULTIPLES. \nSolo es posible tener un contrato por factura.");
//            return 0;
//        }
//    }

    var conceptoServicio = $("#nombreServicio").val();
    var valorServicio = $("#cargoFijoMes").val();
    var idServicio = $("#idServicio").val();

    if (idServicio == '' || conceptoServicio == '' || valorServicio == '') {
        return 0;
    }

    var i = $("#ctrlConceptos").val();
    var numConceptos = $("#numConceptos").val();
    var nuevaFila = '<tr>' +
            '<td><input name="idServicio_' + i + '" id="idServicio_' + i + '" value="' + idServicio + '" style="width: 50px" readonly></td>' +
            '<td><input name="concepto_' + i + '" id="concepto_' + i + '" value="' + conceptoServicio + '" style="width: 550px" required></td>' +
            '<td><input name="valor_' + i + '" id="valor_' + i + '" value="' + valorServicio + '" pattern="[0-9]{1,10}" onblur="calcularTotales()" style="width: 100px" required></td>' +
            '<td><a style="cursor: pointer; color: #00F" onclick="eliminarConcepto(' + idServicio + ', \'idServicio_' + i + '\')">X</a></td>' +
            '</tr>';
    $("#tablaConceptos tbody").append(nuevaFila);

    $("#numConceptos").val(parseInt(numConceptos) + 1);
    $("#ctrlConceptos").val(parseInt(i) + 1);
    $("#numServicios").val(parseInt($("#numServicios").val()) + 1);
    var idServicioAux = idServicio + ',';
    $("#idsServicios").val($("#idsServicios").val() + idServicioAux);
    $("#periodoFacturado").val('');
    $("#verificacionFacturado").hide();
    return 1;
}

//******************************************************************************

function setDptoGenerarFact() {
    var idPrefijo = document.formFactura.idPrefijo.value;
    var idDpto = document.formFactura.idDpto.value;
    location.href = '/sw2click/modulos/factura/generacionFacturas?idPrefijo=' + idPrefijo + '&idDpto=' + idDpto;
}

function seleccionarTodo(vlr) {
    for (i = 0; i < document.form_facturas_email.elements.length; i++) {
        if (document.form_facturas_email.elements[i].type == "checkbox") {
            document.form_facturas_email.elements[i].checked = vlr;
        }
    }
}

function selectFacturaCorp(idCorporativo, idFactura, tipo) {
    if (tipo == 1) { // tipo=1 --> recaudar factura
        parent.opener.location = '/sw2click/modulos/recaudo/recaudarFactura?idCorporativo=' + idCorporativo + '&idFactura=' + idFactura;
    }
    if (tipo == 2) { // tipo=1 --> recaudar otros
        parent.opener.location = '/sw2click/modulos/recaudo/recaudarOtros?idCorporativo=' + idCorporativo + '&idFactura=' + idFactura;
    }
    self.close();
}

function selectFacturaRes(idResidencial, idFactura, tipo) {
    if (tipo == 1) { // tipo=1 --> recaudar factura
        parent.opener.location = '/sw2click/modulos/recaudo/recaudarFactura?idResidencial=' + idResidencial + '&idFactura=' + idFactura;
    }
    if (tipo == 2) { // tipo=1 --> recaudar otros
        parent.opener.location = '/sw2click/modulos/recaudo/recaudarOtros?idResidencial=' + idResidencial + '&idFactura=' + idFactura;
    }
    self.close();
}

function imprimirFactura() { //tipo = 1 --> Corporativo; tipo = 2 --> Residencial
    var idFactura = $("#idFactura").val();
    var tipo = parseInt($("#tipo").val());
    if (idFactura != 0 && tipo != 0) {
        var original = 0;
        if ($("#checkOriginal").is(':checked')) {
            original = 1;
        }
        $("#checkOriginal").attr('checked', false);
        $("#dlgConfirm").dialog('close');
        var href;
        if (tipo == 1) { // corporativo
            href = '/sw2click/modulos/factura/imprimirCorporativo?idFactura=' + idFactura + '&original=' + original;
//            hrefParent = '/sw2click/modulos/factura/corporativo';
        } else {
            href = '/sw2click/modulos/factura/imprimirResidencial?idFactura=' + idFactura + '&original=' + original;
//            hrefParent = '/sw2click/modulos/factura/residencial';
        }
        window.open(href, '_blank', 'width=900, height=650, scrollbars=YES');
    }
    return false;
}

function actualizarFactura() {
    var actualizar = document.getElementById('actualizar');
    if (actualizar.value == 'SI') {
        if (confirm("Si usted ACTUALIZA la factura esta sera ANULADA para crear una nueva factura con la informacion actualizada. \n\n Â¿ Seguro que desea ACTUALIZAR la factura ?")) {
            var formUpdFactura = document.getElementById('formUpdFactura');
            formUpdFactura.submit();
        }
    }
}

function activarDescuento(activado) {
    var horasDescuento = document.getElementById('horasDescuento');
    var diasDescuento = document.getElementById('diasDescuento');
    var horasEfectivas = document.getElementById('horasEfectivas');
    var descuento = document.getElementById('descuento');
    var descAux = document.getElementById('descAux');
    var baseImponible = document.getElementById('baseImponible');
    if (activado) {
        horasDescuento.removeAttribute('disabled');
        diasDescuento.removeAttribute('disabled');
        horasEfectivas.removeAttribute('disabled');
        descuento.removeAttribute('disabled');
        horasDescuento.focus();
    } else {
        horasDescuento.setAttribute('disabled', 'true');
        diasDescuento.setAttribute('disabled', 'true');
        horasEfectivas.setAttribute('disabled', 'true');
        descuento.setAttribute('disabled', 'true');
        descuento.value = descAux.value;
        horasDescuento.value = Math.round(descAux.value / ((baseImponible.value / 30) / 24)) + 5;
        diasDescuento.value = Math.round((horasDescuento.value / 24) * 10) / 10;
        horasEfectivas.value = horasDescuento.value - 5;
        calcularTotales();
    }
}

function setHorasDescuento(horas) {
    var descuento = document.getElementById('descuento');
    if (horas > 5 && horas <= 720) {
        var baseImponible = document.getElementById('baseImponible');
        var diasDescuento = document.getElementById('diasDescuento');
        var horasEfectivas = document.getElementById('horasEfectivas');
        var horasDesc = horas - 5;
        var vlrDescuento = Math.round(((baseImponible.value / 30) / 24) * horasDesc);
        var dias = Math.round((horas / 24) * 10) / 10;
        diasDescuento.value = dias;
        horasEfectivas.value = horasDesc;
        descuento.value = vlrDescuento;
    } else {
        descuento.value = 0;
    }
    calcularTotales();
}

function setDiasDescuento(dias) {
    var descuento = document.getElementById('descuento');
    if (dias >= 0.25 && dias <= 30) {
        var baseImponible = document.getElementById('baseImponible');
        var horasDescuento = document.getElementById('horasDescuento');
        var horasEfectivas = document.getElementById('horasEfectivas');
        var horas = Math.round(dias * 24);
        var horasDesc = horas - 5;
        var vlrDescuento = Math.round(((baseImponible.value / 30) / 24) * horasDesc);
        horasDescuento.value = horas;
        horasEfectivas.value = horasDesc;
        descuento.value = vlrDescuento;
    } else {
        descuento.value = 0;
    }
    calcularTotales();
}

function verificar() {
    calcularTotales();
    numConceptos = document.formFactura.numConceptos;
    if (numConceptos.value > 0) {
        return confirm(" Â¿ HA VERIFICADO LOS VALORES DE LA FACTURA Y ESTA DE ACUERDO CON APLICAR LOS CAMBIOS ? ")
    } else {
        alert(" La Factura NECESITA TENER CONCEPTOS. \n Numero de conceptos para esta factura:  " + max + " Conceptos");
        numConceptos.focus();
        return false;
    }
}

function getClienteCorp() {
    var href = '/sw2click/modulos/factura/getCorporativo';
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getClienteRes() {
    var href = '/sw2click/modulos/factura/getResidencial';
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getClienteCorporativo(formulario, accion) {
    var href = '/sw2click/modulos/factura/getClienteCorporativo?formulario=' + formulario + '&accion=' + accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getClienteResidencial(formulario, accion) {
    var href = '/sw2click/modulos/factura/getClienteResidencial?formulario=' + formulario + '&accion=' + accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function selectClienteCorp(idCorporativo) {
    $.get("getClienteCorp", {idCorporativo: idCorporativo}, mostrarClienteCorp, 'json');
}

function selectClienteRes(idResidencial) {
    $.get("getClienteRes", {idResidencial: idResidencial}, mostrarClienteRes, 'json');
}

function selectClienteCorporativo(idCorporativo) {
    $.get("getClienteCorp", {idCorporativo: idCorporativo}, mostrarClienteCorp, 'json');
}

function mostrarClienteCorp(datos) {
    parent.opener.document.getElementById('formFactura').reset();
    $('#verificacionFacturado', parent.opener.document).hide();
    $('#tablaConceptos tbody', parent.opener.document).html('');
    $('#infoServicio', parent.opener.document).html('');
//    $('#fechaLimitePago', parent.opener.document).attr('readonly', 'true');
    $('#fechaCorte', parent.opener.document).attr('readonly', 'true');
    $('#fechaVencimiento', parent.opener.document).attr('readonly', 'true');

    $('#infoCorporativo', parent.opener.document).html(datos['html']);
    $('#idCorporativo', parent.opener.document).val(datos['idCorporativo']);
    $('#idPrefijo', parent.opener.document).val(datos['idPrefijo']);
    $('#prefijo', parent.opener.document).val(datos['prefijoCliente']);
    $('#idServicio', parent.opener.document).html(datos['listaServicios']);
    setFechas();
    self.close();
}

function mostrarClienteRes(datos) {
    parent.opener.document.getElementById('formFactura').reset();
    $('#verificacionFacturado', parent.opener.document).hide();
    $('#tablaConceptos tbody', parent.opener.document).html('');
    $('#infoServicio', parent.opener.document).html('');
//    $('#fechaLimitePago', parent.opener.document).attr('readonly', 'true');
    $('#fechaCorte', parent.opener.document).attr('readonly', 'true');
    $('#fechaVencimiento', parent.opener.document).attr('readonly', 'true');

    $('#infoResidencial', parent.opener.document).html(datos['html']);
    $('#idResidencial', parent.opener.document).val(datos['idResidencial']);
    $('#idPrefijo', parent.opener.document).val(datos['idPrefijo']);
    $('#prefijo', parent.opener.document).val(datos['prefijoCliente']);
    $('#idServicio', parent.opener.document).html(datos['listaServicios']);
    setFechas();
    self.close();
}

function selectClienteResidencial(idResidencial, form, accion) {
    var formulario = parent.opener.document.getElementById(form);
    var txtIdResidencial = parent.opener.document.getElementById('idResidencial');
    txtIdResidencial.value = idResidencial;
    formulario.setAttribute('action', accion);
    formulario.submit();
    self.close();
}

function activarRegistrarDeuda(ban) {
    var divRegistrarDeuda = document.getElementById('divRegistrarDeuda');
    var conceptoDeuda = document.getElementById('conceptoDeuda');
    var valorDeuda = document.getElementById('valorDeuda');
    if (ban) {
        divRegistrarDeuda.removeAttribute('hidden');
        conceptoDeuda.setAttribute('required');
        valorDeuda.setAttribute('required');
    } else {
        divRegistrarDeuda.setAttribute('hidden');
        conceptoDeuda.removeAttribute('required');
        valorDeuda.removeAttribute('required');
    }
}

function validarReinicio() {
    var idCorporativo = document.getElementById('idCorporativo');
    var idResidencial = document.getElementById('idResidencial');
    var valorDeuda = document.getElementById('valorDeuda');
    var checkRegistrarDeuda = document.getElementById('registrarDeuda');
    if (idCorporativo.value == 0 && idResidencial.value == 0) {
        alert("Debe Seleccionar un Cliente");
        idCorporativo.select();
        idCorporativo.focus();
        return false;
    }
    if (checkRegistrarDeuda.checked && valorDeuda.value == 0) {
        alert("El valor de la deuda NO puede ser CERO");
        valorDeuda.select();
        valorDeuda.focus();
        return false;
    }
    return confirm("Â¿ Esta seguro que desea RE-INICIAR LA FACTURACION de este Cliente ?");
}

function calcularDias(horas, tipoCliente) { // tipoCliente: 1->Corp,  2->Res
    if (horas > 5 && horas <= 720) {
        var horasDesc = horas - 5;
        var vlrDescuento = Math.round((($("#baseImponible").val() / 30) / 24) * horasDesc);
        var dias = Math.round((horas / 24) * 10) / 10;
        $("#diasDescuento").val(dias);
        $("#horasEfectivas").val(horasDesc);
        $("#descuento").val(vlrDescuento);
        if (tipoCliente == 1) {
            $("#totalFactura_1").val(Math.round($("#baseImponible").val() * 1.16) - vlrDescuento + parseFloat($("#deuda").val()));
        } else {
            $("#totalFactura_1").val($("#baseImponible").val() - vlrDescuento + parseFloat($("#deuda").val()));
        }
        setObservacion(vlrDescuento);
    } else {
        $("#diasDescuento").val(0);
        $("#horasEfectivas").val(0);
        $("#descuento").val(0);
        $("#totalFactura_1").val($("#totalFactura").val());
    }
}

function calcularHoras(dias, tipoCliente) { // tipoCliente: 1->Corp,  2->Res
    if (dias > 0.25 && dias <= 30) {
        var horas = Math.round(dias * 24);
        var horasDesc = horas - 5;
        var vlrDescuento = Math.round((($("#baseImponible").val() / 30) / 24) * horasDesc);
        $("#horasDescuento").val(horas);
        $("#horasEfectivas").val(horasDesc);
        $("#descuento").val(vlrDescuento);
        if (tipoCliente == 1) {
            $("#totalFactura_1").val(Math.round($("#baseImponible").val() * 1.16) - vlrDescuento + parseFloat($("#deuda").val()));
        } else {
            $("#totalFactura_1").val($("#baseImponible").val() - vlrDescuento + parseFloat($("#deuda").val()));
        }
        setObservacion(vlrDescuento);
    } else {
        $("#horasDescuento").val(0);
        $("#horasEfectivas").val(0);
        $("#descuento").val(0);
        $("#totalFactura_1").val($("#totalFactura").val());
    }
}

function calcularTotalFactura(descuento, tipoCliente) { // tipoCliente: 1->Corp,  2->Res
    if ($.isNumeric(descuento)) {
        if (descuento > 0 && descuento <= parseFloat($("#baseImponible").val())) {
            if (tipoCliente == 1) {
                $("#totalFactura_1").val(Math.round($("#baseImponible").val() * 1.16) - descuento + parseFloat($("#deuda").val()));
            } else {
                $("#totalFactura_1").val($("#baseImponible").val() - descuento + parseFloat($("#deuda").val()));
            }
            setObservacion(descuento);
        } else {
            if (descuento == 0) {
                alert("El valor del descuento DEBE SER MAYOR que CERO.");
            } else {
                alert("El valor de descuento NO PUEDE SUPERAR la Base Imponible.");
            }
            $("#descuento").val("");
            $("#totalFactura_1").val($("#totalFactura").val());
            $("#observacion").val("");
            $("#descuento").focus();
        }
    } else {
        $("#totalFactura_1").val($("#totalFactura").val());
        $("#observacion").val("");
        $("#descuento").val("");
    }
}

function setObservacion(descuento) {
    $("#observacion").val("Descuento de $" + formatoMoneda(descuento, 0) + " por fallas en el Servicio.");
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

function validarDescuento() {
    var msg = "   <<< TOTAL DESCUENTO: " + formatoMoneda($("#descuento").val(), 0) + ">>>\n   <<< TOTAL FACTURA: " + formatoMoneda($("#totalFactura_1").val(), 0) + ">>>\n Â¿ Esta seguro que desea aplicar este Descuento ?";
    return confirm(msg);
}

function dlgImprimirFactura(idFactura, tipo) {
    $("#idFactura").val(idFactura);
    $("#tipo").val(tipo);
    $("#dlgConfirm").dialog({
        width: 250,
        height: 155,
        show: {effect: "bounce", duration: 300},
        hide: {effect: "explode", duration: 300},
        resizable: "false",
        position: "center",
        modal: "true",
        closeOnEscape: "true",
        closeText: "Cerrar"
    });
}

function verificarYAFacturado(tipoCliente) { // tipoCliente=1 --> Corporativo;   tipoCliente=2 --> Residencial
    var idsServicios = $.trim($("#idsServicios").val());
    if (idsServicios.length != 0) {
        var periodoFacturado = $("#periodoFacturado").val();
        var anioFacturado = $("#anioFacturado").val();
        $.get("verificar_facturado", {idsServicios: idsServicios, periodoFacturado: periodoFacturado, anioFacturado: anioFacturado, tipoCliente: tipoCliente}, mostrarVerificacionFacturado, 'json');
    } else {
        $("#verificacionFacturado").hide('800', 'swing');
    }
}

function mostrarVerificacionFacturado(datos) {
//    alert(datos['infoFacturas']);
    if (datos['estaFacturado'] == 1) {
        $("#verificacionFacturado").show('1000', 'swing');
        $("#serviciosYAFacturados tbody").html(datos['infoFacturas']);
    } else {
        $("#verificacionFacturado").hide('800', 'swing');
    }
}

function setFechas() {
    var fechaEmision = $.trim($("#fechaEmision").val());
    var fechaLimitePago = $.trim($("#fechaLimitePago").val());
    var fechaCorte = $.trim($("#fechaCorte").val());
    var fechaVencimiento = $.trim($("#fechaVencimiento").val());

    if (fechaEmision.length == 0) {
        $("#fechaLimitePago").attr('readonly', 'true');
        $("#fechaLimitePago").removeAttr('required');
        $("#fechaLimitePago").removeAttr('min');
        $("#fechaLimitePago").val('');

        $("#fechaCorte").attr('readonly', 'true');
        $("#fechaCorte").removeAttr('required');
        $("#fechaCorte").removeAttr('min');
        $("#fechaCorte").val('');

        $("#fechaVencimiento").attr('readonly', 'true');
        $("#fechaVencimiento").removeAttr('required');
        $("#fechaVencimiento").removeAttr('min');
        $("#fechaVencimiento").val('');
        return;
    } else {
        $("#fechaLimitePago").removeAttr('readonly');
        $("#fechaLimitePago").attr('required', 'true');
        $("#fechaLimitePago").attr('min', fechaEmision);
    }

    if (fechaLimitePago.length == 0) {
        $("#fechaCorte").attr('readonly', 'true');
        $("#fechaCorte").removeAttr('required');
        $("#fechaCorte").removeAttr('min');
        $("#fechaCorte").val('');

        $("#fechaVencimiento").attr('readonly', 'true');
        $("#fechaVencimiento").removeAttr('required');
        $("#fechaVencimiento").removeAttr('min');
        $("#fechaVencimiento").val('');
        return;
    } else {
        $("#fechaCorte").removeAttr('readonly');
        $("#fechaCorte").attr('required', 'true');
        $("#fechaCorte").attr('min', fechaLimitePago);
    }

    if (fechaCorte.length == 0) {
        $("#fechaVencimiento").attr('readonly', 'true');
        $("#fechaVencimiento").removeAttr('required');
        $("#fechaVencimiento").removeAttr('min');
        $("#fechaVencimiento").val('');
    } else {
        $("#fechaVencimiento").removeAttr('readonly');
        $("#fechaVencimiento").attr('required', 'true');
        $("#fechaVencimiento").attr('min', fechaCorte);
    }
}

function validarRegistroFactura(idCliente) {
    if (jQuery.trim($('#' + idCliente).val()).length <= 0) {
        alert("Seleccione un Cliente");
        $('#' + idCliente).focus();
        return false;
    }
    if (parseInt($("#totalFactura").val()) <= 0) {
        alert("El Valor Total de la Factura DEBE ser Mayor que CERO");
        $('#totalFactura').focus();
        return false;
    }
    if (parseInt($("#numConceptos").val()) <= 0) {
        alert("El Numero de Conceptos de la Factura DEBE ser Mayor que CERO");
        $('#numConceptos').focus();
        return false;
    }
    return confirm("Â¿ Esta seguro que desea REGISTRAR esta Factura ?");
}

//-----------------------------------------------------------------------------

function agregarServicioUpd() {
    if ($("#listaServicios").val() === '') {
        alert("DEBE SELECCIONAR UN SERVICIO");
        $("#listaServicios").focus();
        return;
    }
    var ok = $('#tablaContratos tr').each(function () {
        if (parseInt($("#listaServicios").val()) === parseInt($(this).find("td:first").html())) {
            alert("ESTE SERVICIO YA SE ENCUENTRA EN ESTA FACTURA");
            return;
        }
    });
    if (ok) {
        var msg = "NUM FACTURA: " + $("#prefijo").val() + $("#consecutivo").val() + "\n"
                + "SERVICIO: " + $("#listaServicios option:selected").html() + "\n"
                + "MES: " + $("#periodoFacturado").val() + "\n"
                + "MES: " + $("#anioFacturado").val() + "\n"
                + "Â¿ DESEA CONTINUAR ?";
        if (confirm(msg)) {
            $.get('agregarServicioFactura', {idServicio: $("#listaServicios").val(), });
        }
    }
}

//--------------------------------------------------------------------

function eliminarConceptoUpd(idConceptoFactura, valor) {
    if (confirm("Â¿ DESEA ELIMINAR ESTE CONCEPTO ?")) {
        $.get('eliminarConceptoUpd', {idConceptoFactura: idConceptoFactura, valor: valor, idFactura: $("#idFactura").val(), clasificacion: $("#clasificacion").val()}, setEliminarConceptoUpd, 'json');
    }
}
function setEliminarConceptoUpd(datos) {
    if (datos['OK'] === true) {
        alert("CONCEPTO ELIMINADO DE LA PRESENTE FACTURA");
    } else {
        alert("SE HA PRESENTADO UN ERROR - CONCEPTO NO ELIMINADO");
    }
    location.reload();
}

function verEditarConceptoUpd(idConceptoFactura, concepto, valor) {
    $("#idFacturaUpd").val($("#idFactura").val());
    $("#idConceptoFactura").val(idConceptoFactura);
    $("#concepto").val(concepto);
    $("#valor").val(valor);
    $("#frmAux").attr('onsubmit', 'return editarConceptoUpd()');
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#modalEditar';
    } else {
        location.href = '#modalEditar';
    }
}
function editarConceptoUpd() {
    if (confirm('Â¿ DESEA GUARDAR LOS CAMBIOS ?')) {
        $.get('editarConceptoUpd', {
            idConceptoFactura: $("#idConceptoFactura").val(),
            idFactura: $("#idFactura").val(),
            clasificacion: $("#clasificacion").val(),
            concepto: $("#concepto").val(),
            valor: $("#valor").val()
        }, setEditarConceptoUpd, 'json');
    }
    return false;
}
function setEditarConceptoUpd(datos) {
    if (datos['OK'] === true) {
        alert("CONCEPTO ACTULIAZADO EN LA PRESENTE FACTURA");
    } else {
        alert("SE HA PRESENTADO UN ERROR - CONCEPTO NO ELIMINADO");
    }
    ocultarAux();
    location.reload();
}

function guardarFechas() {
    if (confirm("Â¿ DESEA GUARDAR ESTAS FECHAS ?")) {
        $.get('guardarFechasUpd', {
            idFactura: $("#idFactura").val(),
            periodoFacturado: $("#periodoFacturado").val(),
            fechaLimitePago: $("#fechaLimitePago").val(),
            fechaCorte: $("#fechaCorte").val(),
            fechaVencimiento: $("#fechaVencimiento").val()
        }, setGuardarFechasUpd, 'json');
    }
}
function setGuardarFechasUpd(datos) {
    if (datos['OK'] === true) {
        alert("FECHAS ACTUALIZADAS -- OK");
    } else {
        alert("SE HA PRESENTADO UN ERROR - FECHAS NO ACTULIZADAS");
    }
    location.reload();
}

function verNuevoConceptoUpd() {
    $("#idFacturaUpd").val($("#idFactura").val());
    $("#idConceptoFactura").val('0');
    $("#concepto").val('');
    $("#valor").val('');
    $("#frmAux").attr('onsubmit', 'return nuevoConceptoUpd()');
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#modalEditar';
    } else {
        location.href = '#modalEditar';
    }
}
function nuevoConceptoUpd() {
    if (confirm('Â¿ DESEA REGISTRAR ESTE CONCEPTO ?')) {
        $.get('nuevoConceptoUpd', {
            idFactura: $("#idFactura").val(),
            clasificacion: $("#clasificacion").val(),
            concepto: $("#concepto").val(),
            valor: $("#valor").val()
        }, setNuevoConceptoUpd, 'json');
    }
    return false;
}
function setNuevoConceptoUpd(datos) {
    if (datos['OK'] === true) {
        alert("CONCEPTO REGISTRADO EN LA PRESENTE FACTURA");
    } else {
        alert("SE HA PRESENTADO UN ERROR - CONCEPTO NO REGISTRADO");
    }
    ocultarAux();
    location.reload();
}

function guardarIVA() {
    if (parseInt($("#clasificacion").val()) === 1) {
        if (confirm("Â¿ DESEA GUARDAR EL CAMBIO DEL IVA ?")) {
            $.get('guardarIVA', {idFactura: $("#idFactura").val(), ivaPago: $("#ivaPago").val()}, setGuardarIVA, 'json');
        }
    } else {
        alert("NO ES POSIBLE GUARDAR EL CAMBIO DE IVA. \nESTA FACTURA NO DISCRIMINA IVA");
    }
}
function setGuardarIVA(datos) {
    if (datos['OK'] === true) {
        alert("IVA ACTUALIZADO -- OK");
    } else {
        alert("SE HA PRESENTADO UN ERROR - IVA NO ACTULIZADO");
    }
    location.reload();
}

function setAccionEnvio(accion) {
    switch (parseInt(accion)) {
        case 1:
            $("#form_facturas_email").attr('action', 'enviarEmailResidencial');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR LAS FACTURAS SELECCIONADAS ?")');
            break;
        case 2:
            $("#form_facturas_email").attr('action', 'enviarEmailCorporativo');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR LAS FACTURAS SELECCIONADAS ?")');
            break;
        case 3:
            $("#form_facturas_email").attr('action', 'enviarRecordatoriosResidencial');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR RECORDATORIOS DE PAGO ?")');
            break;
        case 4:
            $("#form_facturas_email").attr('action', 'enviarRecordatoriosCorporativo');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR RECORDATORIOS DE PAGO ?")');
            break;
        case 5:
            $("#form_facturas_email").attr('action', 'enviarPrejuridicoResidencial');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR AVISOS PREJURIDICOS ?")');
            break;
        case 6:
            $("#form_facturas_email").attr('action', 'enviarPrejuridicoCorporativo');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR AVISOS PREJURIDICOS ?")');
            break;
        case 7:
            $("#form_facturas_email").attr('action', 'enviarAvisoCorteResidencial');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR AVISOS DE CORTE ?")');
            break;
        case 8:
            $("#form_facturas_email").attr('action', 'enviarAvisoCorteCorporativo');
            $("#form_facturas_email").attr('onsubmit', 'return confirm(" ¿ DESEA ENVIAR AVISOS DE CORTE ?")');
            break;
    }
    $("#form_facturas_email").submit();
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        if ($("#padre").val() === '') {
            location.href = partes[0] + '#close';
        } else {
            location.href = partes[0] + '#' + $("#padre").val();
        }
    } else {
        if ($("#padre").val() === '') {
            location.href = '#close';
        } else {
            location.href = '#' + $("#padre").val();
        }
    }
    $("#padre").val('');
}

function verAux(evento) {
    evento.stopPropagation();
}
//------------------------------------------------------------------------------
function activarBloqueoAjax() {
//    $.blockUI.defaults.baseZ = 100000;
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

function verPrefacturacionEmpresarial() {
    location.href = "empresarial?estadoBusq=" + $("#estadoBusq").val() + "&generarFacturacionBusq=" + $("#generarFacturacionBusq").val() + "&formaCobroBusq=" + $("#formaCobroBusq").val();
}

function verFactura(idFactura, idContrato) {
    $.get('verFactura', {idFactura: idFactura, idContrato: idContrato}, setFormulario, 'json');
    $("#divFacturasCliente").html('');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalNuevo';
        } else {
            location.href = '#modalNuevo';
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function verFacturasCliente(idCorporativo, idContrato) {
    $.get('getFacturasCliente', {idCorporativo: idCorporativo, idContrato: idContrato}, setFacturasCliente, 'json');
    $("#divContenido").html('');
    activarBloqueoAjax();
}
function setFacturasCliente(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divFacturasCliente").html(datos['html']);
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalFacturasCliente';
        } else {
            location.href = '#modalFacturasCliente';
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function verServicios(div, tagLegend) {
//    console.log('hola' + div + '  ' + tagLegend);
    var tag_i = $(tagLegend).find('i');
    if ($("#" + div).is(':visible')) {
        $("#" + div).hide('slow');
        $(tag_i).attr('class', 'fa fa-chevron-circle-down');
    } else {
        $("#" + div).show('slow');
        $(tag_i).attr('class', 'fa fa-chevron-circle-up');
    }
}

function verEditarServicio(idServicio, tabla) {
    $.get('verEditarServicio', {idServicio: idServicio, tabla: tabla}, setEdicionServicio, 'json');
    activarBloqueoAjax();
}
function setEdicionServicio(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divEdicionServicio").html(datos['html']);
        if (parseFloat($("#modalNuevo").css('opacity')) > 0.0) {
            $("#padre").val('modalNuevo');
        } else {
            if (parseFloat($("#modalFacturasCliente").css('opacity')) > 0.0) {
                $("#padre").val('modalFacturasCliente');
            } else {
                $("#padre").val('');
            }
        }
        var href = location.href;
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalEditarServicio';
        } else {
            location.href = '#modalEditarServicio';
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function setEstadoServicio() {
    switch ($("#estadoServicio").val()) {
        case 'Activo':
            $("#ipServicio").attr('required', true);
            $("#fechaActivacionServicio").attr('required', true);
            $("#infoActivacion").show('slow');
            break;
        case 'Suspendido':
            $("#ipServicio").removeAttr('required');
            $("#fechaActivacionServicio").removeAttr('required');
            $("#infoActivacion").hide('slow');
            break;
    }
}

function guardarNovedadServicio() {
    $.post('guardarNovedadServicio', {
        idServicio: $("#idServicio").val(),
        idContrato: $("#idContrato").val(),
        conceptoServicio: $("#conceptoServicio").val(),
        valorServicio: $("#valorServicio").val(),
        estadoServicio: $("#estadoServicio").val(),
        ipServicio: $("#ipServicio").val(),
        fechaActivacionServicio: $("#fechaActivacionServicio").val(),
        tabla: $("#tabla").val()
    }, setGuardarServicio, 'json');
    activarBloqueoAjax();
    return false;
}

function setGuardarServicio(datos) {
    if (parseInt(datos['error']) === 0) {
        ocultarAux();
        alert(" [ OK ] -- LA NOVEDAD DE SERVICIO HA SIDO GUARDADA EN JOSANDRO. ");
        $("#" + datos['tabla'] + " tbody tr").each(function (index, fila) {
            if ($(fila).find("td").eq(1).html() === datos['idServicio']) {
                $(fila).attr('class', 'actualizada');
                return false;
            }
        });
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function generarDesdePrefact() {
    $("#formFactEmpresarial").attr('action', 'generardesdeprefact');
    $("#formFactEmpresarial").attr('onsubmit', 'return confirm(" ¿ DESEA GENERAR ESTAS FACTURAS ?")');
    $("#formFactEmpresarial").submit();
}

function suspenderServicio(idServicio) {
    if (confirm(" ¿ DESEA SUSPENDER ESTE SERVICIO ? ")) {
        $.get('suspenderservicio', {idServicio: idServicio}, setSuspenderServicio, 'json');
    }
    return false;
}
function setSuspenderServicio(datos) {
    if (parseInt(datos['error']) === 0) {
        alert(" [ OK ] -- EL SERVICIO HA SIDO SUSPENDIDO EN JOSANDRO. ");
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
    location.href = "/sw2click/modulos/factura/empresarial";
}
