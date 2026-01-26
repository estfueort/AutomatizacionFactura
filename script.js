function cambiarTipo() {
  document.getElementById("tipoTitulo").innerText =
    document.getElementById("tipo").value;
}

function agregarFila() {
  document.getElementById("tablaProductos").insertAdjacentHTML(
    "beforeend",
    `<tr>
      <td class="col-desc"><textarea></textarea></td>
      <td class="col-precio">
        <input type="number" class="precio" oninput="calcular()">
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

/* Auto altura textarea */
document.addEventListener("input", e => {
  if (e.target.tagName === "TEXTAREA") {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
});

/* PDF multipágina + ocultar botones + nombre dinámico */
function descargarPDF() {
  const factura = document.getElementById("factura");
  const { jsPDF } = window.jspdf;

  const tipo = document.getElementById("tipo").value;
  const numero = document.getElementById("numeroDoc").value || "SIN_NUMERO";
  const nombreArchivo = `${tipo}_${numero}.pdf`;

  const ocultar = document.querySelectorAll(".no-pdf");
  ocultar.forEach(el => el.style.display = "none");

  html2canvas(factura, { scale: 2 }).then(canvas => {
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

    ocultar.forEach(el => el.style.display = "flex");
  });
}
