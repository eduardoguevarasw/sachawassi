const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
});

 function guardarTour() {
  let nombre = document.getElementById("nombre").value;
  let origen = document.getElementById("origen").value;
  let destino = document.getElementById("destino").value;
  let dias = document.getElementById("dias").value;
  let noches = document.getElementById("noches").value;
  let precio = document.getElementById("precio").value;
  let descripcion = document.getElementById("descripcion").value;

  if (
    nombre === "" ||
    origen === "" ||
    destino === "" ||
    dias === "" ||
    noches === "" ||
    precio === "" ||
    descripcion === ""
  ) {
    alert("Todos los campos son obligatorios 💡");
  } else {
    //obtener url de la imagen del localstorage
    let imagen = localStorage.getItem("imagen");
    database
      .from("tour")
      .eq("imagen", imagen)
      .insert([
        {
          nombre: nombre,
          origen: origen,
          destino: destino,
          dias: dias,
          noches: noches,
          precio: precio,
          descripcion: descripcion,
        },
      ])
      .then((res) => {
        if (res.error) {
          alert("Error al guardar el tour 😢");
        } else {
           alert("Tour guardado con exito 😎");
        }
      });
  }
}

async function subir() {
    let foto = document.getElementById("imagen").files[0];
    const CLOUDINARY_PRESET = 'sachawassi';
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dau2utfvm/image/upload'
    //guardar la imagen en cloudinary
    const formData = new FormData();
    formData.append('file', foto);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData

    });
    const file = await res.json();
    console.log(file.secure_url);
    //guardar la url de la imagen en localstorage
    localStorage.setItem("imagen", file.secure_url);
    //guardar la url de la imagen en la base de datos
    database
        .from("tour")
        .insert([
            {
                imagen: file.secure_url
                
            }
        ])
}

//cerrar sesion si hizo click
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
});
