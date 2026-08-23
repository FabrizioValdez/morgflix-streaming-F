import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import ContentRow from "@/components/home/ContentRow";
import Footer from "@/components/home/Footer";

import { getMoviesCatalog } from "@/lib/movies";
import { ROWS as MOCK_ROWS } from "@/app/data/movies";

export default async function HomeScreen() {
  const apiRows = await getMoviesCatalog();
  const rows = apiRows && apiRows.length > 0 ? apiRows : MOCK_ROWS;

  return (
    <div
      style={{
        background: "#0E0B0A",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* Al no pasar featuredMovie, el Hero utilizará Evangelion y /images/evangelion.jpg por defecto */}
      <Hero />

      <main className="relative z-10 -mt-10 pb-20">
        {rows.map((row) => (
          <ContentRow
            key={row.title}
            title={row.title}
            items={row.items}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}