import defaultCatalog from "./eventCatalog.json";

export const CATALOG_STORAGE_KEY = "eventBazarCatalog";
export const CATALOG_UPDATED_EVENT = "event-bazar-catalog-updated";

export const loadCatalog = () => {
  if (typeof window === "undefined") return defaultCatalog;

  try {
    const storedCatalog = window.localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!storedCatalog) return defaultCatalog;
    const parsedCatalog = JSON.parse(storedCatalog);
    return Array.isArray(parsedCatalog) ? parsedCatalog : defaultCatalog;
  } catch {
    return defaultCatalog;
  }
};

export const saveCatalog = (catalog) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
  window.dispatchEvent(new Event(CATALOG_UPDATED_EVENT));
};

export const flattenCatalog = (catalog) =>
  catalog.flatMap((group) =>
    group.products.map((product) => ({
      ...product,
      category: group.category,
      description: product.description || group.description,
      reviews: product.reviews || [],
    }))
  );