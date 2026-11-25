import type { ReactNode } from 'react';

import './PhoneFrame.css';

export function PhoneFrame({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return (
    <div className={`phone-shell ${enabled ? 'phone-shell--framed' : ''}`}>
      <div className="phone-shell__backdrop" aria-hidden />
      <div className="phone-shell__device">{children}</div>
    </div>
  );
}