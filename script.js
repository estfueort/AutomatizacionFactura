function cambiarTipo() {
  document.getElementById("tipoTitulo").innerText =
    document.getElementById("tipo").value;
}

function agregarFila() {
  document.getElementById("tablaProductos").insertAdjacentHTML(
    "beforeend",
    `<tr>
      <td><textarea class="descripcion" placeholder="Descripción"></textarea></td>
      <td><input type="number" class="precio" placeholder="Precio €" oninput="calcular()"></td>
    </tr>`
  );
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

/* Textarea auto-altura */
document.addEventListener("input", e => {
  if (e.target.tagName === "TEXTAREA") {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
});

/* PDF */
function descargarPDF() {
  const factura = document.getElementById("factura");
  const { jsPDF } = window.jspdf;

  html2canvas(factura, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    pdf.save("factura.pdf");
  });
}
