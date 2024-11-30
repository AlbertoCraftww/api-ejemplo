const http = require("http");

http.createServer((peticion,respuesta) => {
    respuesta.write(peticion.url);
    respuesta.end();
}).listen(4000);

