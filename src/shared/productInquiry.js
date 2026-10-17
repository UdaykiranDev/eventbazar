const EVENT_BAZAR_WHATSAPP_NUMBER = "918500890225";

export const getProductInquiryUrl = (product, requestType = "sale or rental", location = "Any location", platform = "app", customer = {}) => {
  const locationMessage = location && location !== "Any location" ? ` for my event in ${location}` : "";
  const customerMessage = customer.name ? `\nCustomer: ${customer.name}${customer.phone ? `\nPhone: ${customer.phone}` : ""}` : "";
  const message = `Hello Event Bazar, I am interested in ${product.title} (${product.category})${locationMessage}. Please share availability and the final ${requestType} price.${customerMessage}\nThe quotation PDF is ready to attach.`;
  if (platform === "web") {
    return `https://web.whatsapp.com/send?phone=${EVENT_BAZAR_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${EVENT_BAZAR_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};