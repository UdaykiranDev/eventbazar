import React from "react";

const Footer = () => {
  const serviceLinks = [
    "Explore Vendors By Category",
    "Explore Vendors By Event Type",
    "Explore Event Venues",
    "Event Buddy",
    "Blogs",
  ];

  const cities = ["Ahmedabad", "Goa", "Mumbai", "New Delhi", "Surat", "Udaipur"];

  const aboutLinks = ["Our Story", "Become a vendor", "Careers", "FAQ's", "Contact Us"];

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0d7bb3 0%, #0b6ea1 100%)",
        color: "#fff",
        paddingTop: "28px",
        marginTop: "40px",
      }}
    >
      <div className="container-fluid" style={{ maxWidth: "1440px", padding: "0 20px" }}>
        <div className="row align-items-start justify-content-between">
          <div className="col-lg-3 col-md-12 mb-4">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                  color: "#fff",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "2.5rem", fontWeight: "900" }}>E</span>
                <span style={{ fontSize: "2rem", fontWeight: "700" }}>vent</span>
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  marginLeft: "4px",
                  color: "#fff",
                }}
              >
                Bazar.com
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
              {[
                { icon: "fa-instagram", bg: "#fff" },
                { icon: "fa-linkedin", bg: "#fff" },
                { icon: "fa-facebook", bg: "#fff" },
                { icon: "fa-pinterest-p", bg: "#fff" },
                { icon: "fa-x-twitter", bg: "#fff" },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0d7bb3",
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  }}
                >
                  <i className={`fa ${item.icon}`} aria-hidden="true" />
                </div>
              ))}
            </div>

            <div style={{ color: "rgba(255,255,255,0.9)", lineHeight: "1.7", fontSize: "0.95rem" }}>
              <div>EventBazar.com, B-912,</div>
              <div>Mondeal Square, Prahladnagar,</div>
              <div>Ahmedabad, Gujarat, 380015</div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <div
                style={{
                  background: "#000",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "0.72rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: "118px",
                }}
              >
                <i className="fa fa-apple" style={{ fontSize: "1.2rem" }} />
                <div>
                  <div style={{ fontSize: "0.58rem", opacity: 0.8 }}>Download on the</div>
                  <div style={{ fontWeight: "700" }}>App Store</div>
                </div>
              </div>

              <div
                style={{
                  background: "#000",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "0.72rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: "118px",
                }}
              >
                <i className="fa fa-play" style={{ fontSize: "0.9rem" }} />
                <div>
                  <div style={{ fontSize: "0.58rem", opacity: 0.8 }}>GET IT ON</div>
                  <div style={{ fontWeight: "700" }}>Google Play</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block",
                width: "100%",
              }}
            >
              Our Services
            </h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.2" }}>
              {serviceLinks.map((item, index) => (
                <li key={index}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block",
                width: "100%",
              }}
            >
              Cities
            </h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.2" }}>
              {cities.map((city, index) => (
                <li key={index}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block",
                width: "100%",
              }}
            >
              About
            </h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.2" }}>
              {aboutLinks.map((item, index) => (
                <li key={index}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
            <h5
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block",
                width: "100%",
              }}
            >
              For Vendors
            </h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.2" }}>
              <li>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                  vendors@eventbazar.com
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                  +91 74360 44777
                </a>
              </li>
            </ul>

            <h5
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                marginTop: "26px",
                marginBottom: "14px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block",
                width: "100%",
              }}
            >
              For Customers
            </h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2.2" }}>
              <li>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                  info@eventbazar.com
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
                  +91 74350 44777
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.35)",
          marginTop: "18px",
          padding: "14px 0",
          background: "rgba(0,0,0,0.06)",
        }}
      >
        <div className="container-fluid" style={{ maxWidth: "1440px", padding: "0 20px" }}>
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6 col-sm-12">
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", color: "rgba(255,255,255,0.9)" }}>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>Privacy Policy</a>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>Terms & Conditions</a>
                <a href="#" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>Disclaimer</a>
              </div>
            </div>

            <div className="col-md-6 col-sm-12 text-md-end text-start mt-2 mt-md-0">
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.92rem" }}>
                © 2026 Event Bazar Private Limited. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
