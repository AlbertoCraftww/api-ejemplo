const contenedorColores = document.querySelector("ul");
const formulario = document.querySelector("form");
const input = document.querySelector('input[type="text"]');
const parrafoError = document.querySelector(".error");

function li(id,r,g,b,a){
    let item = document.createElement("li");
    item.innerText = [r,g,b,a].join(",");
    item.style.backgroundColor = `rgb(${[r,g,b,a].join(",")})`;

    item.addEventListener("click", () => {
        fetch("/colores/borrar/" + id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({error})  => {
            if(!error){
                return item.remove();
            }
            console.log("..mostrar noseque al usuario");
        })
    });

    return item;
}

fetch("/colores")
.then(respuesta => respuesta.json())
.then(colores => {
    colores.forEach(({id,r,g,b,a}) => {
        contenedorColores.appendChild(li(id,r,g,b,a));
    });
});



formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    
    parrafoError.classList.remove("visible");

    let msgError = "no puede estar en blanco";

    if(input.value.trim() != ""){

        let posibleValor = input.value.trim().split(",").map(n => Number(n));
        
        let valido = posibleValor.length == 3;


        if(valido){
            
            let contador = 0;

            while(valido && contador < posibleValor.length){
                valido = posibleValor[contador] - parseInt(posibleValor[contador]) == 0 && posibleValor[contador] >= 0  && posibleValor[contador] <= 255;
                contador++;
            }            
            
            if(valido){

                let [r,g,b,a] = posibleValor;                

                return fetch("/colores/nuevo",{
                            method : "POST",
                            body : JSON.stringify({ r,g,b,a }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        })
                        .then(respuesta => respuesta.json())
                        .then(({id,error}) => {
                            if(!error){
                                contenedorColores.appendChild(li(id,r,g,b,a));
                                return input.value = "";
                            }
                            console.log("...avisar al usuario del error");
                        });
                

            }
        }
        msgError = "tres valores 0-255 separados por comas";
    }
    parrafoError.innerText = msgError;
    parrafoError.classList.add("visible");
    
});
