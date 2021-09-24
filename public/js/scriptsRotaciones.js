function SetFecha(fecha) {
    var dias = parseInt(7);
    fecha = fecha.replace("-", "/").replace("-", "/");
    fecha = new Date(fecha);
    fecha.setDate(fecha.getDate() + dias);
    var anio = fecha.getFullYear();  //Año de 4 digitos.
    var mes = fecha.getMonth() + 1;  //Mes.
    var dia = fecha.getDate();       //Día del mes.
    if (mes.toString().length < 2) {
        mes = "0".concat(mes);
    }
    if (dia.toString().length < 2) {
        dia = "0".concat(dia);
    }
    var rote = anio + "-" + mes + "-" + dia;
    document.getElementById('rote').value = rote;
}

function registrar (datos, estado){
   var str=datos.split('@');
   var id=(str[0]); 
   var fecha=(str[1]);
   
   location.href ='procesar?idEmpleado='+id+'&&fecha='+fecha+'&&estado='+estado;

}