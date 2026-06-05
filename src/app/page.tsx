import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Roadmap from "@/components/Roadmap";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Navbar />
      <Hero />
      <Services />
      <Products />
      <Roadmap />
      <Contact />
      <Footer />
    </main>
  );
}
