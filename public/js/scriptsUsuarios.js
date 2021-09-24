function validarCambioClave() {
    return confirm("¿ Esta seguro que desea Cambiar su Contraseña ?");
}

function cambiarEstado(idUsuario, estado) {
    activo = '';
    if (estado == 0 || estado == 2) {
        activo = 'Deshabilitar';
    }
    if (estado == 1 || estado == 3) {
        activo = 'Habilitar';
    }

    if (confirm('¿ Seguro que desea ' + activo + ' este Usuario ?')) {
        location.href = "cambiarEstado?idUsuario=" + idUsuario + "&&estado=" + estado;
    }

}

function buscarCliente() {
    var href = 'getCorporativo';
    var target = '_blank';
    window.open(href, target, ' width=1100, height= 650, scrollbars=YES');
    return false;
}

function selectClienteCorp(id) {
    $.get('datosCorporativo', {idCorporativo: id}, mostrarDatosCorporativo);
}

function mostrarDatosCorporativo(datos) {
    parent.opener.document.getElementById('htmlDatosCorporativo').innerHTML = datos;
    self.close();
}


//    alert (id+'___'+formulario +'__'+accion);
//    var form = parent.opener.document.getElementById(formulario);
//    form.setAttribute('action', accion);
//    var txtIdUsuario = parent.opener.document.getElementById("idUsuario");
//    txtIdUsuario.value = id;
//    form.submit();
//    self.close();


function validarn(e) { // 1
    tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla == 32)
        return false; // 3

}

function validarEspacios() {
    var a1 = document.getElementById("login").value;
    document.getElementById("login").value = document.getElementById("login").value.replace(/\ /g, "");
    var a2 = document.getElementById("login").value;
    if (a1 != a2) {
        alert('Se eliminarion los espacios, por que no estan permitidos para este LOGIN');
    }
}

function nuevoModulo(idUsuario) {
    var modulo = prompt('Asigne Nombre al Nuevo Modulo');

    if (modulo) {
        location.href = "nuevoModulo?modulo=" + modulo + "&&idUsuario=" + idUsuario;
    }

}

//******************************************************************************
function ocultarAux() {
    var href = location.href;
    if (href.indexOf('#') !== -1) {
        var partes = href.split('#');
        location.href = partes[0] + '#close';
    } else {
        location.href = '#close';
    }
    location.reload();
}

function verAux(evento) {
    evento.stopPropagation();
}

//------------------------------------------------------------------------------

function verificarPago() {
    $.get('/sw2click/modulos/usuarios/verificarPago', {}, setVerificarPago, 'json');
//    console.log('aqui')
}

function setVerificarPago(datos) {
//         console.log('aqui = '+datos['encontrado'])
    if (parseInt(datos['encontrado']) === 1) {
        var href = location.href;
        $("#identificacion").val(datos['identificacion']);
        $("#empleado").val(datos['empleado']);
        $("#bonificacion").val(datos['bonificacion']);
        $("#quincena").val(datos['quincena']);
        $("#prima").val(datos['prima']);
        $("#total").val(datos['total']);
        if (datos['vacaciones'] !== '') {
            $("#vacaciones").val(datos['vacaciones']);
            $("#infoVacaciones").show();
        }
//        $("#idNomina").val(datos['idNomina']);
//        $("#idEmpleado").val(datos['idEmpleado']);
//        $("#mes").val(datos['mes']);
//        $("#anio").val(datos['anio']);
//        $("#sueldoBasico").val(datos['sueldoBasico']);
//        $("#diasTrabajados").val(datos['diasTrabajados']);
//        $("#salario").val(datos['salario']);
//        $("#rodamiento").val(datos['rodamiento']);
//        $("#totalDevengado").val(datos['totalDevengado']);
//        $("#cargoFijoCelular").val(datos['cargoFijoCelular']);
//        $("#cargoFijoInternet").val(datos['cargoFijoInternet']);
//        $("#legalizacionCaja").val(datos['legalizacionCaja']);
//        $("#anticipos").val(datos['anticipos']);
//        $("#totalDeducciones").val(datos['totalDeducciones']);
//        $("#pagoNeto").val(datos['pagoNeto']);
//        $("#fechaIni").val(datos['fechaIni']);
//        $("#fechaFin").val(datos['fechaFin']);
//        $("#dias").val(datos['dias']);
//        $("#mediopago").val(datos['mediopago']);
//        $("#liquidacion").val(datos['liquidacion']);
//        $("#ctaCobro").val(datos['ctaCobro']);
//        $("#totalPago").val(datos['totalPago']);
        if (href.indexOf('#') !== -1) {
            var partes = href.split('#');
            location.href = partes[0] + '#modalAviso';
        } else {
            location.href = '#modalAviso';
        }
    } else {
        location.href = '/sw2click/modulos/secciones/seccionGeneral';
    }
}
