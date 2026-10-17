import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="event-hero" aria-labelledby="event-hero-title">
        <img className="event-hero-image" src={`${process.env.PUBLIC_URL}/assets/main.png.jpg`} alt="Colorful floral stage decoration for a celebration" />
        <div className="event-hero-content">
          <div className="event-hero-copy">
            <p className="event-hero-kicker">Event styling · Palasa & Vizianagaram</p>
            <h1 className="event-hero-title" id="event-hero-title">Make room for a little wonder.</h1>
            <p className="event-hero-description">
              Find the decor, floral details, and stage pieces that make your gathering feel like yours. Buy or rent, then confirm your quote with our team.
            </p>
            <Link className="event-hero-link" to="/product">
              Explore event products <i className="fa fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
