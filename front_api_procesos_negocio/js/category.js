function listarCategorias() {
  validaToken();
  var settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi + "/categorias", settings)
    .then((response) => response.json())
    .then(function (data) {
      var categorias = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de categorias</h1>
                </div>
                  
                <a href="#" onclick="registerFormCa('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Nombre</th>
                        <th scope="col">Last Descripcion</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
      var cont = 0;
      for (const categoria of data) {
        cont++;
        categorias += `
                
                        <tr>
                            <th scope="row">${cont}</th>
                            <td>${categoria.nombre}</td>
                            <td>${categoria.descripcion}</td>
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaCategoria('${categoria.id}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarCategoria('${categoria.id}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verCategoria('${categoria.id}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            </td>
                        </tr>
                    `;
      }
      categorias += `
            </tbody>
                </table>
            `;
      document.getElementById("datos").innerHTML = categorias;
    })
    .catch(function (error) {
      var agregar = `<a href="#" onclick="registerFormCa('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>`;
      document.getElementById("datos").innerHTML = agregar;
      alertas(
        "Agrege una categor&iacute;a dandole click al bot&oacute;n ya que est&aacute; base de datos est&aacute; vac&iacute;a!",
        2
      );
    });
}

function verModificarCategoria(id) {
  validaToken();
  var settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  var cont = 0;
  fetch(urlApi + "/categoria/" + id, settings)
    .then((response) => response.json())
    .then(function (categoria) {
      var cadena = "";
      if (categoria) {
        cont++;
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Categoria</h1>
                </div>
                <form action="" method="post" id="myForm">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" required value="${categoria.nombre}"> <br>
                    <label for="lastname"  class="form-label">Descripcion</label>
                    <input type="text" class="form-control" name="descripcion" id="descripcion" required value="${categoria.descripcion}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCategoria('${categoria.id}')">Modificar
                    </button>
                </form>`;
      }
      document.getElementById("contentModal").innerHTML = cadena;
      var myModal = new bootstrap.Modal(
        document.getElementById("modalUsuario")
      );
      myModal.toggle();
    });
}

async function modificarCategoria(id) {
  validaToken();
  var myForm = document.getElementById("myForm");
  var formData = new FormData(myForm);
  var jsonData = {};
  for (var [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  const request = await fetch(urlApi + "/updateCategoria/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
    body: JSON.stringify(jsonData),
  });
  listarCategorias();
  alertas("Se ha modificado la categoria exitosamente!", 1);
  document.getElementById("contentModal").innerHTML = "";
  var myModalEl = document.getElementById("modalUsuario");
  var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
  modal.hide();
}

function verCategoria(id) {
  validaToken();
  var settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi + "/categoria/" + id, settings)
    .then((response) => response.json())
    .then(function (categoria) {
      var cadena = "";
      if (categoria) {
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Categoria</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Nombre: ${categoria.nombre}</li>
                    <li class="list-group-item">Descripción: ${categoria.descripcion}</li>
                </ul>`;
      }
      document.getElementById("contentModal").innerHTML = cadena;
      var myModal = new bootstrap.Modal(
        document.getElementById("modalUsuario")
      );
      myModal.toggle();
    });
}

function eliminaCategoria(id) {
  validaToken();
  var settings = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi + "/deleteCategoria/" + id, settings).then((data) => {
    listarCategorias();
    alertas(
      "Se ha eliminado la categoria exitosamente, si no se elimino la categor&iacute;a es por que esta relacionado a uno o muchos articulos primero elimine esos articulos para eliminar la categor&iacute;a!",
      2
    );
  });
}

function registerFormCa(auth = false) {
  cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Categoria</h1>
            </div>
              
            <form action="" method="post" id="myFormRegCa">
                <label for="name" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre" id="nombre" required> <br>
                <label for="lastname"  class="form-label">Descripcion</label>
                <input type="text" class="form-control" name="descripcion" id="descripcion" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarCategoria('${auth}')">Registrar</button>
            </form>`;
  document.getElementById("contentModal").innerHTML = cadena;
  var myModal = new bootstrap.Modal(document.getElementById("modalUsuario"));
  myModal.toggle();
}

async function registrarCategoria(auth = false) {
  var myForm = document.getElementById("myFormRegCa");
  var formData = new FormData(myForm);
  var jsonData = {};
  for (var [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  const request = await fetch(urlApi + "/categoria", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => response.json())
    .then(function (respuesta) {
      console.log("respuesta peticion", respuesta);
    });
  if (auth) {
    listarCategorias();
  }
  alertas("Se ha registrado la categoria exitosamente!", 1);
  document.getElementById("contentModal").innerHTML = "";
  var myModalEl = document.getElementById("modalUsuario");
  var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
  modal.hide();
}
