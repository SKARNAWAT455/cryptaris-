import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Encrypt", path: "/encrypt" },
  { label: "Decrypt", path: "/decrypt" },
  { label: "Tools", path: "/tools/decoy" }, // We'll handle this specially below
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-nav shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="container-tight flex items-center justify-between h-16 px-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          Cryptaris
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.label === "Tools") {
              return (
                <div key="tools" className="relative group">
                  <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 pb-1 ${location.pathname.startsWith('/tools') ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    Tools
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-popover border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <div className="py-1">
                      <Link to="/tools/decoy" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors">Decoy Generator</Link>
                      <Link to="/tools/shred" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors">Server File Shredder</Link>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 pb-1 ${location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0"
                    }`}
                />
              </Link>
            )
          })}
          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-border/30 animate-fade-up">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => {
              if (link.label === "Tools") {
                return (
                  <div key="tools-mobile" className="flex flex-col gap-1 mt-2 border-t border-border/50 pt-2">
                    <span className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</span>
                    <Link to="/tools/decoy" className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/tools/decoy' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>Decoy Generator</Link>
                    <Link to="/tools/shred" className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/tools/shred' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>Server File Shredder</Link>
                  </div>
                )
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
