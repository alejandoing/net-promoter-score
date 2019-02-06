<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
export default {
  created() {
    var doc = new jsPDF()

    doc.setFontSize(24)
    doc.text('Reporte General de Valoraciones', 40, 25)
    doc.save('reporte_general.pdf')
  }
}
</script>

