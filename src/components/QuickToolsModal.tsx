import React, { useState } from 'react';
import { X, Download, Layers, Users, FileSpreadsheet, Plus, CheckCircle2 } from 'lucide-react';
import {
  VenueId,
  VenueSlide,
  StaffMember,
  RevenuePoint,
  ComplexEvent,
} from '../data/complexData';

export type ActiveModalType = 'maqueta3d' | 'personal' | 'reportes' | 'nuevoEvento' | null;

interface QuickToolsModalProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  venues: VenueSlide[];
  staff: StaffMember[];
  onToggleStaffStatus: (id: string) => void;
  revenueData: RevenuePoint[];
  onAddEvent: (evt: Omit<ComplexEvent, 'id'>) => void;
  onSelectVenueSlide: (index: number) => void;
}

export const QuickToolsModal: React.FC<QuickToolsModalProps> = ({
  activeModal,
  onClose,
  venues,
  staff,
  onToggleStaffStatus,
  revenueData,
  onAddEvent,
  onSelectVenueSlide,
}) => {
  const [selected3DWing, setSelected3DWing] = useState<VenueId>('casino');
  const [staffFilter, setStaffFilter] = useState<'all' | VenueId>('all');

  // New event form state
  const [evtTime, setEvtTime] = useState('23:45');
  const [evtTitle, setEvtTitle] = useState('');
  const [evtVenueId, setEvtVenueId] = useState<VenueId>('casino');
  const [evtCategory, setEvtCategory] = useState<'Torneo' | 'Promo' | 'Degustación' | 'Operativo'>('Torneo');
  const [evtCapacity, setEvtCapacity] = useState('Cupo abierto · 30 plazas');

  if (!activeModal) return null;

  const handleExportCSV = () => {
    const headers = ['Franja Horaria,Hoy ($),Ayer ($),Lavanderia ($),Casino ($),Bar & Fumadores ($)'];
    const rows = revenueData.map(
      (r) => `${r.period},${r.today},${r.yesterday},${r.laundry},${r.casino},${r.skybar}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'joker_wash_and_play_reporte_diario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;
    const venueNames: Record<VenueId, string> = {
      laundry: 'Lavandería',
      casino: 'Casino',
      skybar: 'Bar & Fumadores',
    };
    onAddEvent({
      time: evtTime,
      title: evtTitle.trim(),
      venueId: evtVenueId,
      venueName: venueNames[evtVenueId],
      category: evtCategory,
      capacityStatus: evtCapacity,
    });
    setEvtTitle('');
    onClose();
  };

  const active3DVenue = venues.find((v) => v.id === selected3DWing) || venues[1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#12101b] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-dashboard-entry">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0c14]">
          <div className="flex items-center gap-3">
            {activeModal === 'maqueta3d' && <Layers className="w-5 h-5 text-[#e0203c]" />}
            {activeModal === 'personal' && <Users className="w-5 h-5 text-[#f2c14e]" />}
            {activeModal === 'reportes' && <FileSpreadsheet className="w-5 h-5 text-[#3fd8e8]" />}
            {activeModal === 'nuevoEvento' && <Plus className="w-5 h-5 text-[#a88cff]" />}
            <h2 className="text-2xl tracking-wider text-white font-display">
              {activeModal === 'maqueta3d' && 'Maqueta Arquitectónica 3D · Joker Wash & Play'}
              {activeModal === 'personal' && 'Gestión de Personal y Turnos Activos'}
              {activeModal === 'reportes' && 'Reporte Consolidado de Operaciones e Ingresos'}
              {activeModal === 'nuevoEvento' && 'Programar Nuevo Evento en el Complejo'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {activeModal === 'maqueta3d' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Isometric 3D Interactive Stack */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center py-6 px-4 bg-[#0a0910] rounded-xl border border-white/10 relative overflow-hidden">
                <div className="text-xs text-zinc-400 mb-4 self-start flex items-center gap-2">
                  <span>Seleccioná un nivel para inspeccionar su telemetría estructural</span>
                </div>

                {/* 3 Isometric Layers */}
                <div className="w-full max-w-md space-y-4 my-2">
                  {/* Top Layer: Sky Bar & Fumadores */}
                  <button
                    type="button"
                    onClick={() => setSelected3DWing('skybar')}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer transform ${
                      selected3DWing === 'skybar'
                        ? 'bg-[#a88cff]/15 border-[#a88cff] -translate-y-1 shadow-[0_0_25px_rgba(168,140,255,0.25)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#a88cff] font-medium">NIVEL 03 · TERRAZA CUBIERTA</p>
                        <h3 className="text-xl text-white font-display tracking-wide mt-0.5">
                          Bar & Sala de Fumadores
                        </h3>
                      </div>
                      <span className="font-mono-tabular text-xs text-zinc-300">
                        18 ACH · 100% Extracción
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((node) => (
                        <div
                          key={node}
                          className="h-2 rounded-full bg-[#a88cff]/60"
                          title={`Extractor Laminar #${node} Activo`}
                        />
                      ))}
                    </div>
                  </button>

                  {/* Middle Layer: Casino */}
                  <button
                    type="button"
                    onClick={() => setSelected3DWing('casino')}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer transform ${
                      selected3DWing === 'casino'
                        ? 'bg-[#f2c14e]/15 border-[#f2c14e] -translate-y-1 shadow-[0_0_25px_rgba(242,193,78,0.25)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#f2c14e] font-medium">NIVEL 02 · PLANTA PRINCIPAL</p>
                        <h3 className="text-xl text-white font-display tracking-wide mt-0.5">
                          Sala de Casino & Pit VIP
                        </h3>
                      </div>
                      <span className="font-mono-tabular text-xs text-zinc-300">
                        8 Mesas · 64/70 Slots
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-8 gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
                        <div
                          key={table}
                          className="h-2 rounded-full bg-[#f2c14e]/70"
                          title={`Mesa #${table} Abierta`}
                        />
                      ))}
                    </div>
                  </button>

                  {/* Ground Layer: Lavandería */}
                  <button
                    type="button"
                    onClick={() => setSelected3DWing('laundry')}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer transform ${
                      selected3DWing === 'laundry'
                        ? 'bg-[#3fd8e8]/15 border-[#3fd8e8] -translate-y-1 shadow-[0_0_25px_rgba(63,216,232,0.25)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#3fd8e8] font-medium">NIVEL 01 · ACCESO URBANO</p>
                        <h3 className="text-xl text-white font-display tracking-wide mt-0.5">
                          Lavandería Inteligente 24h
                        </h3>
                      </div>
                      <span className="font-mono-tabular text-xs text-zinc-300">
                        24 Activas · 12 en Ciclo
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-12 gap-1">
                      {Array.from({ length: 12 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-2 rounded-full bg-[#3fd8e8]/70"
                          title={`Isla de Lavado #${idx + 1}`}
                        />
                      ))}
                    </div>
                  </button>
                </div>
              </div>

              {/* Wing Telemetry Detail Panel */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium"
                      style={{ color: active3DVenue.accentHex }}
                    >
                      {active3DVenue.wingLabel}
                    </span>
                    <span className="font-mono-tabular text-xs text-zinc-400">
                      Ocupación: {active3DVenue.occupancy.percentage}%
                    </span>
                  </div>
                  <h3 className="text-3xl font-display text-white mt-1">
                    {active3DVenue.name}
                  </h3>
                  <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                    {active3DVenue.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                    {active3DVenue.secondaryMetrics.map((m) => (
                      <div key={m.label} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{m.label}</span>
                        <span className="font-mono-tabular text-white font-medium">
                          {m.value} <span className="text-zinc-500 text-xs">· {m.detail}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const idx = venues.findIndex((v) => v.id === active3DVenue.id);
                      if (idx >= 0) onSelectVenueSlide(idx);
                      onClose();
                    }}
                    className="mt-5 w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-black transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                    style={{ backgroundColor: active3DVenue.accentHex }}
                  >
                    Enfocar {active3DVenue.name} en el Carrusel Principal
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'personal' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-zinc-300">
                  Dotación operativa asignada por ala. Podés alternar el estado en turno de cada responsable.
                </p>
                <div className="flex items-center gap-1 p-1 bg-[#0a0910] rounded-lg border border-white/10">
                  {(['all', 'laundry', 'casino', 'skybar'] as const).map((filterKey) => {
                    const labels = {
                      all: 'Todos',
                      laundry: 'Lavandería',
                      casino: 'Casino',
                      skybar: 'Bar & Fumadores',
                    };
                    return (
                      <button
                        key={filterKey}
                        type="button"
                        onClick={() => setStaffFilter(filterKey)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          staffFilter === filterKey
                            ? 'bg-[#e0203c] text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {labels[filterKey]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0a0910] text-xs text-zinc-400">
                      <th className="py-3 px-4 font-medium">Integrante</th>
                      <th className="py-3 px-4 font-medium">Rol Operativo</th>
                      <th className="py-3 px-4 font-medium">Local</th>
                      <th className="py-3 px-4 font-medium">Franja</th>
                      <th className="py-3 px-4 font-medium text-right">Acción de Turno</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {staff
                      .filter((s) => staffFilter === 'all' || s.venueId === staffFilter)
                      .map((member) => (
                        <tr key={member.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-medium text-white">{member.name}</td>
                          <td className="py-3 px-4 text-zinc-300">{member.role}</td>
                          <td className="py-3 px-4 text-zinc-300">{member.venueName}</td>
                          <td className="py-3 px-4 font-mono-tabular text-zinc-400">{member.shift}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onToggleStaffStatus(member.id)}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                member.active
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-zinc-800 text-zinc-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {member.active ? 'En puesto · Activo' : 'En descanso · Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeModal === 'reportes' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-300">
                    Arqueo horario comparativo por unidad de negocio (valores expresados en ARS).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e0203c] hover:bg-[#c81933] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0a0910] text-xs text-zinc-400">
                      <th className="py-3 px-4 font-medium">Corte Horario</th>
                      <th className="py-3 px-4 font-medium text-right">Lavandería</th>
                      <th className="py-3 px-4 font-medium text-right">Casino</th>
                      <th className="py-3 px-4 font-medium text-right">Bar & Fumadores</th>
                      <th className="py-3 px-4 font-medium text-right">Total Hoy</th>
                      <th className="py-3 px-4 font-medium text-right">Total Ayer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm font-mono-tabular">
                    {revenueData.map((row) => (
                      <tr key={row.period} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 text-zinc-300">{row.period} hs</td>
                        <td className="py-2.5 px-4 text-right text-[#3fd8e8]">
                          ${row.laundry.toLocaleString('es-AR')}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#f2c14e]">
                          ${row.casino.toLocaleString('es-AR')}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#a88cff]">
                          ${row.skybar.toLocaleString('es-AR')}
                        </td>
                        <td className="py-2.5 px-4 text-right font-semibold text-white">
                          ${row.today.toLocaleString('es-AR')}
                        </td>
                        <td className="py-2.5 px-4 text-right text-zinc-400">
                          ${row.yesterday.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeModal === 'nuevoEvento' && (
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Horario (24h)</label>
                  <input
                    type="time"
                    value={evtTime}
                    onChange={(e) => setEvtTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0a0910] border border-white/15 text-white font-mono-tabular text-sm focus:outline-none focus:border-[#e0203c]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Local Asignado</label>
                  <select
                    value={evtVenueId}
                    onChange={(e) => setEvtVenueId(e.target.value as VenueId)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0a0910] border border-white/15 text-white text-sm focus:outline-none focus:border-[#e0203c]"
                  >
                    <option value="laundry">Lavandería (Cian)</option>
                    <option value="casino">Casino (Dorado)</option>
                    <option value="skybar">Bar & Fumadores (Violeta)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Tipo de Actividad</label>
                  <select
                    value={evtCategory}
                    onChange={(e) =>
                      setEvtCategory(e.target.value as 'Torneo' | 'Promo' | 'Degustación' | 'Operativo')
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0a0910] border border-white/15 text-white text-sm focus:outline-none focus:border-[#e0203c]"
                  >
                    <option value="Torneo">Torneo</option>
                    <option value="Promo">Promo</option>
                    <option value="Degustación">Degustación</option>
                    <option value="Operativo">Operativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Estado de Cupo / Detalle</label>
                  <input
                    type="text"
                    value={evtCapacity}
                    onChange={(e) => setEvtCapacity(e.target.value)}
                    placeholder="Ej. 20 / 24 plazas reservadas"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0a0910] border border-white/15 text-white text-sm focus:outline-none focus:border-[#e0203c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Nombre del Evento</label>
                <input
                  type="text"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="Ej. Torneo Ruleta Relámpago Medianoche"
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0a0910] border border-white/15 text-white text-sm focus:outline-none focus:border-[#e0203c]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-white/15 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e0203c] hover:bg-[#c81933] text-xs font-semibold text-white cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Evento
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
