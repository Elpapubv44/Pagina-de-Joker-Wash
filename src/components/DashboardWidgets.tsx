import React, { useState } from 'react';
import {
  Plus,
  Check,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import {
  VenueId,
  VenueSlide,
  RevenuePoint,
  ComplexEvent,
  SystemAlert,
} from '../data/complexData';

interface DashboardWidgetsProps {
  venues: VenueSlide[];
  revenueData: RevenuePoint[];
  events: ComplexEvent[];
  alerts: SystemAlert[];
  activeVenueFilter: 'all' | VenueId;
  onChangeVenueFilter: (filter: 'all' | VenueId) => void;
  onAdjustOccupancy: (venueId: VenueId, delta: number) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onResetAllAlerts: () => void;
  onOpenNewEventModal: () => void;
  onOpenReportsModal: () => void;
  onFocusVenueInCarousel: (venueId: VenueId) => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  venues,
  revenueData,
  events,
  alerts,
  activeVenueFilter,
  onChangeVenueFilter,
  onAdjustOccupancy,
  onAcknowledgeAlert,
  onResetAllAlerts,
  onOpenNewEventModal,
  onOpenReportsModal,
  onFocusVenueInCarousel,
}) => {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Calculate revenue totals based on activeVenueFilter
  const getPointTodayValue = (pt: RevenuePoint) => {
    if (activeVenueFilter === 'laundry') return pt.laundry;
    if (activeVenueFilter === 'casino') return pt.casino;
    if (activeVenueFilter === 'skybar') return pt.skybar;
    return pt.today;
  };

  const getPointYesterdayValue = (pt: RevenuePoint) => {
    if (activeVenueFilter === 'laundry') return Math.round(pt.laundry * 0.89);
    if (activeVenueFilter === 'casino') return Math.round(pt.casino * 0.86);
    if (activeVenueFilter === 'skybar') return Math.round(pt.skybar * 0.91);
    return pt.yesterday;
  };

  const totalToday = revenueData.reduce((acc, pt) => acc + getPointTodayValue(pt), 0);
  const totalYesterday = revenueData.reduce((acc, pt) => acc + getPointYesterdayValue(pt), 0);
  const growthPct = (((totalToday - totalYesterday) / totalYesterday) * 100).toFixed(1);

  const maxBarValue = Math.max(
    ...revenueData.map((pt) => Math.max(getPointTodayValue(pt), getPointYesterdayValue(pt))),
    1
  );

  // Accent color for revenue chart based on filter
  const chartAccentColor =
    activeVenueFilter === 'laundry'
      ? '#3fd8e8'
      : activeVenueFilter === 'casino'
      ? '#f2c14e'
      : activeVenueFilter === 'skybar'
      ? '#a88cff'
      : '#e0203c';

  const filteredEvents =
    activeVenueFilter === 'all'
      ? events
      : events.filter((e) => e.venueId === activeVenueFilter);

  const filteredAlerts =
    activeVenueFilter === 'all'
      ? alerts
      : alerts.filter((a) => a.venueId === activeVenueFilter);

  const venueColorMap: Record<VenueId, string> = {
    laundry: '#3fd8e8',
    casino: '#f2c14e',
    skybar: '#a88cff',
  };

  return (
    <section aria-label="Panel de Control y Widgets" className="mt-10">
      {/* Filter & Section Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl text-white font-display tracking-wider">
            TELEMETRÍA OPERATIVA Y RENDIMIENTO
          </h2>
          <p className="text-xs text-zinc-400">
            Datos consolidados en vivo · Filtrá por unidad para aislar métricas e incidentes
          </p>
        </div>

        {/* Interactive Segmented Filter Control */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#13111d] border border-white/10"
          role="group"
          aria-label="Filtrar widgets por local"
        >
          {(
            [
              { id: 'all', label: 'Todos los Locales', color: '#e0203c' },
              { id: 'laundry', label: 'Lavandería', color: '#3fd8e8' },
              { id: 'casino', label: 'Casino', color: '#f2c14e' },
              { id: 'skybar', label: 'Bar & Fumadores', color: '#a88cff' },
            ] as const
          ).map((tab) => {
            const isActive = activeVenueFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeVenueFilter(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: tab.color,
                    boxShadow: isActive ? `0 0 8px ${tab.color}` : undefined,
                  }}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Card Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* WIDGET 1: INGRESOS HOY */}
        <article className="glass-panel glass-panel-red rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-zinc-400">01 · Finanzas en Vivo</span>
                <h3 className="text-2xl text-white font-display tracking-wide mt-0.5">
                  Ingresos Hoy
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenReportsModal}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                title="Abrir desglose completo y exportar CSV"
              >
                <span>Detalle</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Total & Delta vs Yesterday */}
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-bold font-mono-tabular text-white">
                ${totalToday.toLocaleString('es-AR')}
              </div>
              <div className="text-xs font-mono-tabular text-emerald-400">
                +{growthPct}% vs ayer
              </div>
            </div>
            <div className="text-xs text-zinc-400 font-mono-tabular mt-0.5">
              Ayer al mismo corte: ${totalYesterday.toLocaleString('es-AR')}
            </div>

            {/* Mini Comparative Bar Chart (Today vs Yesterday) */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-xs inline-block"
                      style={{ backgroundColor: chartAccentColor }}
                    />
                    Hoy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-white/20 inline-block" />
                    Ayer
                  </span>
                </div>
                <span className="font-mono-tabular">
                  {hoveredBarIndex !== null
                    ? `${revenueData[hoveredBarIndex].period} hs: $${getPointTodayValue(
                        revenueData[hoveredBarIndex]
                      ).toLocaleString('es-AR')}`
                    : '6 cortes horarios'}
                </span>
              </div>

              <div className="h-36 flex items-end justify-between gap-2 pt-2">
                {revenueData.map((pt, idx) => {
                  const valToday = getPointTodayValue(pt);
                  const valYest = getPointYesterdayValue(pt);
                  const heightTodayPct = Math.max(Math.round((valToday / maxBarValue) * 100), 12);
                  const heightYestPct = Math.max(Math.round((valYest / maxBarValue) * 100), 10);
                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div
                      key={pt.period}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                    >
                      <div className="w-full flex items-end justify-center gap-1 h-28">
                        {/* Yesterday Bar */}
                        <div
                          className="w-2.5 sm:w-3 rounded-t-sm bg-white/20 transition-opacity group-hover:bg-white/35"
                          style={{ height: `${heightYestPct}%` }}
                          title={`Ayer ${pt.period}: $${valYest.toLocaleString('es-AR')}`}
                        />
                        {/* Today Bar */}
                        <div
                          className="w-2.5 sm:w-3 rounded-t-sm transition-transform"
                          style={{
                            height: `${heightTodayPct}%`,
                            backgroundColor: chartAccentColor,
                            boxShadow: isHovered ? `0 0 12px ${chartAccentColor}` : undefined,
                          }}
                          title={`Hoy ${pt.period}: $${valToday.toLocaleString('es-AR')}`}
                        />
                      </div>
                      <span className="text-[10px] font-mono-tabular text-zinc-400 group-hover:text-white">
                        {pt.period}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Ticket promedio complejo</span>
            <span className="font-mono-tabular text-white font-medium">$18.450 ARS</span>
          </div>
        </article>

        {/* WIDGET 2: OCUPACIÓN POR LOCAL */}
        <article className="glass-panel glass-panel-cyan rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-zinc-400">02 · Aforo & Capacidad</span>
                <h3 className="text-2xl text-white font-display tracking-wide mt-0.5">
                  Ocupación por Local
                </h3>
              </div>
              <span className="font-mono-tabular text-xs text-zinc-300">
                3 / 3 Alas Activas
              </span>
            </div>

            <div className="mt-4 space-y-5">
              {venues.map((venue) => {
                const isHighlighted =
                  activeVenueFilter === 'all' || activeVenueFilter === venue.id;

                return (
                  <div
                    key={venue.id}
                    className={`transition-opacity ${
                      isHighlighted ? 'opacity-100' : 'opacity-45'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <button
                        type="button"
                        onClick={() => onFocusVenueInCarousel(venue.id)}
                        className="flex items-center gap-2 font-semibold text-white hover:underline cursor-pointer"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: venue.accentHex,
                            boxShadow: `0 0 8px ${venue.accentHex}`,
                          }}
                        />
                        <span>{venue.name}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="font-mono-tabular text-zinc-300">
                          {venue.occupancy.current}/{venue.occupancy.capacity}{' '}
                          <span className="text-zinc-500 hidden sm:inline">
                            {venue.occupancy.unit}
                          </span>
                        </span>
                        <span
                          className="font-mono-tabular font-bold"
                          style={{ color: venue.accentHex }}
                        >
                          {venue.occupancy.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${venue.occupancy.percentage}%`,
                          backgroundColor: venue.accentHex,
                          boxShadow: `0 0 12px ${venue.accentHex}88`,
                        }}
                      />
                    </div>

                    {/* Interactive Capacity Control Row */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Pico: {venue.occupancy.peakHour}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onAdjustOccupancy(venue.id, -1)}
                          className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.12] text-zinc-300 font-mono-tabular cursor-pointer"
                          aria-label={`Reducir ocupación en ${venue.name}`}
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => onAdjustOccupancy(venue.id, 1)}
                          className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.12] text-zinc-300 font-mono-tabular cursor-pointer"
                          aria-label={`Incrementar ocupación en ${venue.name}`}
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Capacidad global ocupada</span>
            <span className="font-mono-tabular text-white font-semibold">
              {venues.reduce((acc, v) => acc + v.occupancy.current, 0)} /{' '}
              {venues.reduce((acc, v) => acc + v.occupancy.capacity, 0)} plazas
            </span>
          </div>
        </article>

        {/* WIDGET 3: PRÓXIMOS EVENTOS */}
        <article className="glass-panel glass-panel-gold rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-zinc-400">03 · Agenda Nocturna</span>
                <h3 className="text-2xl text-white font-display tracking-wide mt-0.5">
                  Próximos Eventos
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenNewEventModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f2c14e]/15 hover:bg-[#f2c14e]/25 border border-[#f2c14e]/40 text-[#f2c14e] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agendar</span>
              </button>
            </div>

            <div className="mt-4 divide-y divide-white/10">
              {filteredEvents.map((evt) => {
                const accent = venueColorMap[evt.venueId];
                return (
                  <div
                    key={evt.id}
                    onClick={() => onFocusVenueInCarousel(evt.venueId)}
                    className="py-3 first:pt-1 last:pb-1 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-tabular font-semibold text-white">
                          {evt.time} hs
                        </span>
                        <span aria-hidden="true" className="text-zinc-500">
                          ·
                        </span>
                        <span style={{ color: accent }} className="font-medium">
                          {evt.venueName}
                        </span>
                      </div>
                      <span className="text-zinc-400">{evt.category}</span>
                    </div>

                    <p className="text-sm font-medium text-zinc-100 group-hover:text-white mt-0.5 leading-snug">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono-tabular mt-0.5">
                      {evt.capacityStatus}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Actividades programadas hoy</span>
            <span className="font-mono-tabular text-white font-medium">
              {filteredEvents.length} eventos activos
            </span>
          </div>
        </article>

        {/* WIDGET 4: ALERTAS DEL SISTEMA */}
        <article className="glass-panel glass-panel-violet rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-zinc-400">04 · Diagnóstico Técnico</span>
                <h3 className="text-2xl text-white font-display tracking-wide mt-0.5">
                  Alertas del Sistema
                </h3>
              </div>
              <button
                type="button"
                onClick={onResetAllAlerts}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                title="Ejecutar testeo general de sensores"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Testear</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {filteredAlerts.map((alert) => {
                const statusColor =
                  alert.status === 'nominal'
                    ? '#34d399'
                    : alert.status === 'warning'
                    ? '#f2c14e'
                    : '#e0203c';

                return (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-[#0a0910]/60 border border-white/10 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: statusColor,
                            boxShadow: `0 0 8px ${statusColor}`,
                          }}
                        />
                        <span className="text-xs font-semibold text-white">
                          {alert.subsystem}
                        </span>
                        <span className="text-[11px] font-mono-tabular text-zinc-500">
                          {alert.code}
                        </span>
                      </div>

                      <span
                        className="text-xs font-mono-tabular font-medium"
                        style={{ color: statusColor }}
                      >
                        {alert.statusLabel}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                      <span className="font-mono-tabular">{alert.metric}</span>
                      {!alert.acknowledged ? (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="flex items-center gap-1 text-[#3fd8e8] hover:underline font-medium cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Atender ahora</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400/90">Verificado · {alert.lastChecked}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Lavarropas · Billeteros · Extractores</span>
            <span className="font-mono-tabular text-emerald-400 font-medium">
              Red 100% En Línea
            </span>
          </div>
        </article>
      </div>
    </section>
  );
};
