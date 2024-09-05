import "./Hero.css"

function Hero() {
  return (
    <section className="ccip-hero">
      <img src="/assets/ccip.png" alt="" className="ccip-hero__grid" />
      <div className="ccip-hero__content">
        <h1 className="ccip-hero__heading">Networks & Tokens</h1>
        <div className="ccip-hero__search">
          <img src="/assets/icons/search.svg" alt="" />
          <input type="text" placeholder="Network/Token/Lane" />
        </div>
      </div>
    </section>
  )
}

export default Hero
