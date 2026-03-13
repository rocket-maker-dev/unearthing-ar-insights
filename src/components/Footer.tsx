import { Github } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border px-6 py-8">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>Proyecto FLL 2026 — Maker Lab · Espacio Vivo · Ferrol, Galicia</p>
      <div className="flex items-center gap-6">
        <a href="https://espaciovivo.gal/fll-robot/presentacion-robot.html" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
          🤖 Robot Game
        </a>
        <a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
          <Github size={16} /> GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
