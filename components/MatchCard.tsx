
import React from 'react';
import { MapPin, Clock, BarChart3, Users, MessageCircle, Zap, CheckCircle2, Star, Beer, Swords, Handshake, Euro, Map, Trash2, Flag, LogOut, Timer, CircleDot, Warehouse, Sun, Grid3x3, BrickWall, User, PanelLeft, PanelRight, MapPinned, ShieldCheck, AlertTriangle, UserMinus, X, Check, CalendarDays } from 'lucide-react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  currentUserName: string;
  onJoinRequest: (match: Match) => void;
  onDelete?: (matchId: number) => void;
  onRate?: (match: Match) => void; 
  onLeave?: (match: Match) => void; 
  onResolveCancellation?: (match: Match, player: string, approved: boolean) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, currentUserName, onJoinRequest, onDelete, onRate, onLeave, onResolveCancellation }) => {
  const isJoined = match.players.includes(currentUserName) || match.players.some(p => p.startsWith(`${currentUserName} `));
  const isCreator = match.creator === currentUserName;
  const isFull = match.players.length >= 4;
  const spotsLeft = 4 - match.players.length;
  const isFinished = match.status === 'Finished';
  
  // Check if current user has a pending cancellation request
  const hasPendingCancellation = match.cancellationRequests?.includes(currentUserName);

  const handleWhatsAppClick = () => {
    const cleanNumber = match.whatsapp.replace(/\D/g, ''); 
    const message = `Hola ${match.creator}, he visto en Padel Push que buscas uno para el partido en ${match.club} (${match.time}). Soy nivel ${match.level.split(' - ')[0]}. ¿Tenéis hueco?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOpenMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = `${match.club} ${match.zone !== 'Valencia Capital' ? match.zone : ''}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleDirectJoin = () => {
    if (!isJoined && !isFull) {
        onJoinRequest(match);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset hours for accurate comparison
    date.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    tomorrow.setHours(0,0,0,0);

    if (date.getTime() === today.getTime()) return 'Hoy';
    if (date.getTime() === tomorrow.getTime()) return 'Mañana';
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  // Grey out finished matches
  const cardStyle = isFinished 
    ? 'bg-gray-50 border border-gray-100 opacity-90 grayscale-[0.5]' 
    : match.isPremium 
        ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-amber-300' 
        : 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100';

  // Category Styling
  const getCategoryStyle = () => {
    switch(match.genderCategory) {
        case 'male': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'female': return 'bg-pink-50 text-pink-700 border-pink-100';
        case 'mixed': return 'bg-purple-50 text-purple-700 border-purple-100';
        default: return 'bg-purple-50 text-purple-700 border-purple-100';
    }
  };

  const getCategoryLabel = () => {
      switch(match.genderCategory) {
          case 'male': return 'Masculino';
          case 'female': return 'Femenino';
          case 'mixed': return 'Mixto';
          default: return 'Mixto';
      }
  };

  return (
    <div className={`rounded-3xl p-5 mb-5 transition-all relative overflow-hidden ${cardStyle}`}>
      
      {/* Premium Badge */}
      {!isFinished && match.isPremium && (
          <div className="absolute top-0 right-0 bg-amber-300 text-black text-[10px] font-black px-3 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm z-10">
              <Star className="w-3 h-3 fill-black" />
              DESTACADO
          </div>
      )}

      {/* Finished Badge */}
      {isFinished && (
          <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl flex items-center gap-1 z-10">
              <Flag className="w-3 h-3 fill-current" />
              FINALIZADO
          </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 pr-12">
                <h3 className={`font-black tracking-tight leading-tight text-xl ${isFinished ? 'text-gray-600' : 'text-gray-900'}`}>
                    {match.club}
                </h3>
                <button 
                    onClick={handleOpenMaps}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Ver en Google Maps"
                >
                    <MapPinned className="w-4 h-4" />
                </button>
            </div>
        </div>
        <div className="flex flex-col text-xs text-gray-500 mt-1 gap-1">
             <div className="flex items-center font-medium">
                 <MapPin className="w-3.5 h-3.5 mr-1" />
                 {match.zone}
             </div>
             {match.locationDetail && (
                 <div className="flex items-center font-medium text-gray-600">
                     <Map className="w-3.5 h-3.5 mr-1 text-gray-400" />
                     {match.locationDetail}
                 </div>
             )}
        </div>
      </div>

      {/* Metrics Grid - Updated to be cleaner (No Borders) */}
      <div className="grid grid-cols-4 gap-2 bg-gray-50 p-3.5 rounded-2xl mb-5">
        <div className="flex flex-col items-center">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">Fecha</span>
             <div className="flex items-center font-bold text-gray-900 text-sm">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                {formatDate(match.date)}
             </div>
        </div>
        <div className="flex flex-col items-center">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">Hora</span>
             <div className="flex items-center font-bold text-gray-900 text-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                {match.time}
             </div>
        </div>
        <div className="flex flex-col items-center">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">Duración</span>
             <div className="flex items-center font-bold text-gray-900 text-sm">
                <Timer className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                {match.duration || 90}'
             </div>
        </div>
        <div className="flex flex-col items-center">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">Nivel</span>
             <div className="flex items-center font-bold text-gray-900 text-sm">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                {match.level.split(' - ')[0]}
             </div>
        </div>
      </div>

      {/* Vibe Tags - Hidden if finished to clean up view */}
      {!isFinished && (
          <div className="flex flex-wrap gap-2 mb-5">
            
            {/* Gender Category */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getCategoryStyle()}`}>
                <User className="w-3.5 h-3.5 mr-1.5" />
                {getCategoryLabel()}
            </span>

            {/* Position Needed */}
            {match.preferredPosition && match.preferredPosition !== 'indifferent' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                    {match.preferredPosition === 'backhand' ? <PanelLeft className="w-3.5 h-3.5 mr-1.5" /> : <PanelRight className="w-3.5 h-3.5 mr-1.5" />}
                    Buscan: {match.preferredPosition === 'backhand' ? 'Revés' : 'Derecha'}
                </span>
            )}

            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${match.matchType === 'competitive' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                {match.matchType === 'competitive' ? <Swords className="w-3.5 h-3.5 mr-1.5" /> : <Handshake className="w-3.5 h-3.5 mr-1.5" />}
                {match.matchType === 'competitive' ? 'Competitivo' : 'Amistoso'}
            </span>
            
            {/* Court Type */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${match.courtType === 'indoor' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-sky-50 text-sky-700 border-sky-100'}`}>
                {match.courtType === 'indoor' ? <Warehouse className="w-3.5 h-3.5 mr-1.5" /> : <Sun className="w-3.5 h-3.5 mr-1.5" />}
                {match.courtType === 'indoor' ? 'Indoor' : 'Outdoor'}
            </span>

             {/* Wall Type */}
             <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${match.wallType === 'glass' ? 'bg-cyan-50 text-cyan-700 border-cyan-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {match.wallType === 'glass' ? <Grid3x3 className="w-3.5 h-3.5 mr-1.5" /> : <BrickWall className="w-3.5 h-3.5 mr-1.5" />}
                {match.wallType === 'glass' ? 'Cristal' : 'Muro'}
            </span>
            
            {/* Balls Indicator */}
            {match.hasBalls ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                    <CircleDot className="w-3.5 h-3.5 mr-1.5 fill-green-200" />
                    Hay Bolas
                </span>
            ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                    <CircleDot className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                    Faltan Bolas
                </span>
            )}

            {match.hasBeer && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    <Beer className="w-3.5 h-3.5 mr-1.5" />
                    Tercer Tiempo
                </span>
            )}
          </div>
      )}

      {/* Creator Info Section - Only on active/open matches */}
      {!isFinished && (match.creatorReputation !== undefined) && (
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-2.5 mb-5 shadow-sm">
             <div className="flex items-center gap-2.5">
                 <div className="bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-white ring-2 ring-gray-100">
                     {match.creator.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex flex-col">
                     <span className="text-[10px] text-gray-400 font-bold uppercase">Organizador</span>
                     <span className="text-sm font-bold text-gray-900 leading-none">{match.creator}</span>
                 </div>
             </div>
             
             <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] text-gray-400 font-bold uppercase">Nivel</span>
                     <span className="text-sm font-bold text-gray-700">{match.creatorLevel ? match.creatorLevel.split(' - ')[0] : 'N/A'}</span>
                 </div>
                 <div className="w-px h-6 bg-gray-100"></div>
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] text-gray-400 font-bold uppercase">Confianza</span>
                     <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-amber-500">{match.creatorReputation.toFixed(1)}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* --- CANCELLATION REQUESTS (CREATOR VIEW) --- */}
      {isCreator && match.cancellationRequests && match.cancellationRequests.length > 0 && (
          <div className="mb-5 bg-red-50 border border-red-100 rounded-2xl p-4 animate-pulse">
              <h4 className="text-xs font-black text-red-700 flex items-center gap-1.5 mb-2.5 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" />
                  Solicitud de Cancelación
              </h4>
              <div className="space-y-2">
                  {match.cancellationRequests.map((player) => (
                      <div key={player} className="flex items-center justify-between bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                          <span className="text-sm font-bold text-gray-800">{player} quiere salir.</span>
                          <div className="flex gap-2">
                              <button 
                                onClick={() => onResolveCancellation && onResolveCancellation(match, player, false)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                title="Rechazar"
                              >
                                  <X className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => onResolveCancellation && onResolveCancellation(match, player, true)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                                title="Aceptar salida"
                              >
                                  <Check className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Players Section & Price Footer */}
      <div className="mb-5">
        
        {/* Avatars */}
        <div className="flex items-end justify-between">
            <div className="flex -space-x-3 overflow-hidden py-1 pl-1">
                {match.players.map((player, idx) => (
                    <div key={idx} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border-[3px] border-white text-xs font-bold text-gray-700 shadow-md z-10" title={player}>
                    {player.charAt(0).toUpperCase()}
                    </div>
                ))}
                {/* Empty Slots visualization */}
                {Array.from({ length: spotsLeft }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border-[3px] border-white text-xs font-bold text-gray-300 border-dashed z-0">
                    +1
                    </div>
                ))}
            </div>

            {/* Price and Spots Logic */}
            <div className="text-right">
                 <div className="flex items-center justify-end gap-1 mb-0.5">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{match.price}€</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase self-end mb-1.5">/pers</span>
                 </div>
                 {!isFinished && (
                    isFull ? (
                        <span className="text-xs font-black text-white bg-red-500 px-3 py-1 rounded-full shadow-sm">Completo</span>
                    ) : (
                        <span className="text-xs font-black text-green-700 bg-green-100 px-3 py-1 rounded-full shadow-sm">
                            {spotsLeft} huecos
                        </span>
                    )
                )}
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-5 gap-3">
        
        {/* HISTORY MODE: Finished Matches */}
        {isFinished ? (
             match.isRated ? (
                <div className="col-span-5 bg-gray-50 text-gray-400 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center gap-2 text-sm border border-gray-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Valoración Enviada
                </div>
             ) : (
                <button
                    onClick={() => onRate && onRate(match)}
                    className="col-span-5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
                >
                    <Star className="w-4 h-4 fill-current" />
                    Valorar {isCreator ? 'Jugadores' : 'Organizador'}
                </button>
             )
        ) : (
            /* ACTIVE MODE */
            <>
                {/* VIEW FOR CREATOR */}
                {isCreator ? (
                    <>
                        {/* Only show WhatsApp if there are other humans to talk to */}
                        {match.players.length > 1 && (
                            <button
                                onClick={handleWhatsAppClick}
                                className="col-span-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-bold py-3.5 rounded-2xl flex items-center justify-center transition-colors text-sm"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        )}
                        
                        <button
                            onClick={() => onDelete && onDelete(match.id)}
                            className={`${match.players.length > 1 ? 'col-span-4' : 'col-span-5'} bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center gap-2 transition-colors text-xs uppercase tracking-wide`}
                        >
                            <Trash2 className="w-4 h-4" />
                            Cancelar Partido
                        </button>
                    </>
                ) : (
                    /* VIEW FOR JOINERS */
                    <>
                        {isJoined && (
                            <>
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="col-span-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </button>
                                
                                <div className="col-span-2 bg-blue-50 text-blue-700 border border-blue-200 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-default">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Apuntado
                                </div>
                                
                                {/* Cancel/Leave Button */}
                                {hasPendingCancellation ? (
                                    <div className="col-span-1 bg-yellow-50 text-yellow-600 border border-yellow-200 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center text-sm cursor-not-allowed opacity-80" title="Esperando confirmación del organizador">
                                        <Timer className="w-5 h-5 animate-pulse" />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onLeave && onLeave(match)}
                                        className="col-span-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold py-3.5 px-2 rounded-2xl flex items-center justify-center transition-colors text-sm"
                                        title="Cancelar plaza"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                )}
                            </>
                        )}

                        {!isJoined && (
                            <button
                                onClick={handleDirectJoin}
                                disabled={isFull}
                                className={`col-span-5 font-bold py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all touch-manipulation text-sm shadow-md
                                    ${isFull 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                            : 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]'
                                    }`}
                            >
                                {isFull ? (
                                    'Completo'
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 fill-current" />
                                        Me apunto
                                    </>
                                )}
                            </button>
                        )}
                    </>
                )}
            </>
        )}
      </div>
    </div>
  );
};
