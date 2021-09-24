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

function getConsolidadosRecaudos() {
    location.href = 'consolidadoRecaudos?mesBusq=' + $("#mesBusq").val() + '&anioBusq=' + $("#anioBusq").val();
}

function getConsolidadosCajas() {
    location.href = 'consolidadoCajas?mesBusq=' + $("#mesBusq").val() + '&anioBusq=' + $("#anioBusq").val() + '&tipoBusq=' + $("#tipoBusq").val();
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
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

function verRegistrarDocumento(idTipoDocumento) {
    $.get('nuevoDocumento', {idTipoDocumento: idTipoDocumento}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verRegistrarMovimiento(idDocumento, idTipoDocumento) {
    $.get('nuevoMovimiento', {idDocumento: idDocumento, idTipoDocumento: idTipoDocumento}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verActualizarMovimiento(idMovimiento, idDocumento, idTipoDocumento) {
    $.get('actualizarMovimiento', {idMovimiento: idMovimiento, idDocumento: idDocumento, idTipoDocumento: idTipoDocumento}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verActualizarDocumento(idDocumento, idTipoDocumento) {
    $.get('actualizarDocumento', {idDocumento: idDocumento, idTipoDocumento: idTipoDocumento}, setFormulario, 'json');
    activarBloqueoAjax();
}
//------------------------------------------------------------------------------
function verRevisarDocumento(idDocumento, idTipoDocumento) {
    $.get('revision', {idDocumento: idDocumento, idTipoDocumento: idTipoDocumento}, setFormulario, 'json');
    activarBloqueoAjax();
}
//------------------------------------------------------------------------------
function verCerrarDocumento(idDocumento, idTipoDocumento) {
    $.get('cierreDocumento', {idDocumento: idDocumento, idTipoDocumento: idTipoDocumento}, setFormulario, 'json');
    activarBloqueoAjax();
}
//------------------------------------------------------------------------------
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $('#modalFormulario').modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//------------------------------------------------------------------------------

function buscarTercero() {
    var identificacion = $("#terceroBusq").val();
    if (identificacion !== '') {
        $.get('buscarTercero', {identificacion: identificacion}, setTerceroBusq, 'json');
    } else {
        $.get('seleccionarTercero', {}, setSeleccionarTercero, 'json');
    }
    activarBloqueoAjax();
}
//------------------------------------------------------------------------------
function setTerceroBusq(datos) {
    switch (parseInt(datos['error'])) {
        case 0:
            alert("LA INFORMACION DEL TERCERO CON IDENTIFICACION: << " + datos['identificacion'] + " >> HA SIDO CARGADA EN EL PRESENTE FORMULARIO.");
            $("#divInfoTercero").html(datos['html']);
            $("#idTercero").val(datos['idTercero']);
            break;
        case 1:
            alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
            break
        case 2:
            alert(" NO EXISTE UN TERCERO PARA LA IDENTIFICACION: << " + datos['identificacion'] + " >>");
            break
    }
}
//------------------------------------------------------------------------------
function setSeleccionarTercero(datos) {
    $("#divAnexar").html(datos);//pone los datos
    $("#tblSeleccionar").DataTable({
        responsive: true,
        "iDisplayLength": 25,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "Mostrar: _MENU_ registros por pagina",
            "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
            "sInfo": "Mostrando <b>_START_</b> a <b>_END_</b> registros <br>TOTAL REGISTROS: <b>_TOTAL_</b> Registros</b>",
            "sInfoEmpty": "Mostrando 0 A 0 registros",
            "sInfoFiltered": "(Filtrados de un total de <b>_MAX_</b> registros)",
            "sLoadingRecords": "CARGANDO...",
            "sProcessing": "EN PROCESO...",
            "sSearch": "Buscar:",
            "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
            "oPaginate": {
                "sFirst": "Inicio",
                "sLast": "Fin",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "aaSorting": [[0, "desc"]]
    });
    $('#modalAnexar').modal('show');
}

function selectEmpresa(idEmpresa) {
    $.get('/josandro/empresa/administracion/getEmpresa', {idEmpresa: idEmpresa}, setEmpresa);
}
function setEmpresa(datos) {
    $("#modalAnexar").modal('hide');
    $("#divInfoCliente").html(datos);
    $("#fk_persona_id_factura").val(0);
    $("#fk_empresa_id_factura").val($("#pk_empresa_id").val());
    $("#cliente").val($("#razonsocial").val());
    $("#ubicacion").val($("#pk_municipio_id option:selected").html() + '-' + $("#pk_departamento_id option:selected").html());
    calcularTotalesConcepto();
    calcularTotales();
}
//------------------------------------------------------------------------------
function mostrarInfoDetalleTercero() {
    if ($("#divInfoTercero").is(":visible")) {
        $("#mas_menos").attr('class', 'fa fa-plus-circle');
        $("#divInfoTercero").hide('slow');
    } else {
        $("#mas_menos").attr('class', 'fa fa-minus-circle');
        $("#divInfoTercero").show('slow');
    }
}

function mostrarInfoDetalleCuenta() {
    if ($("#divInfoCuenta").is(":visible")) {
        $("#mas_menos_cuenta").attr('class', 'fa fa-plus-circle');
        $("#divInfoCuenta").hide('slow');
    } else {
        $("#mas_menos_cuenta").attr('class', 'fa fa-minus-circle');
        $("#divInfoCuenta").show('slow');
    }
}

//------------------------------------------------------------------------------

function buscarCuenta() {
    var numcuenta = $("#cuentaBusq").val();
    if (numcuenta !== '') {
        $.get('buscarCuentaByNum', {numcuenta: numcuenta}, setCuentaBusq, 'json');
    } else {
        $.get('seleccionarCuenta', {}, setSeleccionarCuenta, 'json');
    }
    activarBloqueoAjax();
}
//------------------------------------------------------------------------------
function setCuentaBusq(datos) {
    switch (parseInt(datos['error'])) {
        case 0:
            alert("LA INFORMACION DE LA CUENTA CON NUMERO: << " + datos['numcuenta'] + " >> HA SIDO CARGADA EN EL PRESENTE FORMULARIO.");
            $("#divInfoCuenta").html(datos['html']);
            $("#idCuenta").val(datos['idCuenta']);
            break;
        case 1:
            alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
            break
        case 2:
            alert(" NO EXISTE UNA CUENTA CON NUMERO: << " + datos['numcuenta'] + " >>");
            break
        case 3:
            alert(" USTED HA SELECCIONADO UNA CUENTA MAYOR, NO ES POSIBLE UTILIZAR ESTE TIPO DE CUENTA. \nPOR FAVOR SELECCIONE UNA CUENTA DE DETALLE");
            break
    }
    $("#modalAnexar").modal('hide');
}

//------------------------------------------------------------------------------
function setSeleccionarCuenta(datos) {
    $("#divAnexar").html(datos['infoTabla']);//pone los datos
    $("#tblSeleccionar").DataTable({
        responsive: true,
        "iDisplayLength": 25,
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sLengthMenu": "Mostrar: _MENU_ registros por pagina",
            "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
            "sInfo": "Mostrando <b>_START_</b> a <b>_END_</b> registros <br>TOTAL REGISTROS: <b>_TOTAL_</b> Registros</b>",
            "sInfoEmpty": "Mostrando 0 A 0 registros",
            "sInfoFiltered": "(Filtrados de un total de <b>_MAX_</b> registros)",
            "sLoadingRecords": "CARGANDO...",
            "sProcessing": "EN PROCESO...",
            "sSearch": "Buscar:",
            "sEmptyTable": "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
            "oPaginate": {
                "sFirst": "<i class='fa fa-fast-backward' aria-hidden='true' title='Inicio'></i>",
                "sPrevious": "<i class='fa fa-step-backward' aria-hidden='true' title='Anterior'></i>",
                "sNext": "<i class='fa fa-step-forward' aria-hidden='true' title='Siguiente'></i>",
                "sLast": "<i class='fa fa-fast-forward' aria-hidden='true' title='Fin'></i>",
            }
        },
        "aaSorting": [[0, "asc"]]
    });
    $('#modalAnexar').modal('show');
}

function selectCuenta(idCuenta) {
    $.get('buscarCuentaById', {idCuenta: idCuenta}, setCuentaBusq, 'json');
}
function setEmpresa(datos) {
    $("#modalAnexar").modal('hide');
    $("#divInfoCliente").html(datos);
    $("#fk_persona_id_factura").val(0);
    $("#fk_empresa_id_factura").val($("#pk_empresa_id").val());
    $("#cliente").val($("#razonsocial").val());
    $("#ubicacion").val($("#pk_municipio_id option:selected").html() + '-' + $("#pk_departamento_id option:selected").html());
    calcularTotalesConcepto();
    calcularTotales();
}

//------------------------------------------------------------------------------

function validarAddMovimiento() {
    if ($("#idDocumento").val() === '') {
        alert("SE HA PRESENTADO UN INCONVENIENTE AL MOMENTO DE CARGAR EL DOCUMENTO");
        $('#modalFormulario').modal('hide');
        return false;
    }
    if ($("#idTercero").val() === '') {
        alert("DEBE SELECCIONAR UN TERCERO");
        $("#terceroBusq").focus();
        return false;
    }
    if ($("#idCuenta").val() === '') {
        alert("DEBE SELECCIONAR UNA CUENTA");
        $("#cuentaBusq").focus();
        return false;
    }
    return confirm(" ¿ DESEA REGISTRAR ESTE MOVIMIENTO EN EL PRESENTE DOCUMENTO ? ");
}

//------------------------------------------------------------------------------

function validarEditMovimiento() {
    if ($("#idDocumento").val() === '') {
        alert("SE HA PRESENTADO UN INCONVENIENTE AL MOMENTO DE CARGAR EL DOCUMENTO");
        $('#modalFormulario').modal('hide');
        return false;
    }
    if ($("#idTercero").val() === '') {
        alert("DEBE SELECCIONAR UN TERCERO");
        $("#terceroBusq").focus();
        return false;
    }
    if ($("#idCuenta").val() === '') {
        alert("DEBE SELECCIONAR UNA CUENTA");
        $("#cuentaBusq").focus();
        return false;
    }
    return confirm(" ¿ DESEA ACTUALIZAR LA INFORMACION DE ESTE MOVIMIENTO ? ");
}

//------------------------------------------------------------------------------

function setAccion(accion) {
    $("#accion").val(accion);
}

function validarRevision() {
    return confirm("¿ DESEA <<" + $("#accion").val() + " >> ESTE DOCUMENTO ?");
}


//------------------------------------------------------------------------------


////------------------------------------------------------------------------------

