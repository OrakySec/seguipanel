"use client";

import React, { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Search, X, Loader2, FileText,
  Bold, Italic, List, Link2, Code, Eye, EyeOff, Globe,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { upsertBlog, deleteBlog } from "./actions";
import { slugify } from "@/lib/utils";

interface BlogPost {
  id: number;
  title: string;
  urlSlug: string;
  category: string | null;
  image: string | null;
  content: string;
  metaDescription: string | null;
  metaKeywords: string | null;
  status: number;
  publishedAt: string | null;
  createdAt: string;
}

const CATEGORIES = ["Dicas", "Instagram", "TikTok", "YouTube", "Kwai", "Facebook", "Marketing Digital", "Comprar Seguidores"];

const EMPTY_FORM = {
  id: undefined as number | undefined,
  title: "",
  urlSlug: "",
  category: "",
  image: "",
  content: "",
  metaDescription: "",
  metaKeywords: "",
  status: 1,
  publishedAt: "",
};

function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function toLocalDatetimeValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ─── Rich Text Editor ─── */
function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlMode, setHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(value);
  const internalChange = useRef(false);

  // Sync external value → editor (on mount or switching from html mode)
  useEffect(() => {
    if (editorRef.current && !htmlMode) {
      internalChange.current = true;
      editorRef.current.innerHTML = value;
      internalChange.current = false;
    }
  }, [htmlMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set initial content
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = value;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = useCallback(() => {
    if (editorRef.current && !internalChange.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertLink = () => {
    const url = prompt("URL do link:");
    if (url) exec("createLink", url);
  };

  const toggleHtml = () => {
    if (!htmlMode) {
      // Switch to HTML mode: snapshot current HTML
      setRawHtml(editorRef.current?.innerHTML || value);
    } else {
      // Switch back to visual: apply raw HTML
      onChange(rawHtml);
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = rawHtml;
      }, 0);
    }
    setHtmlMode(!htmlMode);
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-surface">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-card flex-wrap">
        <ToolBtn title="Negrito" onClick={() => exec("bold")}><Bold size={14} /></ToolBtn>
        <ToolBtn title="Itálico" onClick={() => exec("italic")}><Italic size={14} /></ToolBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn title="Título H2" onClick={() => exec("formatBlock", "h2")}>H2</ToolBtn>
        <ToolBtn title="Título H3" onClick={() => exec("formatBlock", "h3")}>H3</ToolBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn title="Lista" onClick={() => exec("insertUnorderedList")}><List size={14} /></ToolBtn>
        <ToolBtn title="Link" onClick={insertLink}><Link2 size={14} /></ToolBtn>
        <div className="ml-auto">
          <ToolBtn title={htmlMode ? "Modo Visual" : "Editar HTML"} onClick={toggleHtml}>
            {htmlMode ? <EyeOff size={14} /> : <Code size={14} />}
            <span className="text-[10px] ml-1">{htmlMode ? "Visual" : "HTML"}</span>
          </ToolBtn>
        </div>
      </div>

      {htmlMode ? (
        <textarea
          value={rawHtml}
          onChange={(e) => { setRawHtml(e.target.value); onChange(e.target.value); }}
          className="w-full min-h-[320px] px-4 py-3 text-xs font-mono bg-surface outline-none resize-y text-foreground"
          placeholder="<h2>Título</h2><p>Conteúdo do artigo...</p>"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[320px] px-4 py-3 outline-none text-sm leading-7 text-foreground blog-editor-content"
          data-placeholder="Comece a escrever o conteúdo do artigo..."
          suppressContentEditableWarning
        />
      )}
    </div>
  );
}

function ToolBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex items-center px-2 py-1.5 rounded-lg text-muted hover:bg-surface hover:text-foreground transition-colors text-xs font-bold"
    >
      {children}
    </button>
  );
}

/* ─── Main Component ─── */
export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()) ||
      p.urlSlug.toLowerCase().includes(search.toLowerCase())
  );

  const isPublished = (p: BlogPost) => p.status === 1 && !!p.publishedAt && new Date(p.publishedAt) <= new Date();

  function openCreate() {
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(p: BlogPost) {
    setForm({
      id: p.id,
      title: p.title,
      urlSlug: p.urlSlug,
      category: p.category || "",
      image: p.image || "",
      content: p.content,
      metaDescription: p.metaDescription || "",
      metaKeywords: p.metaKeywords || "",
      status: p.status,
      publishedAt: toLocalDatetimeValue(p.publishedAt),
    });
    setFormError("");
    setModalOpen(true);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      // Auto-generate slug only when creating
      urlSlug: f.id ? f.urlSlug : slugify(title),
    }));
  }

  function handleSave() {
    if (!form.title.trim()) { setFormError("Informe o título do post."); return; }
    if (!form.content.trim() || form.content === "<br>") { setFormError("O conteúdo não pode estar vazio."); return; }
    if (form.metaDescription && form.metaDescription.length > 160) { setFormError("A meta description deve ter no máximo 160 caracteres."); return; }

    startTransition(async () => {
      const res = await upsertBlog({
        id: form.id,
        title: form.title,
        urlSlug: form.urlSlug || undefined,
        category: form.category || undefined,
        image: form.image || undefined,
        content: form.content,
        metaDescription: form.metaDescription || undefined,
        metaKeywords: form.metaKeywords || undefined,
        status: form.status,
        publishedAt: form.publishedAt || null,
      });

      if (!res.success) { setFormError(res.error || "Erro ao salvar."); return; }

      const saved: BlogPost = {
        id: form.id ?? Date.now(),
        title: form.title,
        urlSlug: form.urlSlug || slugify(form.title),
        category: form.category || null,
        image: form.image || null,
        content: form.content,
        metaDescription: form.metaDescription || null,
        metaKeywords: form.metaKeywords || null,
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        createdAt: posts.find((p) => p.id === form.id)?.createdAt ?? new Date().toISOString(),
      };

      if (form.id) {
        setPosts((prev) => prev.map((p) => (p.id === form.id ? saved : p)));
      } else {
        setPosts((prev) => [saved, ...prev]);
      }

      setModalOpen(false);
      toast("success", form.id ? "Post atualizado!" : "Post criado!");
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Excluir este post? Esta ação não pode ser desfeita.")) return;
    startTransition(async () => {
      const res = await deleteBlog(id);
      if (!res.success) { toast("error", res.error || "Erro ao excluir."); return; }
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast("success", "Post excluído.");
    });
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground mb-1">Blog & Conteúdo</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">
            Gerencie artigos para SEO e autoridade de marca
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-brand hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Novo Post
        </button>
      </header>

      {/* Tabela */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-card overflow-hidden">
        <div className="p-8 border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar por título, categoria ou slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-card rounded-2xl text-sm border border-border focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface/50 text-left">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Título</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Categoria</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Leitura</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Publicação</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.01 }}
                    className="hover:bg-surface/40 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground leading-tight max-w-[280px] truncate">{p.title}</p>
                          <p className="text-[10px] text-muted font-bold mt-0.5 font-mono">/blog/{p.urlSlug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {p.category ? (
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-wider">
                          {p.category}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted font-bold">—</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground">{readingTime(p.content)} min</span>
                    </td>
                    <td className="px-8 py-6">
                      {p.publishedAt ? (
                        <span className="text-sm font-bold text-foreground">
                          {new Date(p.publishedAt).toLocaleDateString("pt-BR")}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted font-black uppercase tracking-widest">Rascunho</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        isPublished(p)
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isPublished(p) ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                        {isPublished(p) ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPublished(p) && (
                          <a
                            href={`/blog/${p.urlSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-surface hover:bg-card hover:text-primary hover:shadow-sm rounded-xl transition-all text-muted"
                            title="Ver post"
                          >
                            <Globe size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(p)}
                          className="p-3 bg-surface hover:bg-card hover:text-primary hover:shadow-sm rounded-xl transition-all text-muted"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-3 bg-surface hover:bg-card hover:text-red-500 hover:shadow-sm rounded-xl transition-all text-muted"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-muted">
                        <FileText size={32} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest">Nenhum post encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-surface/30 border-t border-border">
          <p className="text-[10px] text-muted font-black uppercase tracking-widest">
            {filtered.length} post{filtered.length !== 1 ? "s" : ""} · {posts.filter(isPublished).length} publicado{posts.filter(isPublished).length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              className="relative bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-4xl my-8 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-0.5">
                    {form.id ? "Editar Post" : "Novo Post"}
                  </p>
                  <h3 className="text-xl font-black text-foreground tracking-tighter">
                    {form.id ? "Atualizar artigo" : "Criar artigo"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-surface rounded-xl text-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Linha 1: Título */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Título do Post *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Como comprar seguidores no Instagram em 2026"
                    className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Linha 2: Slug + Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={form.urlSlug}
                      onChange={(e) => setForm((f) => ({ ...f, urlSlug: e.target.value }))}
                      placeholder="como-comprar-seguidores-instagram"
                      className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <p className="text-[9px] text-muted font-bold mt-1 ml-1">seguifacil.com/blog/{form.urlSlug || "…"}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Categoria</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Sem categoria</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Linha 3: Imagem + PublishedAt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">URL da Imagem de Capa</label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="https://..."
                      className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                      Data de Publicação <span className="text-muted/60">(vazio = rascunho)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                      className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                    Meta Description (SEO)
                    <span className={`ml-2 ${form.metaDescription.length > 160 ? "text-red-500" : "text-muted/60"}`}>
                      {form.metaDescription.length}/160
                    </span>
                  </label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                    rows={2}
                    placeholder="Descrição que aparece no Google (máx. 160 caracteres)"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Meta Keywords (SEO)</label>
                  <input
                    type="text"
                    value={form.metaKeywords}
                    onChange={(e) => setForm((f) => ({ ...f, metaKeywords: e.target.value }))}
                    placeholder="comprar seguidores instagram, seguidores reais, como crescer"
                    className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Editor de Conteúdo */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">Conteúdo do Artigo *</label>
                  <RichEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                  />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
                  <div>
                    <p className="text-sm font-black text-foreground">Post Ativo</p>
                    <p className="text-[10px] text-muted font-bold mt-0.5">Aparece no blog quando a data de publicação chegar</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: f.status === 1 ? 0 : 1 }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${form.status === 1 ? "bg-emerald-500" : "bg-border"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.status === 1 ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Erro */}
                {formError && (
                  <p className="text-xs text-red-500 font-bold flex items-center gap-1.5 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
                    {formError}
                  </p>
                )}

                {/* Botão Salvar */}
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full py-4 bg-brand-gradient text-white font-black rounded-2xl shadow-brand hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  {isPending ? <><Loader2 size={16} className="animate-spin" /> Salvando…</> : <><FileText size={16} /> {form.id ? "Atualizar Post" : "Publicar Post"}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
