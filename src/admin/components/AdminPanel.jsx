import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { flattenCatalog, loadCatalog, saveCatalog } from "../../data/catalogStorage";
import { HOME_CONTENT_UPDATED_EVENT, loadHomeContent, saveHomeContent } from "../../data/homeContentStorage";
import { LOCATIONS_UPDATED_EVENT, loadLocations, saveLocations } from "../../data/locationStorage";
import "./AdminPanel.css";

const USERS_STORAGE_KEY = "eventBazarSampleUsers";
const sampleUsers = [
  { id: "USR-1001", name: "Priya Sharma", email: "priya.sharma@example.com", phone: "+91 98765 43210", role: "Customer", status: "Active" },
  { id: "USR-1002", name: "Arjun Reddy", email: "arjun.reddy@example.com", phone: "+91 98765 43211", role: "Customer", status: "Active" },
  { id: "USR-1003", name: "Sana Khan", email: "sana.khan@example.com", phone: "+91 98765 43212", role: "Customer", status: "Active" },
  { id: "USR-1004", name: "Rahul Varma", email: "rahul.varma@example.com", phone: "+91 98765 43213", role: "Vendor", status: "Pending" },
  { id: "USR-1005", name: "Meera Patel", email: "meera.patel@example.com", phone: "+91 98765 43214", role: "Customer", status: "Active" },
];

const loadUsers = () => {
  try {
    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : sampleUsers;
  } catch {
    return sampleUsers;
  }
};

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const emptyProduct = (category) => ({ title: "", category, description: "", salePrice: "", rentalPricePerDay: "", image: "/images/et-bazar/products/wedding-decor.jpg" });

function AdminPanel() {
  const [section, setSection] = useState("overview");
  const [catalog, setCatalog] = useState(loadCatalog);
  const [homeContent, setHomeContent] = useState(loadHomeContent);
  const [locations, setLocations] = useState(loadLocations);
  const [users, setUsers] = useState(loadUsers);
  const [productSearch, setProductSearch] = useState("");
  const [productForm, setProductForm] = useState(null);
  const [categoryForm, setCategoryForm] = useState(null);
  const [userForm, setUserForm] = useState(null);
  const [locationForm, setLocationForm] = useState(null);
  const [contentForm, setContentForm] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const refreshCatalog = () => setCatalog(loadCatalog());
    const refreshHomeContent = () => setHomeContent(loadHomeContent());
    const refreshLocations = () => setLocations(loadLocations());
    const refreshUsers = () => setUsers(loadUsers());
    window.addEventListener("storage", refreshCatalog);
    window.addEventListener("event-bazar-catalog-updated", refreshCatalog);
    window.addEventListener("storage", refreshHomeContent);
    window.addEventListener(HOME_CONTENT_UPDATED_EVENT, refreshHomeContent);
    window.addEventListener("storage", refreshLocations);
    window.addEventListener(LOCATIONS_UPDATED_EVENT, refreshLocations);
    window.addEventListener("storage", refreshUsers);
    return () => {
      window.removeEventListener("storage", refreshCatalog);
      window.removeEventListener("event-bazar-catalog-updated", refreshCatalog);
      window.removeEventListener("storage", refreshHomeContent);
      window.removeEventListener(HOME_CONTENT_UPDATED_EVENT, refreshHomeContent);
      window.removeEventListener("storage", refreshLocations);
      window.removeEventListener(LOCATIONS_UPDATED_EVENT, refreshLocations);
      window.removeEventListener("storage", refreshUsers);
    };
  }, []);

  const products = useMemo(() => flattenCatalog(catalog), [catalog]);
  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase())
  );
  const customerCount = users.filter((user) => user.role === "Customer").length;

  const persistCatalog = (nextCatalog, message) => {
    setCatalog(nextCatalog);
    saveCatalog(nextCatalog);
    setNotice(message);
  };

  const persistHomeContent = (nextContent, message) => {
    setHomeContent(nextContent);
    saveHomeContent(nextContent);
    setNotice(message);
  };

  const persistLocations = (nextLocations, message) => {
    setLocations(nextLocations);
    saveLocations(nextLocations);
    setNotice(message);
  };

  const saveHomeContentItem = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = contentForm.type;
    const currentItems = homeContent[type];
    const item = type === "gallery"
      ? {
          id: contentForm.id || `reel-${Date.now()}`,
          title: form.get("title").trim(),
          vendor: form.get("vendor").trim(),
          thumbnail: form.get("thumbnail").trim(),
          instagramUrl: form.get("instagramUrl").trim(),
          postedAt: form.get("postedAt").trim(),
        }
      : {
          id: contentForm.id || `review-${Date.now()}`,
          name: form.get("name").trim(),
          event: form.get("event").trim(),
          rating: Number(form.get("rating")),
          text: form.get("text").trim(),
          avatar: form.get("avatar").trim() || "/images/avatar.png",
          isSample: contentForm.isSample ?? true,
          ...(contentForm.submittedAt ? { submittedAt: contentForm.submittedAt } : {}),
        };
    const nextItems = contentForm.id
      ? currentItems.map((existing) => existing.id === contentForm.id ? item : existing)
      : [...currentItems, item];
    persistHomeContent({ ...homeContent, [type]: nextItems }, `${type === "gallery" ? "Instagram post" : "Review"} ${contentForm.id ? "updated" : "created"}.`);
    setContentForm(null);
  };

  const deleteHomeContentItem = (type, item) => {
    const label = type === "gallery" ? "Instagram post" : "review";
    if (!window.confirm(`Delete this ${label}?`)) return;
    persistHomeContent({
      ...homeContent,
      [type]: homeContent[type].filter((entry) => entry.id !== item.id),
    }, `${label} deleted.`);
  };

  const saveProduct = (event) => {
    event.preventDefault();
    if (!productForm.title.trim() || !productForm.category || !productForm.salePrice) return;
    let nextCatalog = catalog.map((group) => ({ ...group, products: [...group.products] }));
    let targetGroup = nextCatalog.find((group) => group.category === productForm.category);
    if (!targetGroup) {
      targetGroup = { category: productForm.category, description: "Products and services for event styling.", products: [] };
      nextCatalog.push(targetGroup);
    }
    const { id, category, ...values } = productForm;
    if (id) {
      nextCatalog = nextCatalog.map((group) => ({
        ...group,
        products: group.products.filter((product) => product.id !== id),
      }));
      targetGroup = nextCatalog.find((group) => group.category === category);
    }
    targetGroup.products.push({
      ...values,
      id: id || Math.max(0, ...products.map((product) => product.id)) + 1,
      title: values.title.trim(),
      salePrice: Number(values.salePrice),
      rentalPricePerDay: Number(values.rentalPricePerDay || 0),
      image: values.image.trim(),
      reviews: id ? (products.find((product) => product.id === id)?.reviews || []) : [],
    });
    persistCatalog(nextCatalog, id ? "Product updated." : "Product created.");
    setProductForm(null);
  };

  const deleteProduct = (product) => {
    if (!window.confirm(`Delete ${product.title}?`)) return;
    persistCatalog(catalog.map((group) => ({
      ...group,
      products: group.products.filter((item) => item.id !== product.id),
    })), "Product deleted.");
  };

  const saveCategory = (event) => {
    event.preventDefault();
    const name = categoryForm.name.trim();
    if (!name) return;
    const duplicate = catalog.some((group) => group.category.toLowerCase() === name.toLowerCase() && group.category !== categoryForm.originalName);
    if (duplicate) {
      setNotice("A category with that name already exists.");
      return;
    }
    let nextCatalog;
    if (categoryForm.originalName) {
      nextCatalog = catalog.map((group) => group.category === categoryForm.originalName ? { ...group, category: name } : group);
    } else {
      nextCatalog = [...catalog, { category: name, description: "Products and services for event styling.", products: [] }];
    }
    persistCatalog(nextCatalog, categoryForm.originalName ? "Category updated." : "Category created.");
    setCategoryForm(null);
  };

  const deleteCategory = (group) => {
    if (group.products.length) {
      setNotice("Move or delete this category's products before deleting the category.");
      return;
    }
    if (!window.confirm(`Delete the empty category ${group.category}?`)) return;
    persistCatalog(catalog.filter((item) => item.category !== group.category), "Category deleted.");
  };

  const saveUser = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const user = {
      id: userForm.id || `USR-${Date.now()}`,
      name: form.get("name").trim(),
      email: form.get("email").trim(),
      phone: form.get("phone").trim(),
      role: form.get("role"),
      status: userForm.status || "Active",
    };
    const nextUsers = userForm.id
      ? users.map((item) => item.id === userForm.id ? user : item)
      : [...users, user];
    setUsers(nextUsers);
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    setUserForm(null);
    setNotice(userForm.id ? "Sample user updated." : "Sample user added.");
  };

  const saveLocation = (event) => {
    event.preventDefault();
    const name = locationForm.name.trim();
    if (!name) return;
    if (locations.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== locationForm.id)) {
      setNotice("A location with that name already exists.");
      return;
    }
    const location = { id: locationForm.id || `location-${Date.now()}`, name };
    const nextLocations = locationForm.id
      ? locations.map((item) => item.id === locationForm.id ? location : item)
      : [...locations, location];
    persistLocations(nextLocations, locationForm.id ? "Location updated." : "Location created.");
    setLocationForm(null);
  };

  const deleteLocation = (location) => {
    if (!window.confirm(`Delete ${location.name} from the location list?`)) return;
    persistLocations(locations.filter((item) => item.id !== location.id), "Location deleted.");
  };

  const changeUserStatus = (user) => {
    const nextUsers = users.map((item) => item.id === user.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item);
    setUsers(nextUsers);
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const removeUser = (user) => {
    if (!window.confirm(`Remove sample user ${user.name}?`)) return;
    const nextUsers = users.filter((item) => item.id !== user.id);
    setUsers(nextUsers);
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    setNotice("Sample user removed.");
  };

  const navigation = [
    { id: "overview", label: "Overview", icon: "fa-home" },
    { id: "products", label: "Products", icon: "fa-cubes" },
    { id: "categories", label: "Categories", icon: "fa-tags" },
    { id: "locations", label: "Locations", icon: "fa-map-marker" },
    { id: "gallery", label: "Instagram gallery", icon: "fa-instagram" },
    { id: "reviews", label: "Client reviews", icon: "fa-star" },
    { id: "users", label: "Users", icon: "fa-users" },
  ];

  const startEditProduct = (product) => setProductForm({
    id: product.id,
    title: product.title,
    category: product.category,
    description: product.description,
    salePrice: product.salePrice,
    rentalPricePerDay: product.rentalPricePerDay,
    image: product.image,
  });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/" className="admin-brand"><span className="admin-brand-mark">EB</span><span>Event Bazar</span></NavLink>
        <nav className="admin-nav" aria-label="Admin sections">
          {navigation.map((item) => (
            <button key={item.id} type="button" className={section === item.id ? "active" : ""} onClick={() => { setSection(item.id); setNotice(""); }}>
              <i className={`fa ${item.icon}`} aria-hidden="true" />{item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer"><NavLink to="/" className="btn btn-outline-light w-100"><i className="fa fa-arrow-left me-2" />Back to store</NavLink></div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div><p className="admin-eyebrow">Event Bazar · Admin workspace</p><h1>{navigation.find((item) => item.id === section)?.label}</h1><p className="admin-subtitle">Manage your showcase catalog and sample customer records.</p></div>
          <div className="admin-profile"><span className="admin-avatar">AD</span><span>Administrator</span></div>
        </header>
        {notice && <div className="alert alert-info py-2" role="status">{notice}</div>}
        <p className="admin-storage-note"><i className="fa fa-info-circle me-2" aria-hidden="true" />Admin changes are saved in this browser only. This demo is not connected to a shared database or account system.</p>

        {section === "overview" && (
          <>
            <section className="admin-stat-grid" aria-label="Catalog summary">
              {([
                { label: "Showcase products", value: products.length, icon: "fa-cubes", tone: "info" },
                { label: "Categories", value: catalog.length, icon: "fa-tags", tone: "primary" },
                { label: "Sample customers", value: customerCount, icon: "fa-users", tone: "success" },
                { label: "Instagram videos", value: homeContent.gallery.length, icon: "fa-instagram", tone: "info" },
                { label: "Client reviews", value: homeContent.reviews.length, icon: "fa-star", tone: "warning" },
              ]).map((stat) => <article className="admin-stat-card" key={stat.label}><div className={`admin-stat-icon ${stat.tone}`}><i className={`fa ${stat.icon}`} /></div><div><p>{stat.label}</p><h2>{stat.value}</h2><small>Current local catalog</small></div></article>)}
            </section>
            <section className="admin-card admin-report-card">
              <div className="admin-card-heading"><div><h3>Products by category</h3><p>Catalog inventory report, not order or sales data.</p></div><button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setSection("products")}>Manage products</button></div>
              <div className="admin-report-list">{catalog.map((group) => {
                const share = products.length ? Math.max(3, Math.round(group.products.length / products.length * 100)) : 0;
                return <div className="admin-report-row" key={group.category}><div><span>{group.category}</span><strong>{group.products.length}</strong></div><div className="admin-report-track"><span style={{ width: `${share}%` }} /></div></div>;
              })}</div>
            </section>
            <section className="row g-4 admin-content-reports">
              <div className="col-lg-6"><article className="admin-card"><div className="admin-card-heading"><div><h3>Instagram gallery report</h3><p>Homepage reel links currently published.</p></div><button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setSection("gallery")}>Manage</button></div><div className="admin-content-metric"><i className="fa fa-instagram" aria-hidden="true" /><strong>{homeContent.gallery.length}</strong><span>video cards</span></div><div className="admin-content-mini-list">{homeContent.gallery.slice(0, 3).map((reel) => <div key={reel.id}><span>{reel.title}</span><small>{reel.vendor}</small></div>)}</div></article></div>
              <div className="col-lg-6"><article className="admin-card"><div className="admin-card-heading"><div><h3>Client reviews report</h3><p>Sample testimonials are marked; verify before publishing.</p></div><button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setSection("reviews")}>Manage</button></div><div className="admin-content-metric"><i className="fa fa-star" aria-hidden="true" /><strong>{homeContent.reviews.length}</strong><span>review entries</span></div><div className="admin-rating-summary">{[5, 4, 3, 2, 1].map((rating) => { const count = homeContent.reviews.filter((review) => review.rating === rating).length; const percent = homeContent.reviews.length ? (count / homeContent.reviews.length) * 100 : 0; return <div className="admin-rating-row" key={rating}><span>{rating} <i className="fa fa-star" /></span><div className="admin-report-track"><span style={{ width: `${percent}%` }} /></div><small>{count}</small></div>; })}</div></article></div>
            </section>
          </>
        )}

        {section === "products" && (
          <section className="admin-card" id="products">
            <div className="admin-card-heading admin-management-heading"><div><h3>Products</h3><p>Create, review, update, or delete showcase listings.</p></div><button type="button" className="btn btn-dark" onClick={() => setProductForm(emptyProduct(catalog[0]?.category || ""))}><i className="fa fa-plus me-2" />Add product</button></div>
            <div className="admin-table-tools"><input className="form-control" type="search" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search product or category" aria-label="Search products" /><span>{filteredProducts.length} products</span></div>
            <div className="table-responsive"><table className="table admin-orders-table align-middle mb-0"><thead><tr><th>Product</th><th>Category</th><th>Buy price</th><th>Rent / day</th><th>Actions</th></tr></thead><tbody>
              {filteredProducts.map((product) => <tr key={product.id}><td><div className="admin-product-cell"><img src={product.image} alt="" /><span>{product.title}</span></div></td><td>{product.category}</td><td>{money(product.salePrice)}</td><td>{product.rentalPricePerDay ? money(product.rentalPricePerDay) : "Not listed"}</td><td className="admin-row-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEditProduct(product)} aria-label={`Edit ${product.title}`}><i className="fa fa-pencil" /></button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.title}`}><i className="fa fa-trash" /></button></td></tr>)}
              {!filteredProducts.length && <tr><td colSpan="5" className="text-center py-4">No products match that search.</td></tr>}
            </tbody></table></div>
          </section>
        )}

        {section === "categories" && (
          <section className="admin-card" id="categories">
            <div className="admin-card-heading admin-management-heading"><div><h3>Categories</h3><p>Categories containing products cannot be deleted until their products are moved.</p></div><button type="button" className="btn btn-dark" onClick={() => setCategoryForm({ name: "", originalName: "" })}><i className="fa fa-plus me-2" />Add category</button></div>
            <div className="table-responsive"><table className="table admin-orders-table align-middle mb-0"><thead><tr><th>Category</th><th>Products</th><th>Actions</th></tr></thead><tbody>{catalog.map((group) => <tr key={group.category}><td className="fw-semibold">{group.category}</td><td>{group.products.length}</td><td className="admin-row-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setCategoryForm({ name: group.category, originalName: group.category })} aria-label={`Rename ${group.category}`}><i className="fa fa-pencil" /></button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(group)} aria-label={`Delete ${group.category}`}><i className="fa fa-trash" /></button></td></tr>)}</tbody></table></div>
          </section>
        )}

        {section === "locations" && (
          <section className="admin-card" id="locations">
            <div className="admin-card-heading admin-management-heading"><div><h3>Locations</h3><p>These locations appear in the marketplace availability filter.</p></div><button type="button" className="btn btn-dark" onClick={() => setLocationForm({ name: "" })}><i className="fa fa-plus me-2" />Add location</button></div>
            <div className="table-responsive"><table className="table admin-orders-table align-middle mb-0"><thead><tr><th>Location</th><th>Actions</th></tr></thead><tbody>{locations.map((location) => <tr key={location.id}><td className="fw-semibold">{location.name}</td><td className="admin-row-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setLocationForm({ ...location })} aria-label={`Edit ${location.name}`}><i className="fa fa-pencil" /></button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteLocation(location)} aria-label={`Delete ${location.name}`}><i className="fa fa-trash" /></button></td></tr>)}{!locations.length && <tr><td colSpan="2" className="text-center py-4">No locations have been added.</td></tr>}</tbody></table></div>
          </section>
        )}

        {section === "gallery" && (
          <section className="admin-card" id="gallery">
            <div className="admin-card-heading admin-management-heading"><div><h3>Instagram video gallery</h3><p>Homepage cards link to the Instagram reel and use a local thumbnail image.</p></div><button type="button" className="btn btn-dark" onClick={() => setContentForm({ type: "gallery", title: "", vendor: "", thumbnail: "/images/et-bazar/products/wedding-decor.jpg", instagramUrl: "", postedAt: "" })}><i className="fa fa-plus me-2" />Add video</button></div>
            <div className="table-responsive"><table className="table admin-orders-table align-middle mb-0"><thead><tr><th>Preview</th><th>Title / vendor</th><th>Instagram URL</th><th>Actions</th></tr></thead><tbody>{homeContent.gallery.map((reel) => <tr key={reel.id}><td><img className="admin-content-thumb" src={reel.thumbnail} alt="" /></td><td><strong>{reel.title}</strong><small className="d-block text-muted">{reel.vendor}{reel.postedAt ? ` · ${reel.postedAt}` : ""}</small></td><td><a href={reel.instagramUrl} target="_blank" rel="noreferrer">Open reel <i className="fa fa-external-link" /></a></td><td className="admin-row-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setContentForm({ type: "gallery", ...reel })} aria-label={`Edit ${reel.title}`}><i className="fa fa-pencil" /></button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteHomeContentItem("gallery", reel)} aria-label={`Delete ${reel.title}`}><i className="fa fa-trash" /></button></td></tr>)}</tbody></table></div>
          </section>
        )}

        {section === "reviews" && (
          <section className="admin-card" id="reviews">
            <div className="admin-card-heading admin-management-heading"><div><h3>Client reviews</h3><p>Seed records are sample testimonials. Confirm customer permission and authenticity before publishing.</p></div><button type="button" className="btn btn-dark" onClick={() => setContentForm({ type: "reviews", name: "", event: "", rating: 5, text: "", avatar: "/images/avatar.png", isSample: true })}><i className="fa fa-plus me-2" />Add review</button></div>
            <div className="table-responsive"><table className="table admin-orders-table align-middle mb-0"><thead><tr><th>Customer</th><th>Event</th><th>Rating</th><th>Review</th><th>Type</th><th>Actions</th></tr></thead><tbody>{homeContent.reviews.map((review) => <tr key={review.id}><td><div className="admin-product-cell"><img src={review.avatar} alt="" /><span>{review.name}</span></div></td><td>{review.event}</td><td className="text-warning">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</td><td className="admin-review-preview">{review.text}</td><td><span className={`admin-status ${review.isSample ? "pending" : "active"}`}>{review.isSample ? "Sample" : "Customer"}</span></td><td className="admin-row-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setContentForm({ type: "reviews", ...review })} aria-label={`Edit review by ${review.name}`}><i className="fa fa-pencil" /></button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteHomeContentItem("reviews", review)} aria-label={`Delete review by ${review.name}`}><i className="fa fa-trash" /></button></td></tr>)}</tbody></table></div>
          </section>
        )}

        {section === "users" && (
          <section className="admin-card" id="users">
            <div className="admin-card-heading admin-management-heading"><div><h3>Sample users</h3><p>Illustrative customer and vendor records for the admin interface.</p></div><button type="button" className="btn btn-dark" onClick={() => setUserForm({})}><i className="fa fa-user-plus me-2" />Add sample user</button></div>
            <div className="table-responsive"><table className="table admin-orders-table align-middle mb-0"><thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small className="d-block text-muted">{user.id}</small></td><td>{user.email}</td><td>{user.phone}</td><td>{user.role}</td><td><span className={`admin-status ${user.status.toLowerCase()}`}>{user.status}</span></td><td className="admin-row-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setUserForm({ ...user })} aria-label={`Edit ${user.name}`}><i className="fa fa-pencil" /></button><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => changeUserStatus(user)}>{user.status === "Active" ? "Deactivate" : "Activate"}</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeUser(user)} aria-label={`Remove ${user.name}`}><i className="fa fa-trash" /></button></td></tr>)}</tbody></table></div>
          </section>
        )}
      </main>

      {productForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title"><div className="admin-card-heading"><div><h3 id="product-form-title">{productForm.id ? "Update product" : "Create product"}</h3><p>Showcase prices are indicative.</p></div><button type="button" className="btn-close" onClick={() => setProductForm(null)} aria-label="Close" /></div>
        <form onSubmit={saveProduct} className="admin-form-grid">
          <label>Product name<input className="form-control" required value={productForm.title} onChange={(event) => setProductForm({ ...productForm, title: event.target.value })} /></label>
          <label>Category<select className="form-select" required value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}><option value="" disabled>Select category</option>{catalog.map((group) => <option key={group.category} value={group.category}>{group.category}</option>)}</select></label>
          <label>Buy price (INR)<input className="form-control" type="number" min="0" required value={productForm.salePrice} onChange={(event) => setProductForm({ ...productForm, salePrice: event.target.value })} /></label>
          <label>Rent price per day (INR)<input className="form-control" type="number" min="0" value={productForm.rentalPricePerDay} onChange={(event) => setProductForm({ ...productForm, rentalPricePerDay: event.target.value })} /></label>
          <label className="admin-form-wide">Image path<input className="form-control" required value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} placeholder="/images/..." /></label>
          <label className="admin-form-wide">Description<textarea className="form-control" rows="3" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} /></label>
          <div className="admin-form-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setProductForm(null)}>Cancel</button><button type="submit" className="btn btn-dark">Save product</button></div>
        </form>
      </section></div>}

      {categoryForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal admin-modal-narrow" role="dialog" aria-modal="true" aria-labelledby="category-form-title"><div className="admin-card-heading"><div><h3 id="category-form-title">{categoryForm.originalName ? "Rename category" : "Create category"}</h3></div><button type="button" className="btn-close" onClick={() => setCategoryForm(null)} aria-label="Close" /></div><form onSubmit={saveCategory}><label>Category name<input autoFocus className="form-control mt-2" required value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label><div className="admin-form-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setCategoryForm(null)}>Cancel</button><button type="submit" className="btn btn-dark">Save category</button></div></form></section></div>}

      {locationForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal admin-modal-narrow" role="dialog" aria-modal="true" aria-labelledby="location-form-title"><div className="admin-card-heading"><div><h3 id="location-form-title">{locationForm.id ? "Edit location" : "Add location"}</h3></div><button type="button" className="btn-close" onClick={() => setLocationForm(null)} aria-label="Close" /></div><form onSubmit={saveLocation}><label>Location name<input autoFocus className="form-control mt-2" required value={locationForm.name} onChange={(event) => setLocationForm({ ...locationForm, name: event.target.value })} /></label><div className="admin-form-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setLocationForm(null)}>Cancel</button><button type="submit" className="btn btn-dark">Save location</button></div></form></section></div>}

      {contentForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="home-content-form-title"><div className="admin-card-heading"><div><h3 id="home-content-form-title">{contentForm.type === "gallery" ? (contentForm.id ? "Edit Instagram video" : "Add Instagram video") : (contentForm.id ? "Edit client review" : "Add client review")}</h3><p>{contentForm.type === "reviews" ? "Review entries are sample content until verified." : "Add a public Instagram reel URL and a local thumbnail path."}</p></div><button type="button" className="btn-close" onClick={() => setContentForm(null)} aria-label="Close" /></div>
        <form onSubmit={saveHomeContentItem} className="admin-form-grid">
          {contentForm.type === "gallery" ? <>
            <label>Video title<input className="form-control" name="title" required defaultValue={contentForm.title} /></label>
            <label>Vendor name<input className="form-control" name="vendor" required defaultValue={contentForm.vendor} /></label>
            <label className="admin-form-wide">Instagram reel URL<input className="form-control" type="url" name="instagramUrl" required defaultValue={contentForm.instagramUrl} placeholder="https://www.instagram.com/reel/..." /></label>
            <label className="admin-form-wide">Thumbnail image path<input className="form-control" name="thumbnail" required defaultValue={contentForm.thumbnail} placeholder="/images/..." /></label>
            <label className="admin-form-wide">Display date / label<input className="form-control" name="postedAt" defaultValue={contentForm.postedAt} placeholder="e.g. 2 months ago" /></label>
          </> : <>
            <label>Customer name<input className="form-control" name="name" required defaultValue={contentForm.name} /></label>
            <label>Event type<input className="form-control" name="event" required defaultValue={contentForm.event} /></label>
            <label>Rating<select className="form-select" name="rating" defaultValue={contentForm.rating}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label>
            <label>Avatar image path<input className="form-control" name="avatar" defaultValue={contentForm.avatar} placeholder="/images/..." /></label>
            <label className="admin-form-wide">Review text<textarea className="form-control" name="text" rows="4" required defaultValue={contentForm.text} /></label>
          </>}
          <div className="admin-form-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setContentForm(null)}>Cancel</button><button type="submit" className="btn btn-dark">Save</button></div>
        </form>
      </section></div>}

      {userForm && <div className="admin-modal-backdrop" role="presentation"><section className="admin-modal admin-modal-narrow" role="dialog" aria-modal="true" aria-labelledby="user-form-title"><div className="admin-card-heading"><div><h3 id="user-form-title">{userForm.id ? "Edit sample user" : "Add sample user"}</h3><p>This does not create a login account.</p></div><button type="button" className="btn-close" onClick={() => setUserForm(null)} aria-label="Close" /></div><form onSubmit={saveUser} className="admin-form-grid"><label className="admin-form-wide">Name<input className="form-control" name="name" required defaultValue={userForm.name || ""} /></label><label className="admin-form-wide">Email<input className="form-control" type="email" name="email" required defaultValue={userForm.email || ""} /></label><label className="admin-form-wide">Phone<input className="form-control" name="phone" defaultValue={userForm.phone || ""} /></label><label className="admin-form-wide">Role<select className="form-select" name="role" defaultValue={userForm.role || "Customer"}><option>Customer</option><option>Vendor</option></select></label><div className="admin-form-actions"><button type="button" className="btn btn-outline-secondary" onClick={() => setUserForm(null)}>Cancel</button><button type="submit" className="btn btn-dark">{userForm.id ? "Save changes" : "Add user"}</button></div></form></section></div>}
    </div>
  );
}

export default AdminPanel;