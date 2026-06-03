'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Picko() {
  const { events, hoveredEventId } = useStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const pickoRef = useRef<HTMLDivElement>(null);

  // --- Toggle follow on click ---
  const handlePickoClick = () => {
    setIsFollowing((prev) => !prev);
  };

  // --- Green dot: return home ---
  const handleReturn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(false);
  };

  // --- Track mouse only when following ---
  useEffect(() => {
    if (!isFollowing) return;
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isFollowing]);

  // --- Eye tracking ---
  let eyeX = 0;
  let eyeY = 0;
  if (isFollowing && pickoRef.current) {
    const rect = pickoRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(mousePos.y - cy, mousePos.x - cx);
    const dist = Math.min(3, Math.hypot(mousePos.x - cx, mousePos.y - cy) / 10);
    eyeX = Math.cos(angle) * dist;
    eyeY = Math.sin(angle) * dist;
  }

  // --- Which event to display? ---
  // When following + hovering over a card → show that card's info
  const hoveredEvent = hoveredEventId ? events.find((e) => e.id === hoveredEventId) : null;
  const displayEvent = hoveredEvent || null;
  const rating = displayEvent ? (4 + (displayEvent.id.length % 10) / 10).toFixed(1) : '4.8';

  const isHappy = isFollowing;

  // --- Positioning ---
  // Follow ~35px to the right and below the cursor (close, like a pet)
  const OFFSET = 35;
  const containerStyle: React.CSSProperties = isFollowing
    ? { position: 'fixed', left: mousePos.x + OFFSET, top: mousePos.y + OFFSET, zIndex: 50 }
    : { position: 'fixed', left: 16, bottom: 16, zIndex: 50 };

  return (
    <>
      {/* Green return dot – visible at bottom-left when Picko is following */}
      {isFollowing && (
        <div
          onClick={handleReturn}
          className="fixed left-5 bottom-5 z-[60] w-4 h-4 bg-[var(--color-green)] rounded-full cursor-pointer animate-pulse shadow-[0_0_12px_rgba(166,227,161,0.6)]"
          title="Click to return Picko home"
        />
      )}

      {/* Main Picko container */}
      <div style={containerStyle} className="flex flex-col items-start gap-2 pointer-events-auto transition-all duration-150 ease-out">

        {/* Info bubble – only when following AND hovering over a card */}
        {isFollowing && displayEvent && (
          <div className="bg-gradient-to-br from-[var(--color-mantle)] to-[var(--color-surface-0)] border border-[var(--color-surface-1)] p-3 rounded-2xl shadow-2xl w-56 animate-in fade-in">
            <p className="text-[9px] text-[var(--color-green)] font-semibold mb-1 flex items-center gap-1 uppercase tracking-wider">
              <Bot size={10} /> {"Picko's Review"}
            </p>
            <h4 className="font-display font-bold text-xs text-[var(--color-text)] mb-1 line-clamp-1">
              {displayEvent.title}
            </h4>
            <div className="flex items-center gap-1 mb-1 text-[10px]">
              <span className="text-[var(--color-yellow)]">⭐ {rating}/5</span>
              <span className="text-[var(--color-subtext-0)] border-l border-[var(--color-surface-1)] pl-1">Highly Recommended!</span>
            </div>
            <p className="text-[8px] text-[var(--color-subtext-0)] line-clamp-2 mb-2">
              {displayEvent.description}
            </p>
            <div className="text-[8px] text-[var(--color-subtext-0)] bg-[var(--color-surface-0)] p-1.5 rounded-lg border border-[var(--color-surface-1)]">
              <strong>Organized by:</strong> {displayEvent.organizerName || 'Local Youth Center'}<br />
              <strong>Administration:</strong> Ministry of Youth &amp; Sports, {displayEvent.wilaya} Directorate
            </div>
          </div>
        )}

        {/* Robot body */}
        <div
          ref={pickoRef}
          onClick={handlePickoClick}
          className={`w-10 h-10 bg-[var(--color-surface-0)] rounded-xl border-2 flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(180,190,254,0.4)] transition-all duration-300 ${isHappy ? 'border-[var(--color-green)] animate-bounce' : 'border-[var(--color-lavender)]'}`}
          style={{ cursor: 'pointer' }}
          title={isFollowing ? 'Click Picko to stop following' : 'Click Picko to follow you'}
        >
          {/* Antenna */}
          <div className="absolute -top-3 w-1 h-3 bg-[var(--color-lavender)]" />
          <div className={`absolute -top-4 w-2 h-2 rounded-full ${isHappy ? 'bg-[var(--color-green)] animate-pulse' : 'bg-[var(--color-red)]'}`} />

          {/* Face */}
          <div className="w-9 h-6 bg-[var(--color-base)] rounded-lg flex items-center justify-around px-1 relative overflow-hidden">
            {/* Left Eye */}
            <div className="w-2 h-3 bg-[var(--color-surface-1)] rounded-full relative">
              <div
                className="absolute bg-[var(--color-lavender)] rounded-full transition-all duration-75"
                style={{
                  top: '50%', left: '50%',
                  transform: `translate(-50%, -50%) translate(${eyeX}px, ${eyeY}px)`,
                  width: isHappy ? '6px' : '4px',
                  height: isHappy ? '6px' : '4px',
                }}
              />
            </div>
            {/* Right Eye */}
            <div className="w-2 h-3 bg-[var(--color-surface-1)] rounded-full relative">
              <div
                className="absolute bg-[var(--color-lavender)] rounded-full transition-all duration-75"
                style={{
                  top: '50%', left: '50%',
                  transform: `translate(-50%, -50%) translate(${eyeX}px, ${eyeY}px)`,
                  width: isHappy ? '6px' : '4px',
                  height: isHappy ? '6px' : '4px',
                }}
              />
            </div>
          </div>

          {/* Mouth */}
          {isHappy ? (
            <div className="absolute bottom-1.5 w-3 h-0.5 border-b-2 border-[var(--color-green)] rounded-full" />
          ) : (
            <div className="absolute bottom-1 w-2 h-0.5 border-t-2 border-[var(--color-red)] rounded-full" />
          )}
        </div>
      </div>
    </>
  );
}
