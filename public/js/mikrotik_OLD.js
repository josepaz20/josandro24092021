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
//------------------------------------------------------------------------------

function verRegistrar() {
    $.get('registrar', {}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verModificar(idMikrotik) {
    $.get('modificar', {idMikrotik: idMikrotik}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verDetalle(idMikrotik) {
    $.get('detalle', {idMikrotik: idMikrotik}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verCredenciales(idMikrotik) {
    $.get('credenciales', {idMikrotik: idMikrotik}, setFormulario, 'json');
    activarBloqueoAjax();
}

function eliminar(idMikrotik) {
    if (confirm(' ¿ DESEA ELIMINAR ESTA MIKROTIK ? ')) {
        $.get('eliminar', {idMikrotik: idMikrotik}, setEliminar, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminar(datos) {
    if (datos === 3) {
        document.location.href = '/sw2click/modulos/mikrotik/administracion?msg=3';
    } else {
        alert("ERROR! LA MIKROTIK NO PUDO SER ELIMINADA. \n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

function existeMikrotik(ip) {
    if (ip !== $("#iphidden").val()) {
        $.get('existemikrotik', {ip: ip}, setExisteMikrotik, 'json');
        activarBloqueoAjax();
    }
}
function setExisteMikrotik(datos) {
    if (datos !== 2) {
        if (datos === 1) {
            alert("LA DIRECCION IP INGRESADA YA HA SIDO REGISTRADA PREVIAMENTE.");
            $("#ip").val('');
            $("#ip").focus();
        } else {
            alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
            document.location.href = '/sw2click/modulos/mikrotik/administracion?msg=0';
        }
    }
}

function mostrarPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function vermigrarciencuatroasectorial(idServicio, ipRadio) {
    $.get('vermigrarciencuatroasectorial', {idServicio: idServicio, ipRadio: ipRadio}, setFormulario, 'json');
    activarBloqueoAjax();
}

function vercambiarip(idServicio, ipRadio) {
    $.get('vercambiarip', {idServicio: idServicio, ipRadio: ipRadio}, setFormulario, 'json');
    activarBloqueoAjax();
}

function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//******************************************************************************
//******************************************************************************

function verRegistrarSegmento() {
    $.get('veraddsegmento', {}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verModificarSegmento(idSegmento) {
    $.get('modificarsegmento', {idSegmento: idSegmento}, setFormulario, 'json');
    activarBloqueoAjax();
}

function verDetalleSegmento(idSegmento) {
    $.get('detallesegmento', {idSegmento: idSegmento}, setFormulario, 'json');
    activarBloqueoAjax();
}

function eliminarSegmento(idSegmento) {
    if (confirm(' ¿ DESEA ELIMINAR ESTE SEGMENTO ? ')) {
        $.get('eliminarsegmento', {idSegmento: idSegmento}, setEliminarSegmento, 'json');
        activarBloqueoAjax();
    } else {
        return false;
    }
}
function setEliminarSegmento(datos) {
    if (datos === 6) {
        document.location.href = '/sw2click/modulos/mikrotik/segmentos?msg=6';
    } else {
        alert("ERROR! EL SEGMENTO NO PUDO SER ELIMINADO. \n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
    }
}

function importar(idMikrotik) {
    $.get('importar', {idMikrotik: idMikrotik}, setFormulario, 'json');
    activarBloqueoAjax();
}

function existeSegmento(segmento) {
    if (segmento !== '') {
        if (segmento !== $("#segmentohidden").val()) {
            $.get('existesegmento', {segmento: segmento}, setExisteSegmento, 'json');
            activarBloqueoAjax();
        }
    } else {
        alert("POR FAVOR INGRESE UN SEGMENTO.");
        $("#mascara").val('');
        $("#min").val('');
        $("#max").val('');
        $("#ipslibres").val('');
        $("#segmento").focus();
    }
}
function setExisteSegmento(datos) {
    if (parseInt(datos) !== 0) {
        if (parseInt(datos) === 1) {
            alert("EL SEGMENTO INGRESADO YA HA SIDO REGISTRADO PREVIAMENTE.");
            $("#segmento").val('');
            $("#mascara").val('');
            $("#min").val('');
            $("#max").val('');
            $("#ipslibres").val('');
            $("#segmento").focus();
        } else {
            $("#mascara").val('');
            $("#min").val('');
            $("#max").val('');
            $("#ipslibres").val('');
            $("#mascara").focus();
        }
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
        document.location.href = '/sw2click/modulos/mikrotik/segmentos?msg=0';
    }
}

function setRangoIps() {
    if ($("#mascara").val() === '') {
        alert('POR FAVOR INGRESE UNA MASCARA.');
    } else {
        if (parseInt($("#mascara").val()) <= 30 && parseInt($("#mascara").val()) >= 24) {
            var potencia = 32 - parseInt($("#mascara").val());
            if (potencia < 0) {
                alert("SE HA PRESENTADO UN ERROR");
            } else {
                var max = Math.pow(2, potencia) - 2;
                var partesIP = $("#segmento").val().split('.');
//                if (partesIP.length > 0) {
                if (partesIP.length === 4) {
                    $("#min").val(partesIP[0] + '.' + partesIP[1] + '.' + partesIP[2] + '.3');
                    $("#max").val(partesIP[0] + '.' + partesIP[1] + '.' + partesIP[2] + '.' + max);
                    $("#ipslibres").val(max - 2);
                } else {
                    alert("DIGITE UN SEGMENTO BIEN FORMADO");
                    $("#mascara").val('');
                    $("#min").val('');
                    $("#max").val('');
                    $("#ipslibres").val('');
                    $("#segmento").focus();
                }
            }
        } else {
            alert("LA MASCARA DEBE SER UN VALOR ENTRE 24 Y 30.");
            $("#mascara").val('');
            $("#mascara").focus();
        }
    }
}


function verificarImportacion() {
    if ($("#idMikrotik").val() === '') {
        alert("SE HA PRESENTADO UN ERROR");
        return;
    }
    if ($("#idMikrotikOrigen").val() === '') {
        alert("SELECCIONE LA MIKROTIK DE ORIGEN");
        $("#idMikrotikOrigen").focus();
        return;
    }
    if ($("#segmento").val() === '') {
        alert("INDIQUE EL SEGMENTO A IMPORTAR");
        $("#segmento").focus();
        return;
    }
    if (confirm(" DESEA INICIAR LA VERIFICACION ? ")) {
        $.get('verificarImportacion', {idMikrotik: $("#idMikrotik").val(), idMikrotikOrigen: $("#idMikrotikOrigen").val(), segmento: $("#segmento").val()}, setVerificacionImportar, 'json');
        activarBloqueoAjax();
    }
}

function ejecutarImportacion() {
    if ($("#idMikrotik").val() === '') {
        alert("SE HA PRESENTADO UN ERROR");
        return;
    }
    if ($("#idMikrotikOrigen").val() === '') {
        alert("SELECCIONE LA MIKROTIK DE ORIGEN");
        $("#idMikrotikOrigen").focus();
        return;
    }
    if ($("#segmento").val() === '') {
        alert("INDIQUE EL SEGMENTO A IMPORTAR");
        $("#segmento").focus();
        return;
    }
    if (confirm(" DESEA EJECUTAR LA IMPORTACION ? ")) {
        $.get('cargarmikrotik', {idMikrotik: $("#idMikrotik").val(), idMikrotikOrigen: $("#idMikrotikOrigen").val(), segmento: $("#segmento").val()}, setVerificacionImportar, 'json');
        activarBloqueoAjax();
    }
}

function setVerificacionImportar(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divVerificacion").html(datos['html']);
    } else {
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

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

function registrarEnMikrotik(idServicio) {
    $.get('registrarEnMikrotik', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}

function eliminarRegistroEnMikrotik(idServicio) {
    $.get('eliminarRegistroEnMikrotik', {idServicio: idServicio}, setFormulario, 'json');
    activarBloqueoAjax();
}

function cortarServicio(idServicio, ipRadio) {
    if (confirm("¿ DESEA CORTAR ESTE SERVICIO ?")) {
        $.get('cortarservicio', {idServicio: idServicio, ipRadio: ipRadio}, setCortarServicio, 'json');
        activarBloqueoAjax();
    }
}
function setCortarServicio(datos) {
    document.location.href = '/sw2click/modulos/mikrotik/gestion?msg=' + datos;
}

function activarServicio(idServicio, ipRadio) {
    if (confirm("¿ DESEA ACTIVAR ESTE SERVICIO ?")) {
        $.get('activarservicio', {idServicio: idServicio, ipRadio: ipRadio}, setActivarServicio, 'json');
        activarBloqueoAjax();
    }
}
function setActivarServicio(datos) {
    document.location.href = '/sw2click/modulos/mikrotik/gestion?msg=' + datos;
}

function setLimpiar() {
    $("#clienteResBusq").val('');
    $("#clienteCorpBusq").val('');
}

//--------------------------------------------------------------------------------------------
//function verEliminarServicio(idServicio, ipRadio) {
//    $.get('vereliminarservicio', {idServicio: idServicio,ipRadio: ipRadio}, setFormulario, 'json');
//    activarBloqueoAjax();
//}

//---------------------------------------------------------------------------------------------
//PPPoE
//---------------------------------------------------------------------------------------------
function migrarpppoe(idServicio, ipRadio) {
    $.get('vermigrarpppoe', {idServicio: idServicio, ipRadio: ipRadio}, setFormulario, 'json');
    activarBloqueoAjax();
}

function obtenerIpLibre(idSegmento, tipo) {
    if (idSegmento !== '') {
        $.get('obteneriplibre', {idSegmento: idSegmento, tipo: tipo}, setObtenerIpLibre, 'json');
        activarBloqueoAjax();
    } else {
        $("#idMikrotik").val('');
        $("#idSegmento").val('');
        $("#ipRadio").val('');
        $("#ipMikrotik").val('');
        $("#nombre").val('');
        $("#segmento").val('');
        $("#divInfo").hide('slow');
    }
}
function setObtenerIpLibre(datos) {
    console.log(datos)
    if (parseInt(datos['error']) === 0) {
        $("#idMikrotik").val(datos['datos']['idMikrotik']);
        $("#ipRadio").val(datos['datos']['ipRadio']);
        $("#ipMikrotik").val(datos['datos']['ipMikrotik']);
        $("#nombre").val(datos['datos']['nombre']);
        $("#segmento").val(datos['datos']['segmento']);
        $("#divInfo").show('slow');
    } else if (parseInt(datos['error']) === 1) {
        $("#idMikrotik").val('');
        $("#idSegmento").val('');
        $("#ipRadio").val('');
        $("#ipMikrotik").val('');
        $("#nombre").val('');
        $("#segmento").val('');
        $("#divInfo").hide('slow');
        alert("NO SE HA ENCONTRADO IPs LIBRES PARA ASIGNAR.");
        return false;
    } else {
        $("#idMikrotik").val('');
        $("#idSegmento").val('');
        $("#ipRadio").val('');
        $("#ipMikrotik").val('');
        $("#nombre").val('');
        $("#segmento").val('');
        $("#divInfo").hide('slow');
        alert("SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\nPOR FAVOR COMUNIQUESE CON EL ADMINISTRADOR DEL SISTEMA.");
        return false;
    }
}

function verCredencialesPPPoE(username, idServicio) {
//    console.log($('#passwordpppoe').text())
    $("#usernamever").val(username);
    $("#passwordver").val($('#passwordpppoe_' + idServicio).text());
    $("#modalCredenciales").modal('show');    
}
