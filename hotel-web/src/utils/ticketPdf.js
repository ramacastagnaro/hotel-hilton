// Real PDF ticket generator (jsPDF, vector text only — no html2canvas).
//
// The layout is drawn with jsPDF primitives (rect, line, text) on an A4 page.
// The brand logo is an existing asset (`hotel-web/public/img/logo-hilton.png`);
// when it cannot be loaded the header falls back to a typographic wordmark
// drawn as text, so PDF generation never fails because of the image.
import { jsPDF } from 'jspdf';
import { formatDate, formatPrice } from './format';
import { generateConfirmationCode } from './ticketCode';

// Brand tokens (keep in sync with tailwind.config.js).
const NAVY = [15, 33, 67]; // navy-800
const INK = [10, 26, 53]; // navy-900
const GOLD = [201, 162, 75]; // gold-500
const MUTED = [110, 120, 135];
const ROW_TINT = [243, 244, 246]; // surface-100
const HAIRLINE = [229, 231, 235]; // surface-200

const LOGO_PATH = `${process.env.PUBLIC_URL || ''}/img/logo-hilton.png`;

/** Load the public logo as a data URL. Resolves to `null` when unavailable. */
function loadLogoDataUrl() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof fetch !== 'function') {
      return resolve(null);
    }
    fetch(LOGO_PATH)
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error('logo'))))
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      })
      .catch(() => resolve(null));
  });
}

function drawHeader(doc, pageWidth, margin, logoDataUrl) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 38, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, 38, pageWidth, 1.6, 'F');

  let logoDrawn = false;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', margin, 8, 30, 22, undefined, 'FAST');
      logoDrawn = true;
    } catch (error) {
      logoDrawn = false;
    }
  }

  const textX = logoDrawn ? margin + 36 : margin;
  doc.setFont('times', 'bold');
  doc.setFontSize(logoDrawn ? 17 : 20);
  doc.setTextColor(255, 255, 255);
  doc.text('HOTEL HILTON', textX, logoDrawn ? 19 : 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...GOLD);
  doc.text('T U   E S C A P A D A   D E   L U J O', textX, logoDrawn ? 26 : 27);
}

function drawDetails(doc, pageWidth, margin, reservation) {
  const rows = [
    ['Habitación', reservation.room_name || 'Habitación Hotel Hilton'],
    ['Check-in', formatDate(reservation.start_date) || '—'],
    ['Check-out', formatDate(reservation.end_date) || '—'],
    ['Noches', reservation.nights != null ? String(reservation.nights) : '—'],
    ['Huéspedes', reservation.guests != null ? String(reservation.guests) : '—'],
  ];

  let y = 104;
  doc.setFontSize(11);
  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(...ROW_TINT);
      doc.rect(margin, y - 6, pageWidth - margin * 2, 10, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(label, margin + 4, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...INK);
    doc.text(String(value), pageWidth - margin - 4, y, { align: 'right' });
    y += 10;
  });

  y += 6;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text('TOTAL PAGADO', margin + 4, y + 11);

  doc.setFontSize(19);
  doc.setTextColor(...NAVY);
  doc.text(formatPrice(reservation.total_price), pageWidth - margin - 4, y + 11, {
    align: 'right',
  });
}

/**
 * Build the ticket document. Pure and synchronous except for the already-loaded
 * logo data URL, so it is safe to call from a click handler.
 *
 * @param {object} reservation - Reservation shown on the success page.
 * @param {{ logoDataUrl?: string|null }} [options]
 * @returns {import('jspdf').jsPDF}
 */
export function buildTicketDoc(reservation, { logoDataUrl = null } = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const code = generateConfirmationCode(reservation);

  drawHeader(doc, pageWidth, margin, logoDataUrl);

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text('Comprobante de Reserva', margin, 56);

  // Confirmation code box.
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, 62, pageWidth - margin * 2, 22, 3, 3, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text('NÚMERO DE CONFIRMACIÓN', margin + 6, 70);
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text(code, margin + 6, 80);

  drawDetails(doc, pageWidth, margin, reservation);

  // Footer.
  const footerY = pageHeight - 26;
  doc.setDrawColor(...HAIRLINE);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text('Gracias por elegirnos', margin, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Hotel Hilton · Tu escapada de lujo', margin, footerY + 14);
  doc.text(
    `Emitido el ${formatDate(new Date().toISOString())}`,
    pageWidth - margin,
    footerY + 14,
    { align: 'right' }
  );

  return doc;
}

/**
 * Generate and download the ticket as a `.pdf`.
 * @param {object} reservation
 */
export async function downloadTicketPdf(reservation) {
  const logoDataUrl = await loadLogoDataUrl();
  const doc = buildTicketDoc(reservation, { logoDataUrl });
  doc.save(`Reserva-${generateConfirmationCode(reservation)}.pdf`);
}
