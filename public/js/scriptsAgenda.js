function setFechaInicial(){
    var formBusqueda = document.getElementById('formBusqueda');
    formBusqueda.setAttribute('action', 'semanal');
    formBusqueda.submit();
}

function setNuevaActividad(){
    var formBusqueda = document.getElementById('formBusqueda');
    formBusqueda.setAttribute('action', 'nuevaActividad');
    formBusqueda.submit();
}

function getClienteCorp(formulario, accion){
    var href = '/sw2click/modulos/corporativo/getCorporativo?formulario='+formulario+'&accion='+accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function getClienteRes(formulario, accion){
    var href = '/sw2click/modulos/residencial/getResidencial?formulario='+formulario+'&accion='+accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function setDiaActividad(fechaActividad){
    var dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    var partes = fechaActividad.split('-');
    var fecha = new Date(partes[0], partes[1]-1, partes[2]);
    var numDia = fecha.getDay()
    var dia = dias[numDia];
    var txtDiaActividad = document.getElementById('diaActividad');
    txtDiaActividad.value = dia;
    var txtNumDiaActividad = document.getElementById('numDiaActividad');
    txtNumDiaActividad.value = numDia;
}

function setDpto(){
    var formNuevaActividad = document.getElementById('formNuevaActividad');
    formNuevaActividad.setAttribute('action', 'nuevaActividad');
    formNuevaActividad.submit();
}

function setActividad(){
    var formNuevaActividad = document.getElementById('formNuevaActividad');
    formNuevaActividad.setAttribute('action', 'insertar');
    formNuevaActividad.submit();
}

function setEmpleado(){
    var select = document.getElementById('idEmpleado');
    var empleado = document.getElementById('empleado');
    var seleccionado = select.options[select.selectedIndex].text;
    if(seleccionado == 'Selecccione una Opcion'){
        empleado.value = 'NO';
    }else{
        empleado.value = seleccionado;
    }
}

function setIdActividad(idActividad){
    var txtIdActividad = document.getElementById('idActividad');
    txtIdActividad.value = idActividad;
}

function setAplazamiento(){
    var formAplazamiento = document.getElementById('formAplazamiento');
    formAplazamiento.setAttribute('action', 'mover');
    formAplazamiento.submit();
}

function setCliente(){
    var txtIdCorporativo = document.getElementById('idCorporativo');
    var txtIdResidencial = document.getElementById('idResidencial');
    if(txtIdCorporativo == null && txtIdResidencial == null){
        alert("Debe seleccionar un CLIENTE para asignarlo a la Actividad");
        return false;
    }
    var formAsignarCliente = document.getElementById('formAsignarCliente');
    formAsignarCliente.setAttribute('action', 'setCliente');
    return true;
}

function asignarEmpleado(){
    var formAsignarEmpleado = document.getElementById('formAsignarEmpleado');
    formAsignarEmpleado.setAttribute('action', 'setEmpleado');
    return true;
}

function generarOrden(){
    var formGenerarOrden = document.getElementById('formGenerarOrden');
    formGenerarOrden.setAttribute('action', 'setOrden');
    return true;
}

function getViaticos(formulario, accion){
    var href = '/sw2click/modulos/agenda/getViaticos?formulario='+formulario+'&accion='+accion;
    var target = '_blank';
    window.open(href, target, 'width=1130, height=650, scrollbars=YES');
    return false;
}

function agregarViaticos(form, accion){
    var formViaticos = document.getElementById('formViaticos');
    var idsViaticos = '';
    for(var i=0; i<formViaticos.elements.length; i++){
        if(formViaticos.elements[i].type == "checkbox"){
            if(formViaticos.elements[i].checked){
                idsViaticos += formViaticos.elements[i].value+',';
            }
        }
    }
    if(idsViaticos == ''){
        alert("USTED DEBE SELECCIONAR AL MENOS UN VIATICO PARA SER AGREGADO A LA ACTIVIDAD");
        return 0;
    }else{
        var formulario = parent.opener.document.getElementById(form);
        var txtIdsViaticos = parent.opener.document.getElementById('idsViaticos');
        txtIdsViaticos.value = idsViaticos;
        formulario.setAttribute('action', accion);
        formulario.submit();
        self.close();
    }
    return 1;
}

function setViaticos(){
    var txtIdsViaticos = document.getElementById('idsViaticos');
    if(txtIdsViaticos.value != '{idsViaticos}' && txtIdsViaticos.value != ''){
        if(confirm(" ¿ Esta seguro que desea Agregar estos Viaticos a la Actividad ? ")){
            var formAsignarViaticos = document.getElementById('formAsignarViaticos');
            formAsignarViaticos.setAttribute('action', 'setViaticos');
            formAsignarViaticos.submit();
        }
    }else{
        alert("NO hay viaticos para ser Agregados a la Actividad");
    }
}

function eliminarViaticos(){
    if(confirm(" ¿ Esta seguro que desea ELIMINAR 'TODOS' los Viaticos Asociados a la Actividad ? ")){
        var formAsignarViaticos = document.getElementById('formAsignarViaticos');
        formAsignarViaticos.setAttribute('action', 'eliminarViaticos');
        formAsignarViaticos.submit();
    }
}