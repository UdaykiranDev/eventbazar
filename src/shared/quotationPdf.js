import { jsPDF } from "jspdf";
import quoteTemplate from "../data/quotation.sample.json";

const formatAmount = (amount) => `${quoteTemplate.currency} ${Number(amount || 0).toLocaleString("en-IN")}`;

export const createQuotationPdfFile = (product, location = "Any location") => {
  const document = new jsPDF();
  const quotationNumber = `${quoteTemplate.quotationPrefix}-${Date.now()}`;
  const locationLabel = location && location !== "Any location" ? location : "To be confirmed";
  let cursorY = 20;

  document.setFont("helvetica", "bold");
  document.setFontSize(20);
  document.text(quoteTemplate.documentTitle, 14, cursorY);
  cursorY += 10;
  document.setFont("helvetica", "normal");
  document.setFontSize(10);
  document.text(`Quotation: ${quotationNumber}`, 14, cursorY);
  document.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, cursorY);
  cursorY += 12;

  document.setDrawColor(12, 123, 115);
  document.line(14, cursorY, 196, cursorY);
  cursorY += 12;
  document.setFont("helvetica", "bold");
  document.setFontSize(13);
  document.text(product.title, 14, cursorY);
  cursorY += 7;
  document.setFont("helvetica", "normal");
  document.setFontSize(10);
  document.text(`Category: ${product.category}`, 14, cursorY);
  cursorY += 7;
  document.text(`Event location: ${locationLabel}`, 14, cursorY);
  cursorY += 12;

  document.setFont("helvetica", "bold");
  document.text("Indicative pricing", 14, cursorY);
  cursorY += 8;
  document.setFont("helvetica", "normal");
  document.text(`Sale price: ${formatAmount(product.salePrice)} (one-time)`, 18, cursorY);
  cursorY += 7;
  document.text(
    product.rentalPricePerDay > 0
      ? `Rental price: ${formatAmount(product.rentalPricePerDay)} per day`
      : "Rental price: Not listed",
    18,
    cursorY
  );
  cursorY += 12;

  document.setFont("helvetica", "bold");
  document.text(`Validity: ${quoteTemplate.validityDays} days`, 14, cursorY);
  document.setFont("helvetica", "normal");
  document.text(`Taxes included: ${quoteTemplate.taxesIncluded ? "Yes" : "No"}`, 100, cursorY);
  cursorY += 12;
  document.setFont("helvetica", "bold");
  document.text("Terms", 14, cursorY);
  cursorY += 7;
  document.setFont("helvetica", "normal");
  quoteTemplate.terms.forEach((term) => {
    const lines = document.splitTextToSize(`- ${term}`, 178);
    document.text(lines, 16, cursorY);
    cursorY += lines.length * 5 + 2;
  });
  cursorY += 5;
  document.setFont("helvetica", "bold");
  document.text("Event Bazar", 14, cursorY);
  document.setFont("helvetica", "normal");
  document.text("Final price and availability must be confirmed with the vendor on WhatsApp.", 14, cursorY + 6);

  const safeProductName = product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fileName = `event-bazar-quote-${safeProductName || "product"}.pdf`;
  return new File([document.output("blob")], fileName, { type: "application/pdf" });
};

export const downloadQuotationFile = (file) => {
  const fileUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = file.name;
  downloadLink.click();
  URL.revokeObjectURL(fileUrl);
};