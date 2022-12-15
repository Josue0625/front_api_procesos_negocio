//funciones js para el modulo de usuarios
const urlApi = "http://localhost:2929"; //colocar la url con el puerto

async function login() {
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) { //convertimos los datos a json
        jsonData[k] = v;
    }
    var settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi + "/auth/login", settings);
    if (request.ok) {
        const respuesta = await request.text();
        localStorage.token = respuesta;
        location.href = "dashboard.html";
    }
}

function listarUsuarios() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/listusers", settings)
        .then(response => response.json())
        .then(function(data) {

            var usuarios = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de usuarios</h1>
                </div>
                  
                <a href="#" onclick="registerForm('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
            for (const usuario of data) {
                console.log(usuario.email)
                usuarios += `
                
                        <tr>
                            <th scope="row">${usuario.id}</th>
                            <td>${usuario.name}</td>
                            <td>${usuario.lastname}</td>
                            <td>${usuario.email}</td>
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaUsuario('${usuario.id}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            </td>
                        </tr>
                    `;

            }
            usuarios += `
            </tbody>
                </table>
            `;
            document.getElementById("datos").innerHTML = usuarios;
        })
}

function eliminaUsuario(id) {
    validaToken();
    var settings = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            listarUsuarios();
            alertas("Se ha eliminado el usuario exitosamente!", 2)
        })
}

function verModificarUsuario(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then(response => response.json())
        .then(function(usuario) {
            var cadena = '';
            if (usuario) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="name" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="name" id="name" required value="${usuario.name}"> <br>
                    <label for="lastname"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="lastname" id="lastname" required value="${usuario.lastname}"> <br>
                    <label for="document"  class="form-label">document</label>
                    <input type="text" class="form-control" name="document" id="document" required value="${usuario.document}"> <br>
                    <label for="email" class="form-label">email</label>
                    <input type="email" class="form-control" name="email" id="email" required value="${usuario.email}"> <br>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
        })
}

async function modificarUsuario(id) {
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) { //convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/user/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarUsuarios();
    alertas("Se ha modificado el usuario exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/user/" + id, settings)
        .then(response => response.json())
        .then(function(usuario) {
            var cadena = '';
            if (usuario) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">name: ${usuario.name}</li>
                    <li class="list-group-item">Apellido: ${usuario.lastname}</li>
                    <li class="list-group-item">email: ${usuario.email}</li>
                    <li class="list-group-item">document: ${usuario.document}</li>
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
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myFormReg">
                <input type="hidden" name="id" id="id">
                <label for="name" class="form-label">First Name</label>
                <input type="text" class="form-control" name="name" id="name" required> <br>
                <label for="lastname"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="lastname" id="lastname" required> <br>
                <label for="document"  class="form-label">document</label>
                <input type="text" class="form-control" name="document" id="document" required> <br>
                <label for="email" class="form-label">email</label>
                <input type="email" class="form-control" name="email" id="email" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario('${auth}')">Registrar</button>
            </form>`;
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();
}

async function registrarUsuario(auth = false) {
    var myForm = document.getElementById("myFormReg");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) { //convertimos los datos a json
        jsonData[k] = v;
    }
    console.log("data user ", jsonData);
    const request = await fetch(urlApi + "/user", {
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
        listarUsuarios();
    }
    alertas("Se ha registrado el usuario exitosamente!", 1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
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