function reporteLlamadas() {
    var form = document.getElementById('formReportes');
    form.setAttribute('action', 'llamadas');
}

function reporteOrdenes() {
    var form = document.getElementById('formReportes');
    form.setAttribute('action', 'ordenes');
}

function reporteFacturas() {
    var form = document.getElementById('formReportes');
    form.setAttribute('action', 'facturas');
}

function reporteRecaudos() {
    var form = document.getElementById('formReportes');
    form.setAttribute('action', 'recaudos');
}

function imprimirFactura(idFactura, tipo) { //tipo = 1 --> Corporativo; tipo = 2 --> Residencial
//    if(confirm(" Si usted GENERA esta factura << NO >> PODRA APLICAR CAMBIOS en ella despues. \n\n ¿ Seguro que desea GENERAR esta Factura ?")){
    var href;
    if (tipo == 1) { // corporativo
        $("#idFactura").val(idFactura);
        $("#tipo").val(tipo);
        $("#dlgConfirm").dialog({
            width: 250,
            height: 155,
            show: {
                effect: "bounce",
                duration: 300
            },
            hide: {
                effect: "explode",
                duration: 300
            },
            resizable: "false",
            position: "center",
            modal: "true",
            closeOnEscape: "true",
            closeText: "Cerrar"
        });
//            href = '/sw2click/modulos/factura/imprimirCorporativo?idFactura=' + idFactura;
    } else {
        href = '/sw2click/modulos/factura/imprimirResidencial?idFactura=' + idFactura;
    }
    window.open(href, '_blank', 'width=900, height=650, scrollbars=YES');
//    }
//    return false;
}


function dlgImprimirFactura(idFactura, tipo) {
    $("#idFactura").val(idFactura);
    $("#tipo").val(tipo);
    $("#checkOriginal").prop('checked', false);
    $('#modalFormulario').modal('show');
}

function imprimirFactura_1() { //tipo = 1 --> Corporativo; tipo = 2 --> Residencial
    var idFactura = $("#idFactura").val();
    var tipo = parseInt($("#tipo").val());
    if (idFactura != 0 && tipo != 0) {
        var original = 0;
        if ($("#checkOriginal").is(':checked')) {
            original = 1;
        }
        $("#checkOriginal").attr('checked', false);
        $('#modalFormulario').modal('hide');
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

function validarGeneracion() {
    return confirm(" DESEA GENERAR ESTE INFORME ?");
}

function mostrarDescarga(datos) {
    switch (parseInt(datos['error'])) {
        case 0:
            setTimeout(function () {
                $("#archivoDescarga").val(datos['html']);
                $("#divCargando").hide();
                $("#divDescarga").show('slow');
                $("#generar").removeAttr('disabled');
            }, 2000);
            break;
        case 1:
            alert("HA OCURRIDO UN ERROR EN EL SISTEMA");
            break;
        case 2:
            location.href = '/sw2click/modulos/secciones/seccionReportes';
            break;
        case 3:
            alert("EL INFORME SOLICITADO NO CONTIENE INFORMACION. \n\nCAMBIE LOS FILTROS BUSQUEDA E INTENTE DE NUEVO");
            location.href = datos['desde'];
            break;
    }
}

function setTipoReporte() {
    $("#frmReporte input").each(function () {
        $(this).attr('required', true);
    });
    $("#frmReporte select").each(function () {
        $(this).attr('required', true);
    });
    switch ($("#tipoReporte").val()) {
        case '1':
            $("#divRepoFacturas").show('slow');
            $("#divRepoIngresos").hide();
//            $("#tipoFecha").removeAttr('required');
            break;
        case '2':
            $("#divRepoIngresos").show('slow');
            $("#divRepoFacturas").hide();
            $("#estado").removeAttr('required');
            break;
        case '5':
            $("#divRepoIngresos").show('slow');
            $("#divRepoFacturas").hide();
            $("#estado").removeAttr('required');
            break;
        default:
            $("#divRepoFacturas").hide();
            $("#divRepoIngresos").hide();
            break;
    }
}

function descargarArchivo() {
    if ($("#archivoDescarga").val() !== '') {
        location.href = "descargar?nombreArchivo=" + $.trim($("#archivoDescarga").val());
    } else {
        alert("HA OCURRIDO UN ERROR EN EL SISTEMA ! ! ! ");
    }
}
