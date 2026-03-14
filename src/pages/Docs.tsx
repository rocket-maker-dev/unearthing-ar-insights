import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ArrowLeft, BookOpen, ChevronRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

const slugify = (text: string) =>
  text
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // keep letters (any language), numbers, spaces, hyphens
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const cleanText = (raw: string) =>
  raw.replace(/[^\p{L}\p{N}\s—\-:]/gu, "").trim();

const Docs = () => {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [tocOpen, setTocOpen] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    fetch("/docs/DOCS.md")
      .then((r) => r.text())
      .then((text) => {
        setMarkdown(text);
        const regex = /^(#{1,3})\s+(.+)$/gm;
        const h: { id: string; text: string; level: number }[] = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
          const clean = cleanText(match[2]);
          const id = slugify(clean);
          h.push({ id, text: clean, level: match[1].length });
        }
        setHeadings(h);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">{t("docs.loading")}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20">
        <div className="max-w-[90rem] mx-auto flex">
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">{t("docs.content")}</span>
            </div>
            <nav className="space-y-0.5">
              {headings.map((h, i) => (
                <button key={i} onClick={() => scrollTo(h.id)} className={`block w-full text-left text-sm transition-colors rounded-md px-3 py-1.5 hover:bg-secondary hover:text-foreground ${h.level === 1 ? "font-bold text-foreground" : h.level === 2 ? "pl-5 text-muted-foreground font-medium" : "pl-9 text-muted-foreground/70 text-xs"}`}>
                  {h.text}
                </button>
              ))}
            </nav>
          </aside>

          <button onClick={() => setTocOpen(!tocOpen)} className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center">
            {tocOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {tocOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-20 overflow-y-auto p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={18} className="text-primary" />
                <span className="text-sm font-bold uppercase tracking-wider text-primary">{t("docs.content")}</span>
              </div>
              <nav className="space-y-1">
                {headings.map((h, i) => (
                  <button key={i} onClick={() => scrollTo(h.id)} className={`block w-full text-left transition-colors rounded-md px-3 py-2 hover:bg-secondary hover:text-foreground ${h.level === 1 ? "font-bold text-foreground text-base" : h.level === 2 ? "pl-5 text-muted-foreground font-medium text-sm" : "pl-9 text-muted-foreground/70 text-xs"}`}>
                    {h.text}
                  </button>
                ))}
              </nav>
            </div>
          )}

          <main className="flex-1 min-w-0 px-6 md:px-12 py-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">{t("docs.home")}</Link>
              <ChevronRight size={14} />
              <span className="text-foreground font-medium">{t("docs.documentation")}</span>
            </div>

            <article className="docs-prose max-w-4xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children, ...props }) => { const text = String(children).replace(/[^\w\sáéíóúñü—]/gi, "").trim(); const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""); return <h1 id={id} className="text-3xl md:text-4xl font-bold mb-6 mt-12 first:mt-0 text-foreground scroll-mt-24" {...props}>{children}</h1>; },
                  h2: ({ children, ...props }) => { const text = String(children).replace(/[^\w\sáéíóúñü—]/gi, "").trim(); const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""); return <h2 id={id} className="text-2xl font-bold mb-4 mt-10 text-foreground border-b border-border pb-3 scroll-mt-24" {...props}>{children}</h2>; },
                  h3: ({ children, ...props }) => { const text = String(children).replace(/[^\w\sáéíóúñü—]/gi, "").trim(); const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""); return <h3 id={id} className="text-xl font-semibold mb-3 mt-8 text-foreground scroll-mt-24" {...props}>{children}</h3>; },
                  h4: ({ children, ...props }) => <h4 className="text-lg font-semibold mb-2 mt-6 text-foreground" {...props}>{children}</h4>,
                  p: ({ children, ...props }) => <p className="text-muted-foreground leading-relaxed mb-4" {...props}>{children}</p>,
                  a: ({ children, href, ...props }) => <a href={href} className="text-primary hover:underline underline-offset-4 transition-colors" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined} {...props}>{children}</a>,
                  ul: ({ children, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-muted-foreground" {...props}>{children}</ul>,
                  ol: ({ children, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-muted-foreground" {...props}>{children}</ol>,
                  li: ({ children, ...props }) => <li className="leading-relaxed" {...props}>{children}</li>,
                  blockquote: ({ children, ...props }) => <blockquote className="border-l-4 border-primary/40 bg-primary/5 rounded-r-lg pl-4 pr-4 py-3 mb-4 text-muted-foreground italic" {...props}>{children}</blockquote>,
                  code: ({ className, children, ...props }) => { const isInline = !className; if (isInline) { return <code className="bg-secondary text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props}>{children}</code>; } return <code className={`${className} text-sm`} {...props}>{children}</code>; },
                  pre: ({ children, ...props }) => <pre className="bg-[hsl(var(--secondary))] border border-border rounded-xl p-4 mb-4 overflow-x-auto text-sm leading-relaxed" {...props}>{children}</pre>,
                  table: ({ children, ...props }) => <div className="overflow-x-auto mb-6 rounded-xl border border-border"><table className="w-full text-sm" {...props}>{children}</table></div>,
                  thead: ({ children, ...props }) => <thead className="bg-secondary/60 text-foreground" {...props}>{children}</thead>,
                  th: ({ children, ...props }) => <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider border-b border-border" {...props}>{children}</th>,
                  td: ({ children, ...props }) => <td className="px-4 py-3 text-muted-foreground border-b border-border/50" {...props}>{children}</td>,
                  tr: ({ children, ...props }) => <tr className="hover:bg-secondary/30 transition-colors" {...props}>{children}</tr>,
                  hr: () => <hr className="border-border my-10" />,
                  strong: ({ children, ...props }) => <strong className="text-foreground font-semibold" {...props}>{children}</strong>,
                  img: ({ src, alt, ...props }) => <img src={src} alt={alt} className="rounded-xl border border-border my-4 max-w-full" loading="lazy" {...props} />,
                }}
              />
            </article>

            <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={14} /> {t("docs.back_home")}
              </Link>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4">
                ↑ {t("docs.back_top")}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Docs;
