import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Save, Plus, X, Trash2, Image as ImageIcon } from "lucide-react";
import { adminFetch } from "../../utils/adminFetch";
import { selectFeaturedProduct, formatPrice } from "../../utils/featuredDealAlgorithm";
import "./HomepageManagement.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function HomepageManagement() {
  const [config, setConfig] = useState({
    featuredDealProductId: "",
    sections: {
      belowThousand: true,
      megaFlashSale: true,
      buy1Get1: true,
      dailySpecial: true,
      newArrivals: true,
    },
    heroSlides: []
  });
  const [initialConfig, setInitialConfig] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [newSlides, setNewSlides] = useState([]);
  
  // Dirty state tracking
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Update dirty state whenever config or newSlides change
  useEffect(() => {
    if (!initialConfig) return;
    
    const configChanged = JSON.stringify(config) !== JSON.stringify(initialConfig);
    const newSlidesAdded = newSlides.length > 0;
    
    setIsDirty(configChanged || newSlidesAdded);
  }, [config, newSlides, initialConfig]);

  // Handle unsaved changes warning for window unlooad
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Homepage Config
      const confRes = await adminFetch(`${API}/api/homepage`);
      let confData = {};
      if (confRes.ok) {
        confData = await confRes.json();
      }

      // Fetch products
      const prodRes = await adminFetch(`${API}/api/products`);
      let prodData = { products: [] };
      if (prodRes.ok) {
        prodData = await prodRes.json();
      }

      const newConfig = {
        featuredDealProductId: confData.featuredDealProductId || "",
        sections: confData.sections || {
          belowThousand: true,
          megaFlashSale: true,
          buy1Get1: true,
          dailySpecial: true,
          newArrivals: true,
        },
        heroSlides: confData.heroSlides || []
      };

      setConfig(newConfig);
      setInitialConfig(JSON.parse(JSON.stringify(newConfig)));
      const productList = Array.isArray(prodData)
        ? prodData
        : (prodData.products || []);

      setProducts(productList);
      setNewSlides([]);
      setIsDirty(false);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      setFeedback({ type: "error", message: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionToggle = (section) => {
    setConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  const handleExistingSlideChange = (index, field, value) => {
    const updated = [...config.heroSlides];
    updated[index][field] = value;
    setConfig({ ...config, heroSlides: updated });
  };

  const handleNewSlideChange = (index, field, value) => {
    const updated = [...newSlides];
    updated[index][field] = value;
    setNewSlides(updated);
  };

  const removeExistingSlide = (index) => {
    const updated = [...config.heroSlides];
    updated.splice(index, 1);
    setConfig({ ...config, heroSlides: updated });
  };

  const removeNewSlide = (index) => {
    const updated = [...newSlides];
    updated.splice(index, 1);
    setNewSlides(updated);
  };

  const addNewSlideForm = () => {
    setNewSlides([...newSlides, { file: null, destination: "/", alt: "", isActive: true, preview: null }]);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...newSlides];
      updated[index].file = file;
      updated[index].preview = URL.createObjectURL(file);
      updated[index].alt = updated[index].alt || file.name;
      setNewSlides(updated);
    }
  };

  const saveConfig = async () => {
    if (!isDirty) return;
    
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      formData.append("featuredDealProductId", config.featuredDealProductId);
      formData.append("sections", JSON.stringify(config.sections));
      formData.append("existingSlides", JSON.stringify(config.heroSlides));

      newSlides.forEach(slide => {
        if (slide.file) {
          formData.append("images", slide.file);
          // Attach metadata using the original filename to match in backend
          formData.append(`slideMeta_${slide.file.name}`, JSON.stringify({
            destination: slide.destination,
            alt: slide.alt,
            isActive: slide.isActive
          }));
        }
      });

      const res = await adminFetch(`${API}/api/homepage`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Unable to save homepage settings. Please try again.");
      
      setFeedback({ type: "success", message: "Homepage updated successfully." });
      
      const updatedData = await res.json();
      const updatedConfig = {
        featuredDealProductId: updatedData.featuredDealProductId || "",
        sections: updatedData.sections || config.sections,
        heroSlides: updatedData.heroSlides || []
      };
      
      setConfig(updatedConfig);
      setInitialConfig(JSON.parse(JSON.stringify(updatedConfig)));
      setNewSlides([]);
      setIsDirty(false);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const discardChanges = () => {
    setConfig(JSON.parse(JSON.stringify(initialConfig)));
    setNewSlides([]);
    setIsDirty(false);
    setShowConfirmDialog(false);
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;

  // Compute Featured Deal Preview
  let previewProduct = null;
  let isManualPreview = false;
  
  if (config.featuredDealProductId) {
    const manualMatch = products.find(p => p._id === config.featuredDealProductId);
    if (manualMatch && manualMatch.stock > 0 && manualMatch.status === "ACTIVE") {
      previewProduct = manualMatch;
      isManualPreview = true;
    }
  }
  
  if (!previewProduct) {
    previewProduct = selectFeaturedProduct(products);
    isManualPreview = false;
  }

  return (
    <div className="admin-homepage">
      {feedback && (
        <div className={`admin-alert-banner ${feedback.type}`}>
          <div className="admin-alert-content">
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.message}</span>
          </div>
          <button className="admin-alert-close" onClick={() => setFeedback(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Dirty State Modal */}
      {showConfirmDialog && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "400px" }}>
            <h2>Discard unsaved changes?</h2>
            <p style={{ color: "#64748b", margin: "8px 0 24px" }}>
              You have unsaved changes to your homepage configuration. Are you sure you want to discard them?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirmDialog(false)}>Keep Editing</button>
              <button className="btn btn-danger" onClick={discardChanges}>Discard Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="homepage-header">
        <div>
          <div className="breadcrumb">ADMIN / HOMEPAGE</div>
          <h1>Homepage Management</h1>
          <div className="subtitle">Configure hero banners, featured deals, and section visibility.</div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {isDirty && (
            <button className="btn btn-secondary" onClick={() => setShowConfirmDialog(true)} disabled={isSubmitting}>
              Discard
            </button>
          )}
          <button 
            className="btn btn-primary" 
            onClick={saveConfig} 
            disabled={!isDirty || isSubmitting}
          >
            <Save size={16} style={{ marginRight: "4px" }} /> 
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="homepage-content-grid">
        
        {/* FEATURED DEAL */}
        <div className="card">
          <h2 className="card-title">Featured Deal</h2>
          <div className="featured-deal-grid">
            
            {/* Left: Preview */}
            <div className="fd-preview-col">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "8px" }}>
                Current Featured Deal Preview
              </label>
              
              {!previewProduct ? (
                <div className="fd-preview-card" style={{ justifyContent: "center", color: "#64748b" }}>
                  No eligible Featured Deal
                </div>
              ) : (
                <div className="fd-preview-card">
                  <img src={previewProduct.images?.[0] || previewProduct.image} alt={previewProduct.name} className="fd-preview-img" />
                  <div className="fd-preview-info">
                    <h3 className="fd-preview-title">{previewProduct.name}</h3>
                    <p className="fd-preview-price">{formatPrice(previewProduct.finalPrice || previewProduct.price)}</p>
                    {previewProduct.offerType && previewProduct.offerType !== "NONE" ? (
                      <span className="fd-badge" style={{ background: "#fef3c7", color: "#d97706", marginRight: "8px" }}>
                        {previewProduct.offerType.replace(/_/g, " ")}
                      </span>
                    ) : Number(previewProduct.discountPercent) > 0 ? (
                      <span className="fd-badge" style={{ background: "#fce7f3", color: "#be185d", marginRight: "8px" }}>
                        {previewProduct.discountPercent}% OFF
                      </span>
                    ) : null}
                    <span className={`fd-badge ${isManualPreview ? "manual" : "automatic"}`}>
                      {isManualPreview ? "Manual Override" : "Automatic"}
                    </span>
                  </div>
                </div>
              )}
              
              {!previewProduct && (
                 <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
                   The homepage will display no Featured Deal until an eligible product becomes available.
                 </p>
              )}
            </div>
            
            {/* Right: Selector */}
            <div className="fd-selector-col">
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "8px" }}>
                Override Selection
              </label>
              <select 
                className="form-control"
                value={config.featuredDealProductId}
                onChange={(e) => setConfig({ ...config, featuredDealProductId: e.target.value })}
              >
                <option value="">[ Automatic Algorithm ▼ ]</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
              
              {config.featuredDealProductId ? (
                <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px", background: "#f1f5f9", padding: "8px", borderRadius: "4px" }}>
                  {isManualPreview 
                    ? "This product will be used as the Featured Deal while it remains active and in stock. Otherwise the homepage will fall back to the automatic selection."
                    : "Manual selection unavailable — automatic fallback is active."}
                </p>
              ) : (
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
                  The system automatically selects the best deal based on stock, price, and category.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* HERO CAROUSEL */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <h2 className="card-title">Hero Carousel</h2>
              <p className="card-desc">Manage the main sliding banners for the storefront.</p>
            </div>
            <button className="btn btn-secondary" onClick={addNewSlideForm} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Plus size={16} /> Add Slide
            </button>
          </div>

          <div className="slides-list">
            {config.heroSlides.length === 0 && newSlides.length === 0 ? (
              <div className="admin-empty-state" style={{ padding: "40px 20px" }}>
                <ImageIcon size={48} style={{ color: "#cbd5e1", marginBottom: "16px" }} />
                <h3 style={{ margin: "0 0 8px 0" }}>No custom hero slides</h3>
                <p style={{ margin: "0 0 16px 0", color: "#64748b" }}>Add a homepage banner to replace the default storefront hero carousel.</p>
                <button className="btn btn-primary" onClick={addNewSlideForm}>+ Add Slide</button>
              </div>
            ) : (
              <>
                {/* Existing Slides */}
                {config.heroSlides.map((slide, index) => (
                  <div key={`existing-${index}`} className="slide-editor-card">
                    <img src={slide.image} alt="Preview" className="slide-preview" />
                    <div className="slide-form">
                      <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label>Destination URL</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={slide.destination} 
                          onChange={(e) => handleExistingSlideChange(index, "destination", e.target.value)} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label>Alt Text</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={slide.alt} 
                          onChange={(e) => handleExistingSlideChange(index, "alt", e.target.value)} 
                        />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                          <input 
                            type="checkbox" 
                            checked={slide.isActive} 
                            onChange={(e) => handleExistingSlideChange(index, "isActive", e.target.checked)} 
                            style={{ cursor: "pointer" }}
                          />
                          Active
                        </label>
                        <button className="btn-icon text-danger" onClick={() => removeExistingSlide(index)} title="Delete Slide" style={{ marginLeft: "auto", border: "none", background: "none", cursor: "pointer" }}>
                          <Trash2 size={16} /> <span style={{ fontSize: "14px", marginLeft: "4px" }}>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* New Slides */}
                {newSlides.map((slide, index) => (
                  <div key={`new-${index}`} className="slide-editor-card new-slide">
                    
                    {!slide.preview ? (
                      <div className="slide-upload-area" style={{ flexDirection: 'column', gap: '8px' }}>
                        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: "100%", height: "100%", justifyContent: "center" }}>
                          <input 
                            type="file" 
                            accept="image/jpeg, image/png, image/webp" 
                            onChange={(e) => handleFileChange(index, e)} 
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                            aria-label="Upload banner image"
                          />
                          <ImageIcon size={24} style={{ color: "#94a3b8" }} />
                          <span style={{ fontSize: "12px", color: "#475569", fontWeight: "500", marginTop: "4px" }}>Click or Drag Image</span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>JPG / PNG / WEBP</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <img src={slide.preview} alt="Banner Preview" className="slide-preview" />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                          <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle2 size={12} /> Ready</span>
                          <div style={{ position: "relative", cursor: "pointer", color: "#2563eb", fontWeight: "500" }}>
                            Replace
                            <input 
                              type="file" 
                              accept="image/jpeg, image/png, image/webp" 
                              onChange={(e) => handleFileChange(index, e)} 
                              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                              aria-label="Replace banner image"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="slide-form">
                      <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label>Destination URL</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={slide.destination} 
                          onChange={(e) => handleNewSlideChange(index, "destination", e.target.value)} 
                          placeholder="/offers"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "8px" }}>
                        <label>Alt Text</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={slide.alt} 
                          onChange={(e) => handleNewSlideChange(index, "alt", e.target.value)} 
                          placeholder="Banner description"
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn-icon text-danger" onClick={() => removeNewSlide(index)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Trash2 size={16} /> <span style={{ fontSize: "14px", marginLeft: "4px" }}>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* HOMEPAGE SECTIONS */}
        <div className="card">
          <h2 className="card-title">Homepage Sections</h2>
          <p className="card-desc">Toggle the visibility of automated merchandising sections.</p>
          
          <div className="section-toggles">
            <div className="custom-toggle">
              <div className="custom-toggle-info">
                <h4 className="custom-toggle-title">Below ₹1,000</h4>
                <p className="custom-toggle-desc">Show affordable products section on homepage.</p>
              </div>
              <label className="switch-label">
                <input type="checkbox" checked={config.sections.belowThousand} onChange={() => handleSectionToggle("belowThousand")} aria-label="Toggle Below ₹1,000 Section" />
                <span className="switch-slider"></span>
              </label>
            </div>
            
            <div className="custom-toggle">
              <div className="custom-toggle-info">
                <h4 className="custom-toggle-title">Mega Flash Sale</h4>
                <p className="custom-toggle-desc">Show Mega Flash Sale promotions.</p>
              </div>
              <label className="switch-label">
                <input type="checkbox" checked={config.sections.megaFlashSale} onChange={() => handleSectionToggle("megaFlashSale")} aria-label="Toggle Mega Flash Sale Section" />
                <span className="switch-slider"></span>
              </label>
            </div>
            
            <div className="custom-toggle">
              <div className="custom-toggle-info">
                <h4 className="custom-toggle-title">Buy 1 Get 1</h4>
                <p className="custom-toggle-desc">Show BOGO offers directly on the homepage.</p>
              </div>
              <label className="switch-label">
                <input type="checkbox" checked={config.sections.buy1Get1} onChange={() => handleSectionToggle("buy1Get1")} aria-label="Toggle Buy 1 Get 1 Section" />
                <span className="switch-slider"></span>
              </label>
            </div>
            
            <div className="custom-toggle">
              <div className="custom-toggle-info">
                <h4 className="custom-toggle-title">Daily Special</h4>
                <p className="custom-toggle-desc">Show Daily Special deals prominently.</p>
              </div>
              <label className="switch-label">
                <input type="checkbox" checked={config.sections.dailySpecial} onChange={() => handleSectionToggle("dailySpecial")} aria-label="Toggle Daily Special Section" />
                <span className="switch-slider"></span>
              </label>
            </div>
            
            <div className="custom-toggle">
              <div className="custom-toggle-info">
                <h4 className="custom-toggle-title">New Arrivals</h4>
                <p className="custom-toggle-desc">Show the latest products added to the catalog.</p>
              </div>
              <label className="switch-label">
                <input type="checkbox" checked={config.sections.newArrivals} onChange={() => handleSectionToggle("newArrivals")} aria-label="Toggle New Arrivals Section" />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
