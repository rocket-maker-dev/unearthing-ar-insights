import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>{t("footer.project_info")} · <a href="mailto:unearthed@maker.gal" className="hover:text-foreground transition-colors">unearthed@maker.gal</a></p>
        <div className="flex items-center gap-6">
          <a href="https://espaciovivo.gal/fll-robot/presentacion-robot.html" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            {t("footer.robot_game")}
          </a>
          <a href="#" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
            <Github size={16} /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
