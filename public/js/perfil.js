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
//buscar en la base de datos
//funcion para obtener datos 
 function obteneruser(){
  //obtener la cedula de localstore
  let dni = localStorage.getItem("cedula");
  console.log(dni);
  console.log("hola");
  //buscar con el dni en la base de datos
  database
  .from('clientes')
  .select('*')
  .eq('cedula', dni)
  .then(({ data, error }) => {
    console.log(data)
    console.log(error)
    document.getElementById("cedula").value = data[0].cedula;
    document.getElementById("nombres").value = data[0].nombres;
    document.getElementById("apellidos").value = data[0].apellidos;
    document.getElementById("correo").value = data[0].correo;
  })
 }
  obteneruser();
