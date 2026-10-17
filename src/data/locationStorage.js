import defaultLocations from "./locations.json";

export const LOCATION_STORAGE_KEY = "eventBazarLocations";
export const LOCATIONS_UPDATED_EVENT = "event-bazar-locations-updated";

export const loadLocations = () => {
  if (typeof window === "undefined") return defaultLocations;
  try {
    const saved = window.localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!saved) return defaultLocations;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultLocations;
  } catch {
    return defaultLocations;
  }
};

export const saveLocations = (locations) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locations));
  window.dispatchEvent(new Event(LOCATIONS_UPDATED_EVENT));
};