import React from 'react';
import BorderGlow from './BorderGlow';

export function Card(props: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <BorderGlow
      backgroundColor="#120F17"
      borderRadius={28}
      glowRadius={40}
      glowIntensity={0.9}
      colors={['#c084fc', '#5227FF', '#38bdf8']}
      glowColor="40 80 80"
      edgeSensitivity={30}
      coneSpread={25}
      fillOpacity={0.5}
    >
      <section className={`section-card ${props.className || ''}`}>
        {(props.title || props.rightSlot) && (
          <header className="section-head">
            <div>
              {props.title ? (
                <h2 className="section-title">{props.title}</h2>
              ) : null}

              {props.subtitle ? (
                <p className="section-kicker">
                  {props.subtitle}
                </p>
              ) : null}
            </div>

            {props.rightSlot}
          </header>
        )}

        <div className="section-body">
          {props.children}
        </div>
      </section>
    </BorderGlow>
  );
}