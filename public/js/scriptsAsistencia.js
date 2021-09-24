function buscarXfecha(fechaBusq) {
    if (confirm("Verifique que los Cambios Realizados YA FUERON GUARDADOS. \n\nAl cambiar de fecha perdera toda la informacion que no haya sido guardada \n\n¿ Desea Continuar ?")) {
        location.href = 'administracion?fechaBusq=' + fechaBusq;
    }
}

function setCambio(idEmpleado) {
    $("#estado_" + idEmpleado).css('background', '#FF0');
    $("#estado_" + idEmpleado).val('Editado');
    if (parseInt($("#asiste_" + idEmpleado).val()) === 0) {
        $("#observacion_" + idEmpleado).attr('required', true);
    } else {
        $("#observacion_" + idEmpleado).removeAttr('required');
    }
}

function validarGuardado() {
    if (confirm("¿ Desea GUARDAR los cambios ?")) {
        $("#frmAsistencia").attr('action', 'guardar');
        return true;
    }
    return false;
}

function restablecer() {
    $("#tablaAsistencia input").each(function() {
        if ($(this).val() !== 'Guardado') {
            $(this).css('background', '#FCC');
        }
    });
}