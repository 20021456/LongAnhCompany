'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AdminIcon } from '@/components/admin/AdminIcon';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setBusy(false);
    if (res?.error) {
      setError('Email hoặc mật khẩu không đúng.');
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <div className="lg-wrap">
      <div className="lg-pitch">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/long-anh-logo.png" alt="Long Anh" />
          <div className="name">
            Long Anh
            <small>Admin Panel</small>
          </div>
        </div>
        <div>
          <h1>
            Quản lý nội dung —<br />
            nhanh, an toàn, có phân quyền.
          </h1>
          <p>
            Cập nhật sản phẩm, tin tức, tuyển dụng và theo dõi liên hệ khách hàng — tất cả trong một
            bảng điều khiển.
          </p>
          <div className="stats">
            <div className="stat">
              <b>31</b>
              <span>bảng dữ liệu</span>
            </div>
            <div className="stat">
              <b>3</b>
              <span>ngôn ngữ</span>
            </div>
            <div className="stat">
              <b>5</b>
              <span>vai trò</span>
            </div>
          </div>
        </div>
        <div className="foot">© 2026 Công ty TNHH KS Long Anh</div>
      </div>

      <div className="lg-form-side">
        <div className="lg-card">
          <div className="eyebrow">Bảng điều khiển</div>
          <h2>Chào mừng quay lại</h2>
          <p className="sub">Đăng nhập bằng tài khoản quản trị của bạn.</p>

          <form className="lg-form" onSubmit={onSubmit}>
            <div className="ad-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="ad-input"
                type="email"
                autoFocus
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@longanhcorp.com"
              />
            </div>

            <div className="ad-field">
              <label htmlFor="password">Mật khẩu</label>
              <div className="pw-wrap">
                <input
                  id="password"
                  className="ad-input"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="eye"
                  aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  onClick={() => setShowPw((s) => !s)}
                >
                  <AdminIcon name={showPw ? 'check' : 'search'} size={15} />
                </button>
              </div>
            </div>

            {error ? (
              <div className="lg-err">
                <AdminIcon name="shield" size={14} />
                {error}
              </div>
            ) : null}

            <div className="lg-options">
              <label>
                <input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập
              </label>
            </div>

            <button type="submit" className="ad-btn primary" disabled={busy}>
              {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>

          <div className="lg-demo">
            <div className="demo-head">Tài khoản mặc định (sau khi seed)</div>
            <div className="demo-row">
              <div>
                <div className="demo-name">Long Anh Admin</div>
                <div className="demo-role">
                  <code>admin@longanhcorp.com</code> · <code>ChangeMe123!</code>
                </div>
              </div>
              <button
                type="button"
                className="use"
                onClick={() => {
                  setEmail('admin@longanhcorp.com');
                  setPassword('ChangeMe123!');
                }}
              >
                Dùng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
