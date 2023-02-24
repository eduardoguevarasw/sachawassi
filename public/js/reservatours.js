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
//document.getElementById("btnActualizar").style.display = "none";

//restringir la seleccion de fechas anteriores
/*
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
*/

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
            <td>${bote.checkin}</td>
            <td>${bote.checkout}</td>
            <td>${bote.tour}</td>
            <td>${bote.total}</td>
            <td><button class="btnEliminar" onclick="eliminarTour(${bote.id})">Eliminar</button></td>
        </tr>
      </div>
        `;
    } );
}

window.addEventListener("load",  async () => {
 await initDataTable();
});


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



//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})
