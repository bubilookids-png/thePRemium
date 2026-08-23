import React from 'react';
export function Alert(props: { variant: 'error' | 'info' | 'success'; title: string; children?: React.ReactNode }) {
  return <div className={`alert-box alert-${props.variant}`} role={props.variant === 'error' ? 'alert' : 'status'}>
    <strong>{props.title}</strong>{props.children ? <div className="mt-1 opacity-90">{props.children}</div> : null}
  </div>;
}
