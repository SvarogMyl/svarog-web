export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold">Svarog</span>
          <span>EcoSystem</span>
          <span>·</span>
          <span>svasoft.cl</span>
        </div>
        <span>© {year} Svarog EcoSystem. Hecho en Chile 🇨🇱</span>
      </div>
    </footer>
  );
}
