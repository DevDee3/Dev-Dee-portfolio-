import React, { useState, useRef, useEffect } from "react";

// Crypto logos - should be placed in public/images/
const logos = {
  btc: "/images/btc-logo.jpeg",
  eth: "/images/eth-logo.jpeg",
  sol: "/images/sol-logo.png",
  usdt: "/images/usdt-logo.png",
  bnb: "/images/bnb-logo.png"
};

// Product list
const products = [
  { id: 1, name: "BTC Headphones", category: "Electronics", image: "/images/btc-headphones.jpg", logo: logos.btc, currency: "BTC", price: 0.00019 },
  { id: 2, name: "ETH Sneakers", category: "Shoes", image: "/images/eth-sneakers.jpg", logo: logos.eth, currency: "ETH", price: 0.021 },
  { id: 3, name: "Solana TV", category: "Electronics", image: "/images/solana-tv.jpg", logo: logos.sol, currency: "SOL", price: 0.12 },
  { id: 4, name: "USDT Perfume", category: "Perfumes", image: "/images/usdt-perfume.jpg", logo: logos.usdt, currency: "USDT", price: 13.5 },
  { id: 5, name: "BNB Sports Watch", category: "Electronics", image: "/images/bnb-sports-watch.jpg", logo: logos.bnb, currency: "BNB", price: 0.055 },
  { id: 6, name: "BTC Classic T-Shirt", category: "Cloth", image: "/images/btc-classic-tshirt.jpg", logo: logos.btc, currency: "BTC", price: 0.00012 },
  { id: 7, name: "ETH Cap", category: "Cloth", image: "/images/eth-cap.jpg", logo: logos.eth, currency: "ETH", price: 0.008 },
  { id: 8, name: "Baggy Jeans (SOL)", category: "Baggy", image: "/images/baggy-jeans-sol.jpg", logo: logos.sol, currency: "SOL", price: 0.032 },
  { id: 9, name: "BNB Leather Shoes", category: "Shoes", image: "/images/bnb-leather-shoes.jpg", logo: logos.bnb, currency: "BNB", price: 0.019 },
  { id: 10, name: "USDT Tote Bag", category: "Bag", image: "/images/usdt-tote-bag.jpg", logo: logos.usdt, currency: "USDT", price: 8.2 },
  { id: 11, name: "BTC HOODIE", category: "Cloth", image: "/images/btc-hoodie.jpg", logo: logos.btc, currency: "BTC", price: 0.000023 },
  { id: 12, name: "ETH Wireless Earbuds", category: "Electronics", image: "/images/eth-wireless-earbuds.jpg", logo: logos.eth, currency: "ETH", price: 4.3 },
  { id: 13, name: "SOL Gaming Mouse", category: "Electronics", image: "/images/sol-gaming-mouse.jpg", logo: logos.sol, currency: "SOL", price: 5.2 },
  { id: 14, name: "USDT Sun Glasses", category: "Cloth", image: "/images/usdt-sun-glasses.jpg", logo: logos.usdt, currency: "USDT", price: 4.2 }
];

// Promo sales section
const promo = [
  { id: 101, name: "BTC Classic T-Shirt", desc: "BTC shirts up 20% this week! Get yours now.", image: "/images/btc-classic-tshirt.jpg", logo: logos.btc },
  { id: 102, name: "BNB Leather Shoes", desc: "BNB Shoes trending for style and comfort.", image: "/images/bnb-leather-shoes.jpg", logo: logos.bnb },
  { id: 103, name: "SOL Gaming Mouse", desc: "SOL Gaming Mouse get yours now for better gaming experince.", image: "/images/sol-gaming-mouse.jpg", logo: logos.sol },
  { id: 104, name: "ETH Wireless Earbuds", desc: "Get your ETH Wireless Earbuds now for a reduce price by 20%.", image: "/images/eth-wireless-earbuds.jpg", logo: logos.eth }
];

const flashSales = products.slice(0, 5);
const categories = [ "All", "Baggy", "Shoes", "Perfumes", "Bag", "Cloth", "Electronics" ];

function App() {
  // UI State
  const [search, setSearch] = useState("");
  const [suggestedCats, setSuggestedCats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Account menu & modals
  const [showAccount, setShowAccount] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  // Buy Now
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Checkout
  const [address, setAddress] = useState("");
  const [pickup, setPickup] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  // Customer Care
  const [showCare, setShowCare] = useState(false);

  // Flash Sale Horizontal Carousel State
  const [horizontalIndex, setHorizontalIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const flashRef = useRef();

  // Animate Add to Cart (floating effect)
  const [animateCart, setAnimateCart] = useState(false);

  // Animated fade for product cards and other elements
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Horizontal Carousel: move to next flash sale item every 2.5s unless hovering
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setHorizontalIndex(idx => (idx + 1) % flashSales.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  // For touch drag/swipe (optional)
  let startX = 0;
  let deltaX = 0;

  // Search logic
  const handleSearch = (val) => {
    setSearch(val);
    if (val.length > 0) {
      const suggestions = categories.filter(cat =>
        cat.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestedCats(suggestions);
    } else {
      setSuggestedCats([]);
    }
  };

  const filteredProducts = products.filter(product =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Cart logic
  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 600);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const placeOrder = () => setShowCheckout(true);
  const confirmCheckout = () => {
    alert("Order placed! (Demo)");
    setCart([]);
    setShowCheckout(false);
    setAddress("");
    setPickup("");
  };

  // "Buy Now" from modal
  const buyNow = (product) => {
    setShowBuyNow(false);
    setSelectedProduct(null);
    setCart([{ ...product, qty: 1 }]);
    setShowCart(true);
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 600);
  };

  // UI Styles
  const styles = {
    app: { minHeight: "100vh", background: "linear-gradient(135deg,#f8fafc 70%,#657ced 100%)", margin: 0, fontFamily: "system-ui,sans-serif", position: "relative" },
    nav: { background: "#fff", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: "1.6rem", color: "#657ced", letterSpacing: "2px" },
    searchBar: { display: "flex", alignItems: "center", gap: "0.7rem", position: "relative" },
    input: { padding: "8px 12px", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px", outline: "none" },
    select: { padding: "8px 10px", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px" },
    cartBtn: { background: "#657ced", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", position: "relative", transition: "transform 0.3s" },
    badge: { position: "absolute", top: "-7px", right: "-7px", background: "#e53e3e", color: "#fff", padding: "2px 7px", borderRadius: "50%", fontSize: "0.8rem" },
    catSuggest: { position: "absolute", left: 0, top: "calc(100% + 2px)", background: "#fff", border: "1px solid #d1d1d1", borderRadius: "4px", zIndex: 12, minWidth: "140px", fontSize: "0.95rem" },
    catSuggestItem: { padding: "6px 12px", cursor: "pointer" },
    flashSection: { margin: "10px auto 10px", padding: "0.8rem 0", maxWidth: "99vw" },
    flashHeader: { fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "1.5px", padding: "8px 0", marginBottom: "1rem", background: "linear-gradient(90deg,#ff8a00,#e52e71)", color: "#fff", borderRadius: "10px 10px 0 0", textAlign: "center", boxShadow: "0 2px 8px #e52e7133" },
    horizontalCarouselOuter: { overflow: "hidden", width: "99vw", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", height: "290px" },
    horizontalCarouselTrack: {
      display: "flex",
      transition: "transform 0.7s cubic-bezier(.86,0,.07,1)",
      transform: `translateX(-${horizontalIndex * 260}px)`,
      willChange: "transform"
    },
    flashItem: { background: "#fff", borderRadius: "16px", boxShadow: "0 2px 14px #657ced22", padding: "1.4rem 0.9rem 0.9rem 0.9rem", minWidth: "220px", maxWidth: "240px", textAlign: "center", position: "relative", overflow: "hidden", margin: "0 10px", cursor: "pointer", transition: "box-shadow 0.2s" },
    flashImg: { width: "90%", height: "120px", objectFit: "cover", borderRadius: "12px", marginBottom: "0.6rem", transition: "transform 0.6s" },
    cryptoLogo: { position: "absolute", top: "12px", left: "12px", width: "30px", height: "30px", borderRadius: "50%", background: "#fff", border: "1px solid #ddd", padding: "2px" },
    promo: { margin: "18px auto", maxWidth: "92vw", display: "flex", gap: "2rem" },
    promoCard: { background: "#fff", borderRadius: "13px", boxShadow: "0 2px 10px #657ced19", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", minWidth: "270px", opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(20px)", transition: "opacity 1s, transform 1s" },
    promoImg: { width: "60px", height: "60px", borderRadius: "13px", objectFit: "cover" },
    promoText: { flex: 1 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2rem", padding: "2rem 10vw" },
    card: { background: "#fff", borderRadius: "14px", boxShadow: "0 4px 20px rgba(80,80,80,0.07)", padding: "1rem", textAlign: "center", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: fadeIn ? 1 : 0, transform: fadeIn ? "scale(1)" : "scale(0.98)", transition: "opacity 0.9s, transform 1.2s" },
    img: { width: "100%", maxWidth: "140px", height: "150px", objectFit: "cover", borderRadius: "10px", marginBottom: "1rem", transition: "transform 0.3s" },
    prodName: { fontWeight: 700, fontSize: "1.08rem", marginBottom: "0.2rem" },
    prodCat: { color: "#657ced", fontSize: "0.97rem", marginBottom: "0.4rem" },
    prodPrice: { color: "#1a202c", fontSize: "1.07rem", marginBottom: "0.7rem" },
    prodBtn: { background: "#657ced", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "background 0.2s, box-shadow 0.2s" },
    prodCryptoLogo: { position: "absolute", top: "10px", left: "10px", width: "26px", height: "26px", borderRadius: "50%", background: "#fff", border: "1px solid #ddd", padding: "1.5px" },
    cartModal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.17)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99 },
    cartBox: { background: "#fff", borderRadius: "14px", padding: "2rem 1.6rem", minWidth: "320px", maxWidth: "94vw", boxShadow: "0 4px 30px rgba(30,30,30,0.16)" },
    cartTitle: { fontWeight: 700, fontSize: "1.3rem", marginBottom: "1.5rem" },
    cartItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    removeBtn: { background: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", padding: "3px 9px", cursor: "pointer", fontSize: "0.93rem" },
    placeBtn: { background: "#657ced", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "1.08rem" },
    fab: { position: "fixed", bottom: "30px", right: "30px", background: "#7f53ac", color: "#fff", width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", cursor: "pointer", boxShadow: "0 2px 16px #7f53ac44", zIndex: 120, transition: "box-shadow 0.2s" },
    modalBackdrop: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.17)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 },
    modal: { background: "#fff", borderRadius: "14px", padding: "2rem 1.7rem", minWidth: "320px", maxWidth: "97vw", boxShadow: "0 4px 30px rgba(30,30,30,0.16)", position: "relative" },
    modalClose: { position: "absolute", top: "9px", right: "9px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" },
    careBtn: { position: "fixed", bottom: "30px", left: "30px", background: "#657ced", color: "#fff", width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", cursor: "pointer", boxShadow: "0 2px 14px #657ced33", zIndex: 120 }
  };

  useEffect(() => {
    if (!document.getElementById("cart-pop-keyframes")) {
      const style = document.createElement("style");
      style.id = "cart-pop-keyframes";
      style.innerHTML = `
        @keyframes cart-pop {
          0% { transform: scale(1);}
          20% { transform: scale(1.4);}
          50% { transform: scale(0.85);}
          100% { transform: scale(1);}
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Optional: Manual controls for carousel
  const handlePrev = () => setHorizontalIndex(idx => (idx - 1 + flashSales.length) % flashSales.length);
  const handleNext = () => setHorizontalIndex(idx => (idx + 1) % flashSales.length);

  return (
    <div style={styles.app}>
      {/* Navbar */}
      <div style={styles.nav}>
        <span style={styles.logo}>Bloccio</span>
        <div style={styles.searchBar}>
          <input
            type="text"
            style={styles.input}
            placeholder="Search for items (e.g. shoe, TV, perfume...)"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {suggestedCats.length > 0 && (
            <div style={styles.catSuggest}>
              {suggestedCats.map(cat =>
                <div
                  key={cat}
                  style={styles.catSuggestItem}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSuggestedCats([]);
                  }}
                >{cat}</div>
              )}
            </div>
          )}
          <select
            style={styles.select}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat =>
              <option key={cat} value={cat}>{cat}</option>
            )}
          </select>
          <button
            style={{
              ...styles.cartBtn,
              ...(animateCart ? { animation: "cart-pop 0.6s" } : {})
            }}
            onClick={() => setShowCart(true)}
          >
            Cart
            {cart.length > 0 && <span style={styles.badge}>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>}
          </button>
        </div>
        {/* Account Icon */}
        <div style={styles.fab} onClick={() => setShowAccount(!showAccount)} title="Account">
          <span role="img" aria-label="account">👤</span>
        </div>
        {showAccount && (
          <div style={{
            position: "absolute",
            top: "60px",
            right: "30px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 16px #657ced33",
            minWidth: "180px",
            zIndex: 200,
            padding: "0.5rem 0"
          }}>
            <div
              style={{ padding: "12px 24px", cursor: "pointer", color: "#333" }}
              onClick={() => { setShowAccount(false); setShowRegister(true); }}
            >Register / Login</div>
          </div>
        )}
      </div>

      {/* Flash Sales Section (at the very top, horizontal movement) */}
      <div style={styles.flashSection}>
        <div style={styles.flashHeader}>FLASH SALE</div>
        <div
          style={styles.horizontalCarouselOuter}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button style={{ position: "absolute", left: 10, zIndex: 2, background: "#fff", border: "none", fontSize: 28, borderRadius: "50%", boxShadow: "0 2px 8px #eee", cursor: "pointer", top: "40%" }} onClick={handlePrev}>&lt;</button>
          <div style={styles.horizontalCarouselTrack} ref={flashRef}>
            {flashSales.map((item, idx) => (
              <div
                key={item.id}
                style={styles.flashItem}
                onClick={() => { setSelectedProduct(item); setShowBuyNow(true); }}
              >
                <img src={item.image} alt={item.name} style={styles.flashImg} />
                <img src={item.logo} alt="crypto" style={styles.cryptoLogo} />
                <div style={styles.prodName}>{item.name}</div>
                <div style={styles.prodCat}>{item.category}</div>
                <div style={styles.prodPrice}>{item.price} {item.currency}</div>
                <button style={styles.prodBtn} onClick={e => { e.stopPropagation(); addToCart(item); }}>Add to Cart</button>
              </div>
            ))}
          </div>
          <button style={{ position: "absolute", right: 10, zIndex: 2, background: "#fff", border: "none", fontSize: 28, borderRadius: "50%", boxShadow: "0 2px 8px #eee", cursor: "pointer", top: "40%" }} onClick={handleNext}>&gt;</button>
        </div>
      </div>

      {/* Promo Sales */}
      <div style={styles.promo}>
        {promo.map(p => (
          <div style={styles.promoCard} key={p.id}>
            <img src={p.image} alt={p.name} style={styles.promoImg} />
            <div style={styles.promoText}>
              <div style={{fontWeight: 700, marginBottom: "0.1rem"}}>{p.name}</div>
              <div style={{fontSize: "0.97rem"}}>{p.desc}</div>
            </div>
            <img src={p.logo} alt="crypto" style={{width: 26, height: 26, borderRadius: "50%"}} />
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div style={styles.grid}>
        {filteredProducts.length === 0 ? (
          <div>No products found.</div>
        ) : (
          filteredProducts.map(product => (
            <div style={styles.card} key={product.id} onClick={() => { setSelectedProduct(product); setShowBuyNow(true); }}>
              <img src={product.image} alt={product.name} style={styles.img} />
              <img src={product.logo} alt="crypto" style={styles.prodCryptoLogo} />
              <div style={styles.prodName}>{product.name}</div>
              <div style={styles.prodCat}>{product.category}</div>
              <div style={styles.prodPrice}>{product.price} {product.currency}</div>
              <button style={styles.prodBtn} onClick={e => { e.stopPropagation(); addToCart(product); }}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* Buy Now Modal */}
      {showBuyNow && selectedProduct && (
        <div style={styles.modalBackdrop} onClick={() => { setShowBuyNow(false); setSelectedProduct(null); }}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => { setShowBuyNow(false); setSelectedProduct(null); }}>×</button>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{width: "120px", borderRadius: "12px", marginBottom: "1rem"}} />
            <div style={{fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem"}}>{selectedProduct.name}</div>
            <div style={{color: "#657ced", fontSize: "1.05rem", marginBottom: "0.5rem"}}>{selectedProduct.category}</div>
            <div style={{color: "#1a202c", fontSize: "1.1rem", marginBottom: "1rem"}}>{selectedProduct.price} {selectedProduct.currency}</div>
            <button style={styles.prodBtn} onClick={() => buyNow(selectedProduct)}>Buy Now</button>
            <button style={{...styles.prodBtn, background: "#29b6af", marginLeft: "1rem"}} onClick={() => { addToCart(selectedProduct); setShowBuyNow(false); setSelectedProduct(null); }}>Add to Cart</button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div style={styles.cartModal} onClick={() => setShowCart(false)}>
          <div style={styles.cartBox} onClick={e => e.stopPropagation()}>
            <div style={styles.cartTitle}>Your Cart</div>
            {cart.length === 0 ? (
              <div>Your cart is empty.</div>
            ) : (
              <>
                {cart.map(item => (
                  <div style={styles.cartItem} key={item.id}>
                    <span>{item.name} <b>x{item.qty}</b></span>
                    <span>{(item.price * item.qty).toFixed(6)} {item.currency}</span>
                    <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                ))}
                <div style={{borderTop: "1px solid #eee", margin: "1rem 0"}} />
                <div style={{display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: "1.2rem"}}>
                  <span>Total</span>
                  <span>
                    {cart.reduce((t, item) => t + item.price * item.qty, 0).toFixed(6)} {cart[0]?.currency || ""}
                  </span>
                </div>
                <div style={{display: "flex", gap: "0.8rem", alignItems: "center"}}>
                  <img src={logos.btc} alt="btc" style={{width: 26, height: 26}} />
                  <img src={logos.eth} alt="eth" style={{width: 26, height: 26}} />
                  <img src={logos.sol} alt="sol" style={{width: 26, height: 26}} />
                  <img src={logos.usdt} alt="usdt" style={{width: 26, height: 26}} />
                  <span style={{fontSize: "0.98rem", color: "#657ced"}}>Pay with Crypto only</span>
                </div>
                <button style={styles.placeBtn} onClick={placeOrder}>Checkout</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={styles.modalBackdrop} onClick={() => setShowCheckout(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowCheckout(false)}>×</button>
            <h3>Checkout</h3>
            <div style={{marginBottom: "1rem"}}>
              <label style={{fontWeight: 600}}>Delivery address:</label>
              <input
                type="text"
                style={{...styles.input, marginLeft: 0, marginTop: "0.5rem"}}
                placeholder="Type your address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <div style={{marginBottom: "1rem"}}>
              <label style={{fontWeight: 600}}>Or pick up station:</label>
              <input
                type="text"
                style={{...styles.input, marginLeft: 0, marginTop: "0.5rem"}}
                placeholder="Type pickup station (optional)"
                value={pickup}
                onChange={e => setPickup(e.target.value)}
              />
            </div>
            <div style={{margin: "1rem 0"}}><b>Payment:</b> Crypto only</div>
            <div style={{display: "flex", gap: "0.5rem"}}>
              <img src={logos.btc} alt="btc" style={{width: 26, height: 26}} />
              <img src={logos.eth} alt="eth" style={{width: 26, height: 26}} />
              <img src={logos.sol} alt="sol" style={{width: 26, height: 26}} />
              <img src={logos.usdt} alt="usdt" style={{width: 26, height: 26}} />
            </div>
            <button style={{...styles.placeBtn, marginTop: "1.2rem"}} onClick={confirmCheckout}>
              Confirm Order
            </button>
          </div>
        </div>
      )}

      {/* Account Modal: Register/Login, Add Password, Forget Password */}
      {showRegister && (
        <div style={styles.modalBackdrop} onClick={() => setShowRegister(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowRegister(false)}>×</button>
            <h3>Register / Login</h3>
            <div style={{marginBottom: "1rem"}}>
              <b>By Email:</b>
              <input style={styles.input} placeholder="Enter your email" />
            </div>
            <div style={{marginBottom: "1rem"}}>
              <b>By Phone:</b>
              <input style={styles.input} placeholder="Enter your phone number" />
            </div>
            <div>
              <b>By Wallet:</b>
              <div style={{display: "flex", gap: "0.7rem", marginTop: "0.5rem"}}>
                <button style={{...styles.prodBtn, background: "#ffb700"}}>MetaMask</button>
                <button style={{...styles.prodBtn, background: "#9945FF"}}>Phantom</button>
                <button style={{...styles.prodBtn, background: "#29b6af"}}>Trust Wallet</button>
              </div>
            </div>
            <button style={{...styles.placeBtn, marginTop: "1.5rem"}}>Register</button>
            <div style={{marginTop: "2rem", display: "flex", justifyContent: "space-between"}}>
              <button style={{...styles.prodBtn, background: "#6c63ff"}} onClick={() => { setShowRegister(false); setShowAddPassword(true); }}>Add Password</button>
              <button style={{...styles.prodBtn, background: "#e53e3e"}} onClick={() => { setShowRegister(false); setShowForgetPassword(true); }}>Forget Password</button>
            </div>
          </div>
        </div>
      )}
      {showAddPassword && (
        <div style={styles.modalBackdrop} onClick={() => setShowAddPassword(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowAddPassword(false)}>×</button>
            <h3>Add Password</h3>
            <div style={{marginBottom: "1rem"}}>
              <input type="password" style={styles.input} placeholder="Enter new password" />
            </div>
            <button style={styles.placeBtn} onClick={() => setShowAddPassword(false)}>Add Password</button>
          </div>
        </div>
      )}
      {showForgetPassword && (
        <div style={styles.modalBackdrop} onClick={() => setShowForgetPassword(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowForgetPassword(false)}>×</button>
            <h3>Forget Password</h3>
            <div style={{marginBottom: "1rem"}}>
              <input style={styles.input} placeholder="Enter your email or phone" />
            </div>
            <button style={styles.placeBtn} onClick={() => setShowForgetPassword(false)}>Send Reset Link</button>
          </div>
        </div>
      )}

      {/* Customer care FAB */}
      <div style={styles.careBtn} onClick={() => setShowCare(true)} title="Customer Care">
        <span role="img" aria-label="help">💬</span>
      </div>
      {showCare && (
        <div style={styles.modalBackdrop} onClick={() => setShowCare(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowCare(false)}>×</button>
            <h3>Customer Care</h3>
            <div style={{margin: "1rem 0"}}>
              <div><b>Email:</b> <a href="mailto:support@bloccio.com">support@bloccio.com</a></div>
              <div><b>Phone:</b> <a href="tel:+1234567890">+1 234 567 890</a></div>
              <div style={{marginTop: "1rem"}}><b>Live Chat (Demo):</b></div>
              <div style={{marginTop: "0.5rem"}}>
                <input style={styles.input} placeholder="Type your message..." />
                <button style={{...styles.prodBtn, marginLeft: "0.5rem"}}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;