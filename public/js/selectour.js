const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

//ocultar el boton de comprar boleto de paypal 
document.getElementById("paypal-button-container").style.display = "none";

//cerrar sesion si hizo click 
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})

const infoTour = async () => {
    let tour = localStorage.getItem("tour");
    //buscar tour en la base de datos
    const { data, error } = await database
    .from("tour")
    .select("*")
    .eq("id", tour.idTour)
    .single();
    //mostrar informacion del tour
    console.log(data);
    let infoBoleto = document.getElementById("infoBoleto");
          infoBoleto.innerHTML = `
          <h5>Información del Viaje</h5>
          <div class="alert alert-success" role="alert">
          Embarcación: <strong id="bote_a">${data.nombre} </strong>&nbsp&nbsp Ruta: <strong>${data.origen} ➡️ ${data.destino}</strong> <br> Precio: 💲 <strong id="precioBoleto">${data.precio}</strong>&nbsp&nbsp Fecha: <strong>${tour.fecha}</strong>&nbsp&nbsp Hora Salida: <strong id="horaBoleto">${data.hora}</strong>&nbsp&nbsp </strong>
          </div>
                `;
}
infoTour();