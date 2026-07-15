'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from './AdminIcon';
import { fmtDateTimeVn } from '@/lib/format';
import {
  sendAgentMessage,
  setSessionStatus,
  assignSession,
  type ActionResult,
} from '@/app/admin/(panel)/livechat/actions';

export interface ChatMessageRow {
  id: string;
  senderType: string; // visitor | agent | bot
  message: string;
  createdAt: string;
}

const SENDER_LABEL: Record<string, string> = {
  visitor: 'Khách',
  agent: 'Hỗ trợ viên',
  bot: 'Bot',
};

export function ChatThread({
  sessionId,
  status,
  assignedAgentName,
  messages,
}: {
  sessionId: string;
  status: 'open' | 'closed';
  assignedAgentName: string | null;
  messages: ChatMessageRow[];
}) {
  const router = useRouter();
  const [reply, setReply] = useState('');
  const [state, setState] = useState<ActionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const closed = status === 'closed';

  // Poll for new visitor messages — the public widget posts over the
  // `/api/chat` route, so re-fetching this server component keeps the
  // agent's view current without a socket connection.
  useEffect(() => {
    if (closed) return;
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [closed, router]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setState(null);
    const res = await sendAgentMessage({ sessionId, message: reply });
    setBusy(false);
    setState(res);
    if (res.ok) {
      setReply('');
      router.refresh();
    }
  }

  async function run(fn: () => Promise<ActionResult>) {
    setBusy(true);
    setState(null);
    const res = await fn();
    setBusy(false);
    setState(res);
    if (res.ok) router.refresh();
  }

  return (
    <div className="ad-card">
      <div className="ad-card-head">
        <div>
          <h3>
            Cuộc trò chuyện
            <span className={'ad-badge ' + (closed ? 'hide' : 'pub')} style={{ marginLeft: 8 }}>
              <span className="dot" />
              {closed ? 'đã đóng' : 'đang mở'}
            </span>
          </h3>
          <p>Phụ trách: {assignedAgentName ?? 'chưa gán'}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="ad-btn sm"
            disabled={busy}
            onClick={() => run(() => assignSession(sessionId))}
          >
            <AdminIcon name="users" size={13} /> Nhận phụ trách
          </button>
          {closed ? (
            <button
              type="button"
              className="ad-btn sm"
              disabled={busy}
              onClick={() => run(() => setSessionStatus(sessionId, 'open'))}
            >
              Mở lại
            </button>
          ) : (
            <button
              type="button"
              className="ad-btn sm danger"
              disabled={busy}
              onClick={() => run(() => setSessionStatus(sessionId, 'closed'))}
            >
              Đóng phiên
            </button>
          )}
        </div>
      </div>
      <div className="ad-card-body">
        {state?.error ? (
          <div className="lg-err" style={{ marginBottom: 12 }}>
            <AdminIcon name="shield" size={14} />
            {state.error}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            maxHeight: 480,
            overflowY: 'auto',
            paddingRight: 4,
          }}
        >
          {messages.length === 0 ? (
            <div className="ad-empty">Chưa có tin nhắn nào trong phiên này.</div>
          ) : (
            messages.map((m) => {
              const isAgent = m.senderType === 'agent';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isAgent ? 'flex-end' : 'flex-start',
                    maxWidth: '72%',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--ad-text-mute)',
                      marginBottom: 3,
                      textAlign: isAgent ? 'right' : 'left',
                    }}
                  >
                    {SENDER_LABEL[m.senderType] ?? m.senderType} · {fmtDateTimeVn(m.createdAt)}
                  </div>
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      whiteSpace: 'pre-wrap',
                      background: isAgent ? 'var(--ad-primary)' : 'var(--ad-line-soft)',
                      color: isAgent ? '#fff' : 'var(--ad-text)',
                      border: isAgent ? 'none' : '1px solid var(--ad-line)',
                    }}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={onSend} style={{ marginTop: 16 }}>
          <textarea
            className="ad-textarea"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={closed ? 'Phiên đã đóng — mở lại để trả lời.' : 'Nhập câu trả lời…'}
            disabled={closed || busy}
            rows={3}
          />
          <div style={{ marginTop: 8 }}>
            <button
              type="submit"
              className="ad-btn primary"
              disabled={closed || busy || !reply.trim()}
            >
              <AdminIcon name="chat" size={15} />
              {busy ? 'Đang gửi…' : 'Gửi trả lời'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
