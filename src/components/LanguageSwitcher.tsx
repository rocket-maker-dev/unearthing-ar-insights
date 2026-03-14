import { useTranslation } from "react-i18next";

const langs = [
  { code: "gl", label: "GL" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-secondary/50 p-0.5">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
            i18n.language === l.code || i18n.language.startsWith(l.code)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
