function cambiarTipo() {
  document.getElementById("tipoTitulo").innerText =
    document.getElementById("tipo").value;
}

function agregarFila() {
  document.getElementById("tablaProductos").insertAdjacentHTML(
    "beforeend",
    `<tr>
      <td><input type="text" placeholder="Descripción"></td>
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

/* PDF compatible móvil + PC */
function descargarPDF() {
  const factura = document.getElementById("factura");
  const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  html2canvas(factura, {
    scale: 2,
    useCORS: true
  }).then(canvas => {

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    if (imgHeight > pageHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, pageHeight);
    } else {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    }

    const tipo = document.getElementById("tipo").value;
    const numero = document.getElementById("numero").value || "0000";
    const nombre = `${tipo}_${numero}.pdf`;

    if (esMovil) {
      pdf.output("dataurlnewwindow"); // 📱 móvil
    } else {
      pdf.save(nombre);               // 💻 PC
    }
  });
}
