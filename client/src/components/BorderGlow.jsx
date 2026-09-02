import { useRef, useCallback, useEffect } from 'react';
import './BorderGlow.css';

function parseHSL(hsl) {
  const match = hsl.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) {
    return { h: 40, s: 80, l: 80 };
  }

  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3])
  };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];

  const vars = {};

  opacities.forEach((opacity, index) => {
    vars[`--glow-color${keys[index]}`] =
      `hsl(${h}deg ${s}% ${l}% / ${Math.min(
        opacity * intensity,
        100
      )}%)`;
  });

  return vars;
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%'
];

const GRADIENT_KEYS = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven'
];

const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};

  GRADIENT_KEYS.forEach((key, index) => {
    const color = colors[
      Math.min(COLOR_MAP[index], colors.length - 1)
    ];

    vars[key] =
      `radial-gradient(at ${GRADIENT_POSITIONS[index]}, ${color} 0px, transparent 50%)`;
  });

  vars['--gradient-base'] =
    `linear-gradient(${colors[0]} 0 100%)`;

  return vars;
}

function isLightColor(color) {
  const value = color.trim().replace('#', '');

  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) {
    return false;
  }

  const hex =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return r * 0.2126 + g * 0.7152 + b * 0.0722 > 180;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
  return x * x * x;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd
}) {
  const startTime = performance.now() + delay;

  function tick() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    onUpdate(
      start + (end - start) * ease(progress)
    );

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (onEnd) {
      onEnd();
    }
  }

  setTimeout(() => requestAnimationFrame(tick), delay);
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5
}) {
  const cardRef = useRef(null);

  const getCenter = useCallback((element) => {
    const { width, height } =
      element.getBoundingClientRect();

    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (element, x, y) => {
      const [cx, cy] = getCenter(element);

      const dx = x - cx;
      const dy = y - cy;

      const kx =
        dx !== 0 ? cx / Math.abs(dx) : Infinity;

      const ky =
        dy !== 0 ? cy / Math.abs(dy) : Infinity;

      return Math.min(
        Math.max(1 / Math.min(kx, ky), 0),
        1
      );
    },
    [getCenter]
  );

  const getCursorAngle = useCallback(
    (element, x, y) => {
      const [cx, cy] = getCenter(element);

      const dx = x - cx;
      const dy = y - cy;

      if (dx === 0 && dy === 0) {
        return 0;
      }

      let angle =
        Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      if (angle < 0) {
        angle += 360;
      }

      return angle;
    },
    [getCenter]
  );

  const handlePointerMove = useCallback(
    (event) => {
      const card = cardRef.current;

      if (!card) return;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty(
        '--edge-proximity',
        `${(edge * 100).toFixed(3)}`
      );

      card.style.setProperty(
        '--cursor-angle',
        `${angle.toFixed(3)}deg`
      );
    },
    [getEdgeProximity, getCursorAngle]
  );

  useEffect(() => {
    if (!animated || !cardRef.current) {
      return;
    }

    const card = cardRef.current;

    const angleStart = 110;
    const angleEnd = 465;

    card.classList.add('sweep-active');

    card.style.setProperty(
      '--cursor-angle',
      `${angleStart}deg`
    );

    animateValue({
      duration: 500,
      onUpdate: (value) => {
        card.style.setProperty(
          '--edge-proximity',
          value
        );
      }
    });

    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (value) => {
        const angle =
          (angleEnd - angleStart) * (value / 100) +
          angleStart;

        card.style.setProperty(
          '--cursor-angle',
          `${angle}deg`
        );
      }
    });

    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (value) => {
        const angle =
          (angleEnd - angleStart) * (value / 100) +
          angleStart;

        card.style.setProperty(
          '--cursor-angle',
          `${angle}deg`
        );
      }
    });

    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (value) => {
        card.style.setProperty(
          '--edge-proximity',
          value
        );
      },
      onEnd: () => {
        card.classList.remove('sweep-active');
      }
    });
  }, [animated]);

  const glowVars = buildGlowVars(
    glowColor,
    glowIntensity
  );

  const gradientVars = buildGradientVars(colors);

  const lightSurface =
    isLightColor(backgroundColor);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${
        lightSurface
          ? 'border-glow-card--light'
          : ''
      } ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...gradientVars
      }}
    >
      <span className="edge-light" />

      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
}
