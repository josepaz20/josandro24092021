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
function setFormulario(respuesta) {
    $("#divContenido").html(respuesta);
    $('#modalFormulario').modal('show');
}
function setFormularioAvance(respuesta) {
    $("#divContenido").html(respuesta);
    
            oTable = $('#datatableAvance').dataTable({
                    "iDisplayLength": 25,
                    "sPaginationType": "full_numbers",
                    "oLanguage": {
                        "sLengthMenu": "MOSTRAR: _MENU_ REGISTROS POR PAGINA",
                        "sZeroRecords": "NO SE HA ENCONTRADO INFORMACION",
                        "sInfo": "MOSTRANDO <b>_START_</b> A <b>_END_</b> REGISTROS <br>TOTAL REGISTROS: <b>_TOTAL_</b> REGISTROS</b>",
                        "sInfoEmpty": "MOSTRANDO 0 A 0 REGISTROS",
                        "sInfoFiltered": "(FILTRADOS DE UN TOTAL DE <b>_MAX_</b> REGISTROS)",
                        "sLoadingRecords": "CARGANDO...",
                        "sProcessing": "EN PROCESO...",
                        "sSearch": "BUSCAR:",
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
    
    
    
    $('#modalFormulario').modal('show');
    
}

function verDetalle(idAmpliacion) {
    $.get('detalle', {idAmpliacion: idAmpliacion}, setFormulario);
    bloqueoAjax();
}
function verAvance(idAmpliacion) {
    $.get('avance', {idAmpliacion: idAmpliacion}, setFormularioAvance);
    bloqueoAjax();
}
function verActualizar(idAmpliacion) {    
    $.get('actualizar', {idAmpliacion: idAmpliacion}, setFormulario);
    bloqueoAjax();
}
function verViabilidad() {
    $.get('viabilidad', {}, setFormulario);
    bloqueoAjax();
}

//---------------------------------------------------------------------------

function validarRegistrar() {
    if (confirm("   DESEA REGISTRAR ESTA AMPLIACION DE RED ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}

function validarEditar() {
    if (confirm("   DESEA ACTUALIZAR ESTA AMPLIACION DE RED ? ")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
function validarInsavan() {
    if (confirm(" DESEA REGISTRAR ESTE AVANCE? ")) {
        bloqueoAjax();
        return verAvance;
    } else {
        return false;
    }
}

//---------------------------------------------------------------------------

function getMunicipios(idDpto) {
    $("#idMcpo").html('<option value="">Seleccione...</option>');
    if (idDpto !== '') {
        $.get('getMunicipio', {idDpto: idDpto}, setMunicipios);
        bloqueoAjax();
    }
}
function setMunicipios(datos) {   
    $("#idMcpo").html(datos);
}

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
