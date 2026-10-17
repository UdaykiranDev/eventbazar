import defaultContent from "./homeContent.json";

export const HOME_CONTENT_STORAGE_KEY = "eventBazarHomeContent";
export const HOME_CONTENT_UPDATED_EVENT = "event-bazar-home-content-updated";

export const loadHomeContent = () => {
  if (typeof window === "undefined") return defaultContent;
  try {
    const saved = window.localStorage.getItem(HOME_CONTENT_STORAGE_KEY);
    if (!saved) return defaultContent;
    const parsed = JSON.parse(saved);
    return {
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : defaultContent.gallery,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : defaultContent.reviews,
    };
  } catch {
    return defaultContent;
  }
};

export const saveHomeContent = (content) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOME_CONTENT_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(HOME_CONTENT_UPDATED_EVENT));
};