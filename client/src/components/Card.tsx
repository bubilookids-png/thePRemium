import React from 'react';

export function Card(props: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className={`section-card ${props.className || ''}`}>
      {(props.title || props.rightSlot) && (
        <header className="section-head">
          <div>
            {props.title ? <h2 className="section-title">{props.title}</h2> : null}
            {props.subtitle ? <p className="section-kicker">{props.subtitle}</p> : null}
          </div>
          {props.rightSlot}
        </header>
      )}
      <div className="section-body">{props.children}</div>
    </section>
  );
}
