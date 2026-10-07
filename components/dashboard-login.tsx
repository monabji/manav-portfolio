'use client';
import { useState } from 'react';
import { AeroWindow } from './aero-window';
import { crystalIcons } from '@/config/portfolio';
export function DashboardLogin() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      setPassword(''); const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Sign-in failed.');
      window.location.replace('/dashboard');
    } catch (error) { setError(error instanceof Error ? error.message : 'Sign-in failed. Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="route-stage dashboard-stage" id="main-content"><AeroWindow title="Administrator sign-in" icon={crystalIcons.profile} className="content-window dashboard-window" breadcrumbs={[{ label: 'Control Panel' }, { label: 'Sign in' }]}>
    <div className="dashboard-body has-scrollbar"><section className="dashboard-login"><img src={crystalIcons.profile} alt="" /><h1>Welcome back, Manav</h1><p>This control panel is password protected. Sign in to edit and publish your portfolio.</p>
      <form onSubmit={signIn}><label htmlFor="admin-password">Administrator password</label><input id="admin-password" type="password" autoComplete="current-password" maxLength={128} value={password} onChange={event => setPassword(event.target.value)} required disabled={busy} /><button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form>
      <p role="alert">{error}</p><small>Your password is verified on the server. This browser never stores it.</small></section></div>
    <footer className="window-status"><span>Administrator access only</span><span>Secure sign-in</span></footer>
  </AeroWindow></main>;
}
