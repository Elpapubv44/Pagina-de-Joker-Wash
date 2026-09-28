/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  VENUE_SLIDES,
  REVENUE_DATA,
  INITIAL_EVENTS,
  INITIAL_ALERTS,
  INITIAL_STAFF,
  VenueId,
  VenueSlide,
  ComplexEvent,
  SystemAlert,
  StaffMember,
} from './data/complexData';
import { VenueCarousel } from './components/VenueCarousel';
import { DashboardWidgets } from './components/DashboardWidgets';
import { QuickToolsModal, ActiveModalType } from './components/QuickToolsModal';

function JokerCardIcon() {
  return (
    <svg
      width="34"
      height="38"
      viewBox="0 0 34 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Back tilted card */}
      <rect
        x="6"
        y="2"
        width="24"
        height="32"
        rx="4"
        transform="rotate(8 6 2)"
        fill="#191625"
        stroke="#f2c14e"
        strokeWidth="1.5"
      />
      {/* Front main Joker card */}
      <rect
        x="2"
        y="4"
        width="24"
        height="32"
        rx="4"
        fill="#0d0c14"
        stroke="#e0203c"
        strokeWidth="1.75"
      />
      {/* Corner J index */}
      <path
        d="M7 9H9.5V13.5C9.5 14.6 8.7 15.3 7.5 15.3C6.5 15.3 5.8 14.7 5.7 13.8"
        stroke="#f2c14e"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Jester Crown / Diamond Motif */}
      <path
        d="M14 14L18.5 20L14 26L9.5 20L14 14Z"
        fill="#e0203c"
        stroke="#f2c14e"
        strokeWidth="1.2"
      />
      <circle cx="14" cy="11.5" r="1.3" fill="#3fd8e8" />
      <circle cx="9.5" cy="14" r="1.2" fill="#a88cff" />
      <circle cx="18.5" cy="14" r="1.2" fill="#f2c14e" />
    </svg>
  );
}

export default function App() {
  const [venues, setVenues] = useState<VenueSlide[]>(VENUE_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeVenueFilter, setActiveVenueFilter] = useState<'all' | VenueId>('all');
  const [events, setEvents] = useState<ComplexEvent[]>(INITIAL_EVENTS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [liveJackpot, setLiveJackpot] = useState<number>(1240000);
  const [now, setNow] = useState<Date>(() => new Date());

  // Live clock update every second + subtle progressive jackpot increment
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      setLiveJackpot((prev) => prev + 150);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const handleFocusVenueInCarousel = (venueId: VenueId) => {
    const index = venues.findIndex((v) => v.id === venueId);
    if (index !== -1) {
      setActiveSlideIndex(index);
    }
    setActiveVenueFilter(venueId);
  };

  const handleAdjustOccupancy = (venueId: VenueId, delta: number) => {
    setVenues((prev) =>
      prev.map((venue) => {
        if (venue.id !== venueId) return venue;
        const nextCurrent = Math.min(
          venue.occupancy.capacity,
          Math.max(0, venue.occupancy.current + delta)
        );
        const nextPercentage = Math.round((nextCurrent / venue.occupancy.capacity) * 100);
        // Update primary stat if laundry
        const updatedStats: [string, string] =
          venue.id === 'laundry'
            ? [`${nextCurrent} máquinas activas`, venue.primaryStats[1]]
            : venue.primaryStats;

        return {
          ...venue,
          primaryStats: updatedStats,
          occupancy: {
            ...venue.occupancy,
            current: nextCurrent,
            percentage: nextPercentage,
          },
        };
      })
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'nominal',
              statusLabel: 'Normalizado · OK',
              acknowledged: true,
              lastChecked: 'Recién verificado',
            }
          : a
      )
    );
  };

  const handleResetAllAlerts = () => {
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'nominal',
        statusLabel: '100% Operativo',
        acknowledged: true,
        lastChecked: 'Diagnóstico OK',
      }))
    );
  };

  const handleAddEvent = (newEvent: Omit<ComplexEvent, 'id'>) => {
    const created: ComplexEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [created, ...prev]);
  };

  const handleToggleStaffStatus = (staffId: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0910] text-[#f4f3f8] relative selection:bg-[#e0203c]/30">
      {/* Subtle Ambient Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(224, 32, 60, 0.08) 0%, transparent 40%), radial-gradient(circle at 88% 18%, rgba(63, 216, 232, 0.07) 0%, transparent 42%), radial-gradient(circle at 50% 85%, rgba(168, 140, 255, 0.06) 0%, transparent 45%)',
        }}
      />

      {/* TOP BAR / HEADER (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0910]/85 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Logo & Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveVenueFilter('all');
              setActiveSlideIndex(0);
            }}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <JokerCardIcon />
            <span className="text-2xl sm:text-3xl font-display tracking-wider text-white group-hover:text-[#f2c14e] transition-colors whitespace-nowrap">
              JOKER WASH &amp; PLAY
            </span>
          </a>

          {/* Zone 2: Clean Text Navigation Links */}
          <nav
            aria-label="Navegación principal del complejo"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300"
          >
            <button
              type="button"
              onClick={() => {
                setActiveSlideIndex(0);
                setActiveVenueFilter('laundry');
              }}
              className={`hover:text-[#3fd8e8] transition-colors cursor-pointer whitespace-nowrap ${
                activeVenueFilter === 'laundry' ? 'text-[#3fd8e8] underline underline-offset-8' : ''
              }`}
            >
              Lavandería
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSlideIndex(1);
                setActiveVenueFilter('casino');
              }}
              className={`hover:text-[#f2c14e] transition-colors cursor-pointer whitespace-nowrap ${
                activeVenueFilter === 'casino' ? 'text-[#f2c14e] underline underline-offset-8' : ''
              }`}
            >
              Casino
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSlideIndex(2);
                setActiveVenueFilter('skybar');
              }}
              className={`hover:text-[#a88cff] transition-colors cursor-pointer whitespace-nowrap ${
                activeVenueFilter === 'skybar' ? 'text-[#a88cff] underline underline-offset-8' : ''
              }`}
            >
              Bar &amp; Fumadores
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('maqueta3d')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Maqueta 3D
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('reportes')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Reportes
            </button>
          </nav>

          {/* Zone 3: Live Date/Time & Status Indicator ("3 LOCALES ACTIVOS") */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs sm:text-sm font-mono-tabular font-semibold text-white">
                {formattedTime}
              </span>
              <span className="text-[11px] font-mono-tabular text-zinc-400 capitalize">
                {formattedDate}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveVenueFilter('all');
                setActiveModal('maqueta3d');
              }}
              title="Ver estado estructural de los 3 locales"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#3fd8e8]"
                  style={{ boxShadow: '0 0 8px #3fd8e8' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#f2c14e]"
                  style={{ boxShadow: '0 0 8px #f2c14e' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#a88cff]"
                  style={{ boxShadow: '0 0 8px #a88cff' }}
                />
              </div>
              <span className="text-xs font-semibold tracking-wider text-white font-display sm:text-sm">
                3 LOCALES ACTIVOS
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main
        id="top"
        className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 animate-dashboard-entry"
      >
        {/* Mobile Live Clock Bar */}
        <div className="flex sm:hidden items-center justify-between text-xs font-mono-tabular text-zinc-400 mb-4 pb-3 border-b border-white/10">
          <span className="capitalize">{formattedDate}</span>
          <span className="text-white font-semibold">{formattedTime}</span>
        </div>

        {/* HERO / COVER-FLOW CAROUSEL SECTION */}
        <VenueCarousel
          slides={venues}
          activeIndex={activeSlideIndex}
          onChangeIndex={setActiveSlideIndex}
          activeFilter={activeVenueFilter}
          onFilterByVenue={setActiveVenueFilter}
          onOpen3DModal={() => setActiveModal('maqueta3d')}
          liveJackpot={liveJackpot}
        />

        {/* 4-WIDGETS DASHBOARD SECTION */}
        <DashboardWidgets
          venues={venues}
          revenueData={REVENUE_DATA}
          events={events}
          alerts={alerts}
          activeVenueFilter={activeVenueFilter}
          onChangeVenueFilter={setActiveVenueFilter}
          onAdjustOccupancy={handleAdjustOccupancy}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onResetAllAlerts={handleResetAllAlerts}
          onOpenNewEventModal={() => setActiveModal('nuevoEvento')}
          onOpenReportsModal={() => setActiveModal('reportes')}
          onFocusVenueInCarousel={handleFocusVenueInCarousel}
        />
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mt-12 border-t border-white/10 bg-[#08070d]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-zinc-300">
            <button
              type="button"
              onClick={() => setActiveModal('maqueta3d')}
              className="hover:text-[#3fd8e8] transition-colors cursor-pointer whitespace-nowrap"
            >
              Ver maqueta 3D
            </button>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <button
              type="button"
              onClick={() => setActiveModal('personal')}
              className="hover:text-[#f2c14e] transition-colors cursor-pointer whitespace-nowrap"
            >
              Gestión de personal
            </button>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <button
              type="button"
              onClick={() => setActiveModal('reportes')}
              className="hover:text-[#a88cff] transition-colors cursor-pointer whitespace-nowrap"
            >
              Reportes
            </button>
          </div>

          {/* Copyright & System Version */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono-tabular">
            <span>© {now.getFullYear()} Joker Wash &amp; Play Complex</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-300">Sistema v2.4.0</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals for Footer Links & Dashboard Tools */}
      <QuickToolsModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        venues={venues}
        staff={staff}
        onToggleStaffStatus={handleToggleStaffStatus}
        revenueData={REVENUE_DATA}
        onAddEvent={handleAddEvent}
        onSelectVenueSlide={(idx) => setActiveSlideIndex(idx)}
      />
    </div>
  );
}
