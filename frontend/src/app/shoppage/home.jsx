import Home, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home({ user }) {
  return (
    <div style={{ background: "#8c7258", color: "#fff" }}>

      
      <header style={styles.navbar}>
        <h2>Crafted Roots</h2>

        <nav>
          <Link style={styles.link}>Home</Link>
          <Link style={styles.link}>Deals</Link>
          <Link style={styles.link}>New Arrivals</Link>
          <Link style={styles.link}>Packages</Link>
        </nav>

        {user ? (
          <span>Hi, {user}</span>
        ) : (
          <Link to="/login">
            <button style={styles.loginBtn}>Login</button>
          </Link>
        )}
      </header>

      
      <section style={styles.hero}>
        <h1 style={{ fontSize: "48px", opacity: 0.8 }}>ULTIMATE</h1>
        <h1 style={{ fontSize: "64px" }}>SALE</h1>
        <p>NEW COLLECTION</p>
        <button style={styles.shopBtn}>SHOP NOW</button>
      </section>

      <section style={styles.whiteSection}>
        <h2>Deals Of The Month</h2>
        <div style={styles.timer}>
          <TimeBox value="02" label="Days" />
          <TimeBox value="06" label="Hr" />
          <TimeBox value="05" label="Min" />
          <TimeBox value="30" label="Sec" />
        </div>
      </section>

      
      <section style={styles.arrivals}>
        <h2>New Arrivals</h2>

        <div style={styles.tabs}>
          <Tab active text="Women's Fashion" />
          <Tab text="Men's Fashion" />
          <Tab text="Accessories" />
          <Tab text="Discount Deals" />
        </div>

        <div style={styles.productGrid}>
          <Product title="Soy Wax Candles" />
          <Product title="Warli Handpainted Panels" />
          <Product title="Wooden Keychains" />
          <Product title="Handmade Soaps" />
          <Product title="Hand painted Lamps" />
          <Product title="Jute Bags" />
        </div>
      </section>

      
      <TestimonialsSection />

      <footer style={styles.footer}>
        © 2026 Crafted Roots
      </footer>

    </div>
  );
}


const testimonials = [
  {
    id: 1,
    name: "James K.",
    role: "Traveler",
    text: "You can feel the authenticity in every product. Beautifully made.",
    rating: 5,
  
  },
  {
    id: 2,
    name: "Megen W.",
    role: "UI Designer",
    text: "The handmade quality is an outstanding blend of tradition and design.",
    rating: 5,
    
  },
];


function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <section style={styles.whiteSection}>
      <h2>This Is What Our Customers Say</h2>

      <div style={styles.testimonialBox}>
        <button onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}>
          <ChevronLeft />
        </button>

        <div style={styles.testimonialCard}>
          <img src={t.image} alt={t.name} style={styles.avatar} />
          <p>"{t.text}"</p>
          <h4>{t.name}</h4>
          <small>{t.role}</small>
        </div>

        <button onClick={() => setIndex((index + 1) % testimonials.length)}>
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}


function Login({ setUser }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <div style={styles.loginPage}>
      <h2>Login</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        style={styles.input}
      />

      <button
        style={styles.shopBtn}
        onClick={() => {
          setUser(name);
          navigate("/");
        }}
      >
        Login
      </button>
    </div>
  );
}


const Product = ({ title }) => (
  <div style={styles.card}>
    <div style={styles.imagePlaceholder}></div>
    <h4>{title}</h4>
    <span style={{ color: "red" }}>Almost Sold Out</span>
  </div>
);

const TimeBox = ({ value, label }) => (
  <div style={styles.timeBox}>
    <h3>{value}</h3>
    <small>{label}</small>
  </div>
);

const Tab = ({ text, active }) => (
  <button style={{ ...styles.tab, background: active ? "#000" : "#fff", color: active ? "#fff" : "#000" }}>
    {text}
  </button>
);


const styles = {
  navbar: { display: "flex", justifyContent: "space-between", padding: "20px" },
  link: { margin: "0 10px", color: "#fff", textDecoration: "none" },
  loginBtn: { background: "#000", color: "#fff", padding: "8px 16px" },
  hero: { textAlign: "center", padding: "80px" },
  shopBtn: { padding: "10px 20px", background: "#000", color: "#fff" },
  whiteSection: { background: "#fff", color: "#000", padding: "50px", textAlign: "center" },
  timer: { display: "flex", justifyContent: "center", gap: "20px" },
  timeBox: { border: "1px solid #ccc", padding: "10px", width: "60px" },
  arrivals: { padding: "50px", textAlign: "center" },
  tabs: { marginBottom: "20px" },
  tab: { padding: "8px 16px", borderRadius: "20px", border: "none", margin: "5px" },
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" },
  card: { background: "#fff", color: "#000", padding: "15px", borderRadius: "10px" },
  imagePlaceholder: { height: "120px", background: "#ddd", marginBottom: "10px" },
  footer: { padding: "20px", background: "#6f5844", textAlign: "center" },
  testimonialBox: { display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" },
  testimonialCard: { maxWidth: "350px" },
  avatar: { width: "80px", borderRadius: "50%" },
  loginPage: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" },
  input: { padding: "10px", marginBottom: "10px" },
};
