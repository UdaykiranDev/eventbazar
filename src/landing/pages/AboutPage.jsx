import React from 'react'
import { Footer, Navbar } from "../components";
import publicAssetUrl from "../../shared/publicAssetUrl";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          At Event Bazar, we transform special milestones into visually stunning, unforgettable celebrations. 
          Based out of Palasa and serving clients across the Vizianagaram region, we specialize in premium flower styling, custom backdrops, and end-to-end event decoration for gatherings of every scale.   
          Whether you need traditional floral mandaps, contemporary stage setups, vibrant haldi-mehendi corners, or creative birthday themes, we combine high-quality materials with affordable pricing to deliver the best value for your big day. 
        </p>

        <h2 className="text-center py-4">Our Products</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={publicAssetUrl("/images/et-bazar/products/wedding-decor.jpg")} alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Wedding & Reception</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={publicAssetUrl("/images/et-bazar/products/flolar-party.jpg")} alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Haldi & Mehendi</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={publicAssetUrl("/images/et-bazar/products/birthday-decor.jpg")} alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Birthdays</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img className="card-img-top img-fluid" src={publicAssetUrl("/images/et-bazar/products/floral-decor.jpg")} alt="" height={160} />
              <div className="card-body">
                <h5 className="card-title text-center">Floral Decor</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage