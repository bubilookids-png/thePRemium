import React, { useRef } from 'react';
import { useMotionEntrance } from '../utils/motion';

export function Alert(props: { variant: 'error' | 'info' | 'success'; title: string; children?: React.ReactNode }) {
  const alertRef = useRef<HTMLDivElement>(null);
  useMotionEntrance(alertRef, `${props.variant}:${props.title}`);

  return <div ref={alertRef} className={`alert-box alert-${props.variant}`} role={props.variant === 'error' ? 'alert' : 'status'}>
    <strong>{props.title}</strong>{props.children ? <div className="mt-1 opacity-90">{props.children}</div> : null}
  </div>;
}
