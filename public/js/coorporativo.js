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
//------------------------------------------------------------------------------
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}
//------------------------------------------------------------------------------
function verDetalle(idCorporativo) {
    $.get('detalle', {idCorporativo: idCorporativo}, setFormulario);
    bloqueoAjax();
}
//------------------------------------------------------------------------------
function verActualizar(idCorporativo) {
    $.get('actualizar', {idCorporativo: idCorporativo}, setFormulario);
    bloqueoAjax();
}
//------------------------------------------------------------------------------

function validarRegistrarCorporativo() {

    if (confirm(" DESEA REGISTRAR ESTE COORPORATIVO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
//------------------------------------------------------------------------------

function validarEditarCorporativo() {

    if (confirm(" DESEA EDITAR ESTE COORPORATIVO?")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
//------------------------------------------------------------------------------

function getMunicipios(idDpto) {
    $("#idMcpo").html('<option value="">Seleccione...</option>');
    if (idDpto !== '') {
        $.get('getMunicipio', {idDpto: idDpto}, setMunicipios);
        bloqueoAjax();
    }
}
//------------------------------------------------------------------------------

function setMunicipios(datos) {

    $("#idMcpo").html(datos);
}
//------------------------------------------------------------------------------

function seleccionarlista()
{
    var idViabilidad = $("#idViabilidad").val();
    $.get('seleccionarlista', {idViabilidad: idViabilidad});
    alert(idViabilidad);
}
//------------------------------------------------------------------------------

function setReferenciado() 
{
    var referenciadoPor = $("#referenciado").val();
    if (referenciadoPor === '1') {

        $("#referenciadoPor").attr("required", "true");
        $("#referenciadoactual").show('slow');
        $("#referenciadoPor").show('slow');
        return;
    } else {

        $("#referenciadoactual").hide('slow');
        $("#referenciadoPor").hide('slow');
        return;
    }
}
//------------------------------------------------------------------------------
function existeNit() {

    var nit = $.trim($("#nit").val());
    if (nit !== '') {

        $.get('existeNit', {nit: nit}, setExisteNit, 'json');
        bloqueoAjax();
    }
}
//------------------------------------------------------------------------------
function setExisteNit(datos) {

    if (parseInt(datos['error']) === 0) {

        if (parseInt(datos['existe']) === 1) {
            alert("EL NIT<< " + datos['nit'] + " >> \n   YA SE ENCUENTRA REGISTRADO EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR EL REGISTRO DE ESTE CORPORATIVO.");
            $("#nit").val('');
        }
    } else {
        alert("SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE CAMBIO DE TITULAR.");
        $("#nit").val('');
    }
}
//---------------------------------------------------------------------------
function existeNitActualizado() {
    var nit = $.trim($("#nit").val());
    if (nit !== '') {
        $.get('existeNitActualizado', {nit: nit}, setExisteNitActualizado, 'json');
        bloqueoAjax();
    }
}
//---------------------------------------------------------------------------
function setExisteNitActualizado(datos) {
    if (parseInt(datos['error']) === 0) {
   // alert(1);
        if (parseInt(datos['existe']) === 1) {
            //alert(2);
            alert("EL NIT<< " + datos['nit'] + " >> \n   YA SE ENCUENTRA REGISTRADO EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR EL REGISTRO DE ESTE CORPORATIVO.");
            $("#nit").val('');
        }
    } else {
        alert("SE HA PRESENTADO UN INCONVENIENTE EN EL SISTEMA. \n   NO ES POSIBLE REALIZAR ESTE CAMBIO DE TITULAR.");
        $("#nit").val('');
    }
}
//---------------------------------------------------------------------------