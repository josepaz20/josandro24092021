//                            ALERTAS PRIMARIAS
//##############################################################################
function registerEmployeeNewAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea registrar este cliente en la tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Guardar"
    }).then(function (result) {
        if (result.value) {
            $("#formularioCliente").removeAttr('onsubmit');
            $("#formularioCliente").attr('action', 'updateCliente');
            guardarClienteNewAjax();
        } else {
            return false;
        }
    });
}
function updateEmployeeNewAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea actualizar este cliente en la tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Actualizar"
    }).then(function (result) {
        if (result.value) {
            $("#formularioCliente").removeAttr('onsubmit');
            $("#formularioCliente").attr('action', 'updateCliente');
            actualizarClienteOldAjax();
        } else {
            return false;
        }
    });
}
function deleteEmployeeNewAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea eliminar este cliente de la tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Eliminar"
    }).then(function (result) {
        if (result.value) {
            $("#formularioCliente").removeAttr('onsubmit');
            $("#formularioCliente").attr('action', 'updateCliente');
            eliminarClienteOldAjax();
        } else {
            return false;
        }
    });
}
function finishHomeworkAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea terminar esta tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Terminar"
    }).then(function (result) {
        if (result.value) {
            finishHomeworkOpenModal();
        } else {
            return false;
        }
    });
}
function updateTareaAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea actualizar esta tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Actualizar"
    }).then(function (result) {
        if (result.value) {
            updateTareaSubmit();
        } else {
            return false;
        }
    });
}
function deleteTareaAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea eliminar esta tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Eliminar"
    }).then(function (result) {
        if (result.value) {
            deleteTareaSubmit();
        } else {
            return false;
        }
    });
}
function insertTareaAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea guardar esta tarea...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Guardar"
    }).then(function (result) {
        if (result.value) {
            insertTareaSubmit();
        } else {
            return false;
        }
    });
}
function updateEstadoAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea actualizar este estado...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Actualizar"
    }).then(function (result) {
        if (result.value) {
            updateEstadoSubmit();
        } else {
            return false;
        }
    });
}
function deleteEstadoAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea eliminar este estado...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Eliminar"
    }).then(function (result) {
        if (result.value) {
            deleteEstadoSubmit();
        } else {
            return false;
        }
    });
}
function insertEstadoAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea guardar este estado...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Guardar"
    }).then(function (result) {
        if (result.value) {
            insertEstadoSubmit();
        } else {
            return false;
        }
    });
}
function saveInformeAlert() {
    swal({
        title: "¿Estás seguro?",
        text: "Que desea guardar este informe...",
        type: "warning",
        showCancelButton: true,
        cancelButtonColor: "#FA5858",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#04B45F",
        confirmButtonText: "Guardar"
    }).then(function (result) {
        if (result.value) {
            saveInformeAjax();
        } else {
            return false;
        }
    });
}

//                            ALERTAS SECUNDARIAS
//##############################################################################
function errorSystemAlert() {
    swal.close();
    swal({
        title: "Error en el sistema",
        text: "Se ha presentado un error en el sistema. Porfavor comunicarse con el administrador del sistema.",
        type: "error",
        timer: 3000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}

function errorClienteAlert() {
    swal({
        title: "Error con el cliente",
        type: "error",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    }).then(function () {
        reiniciarPagina();
    });
}
function saveClienteAlert() {
    swal({
        title: "Cliente guardado",
        type: "success",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    }).then(function () {
        reiniciarPagina();
    });
}
function updateClienteAlert() {
    swal({
        title: "Cliente actualizado",
        type: "success",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    }).then(function () {
        reiniciarPagina();
    });
}
function deleteClienteAlert() {
    swal({
        title: "Cliente eliminado",
        type: "success",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    }).then(function () {
        reiniciarPagina();
    });
}
function informeGuardadoAlert() {
    swal({
        title: "Informe guardado",
        type: "success",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
function informeErrorAlert() {
    swal({
        title: "No se pudo guardar este informe",
        type: "success",
        timer: 1000,
        showConfirmButton: false,
        showCalcelButton: false
    });
}
