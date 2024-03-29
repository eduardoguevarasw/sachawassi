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
    let { data  , error } =  database
    .from("compras")
    .select("*")
    .eq("id", id)
    .then((response) => {
        let datosCompra = response.data[0];
        
        //obtener los datos de la compra 
        let tx = datosCompra.tx;
        let cedula = datosCompra.cedula;
        let nombre = datosCompra.nombre;
        let apellido = datosCompra.apellido;
        let asientosArray = datosCompra.asientosArray;
        let origen = datosCompra.origen;
        let destino = datosCompra.destino;
        let fecha = datosCompra.fecha;
        let totalPago = datosCompra.totalPago;
        let idRuta = datosCompra.idRuta;
        let bote_asignado = datosCompra.bote_asignado;
        let nombresyapellidos = nombre + " " + apellido;
        console.log(datosCompra);
        //con el id ruta obtener los datos de la ruta
        let { data  , error } =  database
        .from("rutas")
        .select("*")
        .eq("id", idRuta)
        .then((response) => {
            //obtener hora de salida y llegada
            let horaSalida = response.data[0].hora;
            let horaLlegada = response.data[0].llegada;

            let infoCompras = {
                tx: tx,
                cedula: cedula,
                nombre: nombre,
                apellido: apellido,
                nombresyapellidos: nombresyapellidos,
                asientosArray: asientosArray,
                origen: origen,
                destino: destino,
                fecha: fecha,
                totalPago: totalPago,
                horaSalida: horaSalida,
                llegadaBoleto: horaLlegada,
                bote_asignado :  bote_asignado
                
            }

            console.log(infoCompras);

            ///guardar en el local storage
            localStorage.setItem("infoCompras", JSON.stringify(infoCompras));
            //llevar a boleto 
            window.location.href = 'boleto.html'
        })

       

    })
}


