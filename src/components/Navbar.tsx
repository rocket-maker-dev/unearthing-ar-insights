import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import logo from "@/assets/logo_vision_maker_lab.png";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Problema", href: "/#problema" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Arquitectura", href: "/#arquitectura" },
  { label: "Replica", href: "/#replica" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Equipo", href: "/#equipo" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const { user, isAdmin, signIn, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    const err = await signIn(email, password);
    if (err) setLoginError(err);
    else setShowLogin(false);
    setLoggingIn(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="Vision Maker Lab" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-gradient">UNEARTHED</span>{" "}
              <span className="text-foreground">AR</span>
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  if (l.href.startsWith("/") && !l.href.includes("#")) {
                    e.preventDefault();
                    navigate(l.href);
                  } else if (l.href.startsWith("/#") && location.pathname === "/") {
                    e.preventDefault();
                    document.querySelector(l.href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
                    <Shield size={12} /> Admin
                  </span>
                )}
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={14} /> Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn size={14} /> Admin
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 space-y-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={14} className="inline mr-1" /> Cerrar sesión
              </button>
            ) : (
              <button
                onClick={() => { setShowLogin(true); setOpen(false); }}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn size={14} className="inline mr-1" /> Admin
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2"><Shield size={18} className="text-primary" /> Acceso admin</h3>
              <button onClick={() => setShowLogin(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="admin@ejemplo.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loggingIn ? "Entrando…" : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
