const key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";

const database = supabase.createClient(url, key);
const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

//boton btn btn-warning en none
document.getElementById("btnActualizar").style.display = "none";

//restringir la seleccion de fechas anteriores
let today = new Date().toISOString().substr(0, 10);
document.querySelector("#fecha").value = today;
document.querySelector("#fecha").min = today;
//restringir la seleccion de fechas anteriores
document.getElementById("fecha").addEventListener("change", () => {
    let fecha = document.getElementById("fecha").value;
    let dias = document.getElementById("dias").value;
    let fechaCheckout = new Date(fecha);
    fechaCheckout.setDate(fechaCheckout.getDate() + parseInt(dias-1));
    let fechaCheckoutString = fechaCheckout.toISOString().substr(0, 10);
    document.getElementById("fecha2").value = fechaCheckoutString;
  });

let dataTable;
let dataTableisInit = false;

const initDataTable = async () => {
    if(dataTableisInit){
        dataTable.destroy();
    };

    await listarBotes();

    dataTable = $("#table_id").DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                download: 'open'
            }
        ],
        responsive: true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
       
    });

    dataTableisInit = true;
}


function buscarfecha(){
    initDataTable();
}

//funcion para listar los botes
const listarBotes = async () => {
    //al cambiar la fecha se debe actualizar la tabla
    //let fechaActual = document.getElementById("fechaCompra").value;
    //cambiar el formato de la fecha en dd/mm/yyyy
    //determinar la zona horaria
    //let fecha = new Date(fechaActual).toLocaleDateString();
    console.log();
    let registroBotes = document.getElementById("registroBotes");
    let { data, error } = await database
    .from("reservas")
    .select("*")
    //.eq("checkin", fecha)
    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    //buscar la el destino con la id de la ruta
    
    data.forEach((bote,index) => {
        registroBotes.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${bote.nombre}</td>
            <td>${bote.apellido}</td>
            <td>${bote.email}</td>
            <td>${bote.telefono}</td>
            <td>${bote.pais}</td>
            <td>${bote.cantidad}</td>
            <td>${bote.checkin}</td>
            <td>${bote.tour}</td>
            <td>${bote.total}</td>
            <td><button class="btnEditar" onclick="selectTour(${bote.id})">Editar</button></td>
            <td><button class="btnEliminar" onclick="eliminarTour(${bote.id})">Eliminar</button></td>
        </tr>
      </div>
        `;
    } );
}

window.addEventListener("load",  async () => {
 await initDataTable();
});

//funcion para cargar los tours en el select
const cargarTours = async () => {
    let selectTour = document.getElementById("tourSelect");
    let { data, error } = await database
    .from("tour")
    .select("*")
    if (error) {
        console.log("error", error);
        alert("Error al cargar los tours ❌");
    }
    data.forEach((tour) => {
        selectTour.innerHTML += `
        <option value="${tour.nombre}">${tour.nombre}</option>
        `;
    } );
}
cargarTours();

//escuchar el evento change del select de tours cambiar el precio
document.getElementById("tourSelect").addEventListener("change", () => {
    let tour = document.getElementById("tourSelect").value;
    console.log(tour);
    let { data, error } = database
    .from("tour")
    .select("*")
    .eq("nombre", tour)
    .then((response) => {
        data = response.data;
        console.log(data);
        document.getElementById("precio").value = data[0].precio;
        document.getElementById("dias").value = data[0].dias;
        console.log(data[0].precio);
        console.log(data[0].dias);
    })
    //despues de 3 segundos se debe calcular el total
    setTimeout(() => {
        calcularTotal();
    }, 1000);
})

//funcion para calcular el total
const calcularTotal = () => {
    let cantidad = document.getElementById("cantidad").value;
    console.log(cantidad);
    let precio = document.getElementById("precio").value;
    console.log(precio);
    let total = cantidad * precio;
    console.log(total);
    document.getElementById("total").value = total;
}

//funcion para registrar un tour
const registrarTour = async () => {
    //validar que los campos no esten vacios
   

        let nombre = document.getElementById("nombre").value;
        let apellido = document.getElementById("apellido").value;
        let email = document.getElementById("correo").value;
        let telefono = document.getElementById("telefono").value;
        let pais = document.getElementById("pais").value;
        let cantidad = document.getElementById("cantidad").value;
        let checkin = document.getElementById("fecha").value;
        let tour = document.getElementById("tourSelect").value;
        let total = document.getElementById("total").value;
        
        //validar que los campos esten llenos
        if(nombre == "" || apellido == "" || email == "" || telefono == "" || pais == "" || cantidad == "" || checkin == "" || tour == "" || total == ""){
            alert("Todos los campos son obligatorios");
            return;
        }else{
            //validar que el email sea valido
            if(!validateEmail(email)){
                alert("El email no es valido");
                return;
            }else{
                //validar el número de telefono tenga 10 números
                if(telefono.length != 10){
                    alert("El número de telefono debe tener 10 números");
                    return;
                }else{
                    let { data, error } = await database
                    .from("reservas")
                    .insert([
                        { nombre: nombre, apellido: apellido, email: email, telefono: telefono, pais: pais, cantidad: cantidad, checkin: checkin, tour: tour, total: total}
                    ])
                    if (error) {
                        console.log("error", error);
                        alert("Error al registrar el tour ❌");
                    }
                    alert("Tour registrado con exito ✅");
                    location.reload();


                }
            }
        }

}

//funcion para validar el email
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);

}

//funcion para eliminar un tour
const eliminarTour = async (id) => {
    let { data, error } = await database
    .from("reservas")
    .delete()
    .eq("id", id)
    if (error) {
        console.log("error", error);
        alert("Error al eliminar el tour ❌");
    }
    alert("Tour eliminado con exito ✅");
    location.reload();
}

//funcion para seleccionar un tour
const selectTour = async (id) => {
    let { data, error } = await database
    .from("reservas")
    .select("*")
    .eq("id", id)
    if (error) {
        console.log("error", error);
        alert("Error al seleccionar el tour ❌");
    }
    let tour = data[0];
    let nombreTour = tour.tour;
    //buscar el nombre del tour
    let { data: data2, error: error2 } = await database
    .from("tour")
    .select("*")
    .eq("nombre", nombreTour)
    if (error2) {
        console.log("error", error2);
        alert("Error al seleccionar el tour ❌");
    }
    let tour2 = data2[0];
    console.log(tour2);
    document.getElementById("nombre").value = tour.nombre;
    document.getElementById("apellido").value = tour.apellido;
    document.getElementById("correo").value = tour.email;
    document.getElementById("telefono").value = tour.telefono;
    document.getElementById("pais").value = tour.pais;
    document.getElementById("cantidad").value = tour.cantidad;
    document.getElementById("fecha").value = tour.checkin;
    document.getElementById("tourSelect").value = tour.tour;
    document.getElementById("precio").value = tour2.precio;
    document.getElementById("total").value = tour.total;
    document.getElementById("id").value = tour.id;
    document.getElementById("btnActualizar").style.display = "block";
    document.getElementById("btnGuardar").style.display = "none";
}

//funcion para editar un tour
const editarTour = async () => {
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let email = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let pais = document.getElementById("pais").value;
    let cantidad = document.getElementById("cantidad").value;
    let checkin = document.getElementById("fecha").value;
    let tour = document.getElementById("tourSelect").value;
    let total = document.getElementById("total").value;
    let id = document.getElementById("id").value;

    //validar que los campos esten llenos
     //validar que los campos esten llenos
     if(nombre == "" || apellido == "" || email == "" || telefono == "" || pais == "" || cantidad == "" || checkin == "" || tour == "" || total == ""){
        alert("Todos los campos son obligatorios");
        return;
    }else{
        //validar que el email sea valido
        if(!validateEmail(email)){
            alert("El email no es valido");
            return;
        }else{
            //validar el número de telefono tenga 10 números
            if(telefono.length != 10){
                alert("El número de telefono debe tener 10 números");
                return;
            }else{
                let { data, error } = await database
                .from("reservas")
                .update({ nombre: nombre, apellido: apellido, email: email, telefono: telefono, pais: pais, cantidad: cantidad, checkin: checkin, tour: tour, total: total })
                .eq("id", id)
                if (error) {
                    console.log("error", error);
                    alert("Error al editar el tour ❌");
                }
                alert("Tour editado con exito ✅");
                location.reload();

            }
        }
    }

}

//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})
