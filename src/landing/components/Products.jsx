import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATALOG_UPDATED_EVENT, flattenCatalog, loadCatalog } from "../../data/catalogStorage";
import { HOME_CONTENT_UPDATED_EVENT, loadHomeContent } from "../../data/homeContentStorage";
import { LOCATIONS_UPDATED_EVENT, loadLocations } from "../../data/locationStorage";
import QuoteEnquiry from "../../shared/QuoteEnquiry";
import { createQuotationPdfFile, downloadQuotationFile } from "../../shared/quotationPdf";
import publicAssetUrl from "../../shared/publicAssetUrl";
import "./Products.css";

const PAGE_SIZE = 12;
const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;
const getProductRating = (product) => {
  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
  const defaultAverage = Number(product?.rating || product?.averageRating || 4.6);

  if (!reviews.length) {
    return {
      average: defaultAverage,
      count: 0,
      isSample: true,
      stars: Array.from({ length: 5 }, (_, index) => (index < Math.round(defaultAverage) ? "★" : "☆")).join(""),
    };
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  const average = total / reviews.length;

  return {
    average,
    count: reviews.length,
    isSample: false,
    stars: Array.from({ length: 5 }, (_, index) => (index < Math.round(average) ? "★" : "☆")).join(""),
  };
};

const Products = ({ preview = false }) => {
  const [catalog, setCatalog] = useState(loadCatalog);
  const [homeContent, setHomeContent] = useState(loadHomeContent);
  const [locations, setLocations] = useState(loadLocations);
  const [location, setLocation] = useState("Any location");
  const [draftLocation, setDraftLocation] = useState("Any location");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [draftCategory, setDraftCategory] = useState("All categories");
  const [selectedService, setSelectedService] = useState("All services");
  const [draftService, setDraftService] = useState("All services");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [showAllReels, setShowAllReels] = useState(false);
  const [galleryRail, setGalleryRail] = useState(null);
  const [reviewRail, setReviewRail] = useState(null);
  useEffect(() => {
    const refreshCatalog = () => setCatalog(loadCatalog());
    const refreshHomeContent = () => setHomeContent(loadHomeContent());
    const refreshLocations = () => setLocations(loadLocations());
    window.addEventListener("storage", refreshCatalog);
    window.addEventListener(CATALOG_UPDATED_EVENT, refreshCatalog);
    window.addEventListener("storage", refreshHomeContent);
    window.addEventListener(HOME_CONTENT_UPDATED_EVENT, refreshHomeContent);
    window.addEventListener("storage", refreshLocations);
    window.addEventListener(LOCATIONS_UPDATED_EVENT, refreshLocations);
    return () => {
      window.removeEventListener("storage", refreshCatalog);
      window.removeEventListener(CATALOG_UPDATED_EVENT, refreshCatalog);
      window.removeEventListener("storage", refreshHomeContent);
      window.removeEventListener(HOME_CONTENT_UPDATED_EVENT, refreshHomeContent);
      window.removeEventListener("storage", refreshLocations);
      window.removeEventListener(LOCATIONS_UPDATED_EVENT, refreshLocations);
    };
  }, []);
  const productCategories = catalog.map((group) => group.category);
  const eventProducts = flattenCatalog(catalog);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = eventProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All categories" || product.category === selectedCategory;
    const matchesService = selectedService === "All services" ||
      (selectedService === "For rent" ? product.rentalPricePerDay > 0 : product.salePrice > 0);
    const matchesSearch = !normalizedSearch ||
      `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesService && matchesSearch;
  });
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pageProducts = preview
    ? productCategories.map((category) => eventProducts.find((product) => product.category === category))
    : filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstResult = filteredProducts.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastResult = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);

  const applyFilters = () => {
    setLocation(draftLocation);
    setSelectedCategory(draftCategory);
    setSelectedService(draftService);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const runAssistantSearch = () => {
    setSearchTerm(assistantQuery.trim());
    setSelectedCategory("All categories");
    setDraftCategory("All categories");
    setSelectedService("All services");
    setDraftService("All services");
    setCurrentPage(1);
    setAssistantOpen(false);
  };

  return (
    <main className="container my-4 py-3 products-page">
      <header className="products-header">
        <p className="products-eyebrow">{preview ? "A few things for your next celebration" : "Event Bazar marketplace"}</p>
        <h1 className="products-title">{preview ? "Popular event products" : "Event products"}</h1>
        {!preview && <p className="products-intro">Browse event decor and essentials available to buy or rent.</p>}
        {preview && <Link className="catalog-view-all" to="/product">See all 100 products <i className="fa fa-arrow-right" aria-hidden="true" /></Link>}
      </header>

      {!preview && <section className="catalog-controls" aria-label="Product search">
        <div className="catalog-filter-bar">
          <label className="catalog-filter-field">
            <i className="fa fa-map-marker" aria-hidden="true" />
            <select value={draftLocation} onChange={(event) => setDraftLocation(event.target.value)} aria-label="Location">
              {["Any location", ...locations.map((item) => item.name)].map((option) => <option key={option}>{option}</option>)}
            </select>
            <i className="fa fa-angle-down catalog-filter-chevron" aria-hidden="true" />
          </label>
          <label className="catalog-filter-field">
            <i className="fa fa-th-large" aria-hidden="true" />
            <select value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)} aria-label="Category">
              <option>All categories</option>
              {productCategories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <i className="fa fa-angle-down catalog-filter-chevron" aria-hidden="true" />
          </label>
          <label className="catalog-filter-field">
            <i className="fa fa-search" aria-hidden="true" />
            <select value={draftService} onChange={(event) => setDraftService(event.target.value)} aria-label="Services">
              {["All services", "For sale", "For rent"].map((option) => <option key={option}>{option}</option>)}
            </select>
            <i className="fa fa-angle-down catalog-filter-chevron" aria-hidden="true" />
          </label>
        </div>
        <div className="catalog-search-actions">
          <button type="button" className="catalog-search-button" onClick={applyFilters}>
            <i className="fa fa-search" aria-hidden="true" /> Search
          </button>
          <button type="button" className="catalog-assistant-button" onClick={() => setAssistantOpen(true)}>
            <i className="fa fa-magic" aria-hidden="true" /> AI Assistant
          </button>
        </div>
        {location !== "Any location" && <p className="catalog-location-note">Availability for {location} is confirmed directly with the vendor.</p>}
      </section>}

      {!preview && <div className="catalog-summary" aria-live="polite">
        <span>{filteredProducts.length} products</span>
        {filteredProducts.length > 0 && <span>Showing {firstResult}–{lastResult}</span>}
        <span className="showcase-note">Showcase prices; final quote and availability confirmed on WhatsApp.</span>
      </div>}

      {pageProducts.length ? (
        <div className="row g-4">
          {pageProducts.map((product) => {
            const productRating = getProductRating(product);

            return (
              <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <article className="card catalog-card h-100">
                  <Link to={`/product/${product.id}`} className="catalog-image-link" aria-label={`View ${product.title}`}>
                    <img src={publicAssetUrl(product.image)} alt={product.title} className="catalog-image" loading="lazy" />
                    <span className="catalog-image-badge">{product.category}</span>
                    <span className="catalog-image-rating" aria-label={`${productRating.average.toFixed(1)} out of 5 stars`}>
                      <i className="fa fa-star" aria-hidden="true" /> {productRating.average.toFixed(1)}
                    </span>
                  </Link>
                  <div className="catalog-card-body">
                    <div className="catalog-card-head">
                      <p className="catalog-card-category">{product.category}</p>
                      <div className="catalog-card-review-score" aria-label={`${productRating.average.toFixed(1)} out of 5 stars`}>
                        <span className="catalog-card-stars">{productRating.stars}</span>
                        <span className="catalog-card-review-count">{productRating.isSample ? "Sample" : `(${productRating.count})`}</span>
                      </div>
                    </div>
                    <h2 className="catalog-card-title"><Link to={`/product/${product.id}`}>{product.title}</Link></h2>
                    <p className="catalog-card-description">{product.description}</p>
                    <div className="catalog-prices">
                      <div><span>Buy</span><strong>{formatPrice(product.salePrice)}</strong></div>
                      {product.rentalPricePerDay > 0 ? (
                        <div><span>Rent / day</span><strong>{formatPrice(product.rentalPricePerDay)}</strong></div>
                      ) : (
                        <div><span>Rental</span><strong>Not listed</strong></div>
                      )}
                    </div>
                    <div className="catalog-card-actions">
                      <Link to={`/product/${product.id}`} className="catalog-view-button">View</Link>
                      <button
                        type="button"
                        className="catalog-download-button"
                        onClick={(event) => {
                          event.preventDefault();
                          const generatedFile = createQuotationPdfFile(product, location);
                          downloadQuotationFile(generatedFile);
                        }}
                      >
                        Download PDF
                      </button>
                    </div>
                    <div className="catalog-card-footer">
                      <QuoteEnquiry product={product} location={location} label="Enquire" />
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="catalog-empty">
          <i className="fa fa-search" aria-hidden="true" />
          <h2>No matching products</h2>
          <p>Try a different search term or category.</p>
          <button type="button" className="btn btn-outline-dark" onClick={() => {
            setSearchTerm("");
            setAssistantQuery("");
            setSelectedCategory("All categories");
            setDraftCategory("All categories");
            setSelectedService("All services");
            setDraftService("All services");
            setLocation("Any location");
            setDraftLocation("Any location");
            setCurrentPage(1);
          }}>
            Clear filters
          </button>
        </div>
      )}

      {preview && <div className="catalog-more-wrap"><Link to="/product" className="catalog-view-all">Browse all products <i className="fa fa-arrow-right" aria-hidden="true" /></Link></div>}

      {preview && (
        <>
          <section className="home-content-section" aria-labelledby="instagram-gallery-title">
            <header className="home-content-heading">
              <div>
                <h2 id="instagram-gallery-title">Trend Gallery</h2>
                <p>Explore event moments shared by our vendors.</p>
              </div>
              <button type="button" className="home-section-action" onClick={() => setShowAllReels((shown) => !shown)}>
                {showAllReels ? "Show less" : "View all"}
              </button>
            </header>
            <h3 className="home-subheading">Instagram videos</h3>
            <div className={showAllReels ? "instagram-gallery is-expanded" : "instagram-gallery"} ref={setGalleryRail}>
              {homeContent.gallery.map((reel) => (
                <a className="instagram-reel" key={reel.id} href={reel.instagramUrl} target="_blank" rel="noreferrer">
                  <img src={publicAssetUrl(reel.thumbnail)} alt={reel.title} loading="lazy" />
                  <span className="instagram-reel-shade" />
                  <span className="instagram-play" aria-hidden="true"><i className="fa fa-play" /></span>
                  <span className="instagram-reel-copy"><strong>{reel.title}</strong><small>{reel.vendor}{reel.postedAt ? ` · ${reel.postedAt}` : ""}</small></span>
                  <span className="instagram-mark" aria-label="Instagram"><i className="fa fa-instagram" /></span>
                </a>
              ))}
            </div>
            {!showAllReels && homeContent.gallery.length > 2 && (
              <div className="home-rail-controls">
                <button type="button" aria-label="Scroll Instagram gallery left" onClick={() => galleryRail?.scrollBy({ left: -250, behavior: "smooth" })}><i className="fa fa-angle-left" /></button>
                <button type="button" aria-label="Scroll Instagram gallery right" onClick={() => galleryRail?.scrollBy({ left: 250, behavior: "smooth" })}><i className="fa fa-angle-right" /></button>
              </div>
            )}
          </section>

          <section className="home-content-section reviews-section" aria-labelledby="client-reviews-title">
            <header className="home-content-heading centered">
              <div>
                <h2 id="client-reviews-title">Happy clients of EventBazar.com</h2>
                <p>Stories from event creators and planners</p>
              </div>
            </header>
            {homeContent.reviews.length ? (
              <>
                <div className="client-review-rail" ref={setReviewRail}>
                  {homeContent.reviews.map((review) => (
                    <article className="client-review-card" key={review.id}>
                      <img className="client-review-avatar" src={publicAssetUrl(review.avatar)} alt="" loading="lazy" />
                      <div className="client-review-name">{review.name}</div>
                      <div className="client-review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                      <p>{review.text}</p>
                      <small>{review.event}{review.isSample ? " · Sample review" : ""}</small>
                    </article>
                  ))}
                </div>
                {homeContent.reviews.length > 2 && (
                  <div className="home-rail-controls review-controls">
                    <button type="button" aria-label="Scroll client reviews left" onClick={() => reviewRail?.scrollBy({ left: -360, behavior: "smooth" })}><i className="fa fa-angle-left" /></button>
                    <button type="button" aria-label="Scroll client reviews right" onClick={() => reviewRail?.scrollBy({ left: 360, behavior: "smooth" })}><i className="fa fa-angle-right" /></button>
                  </div>
                )}
              </>
            ) : <p className="text-center text-muted">No client reviews have been added yet.</p>}
          </section>
        </>
      )}

      {!preview && pageCount > 1 && (
        <nav className="catalog-pagination" aria-label="Product pages">
          <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page">
            <i className="fa fa-angle-left" aria-hidden="true" /> Previous
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={currentPage === page ? "is-current" : ""}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button type="button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount} aria-label="Next page">
            Next <i className="fa fa-angle-right" aria-hidden="true" />
          </button>
        </nav>
      )}
      {assistantOpen && (
        <div className="catalog-assistant-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAssistantOpen(false); }}>
          <section className="catalog-assistant-dialog" role="dialog" aria-modal="true" aria-labelledby="catalog-assistant-title">
            <div className="catalog-assistant-heading">
              <span><i className="fa fa-magic" aria-hidden="true" /></span>
              <button type="button" aria-label="Close AI Assistant" onClick={() => setAssistantOpen(false)}><i className="fa fa-times" /></button>
            </div>
            <h2 id="catalog-assistant-title">What are you planning?</h2>
            <p>Describe the event item you need, such as “floral stage backdrop” or “lighting for rent”.</p>
            <form onSubmit={(event) => { event.preventDefault(); runAssistantSearch(); }}>
              <input autoFocus type="search" value={assistantQuery} onChange={(event) => setAssistantQuery(event.target.value)} placeholder="Tell us what you are looking for" aria-label="Describe products to find" />
              <button type="submit" disabled={!assistantQuery.trim()}>Find products</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default Products;
