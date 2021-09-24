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
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario);
    bloqueoAjax();
}

function verDetallecompra(idCompra) {
    $.get('detallecompra', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}
function verItems(idCompra) {
    $.get('registraritems', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}

function verGestionitems(idCompra) {
    $.get('gestionitems', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}

function verGestionaraprobaciones(idCompra) {
    $.get('gestionaprobaciones', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}

function verGestionCotizaciones(idCompra) {
    $.get('gestioncotizaciones', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}

function verGestionPagos(idCompra) {
    $.get('gestionpagos', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}

function verAprobacionPago(idItem) {
    $.get('veraprobacionpago', {idItem: idItem}, setFormulario);
    bloqueoAjax();
}

function verPagarCompra(idCompra) {
    $.get('verpagocompra', {idCompra: idCompra}, setFormulario);
    bloqueoAjax();
}

function verAprobarItem(idItem) {
    $.get('veraprobaritem', {idItem: idItem}, setFormularioAux);
    bloqueoAjax();
}

function verRechazarItem(idItem) {
    $.get('verrechazaritem', {idItem: idItem}, setFormularioAux);
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}

function setFormularioAux(respuesta) {
    $("#divContenidoAux").html(respuesta);
    $('#modalAuxiliar').modal('show');
}

//------------------------------------------------------------------------------

function validarRegistrarItem() {
    if (parseInt($("#numItems").val()) > 0) {
        bloqueoAjax();
        return confirm("  DESEA REGISTRAR ESTA COMPRA ? ");
    } else {
        alert(" DEBE INGRESAR POR LO MENOS UN ITEM");
        return false;
    }
}
//---------------------------------------------------------------------------

function registraritems() {
    var contItems = $("#contItems").val();
    var numItems = $("#numItems").val();
    var opciones = '';
    $("#idTipoItemAux option").each(function () {
        opciones += '<option value="' + $(this).val() + '">' + $(this).text() + '</option>';
    });
    var fila = "<tr>";
    fila += " <td><a href='#' class='quitarItem' title='QUITAR ESTE ITEM' style='color: yellow'><i class='fa fa-times' aria-hidden='true'></i></a></td>";
    fila += "<td><select class='form-control' id='idTipoItem_" + contItems + "' name='idTipoItem_" + contItems + "' style='width: 140px' required>" + opciones + "</select></td>";
    fila += " <td><input type='text' id='descripcion_" + contItems + "' name='descripcion_" + contItems + "' style='text-transform: uppercase' class='form-control' required></td>";
    fila += " <td><input type='number' id='cantidad_" + contItems + "' name='cantidad_" + contItems + "' min='1' class='form-control' style='width: 85px' required></td>";
    fila += " <td><input type='number' id='vlrunitario_" + contItems + "' name='vlrunitario_" + contItems + "' min='1' class='form-control' style='width: 125px'></td>";
    fila += " <td><textarea id='justificacion_" + contItems + "' name='justificacion_" + contItems + "' maxlength='300' class='form-control' required></textarea></td>";
    fila += " <td><input type='date' id='fechalimite_" + contItems + "' name='fechalimite_" + contItems + "' min='" + $("#fechalimiteINI").val() + "' class='form-control' style='width: 165px' required></td>";
    fila += " <td><a href='#' class='quitarItem' title='QUITAR ESTE ITEM' style='color: yellow'><i class='fa fa-times' aria-hidden='true'></i></a></td></tr>";

    $("#divItems").append(fila);
    contItems++;
    numItems++;
    $("#contItems").val(contItems);
    $("#numItems").val(numItems);

}
//------------------------------------------------------------------------------
function Confirmaritem(idItem, idCompra) {
    if (confirm("  DESEA CONFIRMAR ESTE ITEM ? ")) {
        $.get('confirmaritem', {idItem: idItem, idCompra: idCompra}, setRespuesta, 'json');
        bloqueoAjax();
    }
}
function Aprobaritem(idItem, idCompra) {
    if (confirm("  DESEA APROBAR ESTE ITEM ? ")) {
        $.get('aprobaritem', {idItem: idItem, idCompra: idCompra}, setRespuesta, 'json');
        bloqueoAjax();
    }
}
function Rechazaritem(idItem, idCompra) {
    if (confirm("  DESEA RECHAZAR ESTE ITEM ? ")) {
        $.get('rechazaritem', {idItem: idItem, idCompra: idCompra}, setRespuesta, 'json');
        bloqueoAjax();
    }
}
function Eliminaritem(idItem, idCompra) {
    if (confirm("  DESEA ELIMINAR ESTE ITEM ? ")) {
        $.get('eliminaritem', {idItem: idItem, idCompra: idCompra}, setRespuesta, 'json');
        bloqueoAjax();
    }
}
function setRespuesta(respuesta) {
    var msg = "SE HA PRESENTADO UN ERROR";
    switch (parseInt(respuesta['ok'])) {
        case 0:
            msg = " [ ERROR ] EL ITEM NO FUE " + respuesta['estado'];
            break;
        case 1:
            msg = " [ OK ] - ITEM " + respuesta['estado'] + " EN JOSANDRO";
//            msg = " [ OK ] - SERVICIO " + respuesta['estado'] + " EN JOSANDRO \n [ ERROR ] EL SERVICIO NO FUE " + respuesta['estado'] + " EN LA MIKROTIK";
            break;
        case 2:
            msg = " [ OK ] - ITEM " + respuesta['estado'] + " EN JOSANDRO";
            break;
    }
    alert(msg);
    verGestionitems(parseInt(respuesta['idCompra']));
}
//------------------------------------------------------------------------------

function validarAddAprobacion() {
    if ($("#idCompra").val() === 0 || $("#idCompra").val() === '' || $("#idCompra").val() === '{idCompra}' || $("#aprobadopor").val() === '') {
        alert("   SE HA PRESENTADO UN INCONVENIENTE ! ! ! \n   POR FAVOR CIERRE EL FORMULARIO E INTENTE DE NUEVO. \n   SI EL ERROR PERSISTE COMUNIQUESE CON EL ADMINISTRADOR.");
        return false;
    }
    if (confirm("   DESEA REGISTRAR SU APROBACION PARA ESTA COMPRA ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarAddCotizacion() {
    if (confirm("   DESEA REGISTRAR ESTA COTIZACION ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarAddAprobacionPago() {
    if (confirm("   DESEA APROBAR EL PAGO DE ESTA COMPRA ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarAprobacionItem() {
    if (confirm("  DESEA APROBAR ESTE ITEM ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------

function validarRechazoItem() {
    if (confirm("  DESEA RECHAZAR ESTE ITEM ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

//------------------------------------------------------------------------------
