const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);
//obtener el jwt 
//cerrar sesion si hizo click 
//cerrar sesion si hizo click 
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})

let dataTable;
let dataTableisInit = false;

const initDataTable = async () => {
    if(dataTableisInit){
        dataTable.destroy();
    };

    await listarBotes();

    dataTable = $("#table_id").DataTable({
        responsive: true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
       
    });

    dataTableisInit = true;
}


//funcion para listar los botes
const listarBotes = async () => {
    //obtener la fecha de hoy en el formato dd/mm/yyyy
    let fechaActual = new Date().toLocaleDateString('es-ES')
    let registroBotes = document.getElementById("registroBotes");
    var idUsuario = localStorage.getItem("cedula");
    let { data, error } = await database
    .from("compras")
    .select("*")
    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    //si el idUsuario es igual al idUsuario de la compra
    //mostrar los datos de la compra
    data.forEach((bote,index) => {
        if(bote.idUsuario == idUsuario){
            registroBotes.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${bote.cedula}</td>
            <td>${bote.nombre}</td>
            <td>${bote.apellido}</td>
            <td>${bote.asientosArray}</td>
            <td>${bote.destino}</td>
            <td>${bote.fecha}</td>
            <td>${bote.totalPago}</td>
            <td><button class="btn btn-danger" onclick="pdfBoleto(${bote.id})">Descargar</button></td>
        </tr>
      </div>
        `;
        }else{
            console.log("no hay datos");
        }
        
    } );
}


window.addEventListener("load",  async () => {
 await initDataTable();
});



function pdfBoleto(id){
    //obtener los datos de la compra para el boleto
    let { data1, error1 } =  database
    .from("compras")
    .select("*")
    .eq("id", id)
    .then(({ data1, error1 }) => {
        //con el idRuta buscar los datos de la ruta
        console.log(data1);
        let { data, error } =  database
        .from("rutas")
        .select("*")
        .eq("id", idRuta)
        .then(({ data, error }) => {

            let datosCompra = {
                nombre: data1.nombre,
                apellido: data1.apellido,
                cedula: data1.cedula,
                asientos: data1.asientosArray,
                destino: data.destino,
                fecha: data1.fecha,
                horaSalida: data.hora,
                llegadaBoleto: data.llegada,
                totalPago: data1.totalPago,
                bote_asignado : data1.bote_asignado
            }
            localStorage.setItem("datosCompra", JSON.stringify(datosCompra));
            window.location.href = "boleto.html";
        })
        
    })
}


