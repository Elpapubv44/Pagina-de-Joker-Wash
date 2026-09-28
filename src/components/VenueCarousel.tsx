import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { VenueSlide, VenueId } from '../data/complexData';

interface VenueCarouselProps {
  slides: VenueSlide[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  activeFilter: 'all' | VenueId;
  onFilterByVenue: (venueId: 'all' | VenueId) => void;
  onOpen3DModal: () => void;
  liveJackpot: number;
}

export const VenueCarousel: React.FC<VenueCarouselProps> = ({
  slides,
  activeIndex,
  onChangeIndex,
  activeFilter,
  onFilterByVenue,
  onOpen3DModal,
  liveJackpot,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    onChangeIndex((activeIndex + 1) % slides.length);
    setProgress(0);
  }, [activeIndex, slides.length, onChangeIndex]);

  const prevSlide = useCallback(() => {
    onChangeIndex((activeIndex - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [activeIndex, slides.length, onChangeIndex]);

  // Autoplay every 5 seconds with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const stepMs = 100;
    const totalMs = 5000;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + (stepMs / totalMs) * 100 >= 100) {
          onChangeIndex((activeIndex + 1) % slides.length);
          return 0;
        }
        return prev + (stepMs / totalMs) * 100;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [activeIndex, isAutoPlaying, isHovered, onChangeIndex, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[activeIndex];

  return (
    <section
      aria-label="Carrusel de Locales Activos"
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Section Header Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>MONITOREO VISUAL EN TIEMPO REAL</span>
            <span aria-hidden="true">·</span>
            <span style={{ color: currentSlide.accentHex }}>{currentSlide.wingLabel}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-display tracking-wider mt-0.5">
            UNIDADES OPERATIVAS DEL COMPLEJO
          </h1>
        </div>

        {/* Controls & Autoplay Indicator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
            title={isAutoPlaying ? 'Pausar rotación automática (5s)' : 'Reanudar rotación automática'}
          >
            {isAutoPlaying && !isHovered ? (
              <Pause className="w-3.5 h-3.5 text-[#e0203c]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isHovered ? 'Pausado (Hover)' : isAutoPlaying ? 'Auto 5s' : 'Manual'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Local anterior"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Siguiente local"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cover-Flow Stage */}
      <div className="relative h-[430px] sm:h-[460px] lg:h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14]">
        {slides.map((slide, idx) => {
          // Calculate cover-flow relative position (-1 = left, 0 = active center, 1 = right)
          let offset = idx - activeIndex;
          if (offset < -1) offset += slides.length;
          if (offset > 1) offset -= slides.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1;

          // Transform and blur properties for smooth cover-flow depth
          const translateX = isCenter ? '0%' : isLeft ? '-68%' : '68%';
          const scale = isCenter ? 1 : 0.86;
          const opacity = isCenter ? 1 : 0.28;
          const blurPx = isCenter ? 'blur(0px)' : 'blur(4px)';
          const zIndex = isCenter ? 20 : 10;

          // Dynamic jackpot string for Casino
          const formattedStatTwo =
            slide.id === 'casino'
              ? `Jackpot: $${liveJackpot.toLocaleString('es-AR')}`
              : slide.primaryStats[1];

          return (
            <article
              key={slide.id}
              onClick={() => {
                if (!isCenter) {
                  onChangeIndex(idx);
                  setProgress(0);
                }
              }}
              style={{
                transform: `translateX(${translateX}) scale(${scale})`,
                opacity,
                filter: blurPx,
                zIndex,
                transition:
                  'transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), filter 550ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden ${
                !isCenter ? 'cursor-pointer' : ''
              }`}
              aria-hidden={!isCenter}
            >
              {/* Background Image or Resilient Gradient Fallback */}
              {!failedImages[slide.id] ? (
                <img
                  src={slide.imageUrl}
                  alt={`${slide.name} — Joker Wash & Play`}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [slide.id]: true,
                    }))
                  }
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: `radial-gradient(circle at 75% 25%, ${slide.accentHex}33 0%, #14121e 55%, #0a0910 100%)`,
                  }}
                />
              )}

              {/* Measured High-Contrast Scrim for Guaranteed Legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(10,9,16,0.95) 0%, rgba(10,9,16,0.78) 48%, rgba(10,9,16,0.35) 100%), linear-gradient(0deg, rgba(10,9,16,0.96) 0%, rgba(10,9,16,0.4) 55%, rgba(10,9,16,0.2) 100%)',
                }}
              />

              {/* Subtle Top Neon Accent Line */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{
                  backgroundColor: slide.accentHex,
                  boxShadow: `0 0 20px ${slide.accentHex}`,
                }}
              />

              {/* Slide Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                {/* Top Metadata Line (Zero-Pill Clean Unboxed Text) */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: slide.accentHex,
                        boxShadow: `0 0 10px ${slide.accentHex}`,
                      }}
                    />
                    <span style={{ color: slide.accentHex }}>{slide.wingLabel}</span>
                    <span aria-hidden="true" className="text-zinc-500">
                      ·
                    </span>
                    <span className="font-mono-tabular text-zinc-300">
                      Ocupación {slide.occupancy.percentage}% ({slide.occupancy.current}/{slide.occupancy.capacity})
                    </span>
                  </div>

                  <div className="text-xs font-mono-tabular text-zinc-400">
                    Horario Pico: {slide.occupancy.peakHour}
                  </div>
                </div>

                {/* Main Venue Title, Description & Key Stats */}
                <div className="max-w-2xl my-auto py-2">
                  <h2
                    className="text-5xl sm:text-6xl lg:text-7xl font-display tracking-wider text-white leading-none"
                    style={{ textWrap: 'balance' }}
                  >
                    {slide.name}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-zinc-200 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  {/* Primary Requested Stats */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                    <div
                      className="p-3.5 rounded-xl bg-[#0a0910]/80 backdrop-blur-md border"
                      style={{ borderColor: `${slide.accentHex}55` }}
                    >
                      <span className="block text-[11px] text-zinc-400">Indicador Principal 01</span>
                      <span
                        className="mt-0.5 block text-lg sm:text-xl font-semibold font-mono-tabular"
                        style={{ color: slide.accentHex }}
                      >
                        {slide.primaryStats[0]}
                      </span>
                    </div>

                    <div
                      className="p-3.5 rounded-xl bg-[#0a0910]/80 backdrop-blur-md border"
                      style={{ borderColor: `${slide.accentHex}55` }}
                    >
                      <span className="block text-[11px] text-zinc-400">Indicador Principal 02</span>
                      <span className="mt-0.5 block text-lg sm:text-xl font-semibold font-mono-tabular text-white">
                        {formattedStatTwo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Secondary Telemetry + Interactive Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {slide.secondaryMetrics.map((metric) => (
                      <div key={metric.label} className="text-xs">
                        <span className="text-zinc-400">{metric.label}: </span>
                        <span className="font-mono-tabular font-semibold text-white">
                          {metric.value}
                        </span>
                        <span className="text-zinc-500 hidden sm:inline"> · {metric.detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilterByVenue(activeFilter === slide.id ? 'all' : slide.id);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border"
                      style={{
                        backgroundColor:
                          activeFilter === slide.id ? slide.accentHex : 'rgba(255,255,255,0.06)',
                        color: activeFilter === slide.id ? '#0a0910' : '#ffffff',
                        borderColor:
                          activeFilter === slide.id ? slide.accentHex : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      {activeFilter === slide.id
                        ? `Mostrando solo ${slide.name}`
                        : `Filtrar Widgets por ${slide.name}`}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen3DModal();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-zinc-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Plano 3D
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Lateral Floating Quick-Nav Buttons on Desktop */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Anterior local"
          className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full bg-[#0a0910]/80 hover:bg-[#0a0910] border border-white/15 text-white transition-transform hover:scale-105 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Siguiente local"
          className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full bg-[#0a0910]/80 hover:bg-[#0a0910] border border-white/15 text-white transition-transform hover:scale-105 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/5 z-30">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: currentSlide.accentHex,
            }}
          />
        </div>
      </div>

      {/* Bottom Indicator Dots & Wing Selector Tabs */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3" role="tablist" aria-label="Seleccionar local">
          {slides.map((slide, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  onChangeIndex(idx);
                  setProgress(0);
                }}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white/[0.08] text-white'
                    : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
                style={{
                  borderColor: isSelected ? slide.accentHex : undefined,
                  boxShadow: isSelected ? `0 0 16px -4px ${slide.accentHex}66` : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: slide.accentHex,
                    boxShadow: isSelected ? `0 0 8px ${slide.accentHex}` : undefined,
                  }}
                />
                <span>{slide.name}</span>
                <span className="font-mono-tabular text-[11px] text-zinc-400">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Classic Dots Indicator */}
        <div className="flex items-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ir a slide ${idx + 1}: ${slide.name}`}
              onClick={() => {
                onChangeIndex(idx);
                setProgress(0);
              }}
              className="h-2.5 rounded-full transition-all cursor-pointer"
              style={{
                width: idx === activeIndex ? '28px' : '10px',
                backgroundColor:
                  idx === activeIndex ? slide.accentHex : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
