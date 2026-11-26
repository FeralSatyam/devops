const menu = [
  {
    name: 'Classic Pani Puri',
    description: 'Crisp puris, potato, chickpeas and our tangy house pani.',
    price: '₹80',
    icon: '🥣',
    label: 'The original',
  },
  {
    name: 'Dahi Puri',
    description: 'Cool yogurt, sweet chutney, sev and a little bit of magic.',
    price: '₹100',
    icon: '🥛',
    label: 'Creamy & cool',
  },
  {
    name: 'Sukha Puri',
    description: 'A crunchy finish filled with masala, chutneys and sev.',
    price: '₹60',
    icon: '✨',
    label: 'One more bite',
  },
];

const puris = ['🌿', '🌶️', '🥔', '🌱', '🧅', '🍋'];

export default function App() {
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
                  <span>{item.price}</span>
                </div>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
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
        <a className="button button-light" href="#menu">Find your favourite <span aria-hidden="true">↑</span></a>
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
