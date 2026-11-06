const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-800/80 text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">Furniro</span>
          <span className="text-slate-600">•</span>
          <span>Operations & Commerce Console</span>
        </div>
        <div>© {new Date().getFullYear()} Furniro. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
