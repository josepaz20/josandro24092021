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

function verInfoRegistro(div, tag_i) {
    if ($("#" + div).is(':visible')) {
        $("#" + div).hide('slow');
        $(tag_i).attr('class', 'fa fa-chevron-circle-down');
    } else {
        $("#" + div).show('slow');
        $(tag_i).attr('class', 'fa fa-chevron-circle-up');
    }
}

//------------------------------------------------------------------------------

function verInfoServicio(idServicio, tiposervicio) {
    $.get('verInfoServicio', {idServicio: idServicio, tiposervicio: tiposervicio}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verInfoRadio(idServicio, estado) {
    $.get('verInfoRadio', {idServicio: idServicio, estado: estado}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verInfoAP(idServicio, estado) {
    $.get('verInfoAP', {idServicio: idServicio, estado: estado}, setFormulario, 'json');
    activarBloqueoAjax();
}
function verInfoEquipo(idServicio, estado) {
    $.get('verInfoEquipo', {idServicio: idServicio, estado: estado}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divFormAction").html(datos['html']);
        var partesHref = document.location.href.split('#');
        if (partesHref.length > 1) {
            document.location.href = partesHref[0] + '#modalDetalle';
        } else {
            document.location.href += '#modalDetalle';
        }
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}


