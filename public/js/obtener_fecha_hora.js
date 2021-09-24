function mostrarTiempo(){
	
    momentoActual = new Date() 
    hora = momentoActual.getHours() 
    minuto = momentoActual.getMinutes() 
	
    str_minuto = new String (minuto) 
    if (str_minuto.length == 1) 
        minuto = "0" + minuto 

    str_hora = new String (hora) 
    if (str_hora.length == 1) 
        hora = "0" + hora 

    horaImprimible = hora + " : " + minuto
    document.form_info_cabecera.hora.value = horaImprimible
    document.form_info_cabecera.fecha.value = obtener_fecha()
    setTimeout("mostrarTiempo()",1000)
	
} 
 
function obtener_fecha(){
    var fecha_actual = new Date()

    dia = fecha_actual.getDate()
    mes = fecha_actual.getMonth() + 1
    anio = fecha_actual.getYear()

    if (anio < 100)
        anio = '19' + anio
    else if ( ( anio > 100 ) && ( anio < 999 ) ) {
        var cadena_anio = new String(anio)
        anio = '20' + cadena_anio.substring(1,3)
    }      

    if (mes < 10)
        mes = '0' + mes

    if (dia < 10)
        dia = '0' + dia
    return (dia + "/" + mes + "/" + anio)
}

function seleccionarTodo(vlr){
    for (i=0; i<document.formFacturasEmail.elements.length; i++) {
        if(document.formFacturasEmail.elements[i].type == "checkbox"){
            document.formFacturasEmail.elements[i].checked = vlr; 
        }
    }
}