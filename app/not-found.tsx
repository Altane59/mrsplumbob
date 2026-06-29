import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center" }}>
      <p className="eyebrow">💔 Lost in Sulani</p>
      <h1 className="page big">
        <span className="gradtext">404</span>
      </h1>
      <p className="sub" style={{ margin: "0 auto 26px" }}>
        We couldn&apos;t find that page. Let&apos;s get you back to something to play.
      </p>
      <div className="btn-row" style={{ justifyContent: "center" }}>
        <Link className="big-btn" href="/">
          🏠 Home
        </Link>
        <Link className="ghost-btn" href="/browse">
          Browse challenges
        </Link>
      </div>
    </section>
  );
}
