import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Genetic, LogEntry, CultivationSession } from '@/types/genetics';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const exportToPDF = (
  genetic: Genetic,
  logs: LogEntry[],
  session: CultivationSession | undefined
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(34, 139, 34);
  doc.text('Mi Cultivo - Bitácora', pageWidth / 2, 20, { align: 'center' });
  
  // Genetic info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${genetic.name}`, pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Banco: ${genetic.bank}`, pageWidth / 2, 42, { align: 'center' });
  
  // Session info
  let yPos = 55;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Información del Cultivo', 14, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  if (session) {
    const startDate = format(new Date(session.startDate), 'dd/MM/yyyy', { locale: es });
    doc.text(`Fecha de inicio: ${startDate}`, 14, yPos);
    yPos += 6;
    
    if (session.endDate) {
      const endDate = format(new Date(session.endDate), 'dd/MM/yyyy', { locale: es });
      doc.text(`Fecha de finalización: ${endDate}`, 14, yPos);
      yPos += 6;
    } else {
      doc.text('Estado: En cultivo', 14, yPos);
      yPos += 6;
    }
    
    if (session.notes) {
      doc.text(`Notas: ${session.notes}`, 14, yPos);
      yPos += 6;
    }
  } else {
    doc.text('No hay cultivo activo', 14, yPos);
    yPos += 6;
  }
  
  // Genetic specifications
  yPos += 5;
  doc.setFontSize(12);
  doc.text('Especificaciones de la Genética', 14, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  const specs = [
    ['Familia', genetic.family],
    ['Tiempo de Floración', genetic.flowering],
    ['Rendimiento', genetic.yield],
    ['THC', genetic.thc],
    ['Sabor', genetic.flavor],
  ];
  
  specs.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, 14, yPos);
    yPos += 5;
  });
  
  // Log entries table
  if (logs.length > 0) {
    yPos += 10;
    doc.setFontSize(12);
    doc.text('Entradas de Bitácora', 14, yPos);
    yPos += 5;
    
    const tableData = logs.map(log => [
      format(new Date(log.date), 'dd/MM/yyyy', { locale: es }),
      log.stage,
      log.observations.substring(0, 50) + (log.observations.length > 50 ? '...' : ''),
      log.height ? `${log.height} cm` : '-',
      log.ph ? log.ph.toString() : '-',
      log.ec ? log.ec.toString() : '-',
      log.temperature ? `${log.temperature}°C` : '-',
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Fecha', 'Etapa', 'Observaciones', 'Altura', 'pH', 'EC', 'Temp']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 25 },
        2: { cellWidth: 60 },
        3: { cellWidth: 18 },
        4: { cellWidth: 15 },
        5: { cellWidth: 15 },
        6: { cellWidth: 18 },
      },
    });
  } else {
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('No hay entradas en la bitácora', 14, yPos);
  }
  
  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    );
  }
  
  // Save PDF
  const fileName = `bitacora_${genetic.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
};
