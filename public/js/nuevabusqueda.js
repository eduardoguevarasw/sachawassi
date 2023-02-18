const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

const minValue = new Date();
minValue.setDate(minValue.getDate());
document.getElementById('fecha').min = minValue.toISOString().split("T")[0];

function traerCiudades() {
  database.from('rutas').select("origen").then(({ data, error }) => {
      //guara los destinos en un array para no repetir
      let ciudades = [];
      if (error) {
          console.log('error', error)
      }else{
          for (let i = 0; i < data.length; i++) {
              ciudades.push(data[i].origen);
          }
          //eliminar los destinos repetidos
          let ciudadesUnicas = [...new Set(ciudades)];
          console.log(ciudadesUnicas);
          let origen = document.getElementById("origen");
          for (let i = 0; i < ciudadesUnicas.length; i++) {
              origen.innerHTML += `<option value="${ciudadesUnicas[i]}">${ciudadesUnicas[i]}</option>`;
          }
      }
  })
  database.from('rutas').select("destino").then(({ data, error }) => {
      //guara los destinos en un array para no repetir
      let destinos = [];
      if (error) {
          console.log('error', error)
      }else{
          for (let i = 0; i < data.length; i++) {
              destinos.push(data[i].destino);
          }
          //eliminar los destinos repetidos
          let destinosUnicos = [...new Set(destinos)];
          console.log(destinosUnicos);
          let destino = document.getElementById("destino");
          for (let i = 0; i < destinosUnicos.length; i++) {
              destino.innerHTML += `<option value="${destinosUnicos[i]}">${destinosUnicos[i]}</option>`;
          }
      }
  })
}
traerCiudades();
