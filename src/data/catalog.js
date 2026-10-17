import { flattenCatalog, loadCatalog } from "./catalogStorage";

const categoryData = loadCatalog();

export const productCategories = categoryData.map((group) => group.category);
export const eventProducts = flattenCatalog(categoryData);