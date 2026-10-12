"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";

import { ErrorBanner } from "@/components/admin/fields";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { handleAdminError } from "@/lib/admin";
import { cn, formatDateTime } from "@/lib/utils";
import { messagesService } from "@/services/resources";
import type { ContactMessage } from "@/types";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setMessages(await messagesService.list());
      setError(null);
    } catch (e) {
      setError(handleAdminError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function setRead(message: ContactMessage, isRead: boolean) {
    try {
      const updated = await messagesService.setRead(message.id, isRead);
      setMessages((list) => list.map((m) => (m.id === updated.id ? updated : m)));
    } catch (e) {
      setError(handleAdminError(e));
    }
  }

  async function toggle(message: ContactMessage) {
    const opening = openId !== message.id;
    setOpenId(opening ? message.id : null);
    if (opening && !message.is_read) await setRead(message, true);
  }

  async function remove(message: ContactMessage) {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await messagesService.remove(message.id);
      setMessages((list) => list.filter((m) => m.id !== message.id));
    } catch (e) {
      setError(handleAdminError(e));
    }
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <SectionTitle
        title="Messages"
        description={`Messages reçus via le formulaire de contact — ${unread} non lu(s).`}
      />
      <ErrorBanner message={error} />

      <div className="mt-4 space-y-3">
        {loading && <p className="text-slate-500">Chargement…</p>}
        {!loading && messages.length === 0 && <Card className="text-center text-slate-500">Aucun message.</Card>}

        {messages.map((message) => {
          const isOpen = openId === message.id;
          return (
            <Card key={message.id} className={cn("p-0", !message.is_read && "border-cyan-400/60")}>
              <button
                type="button"
                onClick={() => toggle(message)}
                className="flex w-full items-center gap-4 p-4 text-left"
                aria-expanded={isOpen}
              >
                <span className={message.is_read ? "text-slate-400" : "text-cyan-500"}>
                  {message.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate", !message.is_read ? "font-bold" : "font-medium", "text-slate-900 dark:text-white")}>
                    {message.subject}
                  </span>
                  <span className="block truncate text-sm text-slate-500">
                    {message.name} · {message.email}
                  </span>
                </span>
                <span className="hidden text-sm text-slate-500 sm:block">{formatDateTime(message.created_at)}</span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                  <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">{message.message}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                      className="inline-flex items-center rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
                    >
                      Répondre par email
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => setRead(message, !message.is_read)}>
                      Marquer comme {message.is_read ? "non lu" : "lu"}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => remove(message)}>
                      <Trash2 size={14} /> Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
