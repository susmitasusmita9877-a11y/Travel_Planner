// client/src/services/pdfExport.js
import jsPDF from 'jspdf';

class PDFExportService {
  /**
   * Export trip details as a beautifully formatted PDF
   */
  async exportTrip(trip) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add new page if needed
    const checkAddPage = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Helper to draw a colored box
    const drawBox = (x, y, width, height, color) => {
      doc.setFillColor(color);
      doc.rect(x, y, width, height, 'F');
    };

    // ===== COVER PAGE =====
    // Gradient-like header (simulated with rectangles)
    drawBox(0, 0, pageWidth, 80, '#3b82f6');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(trip.title || 'My Trip', pageWidth / 2, 35, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(trip.destination || '', pageWidth / 2, 50, { align: 'center' });
    
    // Date range
    if (trip.startDate && trip.endDate) {
      doc.setFontSize(12);
      const dateStr = `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`;
      doc.text(dateStr, pageWidth / 2, 65, { align: 'center' });
    }

    yPosition = 100;

    // ===== TRIP OVERVIEW =====
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip Overview', 20, yPosition);
    yPosition += 10;

    // Draw line under heading
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    // Description
    if (trip.description) {
      doc.setFont('helvetica', 'bold');
      doc.text('Description:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const splitDescription = doc.splitTextToSize(trip.description, pageWidth - 40);
      doc.text(splitDescription, 20, yPosition);
      yPosition += splitDescription.length * 5 + 5;
    }

    checkAddPage(30);

    // Trip details grid
    const details = [
      { label: 'Duration', value: this.calculateDuration(trip.startDate, trip.endDate) },
      { label: 'Travelers', value: trip.travelers || 1 },
      { label: 'Budget', value: trip.budget ? `$${trip.budget}` : 'Not set' },
      { label: 'Status', value: this.getTripStatus(trip.startDate, trip.endDate) }
    ];

    details.forEach((detail, idx) => {
      const xPos = 20 + (idx % 2) * 90;
      const yPos = yPosition + Math.floor(idx / 2) * 15;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${detail.label}:`, xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(String(detail.value), xPos + 30, yPos);
    });

    yPosition += 35;

    // ===== ITINERARY =====
    if (trip.itinerary && trip.itinerary.length > 0) {
      checkAddPage(40);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Itinerary', 20, yPosition);
      yPosition += 10;
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      trip.itinerary.forEach((item, idx) => {
        checkAddPage(25);
        
        // Day badge
        drawBox(20, yPosition - 5, 15, 8, '#10b981');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(`D${idx + 1}`, 27.5, yPosition, { align: 'center' });
        
        // Activity
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const splitActivity = doc.splitTextToSize(item.activity || '', pageWidth - 50);
        doc.text(splitActivity, 40, yPosition);
        yPosition += Math.max(splitActivity.length * 5, 10);
      });

      yPosition += 10;
    }

    // ===== CHECKLIST =====
    if (trip.checklist && trip.checklist.length > 0) {
      checkAddPage(40);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Checklist', 20, yPosition);
      yPosition += 10;
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      const categories = ['Packing', 'Documents', 'Tasks'];
      categories.forEach(category => {
        const items = trip.checklist.filter(item => item.category === category);
        if (items.length === 0) return;

        checkAddPage(30);
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(category, 20, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        items.forEach(item => {
          checkAddPage(10);
          
          // Checkbox
          doc.setDrawColor(0, 0, 0);
          doc.rect(20, yPosition - 3, 4, 4);
          if (item.done) {
            doc.text('✓', 20.5, yPosition + 1);
          }
          
          doc.text(item.text, 28, yPosition);
          yPosition += 6;
        });

        yPosition += 5;
      });
    }

    // ===== BUDGET & EXPENSES =====
    if (trip.expenses && trip.expenses.length > 0) {
      checkAddPage(40);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Budget & Expenses', 20, yPosition);
      yPosition += 10;
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Calculate totals
      const totalExpenses = trip.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const budget = Number(trip.budget || 0);

      // Summary box
      drawBox(20, yPosition - 5, pageWidth - 40, 20, '#f3f4f6');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Spent: $${totalExpenses.toFixed(2)}`, 25, yPosition + 5);
      doc.text(`Budget: $${budget.toFixed(2)}`, 25, yPosition + 12);
      
      if (budget > 0) {
        const remaining = budget - totalExpenses;
        const color = remaining >= 0 ? '#10b981' : '#ef4444';
        doc.setTextColor(color);
        doc.text(`Remaining: $${remaining.toFixed(2)}`, pageWidth - 75, yPosition + 8);
        doc.setTextColor(0, 0, 0);
      }

      yPosition += 30;

      // Expense list
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Expense Details', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      trip.expenses.forEach(expense => {
        checkAddPage(15);
        
        doc.setFont('helvetica', 'bold');
        doc.text(expense.name || 'Unnamed', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`$${Number(expense.amount || 0).toFixed(2)}`, pageWidth - 40, yPosition);
        
        yPosition += 5;
        const details = [expense.category, expense.date].filter(Boolean).join(' • ');
        if (details) {
          doc.setTextColor(100, 100, 100);
          doc.setFontSize(9);
          doc.text(details, 20, yPosition);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          yPosition += 5;
        }
        
        yPosition += 3;
      });
    }

    // ===== FOOTER =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by Travel Planner • Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const filename = `${trip.title?.replace(/[^a-z0-9]/gi, '_') || 'trip'}_itinerary.pdf`;
    doc.save(filename);
  }

  calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return 'Not set';
    const days = Math.max(
      1,
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    );
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  getTripStatus(startDate, endDate) {
    if (!startDate || !endDate) return 'Planning';
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start <= now && end >= now) return 'Active';
    if (end < now) return 'Completed';
    return 'Upcoming';
  }

  /**
   * Export trip as calendar file (iCal format)
   */
  exportToCalendar(trip) {
    if (!trip.startDate || !trip.endDate) {
      alert('Trip must have start and end dates to export to calendar');
      return;
    }

    const formatDate = (date) => {
      return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Travel Planner//EN
BEGIN:VEVENT
UID:${Date.now()}@travelplanner.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(trip.startDate)}
DTEND:${formatDate(trip.endDate)}
SUMMARY:${trip.title}
DESCRIPTION:${trip.description || 'Travel itinerary'}
LOCATION:${trip.destination}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.title?.replace(/[^a-z0-9]/gi, '_') || 'trip'}.ics`;
    a.click();
  }
}

export default new PDFExportService();