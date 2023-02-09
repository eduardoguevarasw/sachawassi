const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);
document.getElementById('paypal-button-container').style.display = "none";

//controlar el calendario 
const minValue = new Date();
minValue.setDate(minValue.getDate());
document.getElementById('checkin').min = minValue.toISOString().split("T")[0]

let selectpais = document.getElementById('pais');
//obtener los paises de rest countries 
fetch('https://restcountries.eu/rest/v2/all')
.then(response => response.json())
.then(data => {
    data.forEach(element => {
        let option = document.createElement('option');
        option.value = element.name;
        option.innerHTML = element.name;
        selectpais.appendChild(option);
    });
})

function reservar(){
     //guardar en la base de datos
     const nombre = document.getElementById('nombre').value;
     const apellido = document.getElementById('apellido').value;
     const email = document.getElementById('email').value;
     const telefono = document.getElementById('telefono').value;
     const checkin = document.getElementById('checkin').value;
     const pais = document.getElementById('pais').value;
     const adultos = document.getElementById('adultos').value;
     const tour = document.getElementById('tour').value;
     const mensaje = document.getElementById('mensaje').value;
      //calcular el precio
    const precio = 250;
    const total = precio * adultos;
    console.log(total);   
    //generar un id unico
    const reserva = Math.floor(Math.random() * 1000000000);
     const data = {
         nombre,
         apellido,
         email,
         telefono,
         checkin,
         pais,
         adultos,
         tour,
         mensaje,
         total,
         reserva
     };
     console.log(data);
     localStorage.setItem('totaltour', total);
     localStorage.setItem('reservatour', reserva);
     //enviar a la base de datos
     database.from('tours').insert(data).then(({ data, error }) => {
         if (error) {
             console.log('error', error)
         }else{
             //mostrar el boton de paypal
                document.getElementById('paypal-button-container').style.display = "block";

         }
     });
 
 
}

//funcion para eliminar la transaccion
function eliminartx(){
    //obtener el id de la reserva
    const reserva = localStorage.getItem('reservatour');
    //eliminar la transaccion
    database.from('tours').delete().match({ reserva }).then(({ data, error }) => {
        if (error) {
            console.log('error', error)
        }else{
            alert("Datos de la reserva eliminados");
        }
    });
}


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
              value:  localStorage.getItem('totaltour'),
              //value: 16
            },
            //descripcion del producto
            description: "Compra de boletos Sacha Wassi",
          },
        ],
      });
    },
    // Finalize the transaction after payer approval
    onApprove: (data, actions) => {
      return actions.order.capture().then(function (orderData) {

        alert("Pago realizado con exito ✅ ");
        
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


   