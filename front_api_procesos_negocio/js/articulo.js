//funciones js para el modulo de articulos

function listarArticulos() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/articulos", settings)
        .then(response => response.json())
        .then(function(data) {

            var articulos = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de articulos</h1>
                </div>
                  
                <a href="#" onclick="registerForm('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">C&oacute;digo</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripci&oacute;n</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
            for (const articulo of data) {
                console.log(articulo.codigo)
                articulos += `
                
                        <tr>
                            <th scope="row">${articulo.id}</th>
                            <td>${articulo.codigo}</td>
                            <td>${articulo.nombre}</td>
                            <td>${articulo.descripcion}</td>
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaArticulo('${articulo.codigo}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarArticulo('${articulo.codigo}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verArticulo('${articulo.codigo}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            </td>
                        </tr>
                    `;

            }
            articulos += `
            </tbody>
                </table>
            `;
            document.getElementById("datos").innerHTML = articulos;
        })
}

function eliminaArticulo(codigo) {
    validaToken();
    var settings = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/articulo/" + codigo, settings)
        .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            listarArticulos();
            alertas("Se ha eliminado el articulo exitosamente!", 2)
        })
}

function verModificarArticulo(codigo) {
    console.log(codigo)
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/articulo/" + codigo, settings)
        .then(response => response.json())
        .then(function(articulo) {
            var cadena = '';
            if (articulo) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar articulo</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <label for="codigo" class="form-label">C&oacute;digo</label>
                    <input type="text" class="form-control" name="codigo" id="codigo" required value="${articulo.codigo}"> <br>
                    <label for="nombre"  class="form-label">Art&iacute;culo</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" required value="${articulo.nombre}"> <br>
                    <label for="descripcion"  class="form-label">Descripci&oacute;n</label>
                    <input type="text" class="form-control" name="descripcion" id="descripcion" required value="${articulo.descripcion}"> <br>
                    <label for="fecha"  class="form-label">Fecha</label>
                    <input type="date" class="form-control" name="fecha" id="fecha" required value="${articulo.fecha}"> <br>
                    <label for="stock"  class="form-label">Stock</label>
                    <input type="text" class="form-control" name="stock" id="stock" required value="${articulo.stock}"> <br>
                    <label for="venta"  class="form-label">Precio Venta</label>
                    <input type="text" class="form-control" name="venta" id="venta" required value="${articulo.venta}"> <br>
                    <label for="compra"  class="form-label">Precio Compra</label>
                    <input type="text" class="form-control" name="compra" id="compra" required value="${articulo.compra}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarArticulo('${articulo.codigo}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

async function modificarArticulo(codigo) {
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) { //convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/articulo/" + codigo, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarArticulos();
    alertas("Se ha modificado el articulo exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verArticulo(codigo) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/articulo/" + codigo, settings)
        .then(response => response.json())
        .then(function(articulo) {
            var cadena = '';
            if (articulo) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar articulo</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">codigo: ${articulo.codigo}</li>
                    <li class="list-group-item">Articulo: ${articulo.nombre}</li>
                    <li class="list-group-item">Descripcion: ${articulo.descripcion}</li>
                </ul>`;

            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

function alertas(mensaje, tipo) {
    var color = "warning";
    if (tipo == 1) { //success verde
        color = "success"
    } else { //danger rojo
        color = "danger"
    }
    var alerta = `<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("alerta").innerHTML = alerta;
}

function registerForm(auth = false) {
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar articulo</h1>
            </div>
              
            <form action="" method="post" id="myFormReg">
                <input type="hidden" name="id" id="id">
                <label for="codigo" class="form-label">C&oacute;digo</label>
                <input type="text" class="form-control" name="codigo" id="codigo" required> <br>
                <label for="nombre"  class="form-label">Art&ioacute;culo</label>
                <input type="text" class="form-control" name="nombre" id="nombre" required> <br>
                <label for="descripcion"  class="form-label">Descripci&oacute;n</label>
                <input type="text" class="form-control" name="descripcion" id="descripcion" required> <br>
                <label for="fecha"  class="form-label">Fecha</label>
                <input type="date" class="form-control" name="fecha" id="fecha" required> <br>
                <label for="stock"  class="form-label">Stock</label>
                <input type="text" class="form-control" name="stock" id="stock" required> <br>
                <label for="venta"  class="form-label">Precio Venta</label>
                <input type="text" class="form-control" name="venta" id="venta" required> <br>
                <label for="compra"  class="form-label">Precio Compra</label>
                <input type="text" class="form-control" name="compra" id="compra" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarArticulo('${auth}')">Registrar</button>
            </form>`;
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalArticulo'))
    myModal.toggle();
}

async function registrarArticulo(auth = false) {
    var myForm = document.getElementById("myFormReg");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) { //convertimos los datos a json
        jsonData[k] = v;
    }
    console.log("data Article ", jsonData);
    const request = await fetch(urlApi + "/articulo", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(function(respuesta) {
            console.log("respuesta peticion", respuesta)
        });
    if (auth) {
        listarArticulos();
    }
    alertas("Se ha registrado el articulo exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalArticulo')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto, funcion) {
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir() {
    localStorage.clear();
    location.href = "index.html";
}

function validaToken() {
    if (localStorage.token == undefined) {
        salir();
    }
}