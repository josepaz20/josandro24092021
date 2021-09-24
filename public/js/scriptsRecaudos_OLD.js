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

function calcularTotalRecaudo() {
    var valorFactura = $("#valorFactura").val();
    if ($.trim(valorFactura).length !== 0) {
        if ($("#tipoRecaudo").val() === 'Pago Completo') {
            //            if(document.formRecaudo.estado.value == 'Abonada'|| (document.formRecaudo.saldoAbonos.value != 0 && document.formRecaudo.estado.value != 'Sin Pago')){
            if ($("#estado").val() === 'Abonada') {
                $("#valorRecaudo").val($("#saldoAbonos").val());
            } else {
                $("#valorRecaudo").val($("#valorFactura").val());
                $("#vlrRecaudoNeto").val($("#valorFactura").val());
                $("#valorProntoPago").val($("#valorFactura").val());
                if ($("#aplicaProntoPago").val() === 'SI') {
                    $("#valorProntoPago").val($("#vlrProntoPago").val());
                }
            //                var valorFactura = document.formRecaudo.valorFactura.value;
            //                var baseImponible = document.formRecaudo.baseImponible.value;
            //                baseImponible = baseImponible.replace('.', '');
            //                valorFactura = valorFactura.replace('.', '');
            //                var descProntoPago = baseImponible * 0.09;
            //                document.formRecaudo.vlrProntoPago.value = valorFactura - descProntoPago; 
            }
            $("#valorRecaudo").removeAttr('required');
            $("#valorRecaudo").attr('readonly', true);
            $("#concepto").focus();
            if (parseInt($("#optRecaudarDeuda").val()) === 1) {
                $("#divRecaudarDeuda").show('1000', 'swing');
            } else {
                $("#divRecaudarDeuda").hide('1000', 'swing');
            }
        } else if ($("#tipoRecaudo").val() === 'Abono') {
            //            if(document.formRecaudo.saldoAbonos.value != 0){
            //                document.formRecaudo.tipoRecaudo.value = 'NO';
            //                document.formRecaudo.valorRecaudo.value = ''; 
            //                document.formRecaudo.concepto.value = ''; 
            //                alert('NO ES POSIBLE ABONAR ESTA FACTURA');
            //                return 0;
            //            }else{
            $("#valorRecaudo").attr("onblur", "validarAbono()");
            $("#valorRecaudo").attr('required', 'true');
            $("#valorRecaudo").val('');
            $("#valorProntoPago").val('');
            $("#valorRecaudo").removeAttr('readonly', 'true');
            $("#valorRecaudo").focus();
            $("#concepto").val('');
            $("#divRecaudarDeuda").hide('1000', 'swing');
        //            }
        } else {
            $("#valorRecaudo").val('');
            $("#vlrRecaudoNeto").val('');
            $("#valorProntoPago").val('');
            $("#valorRecaudo").attr('readonly', 'true');
            $("#concepto").val('');
            $("#divRecaudarDeuda").hide('1000', 'swing');
        }
    }
    $("#recaudarDeuda").val('1');

}

function validarAbono() {
    var vlrFactura = document.formRecaudo.valorFactura.value.replace(/\,/g, '');
    var SaldoAbono = document.formRecaudo.saldoAbonos.value.replace(/\,/g, '');
    var vlrRecaudo = document.getElementById('valorRecaudo');
    var valor = vlrRecaudo.value;
    if (parseFloat(valor) < 0) {
        alert("El Valor del Recaudo NO puede ser NEGATIVO.");
        vlrRecaudo.select();
        vlrRecaudo.focus();
        return 0;
    }

    if (parseFloat(valor) == 0) {
        alert("El Valor del Recaudo NO puede ser CERO.");
        vlrRecaudo.select();
        vlrRecaudo.focus();
        return 0;
    }

    if (parseFloat(SaldoAbono) > 0) {
        if (parseFloat(valor) >= parseFloat(SaldoAbono)) {
            alert("El Valor del Recaudo NO puede ser MAYOR O IGUAL QUE el valor del SALDO A PAGAR");
            vlrRecaudo.select();
            vlrRecaudo.focus();
            return 0;
        }
    } else {
        if (parseFloat(valor) >= parseFloat(vlrFactura)) {
            alert("El Valor del Recaudo NO puede ser MAYOR O IGUAL QUE el valor de la FACTURA");
            vlrRecaudo.select();
            vlrRecaudo.focus();
            return 0;
        }
    }
    return 1;
}

function getConceptoRecaudo() {
    if (document.formRecaudo.idFactura.value != '') {
        var codigo = document.formRecaudo.codigoFactura.value;
        var periodo = document.formRecaudo.periodoFacturado.value;
        var cliente = document.formRecaudo.clienteFactura.value;
        if (document.formRecaudo.tipoRecaudo.value == 'Pago Completo') {
            if (document.formRecaudo.estado.value == 'Abonada') {
                document.formRecaudo.concepto.value = 'Pago Saldo Factura_' + codigo + '_' + periodo + ' - ' + cliente;
            } else {
                document.formRecaudo.concepto.value = 'Pago Factura_' + codigo + '_' + periodo + ' - ' + cliente;
            }
        } else if (document.formRecaudo.tipoRecaudo.value == 'Abono') {
            document.formRecaudo.concepto.value = 'Abono Factura_' + codigo + '_' + periodo + ' - ' + cliente;
        } else {
            document.formRecaudo.concepto.value = '';
        }
    }
}

function validarInfoRecaudo() {
    var idCorporativo = null;
    var idResidencial = null;

    idCorporativo = document.getElementById('idCorporativo');
    idResidencial = document.getElementById('idResidencial');

    if ($("#idCorporativo").length === 0 && $("#idResidencial").length === 0) {
        alert('Usted debe SELECCIONAR UN CLIENTE para realizar el Recaudo');
        $('html,body').animate({
            scrollTop: 0
        }, 500);
        return false;
    }

    if ($("#idFactura").val().length === 0) {
        alert('Usted debe SELECCIONAR UNA FACTURA para realizar el Recaudo');
        $("#idFactura").focus();
        return false;
    }

    //    if (document.formRecaudo.tipoRecaudo.value == 'NO') {
    //        alert('Usted debe SELECCIONAR UN TIPO DE RECAUDO');
    //        document.formRecaudo.tipoRecaudo.focus();
    //        return false;
    //    }

    var seleccionado = $("#idCajaRecaudo option:selected").text();
    if (seleccionado === 'Recaudos' || seleccionado === 'Bancos') {
        if ($("#respaldo").val().length === 0) {
            alert('Usted debe INCLUIR UN RESPALDO para realizar el Recaudo');
            $("#respaldo").focus();
            return false;
        }
    }

    if ($("#valorRecaudo").val().length === 0) {
        alert('Usted debe DIGITAR EL VALOR DEL RECAUDO');
        $("#valorRecaudo").focus();
        return false;
    } else {
        //        if(isNaN(document.formRecaudo.valorRecaudo.value)){
        //            alert("El campo VALOR RECAUDO solo permite NUMEROS");
        //            document.formRecaudo.valorRecaudo.focus();
        //            document.formRecaudo.valorRecaudo.select();
        //            return 0;
        //        }
        if ($("#tipoRecaudo").val() === "Abono") {
            valor = $("#valorRecaudo").val();
            var expReg = /^([0-9])*$/;
            if (!expReg.test(valor)) {
                alert("El campo VALOR RECAUDO solo permite NUMEROS \n\n [ Sin Guiones, ni puntos, ni comas ]");
                $("#valorRecaudo").focus();
                $("#valorRecaudo").select();
                return false;
            }
        }
    }

    if ($("#concepto").val().length === 0) {
        alert('Usted debe DIGITAR EL CONCEPTO DEL RECAUDO');
        $("#concepto").focus();
        return false;
    }

    if ($("#login").val().length === 0) {
        alert('Usted debe DIGITAR SU LOGIN para realizar el Recaudo');
        $("#login").focus();
        return false;
    }

    if ($("#password").val().length === 0) {
        alert('Usted debe DIGITAR SU CLAVE para realizar el Recaudo');
        $("#password").focus();
        return false;
    }

    if ($("#aplicaProntoPago").length === 0 || $("#estado").length === 0 || $("#vlrProntoPago").length === 0) {
        alert("ERROR EN EL SISTEMA. Comuniquese con el Administrador [ software@dobleclick.net.co ]");
        return false;
    }

    var msg = '';
    if ($("#aplicaProntoPago").val() === "SI" && $("#tipoRecaudo").val() !== "Abono" && $("#estado").val() === "Sin Pago") {
        var vlrRecaudo = formatoMoneda($("#vlrProntoPago").val().replace(/\,/g, ''), 0);
        msg = '                <<< P R O N T O   P A G O >>> \n\n ¿ DESEA REGISTRAR ESTE RECAUDO EN EL SISTEMA ? \n   << VALOR DE ESTE RECAUDO:   $ ' + vlrRecaudo + ' >>';
    } else {
        var vlrRecaudo = formatoMoneda($("#vlrRecaudoNeto").val().replace(/\,/g, ''), 0);
        msg = ' DESEAS REGISTRAR ESTE RECAUDO EN EL SISTEMA ? \n   << VALOR DE ESTE RECAUDO:   $ ' + vlrRecaudo + ' >>';
    //        if (seleccionado === 'Bancos') {
    //            msg += '\n\n REPORTADO A CAJA BANCOS: $ ' + formatoMoneda($("#vlrRecaudoNeto").val(), 0);
    //        }
    }
    if (confirm(msg)) {
        activarBloqueoAjax();
        return true;
    } else {
        document.formRecaudo.password.value = '';
        return false;
    }
}

function validarInfoRecaudoOtros() {
    var idCorporativo = null;
    var idResidencial = null;

    idCorporativo = document.getElementById('idCorporativo');
    idResidencial = document.getElementById('idResidencial');

    if (document.formRecaudo.tipoCliente.value == 'NO') {
        alert('Usted debe SELECCIONAR UN CLIENTE (Corporativo o Residencial) o REGISTRARLO (Recaudo Particular) para realizar este Recaudo');
        return 0;
    }

    if (document.formRecaudo.tipoCliente.value == 'CLIENTE') {
        if (idCorporativo == null && idResidencial == null) {
            alert('Usted debe SELECCIONAR UN CLIENTE para realizar este Recaudo');
            infoCliente = document.getElementById('infoCliente');
            infoCliente.focus();
            return 0;
        }
    }

    if (document.formRecaudo.tipoCliente.value == 'NUEVO') {
        if (document.formRecaudo.identificacion.value == '') {
            alert('El campo IDENTIFICACION es obligatorio');
            document.formRecaudo.identificacion.focus();
            return 0;
        } else {
            if (isNaN(document.formRecaudo.identificacion.value)) {
                alert("El campo IDENTIFICACION solo permite NUMEROS");
                document.formRecaudo.identificacion.focus();
                document.formRecaudo.identificacion.select();
                return 0;
            }
        }
        if (document.formRecaudo.nombresPersona.value == '') {
            alert('El campo NOMBRES es obligatorio');
            document.formRecaudo.nombresPersona.focus();
            return 0;
        }
        if (document.formRecaudo.apellidosPersona.value == '') {
            alert('El campo APELLIDOS es obligatorio');
            document.formRecaudo.apellidosPersona.focus();
            return 0;
        }
        if (document.formRecaudo.direccion.value == '') {
            alert('El campo DIRECCION es obligatorio');
            document.formRecaudo.direccion.focus();
            return 0;
        }
        if (document.formRecaudo.telefonoPersona.value == '') {
            alert('El campo TELEFONO es obligatorio');
            document.formRecaudo.telefonoPersona.focus();
            return 0;
        }
        if (document.formRecaudo.email1.value == '') {
            alert('El campo EMAIL 1 es obligatorio');
            document.formRecaudo.email1.focus();
            return 0;
        } else {
            email = document.formRecaudo.email1.value;
            var expReg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
            if (!expReg.test(email)) {
                alert('La direccion de correo electronico [ Email1 ] es INCORRECTA.');
                document.formRecaudo.email1.focus();
                document.formRecaudo.email1.select();
                return 0;
            }
        }
    }

    if (document.formRecaudo.valorRecaudo.value == '') {
        alert('Usted debe DIGITAR EL VALOR DEL RECAUDO');
        document.formRecaudo.valorRecaudo.focus();
        return 0;
    } else {
        if (isNaN(document.formRecaudo.valorRecaudo.value)) {
            alert("El campo VALOR RECAUDO solo permite NUMEROS");
            document.formRecaudo.valorRecaudo.focus();
            document.formRecaudo.valorRecaudo.select();
            return 0;
        }
        if (document.formRecaudo.tipoRecaudo.value == "Abono") {
            valor = document.formRecaudo.valorRecaudo.value;
            var expReg = /^([0-9])*$/;
            if (!expReg.test(valor)) {
                alert("El campo VALOR RECAUDO solo permite NUMEROS \n   [ Sin Guiones, ni puntos, ni comas ]");
                document.formRecaudo.valorRecaudo.focus();
                document.formRecaudo.valorRecaudo.select();
                return 0;
            }
        }
    }

    if (document.formRecaudo.concepto.value == '') {
        alert('Usted debe DIGITAR EL CONCEPTO DEL RECAUDO');
        document.formRecaudo.concepto.focus();
        return 0;
    }

    if (document.formRecaudo.login.value == '') {
        alert('Usted debe DIGITAR SU LOGIN para realizar este Recaudo');
        document.formRecaudo.login.focus();
        return 0;
    }

    if (document.formRecaudo.password.value == '') {
        alert('Usted debe DIGITAR SU CLAVE para realizar este Recaudo');
        document.formRecaudo.password.focus();
        return 0;
    }

    var vlrRecaudo = formatoMoneda(document.formRecaudo.valorRecaudo.value, 0);
    if (confirm('¿DESEA REGISTRAR ESTE RECAUDO EN EL SISTEMA? \n   << VALOR DE ESTE RECAUDO:   $ ' + vlrRecaudo + ' >>') == true) {
        document.formRecaudo.submit();
    } else {
        document.formRecaudo.clave.value = '';
    }

    return 1;
}

function setDptoNewOtros() {
    var formulario = document.getElementById("formRecaudo");
    formulario.setAttribute("action", "/sw2click/modulos/recaudo/recaudarOtros")
    formulario.submit();
}

function setClienteParticular() {
    var particular = document.getElementById('clienteParticular');
    particular.removeAttribute('hidden');

    document.formRecaudo.tipoCliente.value = 'PERSONA';

    var cliente = document.getElementById('cliente');
    if (cliente != null) {
        cliente.setAttribute('hidden', true);
    }
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

function buscarFactura() {
    if ($("#consecutivo").val() !== '') {
        $.get('buscarFacturaJuguemos', {consecutivo: $("#consecutivo").val()}, mostrarInfoFacturaJuguemos, 'json');
        activarBloqueoAjax();
    } else {
        alert(" POR FAVOR INGRESE UN NUMERO DE FACTURA ");
    }
}
function mostrarInfoFacturaJuguemos(datos) {
    if (datos['error'] === 1) {
        alert('La factura que usted esta Buscando NO SE ENCUENTRA REGISTRADA en el Sistema.');
        $("#consecutivo").focus();
        $("#consecutivo").select();
        return;
    }
    if (datos['error'] === 2) {
        alert('Ha ocurrido un ERROR en el Sistema. Comuniquese con el Administrador.');
        return;
    }
    $("#infoRecaudoAgentes").html(datos['html']);
    $("#prontoPago").val(datos['prontoPago']);
}

function recaudarFactura() {
    var vlrRecaudo = formatoMoneda(document.getElementById('totalRecaudo').value);
    if (confirm(' ¿ DESEA REGISTRAR ESTE RECAUDO EN EL SISTEMA ? \n   << VALOR DE ESTE RECAUDO:   $ ' + vlrRecaudo + ' >>') == true) {
        var accion = document.getElementById('accion');
        var consecutivo = document.getElementById('consecutivo');
        accion.value = "RECAUDAR";
        consecutivo.value = "0";
    }
}

function validarRecaudoJuguemos() {
    var vlrRecaudo = 0;
    var prontoPago = '';
    if ($("#estado").val() === 'Pagado' || $("#estado").val() === 'Abonado') {
        alert("LA FACTURA A RECAUDAR YA ESTA PAGADA, NO ES POSIBLE REALIZAR EL RECAUDO");
        return false;
    }
    if ($("#estado").val() === 'Anulada') {
        alert("LA FACTURA A RECAUDAR ESTA << ANULADA >>, NO ES POSIBLE REALIZAR EL RECAUDO");
        return false;
    }
    if ($("#prontoPago").val() === 'SI') {
        vlrRecaudo = $('#vlrProntoPago').val();
        prontoPago = '[PRONTO PAGO]';
    } else {
        vlrRecaudo = $('#totalRecaudo').val();
    }
    var info =
            " CLIENTE:  " + $("#cliente").val() + "\n" +
            " NUM FACTURA:  " + $("#numero").val() + "\n" +
            " PERIODO:  " + $("#periodoFacturado").val() + "\n" +
            "------------------------------------------------------------- \n" +
            " *** VALOR RECAUDO:  << $ " + vlrRecaudo + " " + prontoPago + " >> *** \n" +
            " ** AGENTE RECAUDO:  " + $("#idCajaRecaudo option:selected").text() + "\n" +
            "------------------------------------------------------------- \n" +
            " � DESEA REGISTRAR ESTE RECAUDO EN EL SISTEMA ? \n";
    if (confirm(info)) {
        activarBloqueoAjax();
        return true;
    } else {
        return false;
    }
//    return confirm(prontoPago + ' � DESEA REGISTRAR ESTE RECAUDO EN EL SISTEMA ? \n   << VALOR DE ESTE RECAUDO:   $ ' + vlrRecaudo + ' >>');
}

function setAgenteRecaudo() {
    $("#logoJuguemos").hide();
    $("#logoAcertemos").hide();
    $("#logoGane").hide();
    $("#logoPSE").hide();
    if ($("#idCajaRecaudo").val() !== '') {
        switch (parseInt($("#idCajaRecaudo").val())) {
            case 43:
                $("#logoJuguemos").show('slow');
                break;
            case 79:
                $("#logoGane").show('slow');
                break;
            case 209:
                $("#logoAcertemos").show('slow');
                break;
            case 316:
                $("#logoPSE").show('slow');
                break;
        }
    }
}

function activarRespaldo() {
    var seleccionado = $("#idCajaRecaudo option:selected").text();
    $("#cajaRecaudo").val(seleccionado);
    if (seleccionado === 'Recaudos') {
        $("#divRespaldo").show('slow');
        $("#respaldo").attr('required', true);
    } else if (seleccionado === 'Bancos') {
        $("#respaldo").attr('required', true);
        //        $("#vlrRecaudoBancos").attr('required', true);
        //        $("#divRecaudoBancos").show('slow');
        $("#divRespaldo").show('slow');
    } else {
        $("#divRespaldo").hide('slow');
        //        $("#divRecaudoBancos").hide('slow');
        $("#respaldo").removeAttr('required');
    //        $("#vlrRecaudoBancos").removeAttr('required');
    }
}

function getRecaudosXfecha() {
    var formRecaudos = document.getElementById('formRecaudos');
    formRecaudos.setAttribute('action', 'administracion');
    formRecaudos.submit();
}

function revisar(idRecaudo) {
    if (confirm('¿ Desea Marcar este registro como Revisado?')) {
        location.href = '/sw2click/modulos/recaudo/revisar?idRecaudo=' + idRecaudo;
    }
}

function selectClienteCorpRecaudo(idCorporativo) {
    //    if (tipo == 1) { // tipo=1 --> recaudar facturas
    //        parent.opener.location = 'recaudarFactura?idCorporativo=' + idCorporativo;
    //    }
    //    if (tipo == 2) { // tipo=2 --> recaudar otros
    //        parent.opener.location = 'recaudarOtros?idCorporativo=' + idCorporativo;
    //    }
    //    self.close();
    $.get("getClienteCorp", {
        idCorporativo: idCorporativo
    }, mostrarCliente, 'json');
}

function selectClienteResRecaudo(idResidencial) {
    //    if (tipo == 1) { // tipo=1 --> recaudar facturas
    //        parent.opener.location = '/sw2click/modulos/recaudo/recaudarFactura?idResidencial=' + idResidencial;
    //    }
    //    if (tipo == 2) { // tipo=2 --> recaudar otros
    //        parent.opener.location = '/sw2click/modulos/recaudo/recaudarOtros?idResidencial=' + idResidencial;
    //    }
    //    self.close();
    $.get("getClienteRes", {
        idResidencial: idResidencial
    }, mostrarCliente, 'json');
}

function mostrarCliente(datos) {
    $('#divRespaldo', parent.opener.document).hide();
    //    $('#divRecaudoBancos', parent.opener.document).hide();
    $('#respaldo', parent.opener.document).removeAttr('required');
    //    $('#vlrRecaudoBancos', parent.opener.document).removeAttr('required');

    $('#divRecaudarDeuda', parent.opener.document).hide();

    $('#divInfoCliente', parent.opener.document).html(datos['html']);
    $('#divInfoFactura', parent.opener.document).html('');
    parent.opener.document.getElementById('formRecaudo').reset();

    self.close();
}

function buscarFacturasCliente() {
    var href = 'NO';
    if ($("#idCorporativo").length !== 0) {
        href = 'selectFacturaRecaudo?idCliente=' + $("#idCorporativo").val() + '&tipoCliente=Corporativo';
    } else if ($("#idResidencial").length !== 0) {
        href = 'selectFacturaRecaudo?idCliente=' + $("#idResidencial").val() + '&tipoCliente=Residencial';
    }
    if (href !== 'NO') {
        window.open(href, '_blank', 'width=1100, height=650, scrollbars=YES');
    }
}

function setFactura(idFactura) {
    $.get("getFactura", {
        idFactura: idFactura
    }, mostrarFactura, 'json');
}

function mostrarFactura(datos) {
    parent.opener.document.getElementById('formRecaudo').reset();

    $('#divRespaldo', parent.opener.document).hide();
    //    $('#divRecaudoBancos', parent.opener.document).hide();
    $('#respaldo', parent.opener.document).removeAttr('required');
    //    $('#vlrRecaudoBancos', parent.opener.document).removeAttr('required');

    $('#divRecaudarDeuda', parent.opener.document).hide();

    $('#divInfoFactura', parent.opener.document).html(datos['html']);
    $('#idFactura', parent.opener.document).val(datos['idFactura']);

    self.close();
}

function setRecaudarDeuda() {
    if ($("#deuda").length > 0) {
        var deuda = $("#deuda").val();
        var vlrRecaudo = $("#valorFactura").val();
        var vlrProntoPago = $("#vlrProntoPago").val();
        if (parseFloat($("#valorRecaudo").val()) > 0) {
            if (parseInt($("#recaudarDeuda").val()) === 0) {
                var vlrRecaudoSinDeuda = parseFloat(vlrRecaudo.replace(/\,/g, '')) - parseFloat(deuda.replace(/\,/g, ''));
                var vlrProntoPagoSinDeuda = parseFloat(vlrProntoPago.replace(/\,/g, '')) - parseFloat(deuda.replace(/\,/g, ''));
                $("#valorRecaudo").val(formatoMoneda(vlrRecaudoSinDeuda, 0));
                $("#vlrRecaudoNeto").val(formatoMoneda(vlrRecaudoSinDeuda, 0));
                $("#valorProntoPago").val(formatoMoneda(vlrProntoPagoSinDeuda, 0));
            } else {
                $("#valorRecaudo").val(vlrRecaudo);
                $("#vlrRecaudoNeto").val(vlrRecaudo);
                $("#valorProntoPago").val(vlrProntoPago);
            }
        }
    }
}

function calcularRecaudoNeto() {
    var descuento = 0, vlrReteIVA = 0, vlrReteFuente = 0, vlrReteICA = 0, vlrEstampillas = 0, vlrOtrosDescuentos = 0, valorRecaudo = 0;
    if ($.isNumeric($("#vlrReteIVA").val())) {
        vlrReteIVA = $("#vlrReteIVA").val();
    } else {
        $("#vlrReteIVA").val(0);
    }
    if ($.isNumeric($("#vlrReteFuente").val())) {
        vlrReteFuente = $("#vlrReteFuente").val();
    } else {
        $("#vlrReteFuente").val(0);
    }
    if ($.isNumeric($("#vlrReteICA").val())) {
        vlrReteICA = $("#vlrReteICA").val();
    } else {
        $("#vlrReteICA").val(0);
    }
    if ($.isNumeric($("#vlrEstampillas").val())) {
        vlrEstampillas = $("#vlrEstampillas").val();
    } else {
        $("#vlrEstampillas").val(0);
    }
    if ($.isNumeric($("#vlrOtrosDescuentos").val())) {
        vlrOtrosDescuentos = $("#vlrOtrosDescuentos").val();
    } else {
        $("#vlrOtrosDescuentos").val(0);
    }
    if ($.isNumeric($("#valorRecaudo").val().replace(/\,/g, ''))) {
        valorRecaudo = $("#valorRecaudo").val().replace(/\,/g, '');
    }
    
    descuento = parseInt(vlrReteIVA) + parseInt(vlrReteFuente) + parseInt(vlrReteICA) + parseInt(vlrEstampillas) + parseInt(vlrOtrosDescuentos);
    $("#totalDescuentos").val(formatoMoneda(descuento));
    
    if ($("#tipoRecaudo").val() === 'Pago Completo' && $("#idFactura").val().length !== 0) {
        if (parseInt(valorRecaudo) > parseInt(descuento)) {
            $("#vlrRecaudoNeto").val(formatoMoneda(parseInt(valorRecaudo) - parseInt(descuento)));
        } else {
            alert("EL VALOR DE LOS DESCUENTOS NO PUEDE SER MAYOR O IGUAL QUE EL VALOR DE LA FACTURA \n\n [ Por favor, revise los Descuentos Aplicados ] \n\n TOTAL FACTURADO = " + formatoMoneda(parseInt(valorRecaudo)) + "\n DESCUENTOS = " + formatoMoneda(parseInt(descuento)) + "\n TOTAL A RECAUDAR = " + formatoMoneda((parseInt(valorRecaudo) - parseInt(descuento))));
            $("#vlrRecaudoNeto").val(formatoMoneda(parseInt(valorRecaudo)));
        }
    }
}

function setFechaPago() {
    if ($("#fechaPago").val().length !== 0) {
        $("#fechaCobro").attr('min', $("#fechaPago").val());
        $("#fechaCobro").attr('required', true);
        $("#fechaCobro").removeAttr('readonly');
        $("#fechaCobro").focus();
    }
}

function imprimirReciboPago(idRecaudo) {
    $("#divReciboPago").html('');
    if (idRecaudo !== 0) {
        $.get('getReciboPago', {idRecaudo: idRecaudo}, setImprimirReciboPago, 'json');
    }
}
function setImprimirReciboPago(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divReciboPago").html(datos['html']);
        $("#divReciboPago").print();
    }
    setTimeout($("#divReciboPago").html(''), 2000);
}
