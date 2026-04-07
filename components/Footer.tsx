export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#01050d] px-6 py-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center text-sm text-white/50 gap-4">
        <p>© 2026 Storify</p>

        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  );
}