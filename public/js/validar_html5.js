function validar_HTML5(){
    if(!Modernizr.input.required || !Modernizr.inputtypes.number || !Modernizr.inputtypes.date){
        alert("LO SENTIMOS ! ! ! NO ES POSIBLE INGRESAR AL SISTEMA. \n\n\
           La version de su navegador es muy antigua. \n\
           Actualice su navegador e intente de nuevo");
        location.href='/sw2click/public/html/noSoportaHTML5.html';
        document.login.html5.value = "NO";
        return false;
    }
}
