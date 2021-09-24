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
                    'z-index': 10000
                }
            }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

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

function setFormulario(datos) {
    if (datos['error'] === 0) {
        var href = location.href;
        $("#formNuevo").html(datos['html']);
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#openModal';
        } else {
            location.href = '#openModal';
        }
        $("#idAsignada").focus();
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

//------------------------------------------------------------------------------

function validarBusqueda() {
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
        return confirm("¿ DESEA INICIAR LA BUSQUEDA ?");
    } else {
        alert("DEBE INDICAR AL MENOS UN FILTRO DE BUSQUEDA");
        $("#idOrdenBusq").focus();
        return false;
    }
}

function migrarpppoe(idServicio) {
    if (confirm(" DESEA MIGRAR ESTE SERVICIO A PPPoE ? ")) {
        $.post('migrarpppoe', {idServicio: idServicio}, setMigracion, 'json');
        bloqueoAjax();
    }
    return false;
}
function setMigracion(respuesta) {
    if (parseInt(respuesta['ok']) === 1) {
        alert(" [ OK ] - SERVICIO MIGRADO A PPPoE");
    } else {
        alert(" [ ERROR ] - EL SERVICIO NO FUE MIGRADO A PPPoE");
    }
    location.reload();
}

function verCredenciales(username, password) {
    $("#username").val(username);
    $("#password").val(password);
    var partesHref = document.location.href.split('#');
    if (partesHref.length > 1) {
        document.location.href = partesHref[0] + '#modalCredenciales';
    } else {
        document.location.href += '#modalCredenciales';
    }
}