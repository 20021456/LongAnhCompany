'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { Icon } from '@/components/ui/Icon';

interface Msg {
  id: string;
  senderType: string; // visitor | agent | bot
  message: string;
  createdAt: string;
}

const LS_KEY = 'la_chat_session';
const POLL_MS = 4000;

const T: Record<Locale, Record<string, string>> = {
  vi: {
    title: 'Hỗ trợ trực tuyến',
    sub: 'Thường phản hồi trong vài phút',
    greet: 'Xin chào! Long Anh có thể giúp gì cho bạn?',
    placeholder: 'Nhập tin nhắn…',
    open: 'Chat với chúng tôi',
    you: 'Bạn',
    agent: 'Hỗ trợ viên',
  },
  en: {
    title: 'Live support',
    sub: 'Usually replies within minutes',
    greet: 'Hi there! How can Long Anh help you?',
    placeholder: 'Type a message…',
    open: 'Chat with us',
    you: 'You',
    agent: 'Support',
  },
  zh: {
    title: '在线支持',
    sub: '通常几分钟内回复',
    greet: '您好!龙英可以为您提供什么帮助?',
    placeholder: '输入消息…',
    open: '与我们聊天',
    you: '您',
    agent: '客服',
  },
};

const ACCENT = '#F08023';

export function ChatWidget({ locale }: { locale: Locale }) {
  const t = T[locale] ?? T.vi;
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);

  const seenAgentRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore an existing session from a previous visit.
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) setSessionId(stored);
  }, []);

  const poll = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat/${sessionId}`, { cache: 'no-store' });
      if (res.status === 404) {
        localStorage.removeItem(LS_KEY);
        setSessionId(null);
        return;
      }
      if (!res.ok) return;
      const json = (await res.json()) as { messages: Msg[] };
      setMessages(json.messages);
    } catch {
      /* network blip — next tick retries */
    }
  }, [sessionId]);

  // Poll for new messages while a session is active.
  useEffect(() => {
    if (!sessionId) return;
    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);
    return () => clearInterval(timer);
  }, [sessionId, poll]);

  // Track unread agent messages while the panel is closed.
  useEffect(() => {
    const agentCount = messages.filter((m) => m.senderType !== 'visitor').length;
    if (open) {
      seenAgentRef.current = agentCount;
      setUnread(0);
    } else {
      setUnread(Math.max(0, agentCount - seenAgentRef.current));
    }
  }, [messages, open]);

  // Keep the thread scrolled to the latest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      let sid = sessionId;
      if (!sid) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ locale }),
        });
        if (!res.ok) throw new Error('create failed');
        sid = ((await res.json()) as { sessionId: string }).sessionId;
        localStorage.setItem(LS_KEY, sid);
        setSessionId(sid);
      }
      setDraft('');
      const res = await fetch(`/api/chat/${sid}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const json = (await res.json()) as { message?: Msg };
        if (json.message) {
          setMessages((prev) =>
            prev.some((m) => m.id === json.message!.id) ? prev : [...prev, json.message!],
          );
        }
      }
    } catch {
      setDraft(text);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open ? (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 20,
            width: 'min(360px, calc(100vw - 40px))',
            height: 'min(520px, calc(100vh - 130px))',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 18px 50px rgba(0,0,0,.22)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            border: '1px solid rgba(0,0,0,.08)',
          }}
        >
          <div style={{ background: ACCENT, color: '#fff', padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{t.title}</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>{t.sub}</div>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: '#f7f7f8',
            }}
          >
            <Bubble who="agent" label={t.agent} text={t.greet} />
            {messages.map((m) => (
              <Bubble
                key={m.id}
                who={m.senderType === 'visitor' ? 'visitor' : 'agent'}
                label={m.senderType === 'visitor' ? t.you : t.agent}
                text={m.message}
              />
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            style={{
              display: 'flex',
              gap: 8,
              padding: 10,
              borderTop: '1px solid rgba(0,0,0,.08)',
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.placeholder}
              style={{
                flex: 1,
                border: '1px solid rgba(0,0,0,.15)',
                borderRadius: 10,
                padding: '9px 12px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              aria-label="Send"
              style={{
                background: ACCENT,
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                width: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: sending || !draft.trim() ? 'default' : 'pointer',
                opacity: sending || !draft.trim() ? 0.6 : 1,
              }}
            >
              <Icon name="arrow" size={16} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.open}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: ACCENT,
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(240,128,35,.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <Icon
          name={open ? 'plus' : 'mail'}
          size={22}
          style={open ? { transform: 'rotate(45deg)' } : undefined}
        />
        {unread > 0 && !open ? (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              minWidth: 20,
              height: 20,
              padding: '0 5px',
              borderRadius: 10,
              background: '#e23b3b',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
            }}
          >
            {unread}
          </span>
        ) : null}
      </button>
    </>
  );
}

function Bubble({ who, label, text }: { who: 'visitor' | 'agent'; label: string; text: string }) {
  const isVisitor = who === 'visitor';
  return (
    <div style={{ alignSelf: isVisitor ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
      <div
        style={{
          fontSize: 10.5,
          color: '#888',
          marginBottom: 2,
          textAlign: isVisitor ? 'right' : 'left',
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: '8px 11px',
          borderRadius: 12,
          fontSize: 13.5,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: isVisitor ? ACCENT : '#fff',
          color: isVisitor ? '#fff' : '#222',
          border: isVisitor ? 'none' : '1px solid rgba(0,0,0,.08)',
        }}
      >
        {text}
      </div>
    </div>
  );
}
