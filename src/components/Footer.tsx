import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/10 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl pt-16 pb-8 transition-colors duration-300">
      <div className="container-tight px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-foreground dark:text-white">Cryptaris</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Advanced encryption and security tools for the modern web. Protect your data with military-grade privacy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground dark:text-white tracking-wider uppercase">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/encrypt" className="hover:text-primary transition-colors">Encrypt Data</Link>
              </li>
              <li>
                <Link to="/decrypt" className="hover:text-primary transition-colors">Decrypt Data</Link>
              </li>
              <li>
                <Link to="/tools/decoy" className="hover:text-primary transition-colors">Decoy Generator</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground dark:text-white tracking-wider uppercase">Legal & Help</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/10 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Cryptaris. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
              All Systems Operational
            </span>
            <span>v1.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
