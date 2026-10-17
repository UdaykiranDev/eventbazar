import { getProductInquiryUrl } from "./productInquiry";

const QuoteEnquiry = ({ product, requestType = "sale or rental", location = "Any location", label = "Enquire" }) => {
  const handleEnquiry = () => {
    const chatUrl = getProductInquiryUrl(product, requestType, location, "app", {});
    window.open(chatUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button type="button" className="catalog-whatsapp" onClick={handleEnquiry}>
      <i className="fa fa-whatsapp" aria-hidden="true" />
      {label}
    </button>
  );
};

export default QuoteEnquiry;