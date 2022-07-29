/*******************************
Local Storage con JavaScript
Metodos:  setItem, getItem, removeItem, clear, key, length

Abajo los problemas:
-SOLUCIONADO no arma bien los id de los botones cuando el numero de la serie es mayoy a 9 (dos digitos), porque hago un slice que toma solamente el ultimo digito. 
-SOLUCIONADO problema con la validacion, sigue mostrando los mensajes de error en las etiquetas, despues de cerrar y volver a abrir el modal de ingreso de nueva serie.
-SOLUCIONADO CON "word-break: break-all;"" parrafo que se rompe si se pone una palabra demasiado larga, mas del ancho del contenedor. 
    Esto genera que se amplie el ancho del documento y la ubicaciones puestas con porcentajes, por eso habria que cambiar a viewports.
-SOLUCIONADO Error en la validacion de la cantidad de capitulos. Permite poner un cero por teclado.
Mejoras:
-
 *******************************/

/*******************************
    Variables y constantes globales
    *******************************/
    let series = JSON.parse(localStorage.getItem("data")) || [];
    let contadorSeries = parseInt(localStorage.getItem("contadorSeries")) || 0;

    let idNumeroActual = null;
    let MAXIMO_NUMERO_CAPITULOS = 2000;

    const serieValidaciones = {
        "nueva_serie_titulo": false,
        "nueva_serie_descripcion": false,
        "nueva_serie_cantidad_capitulos": false
    }
    /* Model de Objeto serie
    {
        id: 0,
        titulo: "Título de la serie",
        descripcion: "Descripción de la serie",
        cantidadCapitulos: 24,
        capituloActual: 1,
        imagen: "imagen.png"    
    }*/

    $d = document;
    const $mensajeErrorLabel = $d.getElementById("nueva_serie_mensaje_error");

/**********************************
 Funciones utilitarias
 ************************************/

//agrega una nueva serie al array de series. recibe: los ids de titulo, descripcion, cantidad de capitulos del formulario de nueva serie
const agregarSerie = (idTitulo, idDescripcion, idCantidadCapitulos, imagen, idContenedor) => {

    let tituloSerie = $d.getElementById(idTitulo).value;
    let descripcionSerie = $d.getElementById(idDescripcion).value;
    let cantidadCapitulosSerie = parseInt($d.getElementById(idCantidadCapitulos).value);
    let nuevoId = contadorSeries + 1;

    series.push({
        id: nuevoId, 
        titulo: tituloSerie, 
        descripcion: descripcionSerie, 
        cantidadCapitulos: cantidadCapitulosSerie, 
        capituloActual: 0,
        imagen: "imagen.png"});    
    contadorSeries += 1;
    localStorage.setItem("data", JSON.stringify(series));
    localStorage.setItem("contadorSeries", contadorSeries);
}
//agregarSerie("nueva_serie_titulo", "nueva_serie_descripcion", "nueva_serie_cantidad_capitulos", "imagenPasada.jpg", "nueva_serie");

const eliminarSerie = (idEliminar) => {
    console.log("id a eliminar: ", idEliminar);
    let nuevoArraySeries = series.filter(elemento => elemento.id != idEliminar);
    series = nuevoArraySeries;
    localStorage.setItem("data", JSON.stringify(series));
    //console.log(idEliminar);
}
//eliminarSerie(0);

//modifica el array series, se le pasa el id de la serie.
const aumentarCapitulo = (id) => {
    series.forEach((elemento) => {
        if (elemento.id == id){
            if (elemento.capituloActual < elemento.cantidadCapitulos){elemento.capituloActual += 1;}            
        }
    })
    localStorage.setItem("data", JSON.stringify(series));
    //console.log(id);
}
//modifica el array series, se le pasa el id de la serie.
const disminuirCapitulo = (id) => {
    series.forEach((elemento) => {
        if (elemento.id == id){
            if (elemento.capituloActual > 0){elemento.capituloActual -= 1;}
        }
    })
    localStorage.setItem("data", JSON.stringify(series));
    //console.log(id);
}

const resetearValidaciones = () => {
    console.log("reseteando validaciones");
    serieValidaciones["nueva_serie_titulo"] = false;
    serieValidaciones["nueva_serie_descripcion"] = false;
    serieValidaciones["nueva_serie_cantidad_capitulos"] = false;       
    }    
const evaluarValidaciones = () => {
    if (serieValidaciones["nueva_serie_titulo"] == true && 
        serieValidaciones["nueva_serie_descripcion"] == true && 
        serieValidaciones["nueva_serie_cantidad_capitulos"] == true){
            return true;
        }else{
            return false;
        }
}

// muestra el modal de ingreso de nueva serie. recibe: el id del modal
const mostrarOcultarModalNuevaSerie = (idModal) => {
    $modalNuevaSerie = $d.getElementById(idModal);
    $modalNuevaSerie.classList.toggle("oculto");
    if (!$mensajeErrorLabel.classList.contains("oculto")){$mensajeErrorLabel.classList.add("oculto");}
    let  $imputsModal = $modalNuevaSerie.querySelectorAll("input");
    $imputsModal.forEach((elemento) => {
        elemento.value = "";
    });
    $imputsModal = $modalNuevaSerie.querySelectorAll("textarea");
    $imputsModal.forEach((elemento) => {
        elemento.value = "";
    });
    resetearValidaciones();
    //console.log(idModal, $modalNuevaSerie);
}
/*
Hacer una funcion mas genericas para mostrar u ocultar modales, 
ademas tiene que validar campos y actualizar estados de cada validacion
*/
const mostrarOcultarModal = (idModal) => {
    $modal = $d.getElementById(idModal);      
    $modal.classList.toggle("oculto");    
}

//valida el formulario par una nueva serie
const validarCampo = (idCampo) => {    
    let esValido = true;
    let $campoValidar = $d.getElementById(idCampo);
    let $mensajeErrorLabelActual = $d.getElementById(`mensaje_error_${idCampo}`);
    //console.clear();
    console.log(`validando el campo: "${idCampo}" con el valor: ${$campoValidar.value}\nla etiqueta es : ${$mensajeErrorLabelActual}`);    

    if(idCampo == "nueva_serie_titulo" || idCampo == "nueva_serie_descripcion"){
        if ($campoValidar.value == ""){
        console.log("no puede estar vacio");                
        esValido = false;
        }else {
            console.log("perfecto");
            esValido = true;
        } 
    }
    if (idCampo == "nueva_serie_cantidad_capitulos"){
        if ($campoValidar.value == ""){
            console.log("no puede estar vacio");                
            esValido = false;
        }else if ($campoValidar.value > 0 && $campoValidar.value < MAXIMO_NUMERO_CAPITULOS){
                console.log("perfecto");
                esValido = true;
            }else{
                console.log("No puede ser 0");
                esValido = false;
            }         
    }
    
    console.log(esValido);   
    serieValidaciones[idCampo] = esValido;
    //console.clear();
    console.log(serieValidaciones);
}
/*
 <!--plantilla para la vista de una serie
<div id="serie_1" class="serie">
    <h3 id="titulo_serie_1" class="titulo_serie">titulo serie</h3>
    <p id="descripcion_serie_1" class="descripcion_serie">Descripcion serie</p>
    <button id="btn_menos_serie_1" class="btn">-</button>
    <label>1</label>
    <button id="btn_mas_serie_1" class="btn">+</button>
    <br>
    <button class="btn rojo">Eliminar Serie</button>
</div>
-->
*/
//mostrar todos las series que estan el array de objetos serie. recibe: idContenedor y el array de series
const mostrarTodasLasSeries = (series, idContenedor) => {
    const $contenedorSeries = $d.getElementById(idContenedor);
    $contenedorSeries.innerHTML = "";
    //console.log($contenedorSeries);
    series.forEach(elemento => {        
        //console.log(elemento.titulo, elemento.descripcion);      
        let serieHTML = `<div id="serie_${elemento.id}" class="serie">
                                <h3 id="titulo_serie_${elemento.id}" class="titulo_serie">${elemento.titulo}</h3>
                                <p id="descripcion_serie_${elemento.id}" class="descripcion_serie">${elemento.descripcion}</p>       
                                <div class="avance_capitulos">
                                    <div class="progreso">
                                        <p id="capitulos_serie_${elemento.id}" class="capitulos_serie">
                                            Capitulo ${elemento.capituloActual} de ${elemento.cantidadCapitulos}
                                        </p>            
                                        <progress id = "progreso_barra_${elemento.id}" class="progreso_barra" max = "${elemento.cantidadCapitulos}" value = "${elemento.capituloActual}"></progress>
                                    </div>
                                    <div class="botonera">
                                        <button id="btn_menos_serie_${elemento.id}" class="btn btn_menos">-</button>
                                        <button id="btn_mas_serie_${elemento.id}" class="btn btn_mas">+</button>
                                    </div>        
                                </div>         
                                <button class="btn btn_eliminar alert" id="btn_eliminar_${elemento.id}">X</button>
                            </div>`

        
        $contenedorSeries.innerHTML += serieHTML;
    });
}
mostrarTodasLasSeries(series, "series_contenedor");


const mostrarMensajeError = (mensaje) => {
    if ($mensajeErrorLabel.classList.contains("oculto") == true){ $mensajeErrorLabel.classList.remove("oculto")};
    $mensajeErrorLabel.innerHTML = mensaje;
}

const ocultarMensajeError = () => {$mensajeErrorLabel.classList.add("oculto");}

/**************************************
 Manejadores de eventos
 *************************************/
 
 $d.addEventListener("DOMContentLoaded", (e) => {
    console.log("domcontentloaded");
    
    mostrarTodasLasSeries(series, "series_contenedor");
 })


 $d.addEventListener("click", (evento) => {
    //console.log("click en el documento", evento.target);
    if (evento.target.matches("button")){
        evento.preventDefault();
        if (evento.target.id == "nueva_serie_btn_agregar"){
            //console.log("boton de agregar en el formulario nueva serie");
            if (evaluarValidaciones() == true){
                    agregarSerie("nueva_serie_titulo", "nueva_serie_descripcion", "nueva_serie_cantidad_capitulos", "imagenPasada.jpg", "nueva_serie");      
                    mostrarOcultarModalNuevaSerie("modal_nueva_serie");     
                    mostrarTodasLasSeries(series, "series_contenedor");
            }else{
                console.log("faltan validaciones");                
                mostrarMensajeError("Debe completar todos los campos!");
            }
        }
        //nueva_serie_btn_cerrar
        if (evento.target.id == "nueva_serie_btn_cerrar"){
            //console.log("boton de cerrar en el formulario nueva serie");
            mostrarOcultarModalNuevaSerie("modal_nueva_serie"); 
        }

        if (evento.target.id == "nueva_serie"){
            //console.log("boton de nueva serie en el menu");
            mostrarOcultarModalNuevaSerie("modal_nueva_serie");            
        }              
        if (evento.target.id.includes("btn_eliminar")){
            let stringIdNumeroActual = evento.target.id.slice(-2);
            idNumeroActual = (stringIdNumeroActual[0] == "_") ? stringIdNumeroActual[1] : stringIdNumeroActual;
            //console.log(idNumeroActual);

            /*modal de confirmacion para la eliminacion de una serie */
            mostrarOcultarModal("modal_confirmacion");            
            //console.log("Boton de eliminar");
        }
        if (evento.target.id.includes("btn_menos_serie")){
            let stringIdNumeroActual = evento.target.id.slice(-2);
            let idNumeroActual = (stringIdNumeroActual[0] == "_") ? stringIdNumeroActual[1] : stringIdNumeroActual;
            disminuirCapitulo(parseInt(idNumeroActual));
            mostrarTodasLasSeries(series, "series_contenedor");
            console.log("Boton de menos serie");
        }
        if (evento.target.id.includes("btn_mas_serie")){
            let stringIdNumeroActual = evento.target.id.slice(-2);
            let idNumeroActual = (stringIdNumeroActual[0] == "_") ? stringIdNumeroActual[1] : stringIdNumeroActual;
            aumentarCapitulo(parseInt(idNumeroActual));
            mostrarTodasLasSeries(series, "series_contenedor");
            //console.log("Boton de mas serie");
        }
        if (evento.target.id == "modal_confirmacion_si"){
            modalConfirmacion = true;
            mostrarOcultarModal("modal_confirmacion");
            eliminarSerie(idNumeroActual);   
            mostrarTodasLasSeries(series, "series_contenedor");
            console.log("eliminando serie")
        }
        if (evento.target.id == "modal_confirmacion_no"){
            modalConfirmacion = false;
            mostrarOcultarModal("modal_confirmacion");
            console.log("cerrando modal")
        }
        if (evento.target.id.includes("ingresar")){
            console.log("ingresando");
            mostrarOcultarModal("modal_pruebas");
        }
        if (evento.target.id.includes("registrarse")){
            console.log("registrandose");
        }
    }  
    if (evento.target.matches("input") || evento.target.matches("textarea")){
        let idCampoValidar = evento.target.id;
        //console.log("levantaste una tecla en un input del modal ", idCampoValidar);
        validarCampo(idCampoValidar);
        //mostrarMensajeError("error desde la funcion")
    }   
 })

 $d.addEventListener("keyup", (evento) => {
    if (evento.target.matches("input") || evento.target.matches("textarea")){
        let idCampoValidar = evento.target.id;
        //console.log("levantaste una tecla en un input del modal ", idCampoValidar);
        validarCampo(idCampoValidar);        
    }
 })
