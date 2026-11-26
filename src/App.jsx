import { useEffect, useState } from 'react';

const puris = ['🌿', '🌶️', '🥔', '🌱', '🧅', '🍋'];

export default function App() {
  const [menu, setMenu] = useState([]);
  const [menuError, setMenuError] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [order, setOrder] = useState({ name: '', phone: '', quantity: '1' });
  const [orderMessage, setOrderMessage] = useState('');
  const [orderError, setOrderError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/api/menu')
      .then((response) => {
        if (!response.ok) throw new Error('The menu is temporarily unavailable.');
        return response.json();
      })
      .then((items) => {
        if (!active) return;
        setMenu(items);
        setSelectedItem(items.length ? items[0].id : '');
      })
      .catch((error) => {
        if (active) setMenuError(error.message);
      });

    return () => { active = false; };
  }, []);

  async function submitOrder(event) {
    event.preventDefault();
    setSubmitting(true);
    setOrderMessage('');
    setOrderError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: order.name,
          phone: order.phone,
          menuItemId: selectedItem,
          quantity: Number(order.quantity),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not place your order.');
      setOrderMessage(`Order ${result.order.id.slice(0, 8)} received — ₹${result.order.total}.`);
      setOrder({ name: '', phone: '', quantity: '1' });
    } catch (error) {
      setOrderError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Pani Puri House home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Pani Puri <em>House</em></span>
        </a>
        <nav className="navigation" aria-label="Main navigation">
          <a href="#menu">Our menu</a>
          <a href="#story">Our story</a>
          <a className="nav-cta" href="#visit">Come say hi <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="hero page-width" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true">✳</span> A little crunch, a lot of joy</p>
          <h1>The pani puri<br />kind of <em>day.</em></h1>
          <p className="hero-description">
            Freshly filled, generously spiced, and made for that first
            <strong> “just one more”</strong> moment.
          </p>
          <a className="button button-dark" href="#menu">Explore the menu <span aria-hidden="true">↓</span></a>
          <div className="hero-note">
            <span className="note-icon" aria-hidden="true">✦</span>
            <span>Made fresh when you order.<br /><strong>Never a soggy puri.</strong></span>
          </div>
        </div>

        <div className="hero-art" role="img" aria-label="A plate of pani puri with fresh herbs and spices">
          <div className="art-sun" />
          <div className="art-caption"><span>THE HAPPY<br />PLATE</span><span aria-hidden="true">✳</span></div>
          <div className="plate">
            <div className="puris">
              {puris.map((filling, index) => (
                <span className={`puri puri-${index + 1}`} key={index}>
                  <span>{filling}</span>
                </span>
              ))}
            </div>
            <span className="plate-herb herb-one" aria-hidden="true">✿</span>
            <span className="plate-herb herb-two" aria-hidden="true">✳</span>
          </div>
          <span className="art-scribble scribble-top">crunch<br />happiness</span>
          <span className="art-scribble scribble-bottom">fresh every time <b>↗</b></span>
        </div>
      </section>

      <section className="ticker" aria-label="What makes us special">
        <div className="ticker-inner">
          <span>MADE FRESH</span><b>✳</b><span>SPICE YOUR WAY</span><b>✳</b><span>ALWAYS CRUNCHY</span><b>✳</b>
          <span>MADE FRESH</span><b>✳</b><span>SPICE YOUR WAY</span><b>✳</b><span>ALWAYS CRUNCHY</span><b>✳</b>
        </div>
      </section>

      <section className="menu-section page-width" id="menu">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span aria-hidden="true">01 /</span> The good stuff</p>
            <h2>Pick your <em>crunch.</em></h2>
          </div>
          <p>Every plate is made to order.<br />Every bite is a little celebration.</p>
        </div>
        <div className="menu-grid">
          {menu.map((item, index) => (
            <article className={`menu-card menu-card-${index + 1}`} key={item.name}>
              <div className="menu-card-art" aria-hidden="true">
                <span className="menu-card-label">{item.label}</span>
                <span className="menu-food">{item.icon}</span>
                <span className="menu-spark">✳</span>
              </div>
              <div className="menu-card-copy">
                <div className="menu-title">
                  <h3>{item.name}</h3>
                  <span>₹{item.price}</span>
                </div>
                <p>{item.description}</p>
                <a className="menu-order-link" href="#visit" onClick={() => setSelectedItem(item.id)}>
                  Order this <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        {menuError && <p className="api-error" role="alert">{menuError}</p>}
        {!menu.length && !menuError && <p className="menu-loading" role="status">Fresh menu coming right up…</p>}
      </section>

      <section className="story-section" id="story">
        <div className="story-inner page-width">
          <div className="story-stamp" aria-hidden="true"><span>GOOD<br />MOOD<br />FOOD</span><b>✳</b></div>
          <div className="story-copy">
            <p className="eyebrow"><span aria-hidden="true">02 /</span> A small love story</p>
            <h2>Big flavour.<br /><em>Little puri.</em></h2>
            <p>We believe the best things come one crunchy bite at a time. So we keep it simple: fresh ingredients, lively pani, and all the joy of sharing a plate with your favourite people.</p>
            <a className="text-link" href="#visit">Your next plate is waiting <span aria-hidden="true">↗</span></a>
          </div>
          <div className="story-doodle" aria-hidden="true">yum!<span>✦</span></div>
        </div>
      </section>

      <section className="visit-section page-width" id="visit">
        <p className="eyebrow"><span aria-hidden="true">03 /</span> Your move</p>
        <h2>Bring your appetite.<br /><em>We’ll bring the pani.</em></h2>
        <form className="order-form" onSubmit={submitOrder}>
          <label>
            Your name
            <input
              autoComplete="name"
              maxLength="100"
              required
              value={order.name}
              onChange={(event) => setOrder({ ...order, name: event.target.value })}
            />
          </label>
          <label>
            Phone number
            <input
              autoComplete="tel"
              inputMode="tel"
              maxLength="24"
              required
              value={order.phone}
              onChange={(event) => setOrder({ ...order, phone: event.target.value })}
            />
          </label>
          <label>
            Pick your puri
            <select required value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)}>
              {menu.map((item) => <option value={item.id} key={item.id}>{item.name} — ₹{item.price}</option>)}
            </select>
          </label>
          <label>
            Plates
            <input
              type="number"
              min="1"
              max="20"
              required
              value={order.quantity}
              onChange={(event) => setOrder({ ...order, quantity: event.target.value })}
            />
          </label>
          <button className="button button-light order-submit" type="submit" disabled={submitting || !menu.length}>
            {submitting ? 'Sending…' : 'Place your order'} <span aria-hidden="true">↑</span>
          </button>
          {orderMessage && <p className="order-message" role="status">{orderMessage}</p>}
          {orderError && <p className="order-error" role="alert">{orderError}</p>}
        </form>
        <span className="visit-decoration" aria-hidden="true">✳</span>
      </section>

      <footer className="site-footer page-width">
        <a className="brand" href="#home"><span className="brand-mark" aria-hidden="true">P</span><span>Pani Puri <em>House</em></span></a>
        <p>Made with a little spice and a lot of love.</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </main>
  );
}
