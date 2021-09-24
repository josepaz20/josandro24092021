
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

function verInfoFactura(idFactura) {
    $.get('verinfofactura', {idFactura: idFactura}, setFormulario, 'json');
    activarBloqueoAjax();
}
function setFormulario(datos) {
    if (parseInt(datos['error']) === 0) {
        $("#divContenido").html(datos['html']);
        $("#modalFormulario").modal('show');
    } else {
        alert(" SE HA PRESENTADO UN ERROR EN EL SISTEMA. \n\n POR FAVOR COMUNIQUESE CON EL ADMINISTRADOR.");
    }
}

function getMunicipios(idDpto) {
    if (idDpto !== '') {
        $.get("getMcpos", {idDpto: idDpto}, setMcpos);
        activarBloqueoAjax();
    } else {
        $('#idMcpo').html("<option value=''>Seleccione...</option>");
    }
}

function setMcpos(mcpos) {
    $("#idMcpo").html(mcpos);
}
