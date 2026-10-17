import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { CATALOG_UPDATED_EVENT, flattenCatalog, loadCatalog } from "../../data/catalogStorage";
import QuoteEnquiry from "../../shared/QuoteEnquiry";
import "../components/Products.css";

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

const Product = () => {
  const { id } = useParams();
  const [catalog, setCatalog] = useState(loadCatalog);
  useEffect(() => {
    const refreshCatalog = () => setCatalog(loadCatalog());
    window.addEventListener("storage", refreshCatalog);
    window.addEventListener(CATALOG_UPDATED_EVENT, refreshCatalog);
    return () => {
      window.removeEventListener("storage", refreshCatalog);
      window.removeEventListener(CATALOG_UPDATED_EVENT, refreshCatalog);
    };
  }, []);
  const eventProducts = flattenCatalog(catalog);
  const product = eventProducts.find((item) => item.id === Number(id));
  const relatedProducts = product
    ? eventProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
    : [];
  const productRating = getProductRating(product);

  return (
    <>
      <Navbar />
      {!product ? (
        <main className="container py-5 text-center">
          <h1>Product not found</h1>
          <Link to="/product" className="btn btn-dark mt-3">Browse products</Link>
        </main>
      ) : (
        <main className="container my-5">
          <nav aria-label="Breadcrumb" className="mb-4">
            <Link to="/product">Event products</Link><span className="mx-2">/</span><span>{product.category}</span>
          </nav>
          <div className="row align-items-start g-4">
            <div className="col-md-6">
              <img className="img-fluid w-100" src={product.image} alt={product.title} style={{ maxHeight: "500px", objectFit: "cover" }} />
            </div>
            <div className="col-md-6">
              <p className="catalog-card-category">{product.category}</p>
              <h1 className="display-6">{product.title}</h1>

              <div className="product-review-summary" aria-label={`${productRating.average.toFixed(1)} out of 5 star rating`}>
                <div className="product-review-summary__score">
                  <span>{productRating.average ? productRating.average.toFixed(1) : "0.0"}</span>
                  <small>/ 5</small>
                </div>
                <div className="product-review-summary__meta">
                  <div className="product-review-summary__stars">{productRating.stars}</div>
                  <p>{productRating.isSample ? "Sample review rating" : `${productRating.count} verified customer reviews`}</p>
                </div>
              </div>

              <p className="lead">{product.description}</p>
              <div className="catalog-prices my-4">
                <div><span>Indicative buy price</span><strong>{formatPrice(product.salePrice)}</strong></div>
                {product.rentalPricePerDay > 0 && (
                  <div><span>Indicative rental / day</span><strong>{formatPrice(product.rentalPricePerDay)}</strong></div>
                )}
              </div>
              <p className="text-muted small">Showcase prices only. Final pricing, delivery, setup, and availability are confirmed directly with Event Bazar.</p>
              <div className="product-enquiry-actions">
                <QuoteEnquiry product={product} requestType="purchase" label="Ask to buy" />
                {product.rentalPricePerDay > 0 && (
                  <QuoteEnquiry product={product} requestType="rental" label="Ask to rent" />
                )}
              </div>
            </div>
          </div>

          <section className="my-5 product-review-section" aria-labelledby="reviews-heading">
            <div className="product-review-section__header">
              <h2 id="reviews-heading" className="h3">Customer reviews</h2>
              {productRating.count > 0 && <span>{productRating.average.toFixed(1)} average rating</span>}
            </div>
            {product.reviews.length ? (
              <div className="product-review-list">
                {product.reviews.map((review, index) => (
                  <article key={`${review.name}-${index}`} className="product-review-card">
                    <div className="product-review-card__top">
                      <strong>{review.name}</strong>
                      <span className="product-review-card__stars" aria-label={`${review.rating} out of 5 stars`}>
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            ) : <p className="text-muted border-top pt-3">No customer reviews have been added for this item yet.</p>}
          </section>

          {relatedProducts.length > 0 && (
            <section className="my-5" aria-labelledby="related-heading">
              <h2 id="related-heading" className="h3 mb-4">More in {product.category}</h2>
              <div className="row g-4">
                {relatedProducts.map((item) => (
                  <div key={item.id} className="col-lg-3 col-sm-6">
                    <article className="card catalog-card h-100">
                      <Link to={`/product/${item.id}`} className="catalog-image-link" aria-label={`View ${item.title}`}>
                        <img className="catalog-image" src={item.image} alt={item.title} loading="lazy" />
                      </Link>
                      <div className="catalog-card-body">
                        <p className="catalog-card-category">{item.category}</p>
                        <h3 className="catalog-card-title"><Link to={`/product/${item.id}`}>{item.title}</Link></h3>
                        <div className="catalog-prices">
                          <div><span>Buy</span><strong>{formatPrice(item.salePrice)}</strong></div>
                          {item.rentalPricePerDay > 0 && <div><span>Rent / day</span><strong>{formatPrice(item.rentalPricePerDay)}</strong></div>}
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
      <Footer />
    </>
  );
};

export default Product;
