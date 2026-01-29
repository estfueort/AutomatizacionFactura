/* ===============================
   CAMBIAR FACTURA / PRESUPUESTO
================================ */
function cambiarTipo() {
  document.getElementById("tipoTitulo").innerText =
    document.getElementById("tipo").value;
}

/* ===============================
   FILAS DE PRODUCTOS
================================ */
function agregarFila() {
  document.getElementById("tablaProductos").insertAdjacentHTML(
    "beforeend",
    `<tr>
      <td class="col-desc"><textarea placeholder="Descripción"></textarea></td>
      <td class="col-precio">
        <input type="number" class="precio" placeholder="Precio (€)" oninput="calcular()">
      </td>
    </tr>`
  );
}

function eliminarFila() {
  const tabla = document.getElementById("tablaProductos");
  if (tabla.rows.length > 1) {
    tabla.deleteRow(-1);
    calcular();
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
   CONVERTIR TEXTAREA A DIV (PDF)
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

  // Ocultar botones
  const ocultar = document.querySelectorAll(".no-pdf");
  ocultar.forEach(el => el.style.display = "none");

  // Convertir textarea a div
  reemplazarTextareasPorDivs();

  html2canvas(factura, { scale: 2, useCORS: true }).then(canvas => {
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

    // Restaurar
    restaurarTextareas();
    ocultar.forEach(el => el.style.display = "flex");
  });
}
