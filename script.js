/* ===============================
   CAMBIAR FACTURA / PRESUPUESTO
================================ */
function cambiarTipo() {
  document.getElementById("tipoTitulo").innerText =
    document.getElementById("tipo").value;

  guardarDatos();
}

/* ===============================
   FILAS DE PRODUCTOS
================================ */
function agregarFila() {
  document.getElementById("tablaProductos").insertAdjacentHTML(
    "beforeend",
    `<tr>
      <td class="col-desc">
        <textarea placeholder="Descripción"></textarea>
      </td>
      <td class="col-precio">
        <input type="number" class="precio" placeholder="Precio (€)" oninput="calcular()">
      </td>
    </tr>`
  );

  guardarDatos();
}

function eliminarFila() {
  const tabla = document.getElementById("tablaProductos");

  if (tabla.rows.length > 1) {
    tabla.deleteRow(-1);
    calcular();
    guardarDatos();
  }
}

/* ===============================
   CÁLCULOS
================================ */
function calcular() {
  let base = 0;

  document.querySelectorAll(".precio").forEach(p => {
    base += parseFloat(p.value) || 0;
  });

  const iva = parseFloat(document.getElementById("iva").value) || 0;
  const irpf = parseFloat(document.getElementById("irpf").value) || 0;

  const total = base + base * iva / 100 - base * irpf / 100;

  document.getElementById("base").innerText = base.toFixed(2) + " €";
  document.getElementById("total").innerText = total.toFixed(2) + " €";

  guardarDatos();
}

/* ===============================
   AUTO ALTURA TEXTAREA
================================ */
document.addEventListener("input", e => {
  if (e.target.tagName === "TEXTAREA") {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
});

/* ===============================
   GUARDADO AUTOMÁTICO
================================ */
function guardarDatos() {
  const datos = {
    tipo: document.getElementById("tipo").value,
    fecha: document.getElementById("fecha").value,
    numeroDoc: document.getElementById("numeroDoc").value,

    clienteNombre: document.getElementById("clienteNombre").value,
    clienteDireccion: document.getElementById("clienteDireccion").value,
    clienteOtros: document.getElementById("clienteOtros").value,
    clienteCiudad: document.getElementById("clienteCiudad").value,

    iva: document.getElementById("iva").value,
    irpf: document.getElementById("irpf").value,

    productos: []
  };

  document.querySelectorAll("#tablaProductos tr").forEach(fila => {
    datos.productos.push({
      descripcion: fila.querySelector("textarea").value,
      precio: fila.querySelector(".precio").value
    });
  });

  localStorage.setItem("facturaDatos", JSON.stringify(datos));
}

/* ===============================
   CARGAR DATOS GUARDADOS
================================ */
function cargarDatos() {
  const datosGuardados = localStorage.getItem("facturaDatos");

  if (!datosGuardados) return;

  const datos = JSON.parse(datosGuardados);

  document.getElementById("tipo").value = datos.tipo || "FACTURA";
  document.getElementById("fecha").value = datos.fecha || "";
  document.getElementById("numeroDoc").value = datos.numeroDoc || "";

  document.getElementById("clienteNombre").value = datos.clienteNombre || "";
  document.getElementById("clienteDireccion").value = datos.clienteDireccion || "";
  document.getElementById("clienteOtros").value = datos.clienteOtros || "";
  document.getElementById("clienteCiudad").value = datos.clienteCiudad || "";

  document.getElementById("iva").value = datos.iva || 21;
  document.getElementById("irpf").value = datos.irpf || 0;

  document.getElementById("tipoTitulo").innerText =
    document.getElementById("tipo").value;

  const tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  datos.productos.forEach(producto => {
    tabla.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td class="col-desc">
          <textarea placeholder="Descripción">${producto.descripcion}</textarea>
        </td>
        <td class="col-precio">
          <input type="number" class="precio" value="${producto.precio}" oninput="calcular()">
        </td>
      </tr>`
    );
  });

  calcular();
}

/* ===============================
   BORRAR TODO
================================ */
function borrarTodo() {
  if (!confirm("¿Seguro que quieres borrar todo?")) return;

  localStorage.removeItem("facturaDatos");
  location.reload();
}

/* ===============================
   CONVERTIR TEXTAREA A DIV PARA PDF
================================ */
function reemplazarTextareasPorDivs() {
  document.querySelectorAll("textarea").forEach(textarea => {
    const div = document.createElement("div");

    div.className = "textarea-pdf";
    div.innerText = textarea.value || "";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordBreak = "break-word";
    div.style.width = textarea.offsetWidth + "px";
    div.style.minHeight = textarea.offsetHeight + "px";

    textarea.style.display = "none";
    textarea.parentNode.insertBefore(div, textarea);
  });
}

function restaurarTextareas() {
  document.querySelectorAll(".textarea-pdf").forEach(div => {
    const textarea = div.nextSibling;
    textarea.style.display = "";
    div.remove();
  });
}

/* ===============================
   PDF MULTIPÁGINA + NOMBRE DINÁMICO
================================ */
function descargarPDF() {
  const factura = document.getElementById("factura");
  const { jsPDF } = window.jspdf;

  const tipo = document.getElementById("tipo").value;
  const numero = document.getElementById("numeroDoc").value || "SIN_NUMERO";
  const nombreArchivo = `${tipo}_${numero}.pdf`;

  const ocultar = document.querySelectorAll(".no-pdf");
  ocultar.forEach(el => el.style.display = "none");

  reemplazarTextareasPorDivs();

  html2canvas(factura, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * pageWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(nombreArchivo);

    restaurarTextareas();
    ocultar.forEach(el => el.style.display = "flex");
  });
}

/* ===============================
   INICIAR
================================ */
window.onload = () => {
  cargarDatos();
  calcular();
};