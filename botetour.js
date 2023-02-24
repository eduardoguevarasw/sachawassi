const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

//ocultar el boton de comprar boleto de paypal 
document.getElementById("paypal-button-container").style.display = "none";


//funcion para verificar si un asientos esta reservado
const checkAsiento = async () => {
    let tour = localStorage.getItem("tour");
    tour2 = JSON.parse(tour);
    let idtour = tour2.idTour;
    let checkin = tour2.checkin;
    console.log(idtour);
    console.log(checkin);
    let resp2 = await database.from("reservas").select("*");
    resp2.data.forEach((element) => {
      //guardar en array los asientos reservados
      if (element.checkin == checkin && element.tour == idtour) {
        //cambiar de color los asientos reservados
        let asiento = element.asientos;
        console.log(asiento);
        let seat = document.getElementById(asiento);
        seat.classList.remove("seat");
        seat.classList.add("seat-ocupado");
  
      }
    });
  };
checkAsiento();

const infoTour = async () => {
    let tour = localStorage.getItem("tour");
    console.log(tour);
    tour2 = JSON.parse(tour);    
    //buscar tour en la base de datos
    const { data, error } = await database
    .from("tour")
    .select("*")
    .eq("id", tour2.idTour)
    .single();
    //mostrar informacion del tour
    console.log(data);
    let infoBoleto = document.getElementById("infoBoleto");
          infoBoleto.innerHTML = `
          <h5>Información del Tour</h5>
          <div class="alert alert-success" role="alert">
          Tour: <strong id="bote_a">${data.nombre} </strong>&nbsp&nbsp Ruta: <strong>${data.origen} ➡️ ${data.destino}</strong> <br> Precio: 💲 <strong id="precioBoleto">${data.precio}</strong>&nbsp&nbsp Fecha: <strong>${tour2.checkin}</strong>&nbsp&nbsp Hora Salida: <strong id="horaBoleto">${data.hora}</strong>&nbsp&nbsp </strong>
          </div>
                `;
}
infoTour();



//seleccionar asiento cambiar de de class
asientos = [];
precio = [];
function seleccionarAsiento(id) {
let asientosSelected = document.getElementById("asientosSelected");
let precioBoleto = document.getElementById("precioBoleto");
let agregarPasajero = document.getElementById("pasajeros");
let horaBoleto = document.getElementById("horaBoleto");
let llegadaBoleto = document.getElementById("llegadaBoleto");
console.log(precioBoleto);
let totalPago = document.getElementById("totalPago");

var asiento = document.getElementById(id);
var filas =0;
//traer la hora de la ruta 
if(asiento.classList.contains("seat-ocupado")){
  alert("Asiento ocupado");
}else{
  if(asiento.classList.contains("seat")){
    asiento.classList.remove("seat");
    asiento.classList.add("seat-selected");
    //agregar campos para nombres y apellidos
    agregarPasajero.innerHTML +=`
    <div class="row" id="pasajero${id}">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-body">
        <h5 class="card-title">Asiento ${id}</h5>
        <select class="form-control" id="tipoDNI" name="tipoDNI">
        <option value="cedula">Cédula</option>
        <option value="pasaporte">Pasaporte</option>
        <select>
        <br>
        <input class="form-control" type="text" id="identificacion" name="cedula" placeholder="Indentificación" required/><br>
        <label>Nombre</label>
        <input type="text"  class="form-control" id="nombre" name="nombre" placeholder="Nombre"><br>
        <label>Apellido</label>
        <input type="text" class="form-control" id="apellido" name="apellido" placeholder="Apellido"><br>
        </div>
   </div>
   </div>
   </div>
    `;
    asientos.push(id);
    precio.push(precioBoleto.innerHTML);
   // asientosSelected.innerHTML = asientos;
    console.log(precio);
    //sumar los precios
    let suma = 0;
    for (var i in precio) {
        suma += parseFloat(precio[i].replace("$", ""));
        
    }
    totalPago.innerHTML =`<h3>$${suma} USD</h3>`;
    suma = sessionStorage.setItem("totalPago", suma);
  }else{
    if(asiento.classList.contains("seat-selected")){
      asiento.classList.remove("seat-selected");
      asiento.classList.add("seat");
      asientos.splice(asientos.indexOf(id), 1);
      precio.splice(precio.indexOf(precioBoleto.innerHTML), 1);
      //asientosSelected.innerHTML = asientos;
      let pasajero = document.getElementById("pasajero"+id);
      pasajero.remove();
      console.log(precio);
      //sumar los precios
      let suma = 0;
      for (var i in precio) {
          suma += parseFloat(precio[i].replace("$", ""));
      }
      totalPago.innerHTML=`<h3>$${suma} USD</h3>`;
      suma = sessionStorage.setItem("totalPago", suma);
    }
  }
}

}



const continuar = async () => {
    //comprobar que todos los campos esten llenos
    if (
      document.getElementById("identificacion").value == "" ||
      document.getElementById("nombre").value == "" ||
      document.getElementById("apellido").value == ""
    ) {
      alert("Por favor llene todos los campos 💡");
    } else {
      //si esta marcado como cedula continuar 
      let tipoDNI = document.getElementById("tipoDNI").value;
      if (tipoDNI == "cedula") {
      let cedulas = document.getElementsByName("cedula");
      let nombres = document.getElementsByName("nombre");
      let apellidos = document.getElementsByName("apellido");
      //validar las cedulas
      let dni = cedulas.length;
      let validadas = 0;
      cedulas.forEach((cedula) => {
        var cedula = cedula.value;
        array = cedula.split("");
        num = array.length;
        if (num == 10) {
          total = 0;
          digito = (array[9] * 1);
          for (i = 0; i < (num - 1); i++) {
            mult = 0; if ((i % 2) != 0) { total = total + (array[i] * 1); } else {
              mult = array[i] * 2; if (mult > 9)
                total = total + (mult - 9);
              else
                total = total + mult;
            }
          }
          decena = total / 10;
          decena = Math.floor(decena);
          decena = (decena + 1) * 10;
          final = (decena - total);
          if ((final == 10 && digito == 0) || (final == digito)) {
            //si el numero de cedulas es igual al numero de cedulas validadas
            validadas++;
            if (dni == validadas) {
              let asiento = document.querySelectorAll(".seat-selected");
              let total = sessionStorage.getItem("totalPago");
              let tour = localStorage.getItem("tour");
              //jsonparce
              let tourJson = JSON.parse(tour);
              let email = tourJson.email;
              let pais = tourJson.pais;
              let idTour = tourJson.idTour;
              let checkin = tourJson.checkin;
              let checkout = tourJson.checkout;
              let telefono = tourJson.telefono;

              let asientosArray = [];
              let nombresyapellidos = [];
              let cedula = [];
              let nombre = [];
              let apellido = [];
              let tx = [];
              for (var i = 0; i < cedulas.length; i++) {
                tx.push(Math.floor(Math.random() * 1000000000000));
                cedula.push(cedulas[i].value);
                nombre.push(nombres[i].value);
                apellido.push(apellidos[i].value);
                asientosArray.push(asientos[i]);
                nombresyapellidos.push(nombre[i] + " " + apellido[i]);
              }
  
              var compra = {
                cedula,
                nombre,
                apellido,
                asientosArray,
                nombresyapellidos,
                email,
                pais,
                idTour,
                checkin,
                checkout,
                telefono,
                total,
                tx
              };
              localStorage.setItem("compraTour", JSON.stringify(compra));
              //comprobar que no exista asientos repetidos
              comprobar();
            }
          }
          else {
            alert("La cédula:" + cedula + " es invalida ❌")
            return false;
          }
        }
        else {
          alert("La cédula:" + cedula + " no tiene los 10 digitos ❌")
          return false;
        }
        });
      }else{
        let tipoDNI = document.getElementById("tipoDNI").value;
        if(tipoDNI == "pasaporte"){
        //guardar los datos de la compra
              let cedulas = document.getElementsByName("cedula");
              let nombres = document.getElementsByName("nombre");
              let apellidos = document.getElementsByName("apellido");
              let asiento = document.querySelectorAll(".seat-selected");
              let total = sessionStorage.getItem("totalPago");
              let tour = localStorage.getItem("tour");
              //jsonparce
              let tourJson = JSON.parse(tour);
              let email = tourJson.email;
              let pais = tourJson.pais;
              let idTour = tourJson.idTour;
              let checkin = tourJson.checkin;
              let checkout = tourJson.checkout;
              let telefono = tourJson.telefono;
  
              let asientosArray = [];
              let nombresyapellidos = [];
              let cedula = [];
              let nombre = [];
              let apellido = [];
              let tx = [];
              for (var i = 0; i < cedulas.length; i++) {
                tx.push(Math.floor(Math.random() * 1000000000000));
                cedula.push(cedulas[i].value);
                nombre.push(nombres[i].value);
                apellido.push(apellidos[i].value);
                asientosArray.push(asientos[i]);
                nombresyapellidos.push(nombre[i] + " " + apellido[i]);
              }
  
              var compra = {
                cedula,
                nombre,
                apellido,
                asientosArray,
                nombresyapellidos,
                email,
                pais,
                idTour,
                checkin,
                checkout,
                telefono,
                total,
                tx
              };
              localStorage.setItem("compraTour", JSON.stringify(compra));
              //comprobar que no exista asientos repetidos
                comprobar();    
            }
  
      }
    }
  
  };


const comprobar = async () => {
    let compra = JSON.parse(localStorage.getItem("compraTour"));
    //buscar si en la base existe una compra con los mismos asientos
    let asientos = compra.asientosArray;
    let checkin = compra.checkin;
    let checkout = compra.checkout;
    let email = compra.email;
    let idTour = compra.idTour;
    let pais = compra.pais;
    let total = compra.total;

      //guardar en la base de datos
      //generar un número de transacción de 12 digitos
      
      var datos = {
        cedula: compra.cedula,
        nombre: compra.nombre,
        apellido: compra.apellido,
        asientosArray: compra.asientosArray,
        nombresyapellidos: compra.nombresyapellidos,
        email: compra.email,
        pais: compra.pais,
        idTour: compra.idTour,
        checkin: compra.checkin,
        checkout: compra.checkout,
        telefono: compra.telefono,
        total: compra.total,
        tx: compra.tx
      }
      //generar un número de transacción de 12 digitos
      console.log("INFORMACIO A GUARDAR");
      console.log(datos);
      for(var i = 0; i < datos.cedula.length; i++){
        //generar un número de transacción de 12 digitos
        
        //guardar en la base de datos uno por uno
        let resp = await database.from("reservas").insert(
          {
            cedula: datos.cedula[i],
            nombre: datos.nombre[i],
            apellido: datos.apellido[i],
            asientos: datos.asientosArray[i],
            tx: datos.tx[i],
            email: datos.email,
            pais: datos.pais,
            tour: datos.idTour,
            checkin: datos.checkin,
            checkout: datos.checkout,
            telefono: datos.telefono,
            total: datos.total
            

            
          })
      }
      //let resp = await database.from("compras").insert([compra]);
      //console.log(resp);
      //mostar boton de paypal
      document.getElementById("paypal-button-container").style.display = "block";
  };



paypal
.Buttons({
  // Sets up the transaction when a payment button is clicked
  //cambiar idioma a español
  locale: "es_ES",
  style: {
    color: "blue",
    shape: "pill",
  },
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            //obtener el valor de un session storage
            value: sessionStorage.getItem("totalPago"),
            //value: 16
          },
          //descripcion del producto
          description: "Compra de Tour Sacha Wassi",
        },
      ],
    });
  },
  // Finalize the transaction after payer approval
  onApprove: (data, actions) => {
    return actions.order.capture().then(function (orderData) {

       alert("Compra realizada con éxito ✅ ");
        //generar pdf 
        window.location.href = "gracias.html";
    });
  },
  onCancel: (data, actions) => {
    //mostrar mensaje de pago cancelado
    alert("Pago cancelado 😢 ");
    //borrar datos de compra de la base de datos
    eliminartx();
    
  },
  onError: (data, actions) => {
    //mostrar mensaje de error
    alert("Error al procesar el pago 😢 ");
    //borrar datos de compra de la base de datos
    eliminartx();
  },
})
.render("#paypal-button-container");
//en caso de rechazo
//cerrar sesion si hizo click 

const eliminartx = async () => {
    let compra = JSON.parse(localStorage.getItem("compraTour"));
    let tx = compra.tx;
    let resp = await database.from("reservas").delete().eq("tx", tx);
    console.log(resp);
};