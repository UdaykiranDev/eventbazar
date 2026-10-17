import { useState } from "react";
import { Footer, Navbar } from "../components";
import { loadHomeContent, saveHomeContent } from "../../data/homeContentStorage";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const review = {
      id: `review-${Date.now()}`,
      name: form.get("name").trim(),
      event: form.get("event").trim() || "Event customer",
      rating: Number(form.get("rating")),
      text: form.get("feedback").trim(),
      avatar: "/images/avatar.png",
      isSample: false,
      submittedAt: new Date().toISOString(),
    };
    const content = loadHomeContent();
    saveHomeContent({ ...content, reviews: [...content.reviews, review] });
    event.currentTarget.reset();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="container my-3 py-3">
        <h1 className="text-center">Share your feedback</h1>
        <p className="text-center text-muted">Your feedback will appear in the client reviews.</p>
        <hr />
        <div className="row my-4">
          <div className="col-md-7 col-lg-6 col-sm-10 mx-auto">
            {submitted && <div className="alert alert-success" role="status">Thank you. Your feedback has been added to client reviews.</div>}
            <form onSubmit={submitFeedback}>
              <div className="my-3">
                <label className="form-label" htmlFor="feedback-name">Name</label>
                <input className="form-control" id="feedback-name" name="name" autoComplete="name" required />
              </div>
              <div className="my-3">
                <label className="form-label" htmlFor="feedback-event">Event type</label>
                <input className="form-control" id="feedback-event" name="event" placeholder="Wedding, birthday, corporate event" />
              </div>
              <div className="my-3">
                <label className="form-label" htmlFor="feedback-rating">Rating</label>
                <select className="form-select" id="feedback-rating" name="rating" defaultValue="5">
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>
              <div className="my-3">
                <label className="form-label" htmlFor="feedback-text">Feedback</label>
                <textarea className="form-control" id="feedback-text" name="feedback" rows={5} required />
              </div>
              <div className="text-center">
                <button className="my-2 px-4 btn btn-dark" type="submit">Post feedback</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
