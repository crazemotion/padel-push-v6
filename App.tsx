
import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Plus, X, ShieldCheck, MapPin, Clock, Timer, BarChart3, Users, MessageCircle, Zap, CheckCircle2, Star, Beer, Swords, Handshake, Euro, Map, Trash2, Flag, LogOut, Banknote, CreditCard, Wallet, Crown, ChevronRight, Lock, Minus, Equal, Check, CircleDot, UserPlus, Warehouse, Sun, Grid3x3, BrickWall, Search, PanelLeft, PanelRight, HelpCircle, Hand, CalendarCheck, UserCircle2, MapPinned, ChevronDown, Phone, LayoutGrid, AlertCircle, XCircle, History, Filter, CalendarDays, Bell, AlertTriangle, ArrowRight, Mail, Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
import { CLUBS_VALENCIA, PADEL_LEVELS, INITIAL_MATCHES_DATA, CLUB_ZONE_MAPPING, ZONES, MATCH_DURATIONS } from './constants';
import { Match, UserProfile, ViewState } from './types';
import { MatchCard } from './components/MatchCard';
import { Navigation } from './components/Navigation';

type AuthView = 'welcome' | 'login' | 'register' | 'app';
type RegisterStep = 'form' | 'otp';

const App: React.FC = () => {
  // State
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [currentView, setCurrentView] = useState<ViewState>('feed');
  const [matches, setMatches] = useState<Match[]>([]);
  const [user, setUser] = useState<UserProfile>({ 
    name: '', 
    email: '',
    password: '',
    whatsapp: '', 
    isPhoneVerified: false,
    notificationsEnabled: true,
    notificationZone: 'Valencia Capital',
    isPremium: false,
    level: PADEL_LEVELS[6], 
    reputation: 4.8, 
    matchesPlayed: 12,
    playSide: 'indifferent',
    dominantHand: 'right'
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Auth Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration State
  const [registerStep, setRegisterStep] = useState<RegisterStep>('form');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']); // 4 digits
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Premium Filter State
  const [feedFilter, setFeedFilter] = useState<'zone' | 'all'>('zone');

  // Join Confirmation Modal State
  const [matchToJoin, setMatchToJoin] = useState<Match | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); 
  const [joinBringBalls, setJoinBringBalls] = useState(false);
  
  // New Friend Logic: Array of friends
  const [friendsToAdd, setFriendsToAdd] = useState<{id: number, name: string, level: string}[]>([]);

  // Delete Confirmation State
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null);

  // Leave / Cancel Spot State (New)
  const [matchToLeave, setMatchToLeave] = useState<Match | null>(null);

  // History Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyDateFilter, setHistoryDateFilter] = useState('');

  // Rating State
  const [matchToRate, setMatchToRate] = useState<Match | null>(null);
  const [ratingScore, setRatingScore] = useState({ respect: 5, levelComparison: 0 });

  // Form State
  const [club, setClub] = useState(CLUBS_VALENCIA[0]);
  const [manualZone, setManualZone] = useState(ZONES[0]);
  const [locationDetail, setLocationDetail] = useState(''); 
  const [level, setLevel] = useState(PADEL_LEVELS[6]); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [duration, setDuration] = useState(90); 
  const [price, setPrice] = useState<string>('5');
  const [matchType, setMatchType] = useState<'competitive' | 'friendly'>('friendly');
  const [genderCategory, setGenderCategory] = useState<'male' | 'female' | 'mixed'>('mixed'); 
  const [courtType, setCourtType] = useState<'indoor' | 'outdoor'>('indoor');
  const [wallType, setWallType] = useState<'glass' | 'wall'>('glass');    
  const [preferredPosition, setPreferredPosition] = useState<'right' | 'backhand' | 'indifferent'>('indifferent');
  const [hasBeer, setHasBeer] = useState(false);
  const [hasBalls, setHasBalls] = useState(false);
  const [acceptsCash, setAcceptsCash] = useState(false); 
  const [missingPlayers, setMissingPlayers] = useState(1); 
  const [createAsPremium, setCreateAsPremium] = useState(false); 

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load & Migrate data
  useEffect(() => {
    const savedMatches = localStorage.getItem('padelsos_matches');
    const savedUser = localStorage.getItem('padelsos_user');

    if (savedMatches) {
      let parsedMatches: any[] = JSON.parse(savedMatches);
      const migratedMatches: Match[] = parsedMatches.map(m => ({
        ...m,
        players: Array.isArray(m.players) ? m.players : [m.creator],
        zone: m.zone || CLUB_ZONE_MAPPING[m.club] || 'Valencia Capital',
        price: m.price !== undefined ? m.price : 0,
        matchType: m.matchType || 'friendly',
        genderCategory: m.genderCategory || 'mixed',
        courtType: m.courtType || 'indoor', 
        wallType: m.wallType || 'glass',   
        duration: m.duration || 90,
        hasBeer: m.hasBeer !== undefined ? m.hasBeer : false,
        hasBalls: m.hasBalls !== undefined ? m.hasBalls : false,
        acceptsCash: m.acceptsCash !== undefined ? m.acceptsCash : true,
        isPremium: m.isPremium !== undefined ? m.isPremium : false,
        locationDetail: m.locationDetail || undefined,
        status: m.status || 'Open',
        isRated: m.isRated || false,
        preferredPosition: m.preferredPosition || 'indifferent',
        creatorReputation: m.creatorReputation !== undefined ? m.creatorReputation : 4.5,
        creatorLevel: m.creatorLevel || "2.5 - Principiante +",
        cancellationRequests: m.cancellationRequests || [],
      }));
      setMatches(migratedMatches);
    } else {
      setMatches(INITIAL_MATCHES_DATA as unknown as Match[]);
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        notificationsEnabled: parsedUser.notificationsEnabled ?? true,
        notificationZone: parsedUser.notificationZone ?? 'Valencia Capital',
        isPremium: parsedUser.isPremium ?? false,
        level: parsedUser.level || PADEL_LEVELS[6],
        reputation: parsedUser.reputation || 4.5,
        matchesPlayed: parsedUser.matchesPlayed || 0,
        playSide: parsedUser.playSide || 'indifferent',
        dominantHand: parsedUser.dominantHand || 'right',
        isPhoneVerified: parsedUser.isPhoneVerified ?? true // Assume true for legacy users
      });
      // If user exists in storage, go straight to app
      setAuthView('app');
    } else {
      // If no user, stay in welcome/login
      setAuthView('welcome');
    }
    setIsLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('padelsos_matches', JSON.stringify(matches));
    }
  }, [matches, isLoaded]);

  useEffect(() => {
    if (isLoaded && authView === 'app') {
      localStorage.setItem('padelsos_user', JSON.stringify(user));
    }
  }, [user, isLoaded, authView]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      
      const storedUserStr = localStorage.getItem('padelsos_user');
      if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          if (storedUser.email === loginEmail) {
              setUser(storedUser);
              setAuthView('app');
              return;
          }
      }
      
      if (loginEmail.includes('@')) {
         setUser(prev => ({ ...prev, email: loginEmail, name: loginEmail.split('@')[0], isPhoneVerified: true }));
         setAuthView('app');
      } else {
         alert("Email inválido");
      }
  };

  const handleRegisterStep1 = (e: React.FormEvent) => {
      e.preventDefault();
      if (!regEmail || !regPassword || !regName || !regWhatsapp) return;

      // 1. Generate OTP
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setOtpCode(['', '', '', '']); // Reset input
      
      // 2. Simulate SMS sending
      showToast(`📱 SMS Enviado: Tu código es ${code}`);
      
      // 3. Move to Step 2
      setRegisterStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleRegisterFinalize = (e: React.FormEvent) => {
      e.preventDefault();
      const enteredCode = otpCode.join('');
      
      setIsVerifying(true);
      
      setTimeout(() => {
        if (enteredCode === generatedOtp || enteredCode === '0000') {
            const newUser: UserProfile = {
                name: regName,
                email: regEmail,
                password: regPassword,
                whatsapp: regWhatsapp,
                isPhoneVerified: true,
                notificationsEnabled: true,
                notificationZone: 'Valencia Capital',
                isPremium: false,
                level: PADEL_LEVELS[6],
                reputation: 5.0,
                matchesPlayed: 0,
                playSide: 'indifferent',
                dominantHand: 'right'
            };
    
            setUser(newUser);
            setAuthView('app');
            localStorage.setItem('padelsos_user', JSON.stringify(newUser));
            showToast("✅ Móvil verificado. Cuenta creada.");
        } else {
            showToast("❌ Código incorrecto. Inténtalo de nuevo.");
            setOtpCode(['', '', '', '']);
        }
        setIsVerifying(false);
      }, 1500); // Fake network delay
  };

  const confirmLogout = () => {
      setAuthView('welcome');
      setIsLogoutModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      setRegisterStep('form');
  };


  // Auto-Update Match Status Logic
  useEffect(() => {
      if (!isLoaded) return;
      const interval = setInterval(() => {
          const now = new Date();
          setMatches(prevMatches => prevMatches.map(m => {
              // Only process Open matches
              if (m.status !== 'Open') return m;

              const matchDate = new Date(`${m.date}T${m.time}`);
              const isFull = m.players.length >= 4;

              // Logic requested:
              // 1. If start time passed AND match is FULL -> FINISHED (Moves to History)
              if (now >= matchDate && isFull) {
                  return { ...m, status: 'Finished' };
              }
              
              // 2. If start time passed AND match is NOT FULL -> EXPIRED (Deleted/Hidden)
              if (now >= matchDate && !isFull) {
                  return { ...m, status: 'Expired' };
              }

              return m;
          }));
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
  }, [isLoaded]);

  const parseLevel = (levelStr: string) => {
    return parseFloat(levelStr.split(' ')[0]);
  };

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 4000);
  }

  const openMaps = () => {
      let query = club;
      if (CLUB_ZONE_MAPPING[club] === 'Manual') {
          query = locationDetail || manualZone;
      }
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if date/time is in the past
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    
    if (selectedDateTime < now) {
        showToast("⚠️ La fecha y hora no pueden ser anteriores a ahora.");
        return;
    }
    
    let finalZone = '';
    const mappedZone = CLUB_ZONE_MAPPING[club];
    if (mappedZone === 'Manual') {
        finalZone = manualZone;
    } else {
        finalZone = mappedZone;
    }

    const occupiedSlots = 4 - missingPlayers;
    const initialPlayers = [user.name];
    for (let i = 1; i < occupiedSlots; i++) {
        initialPlayers.push(`Amigo ${i}`);
    }

    const newMatch: Match = {
      id: Date.now(),
      club,
      zone: finalZone,
      locationDetail: mappedZone === 'Manual' ? locationDetail : undefined,
      date,
      time,
      duration,
      level,
      price: parseFloat(price) || 0,
      matchType,
      genderCategory,
      courtType,
      wallType,
      hasBeer,
      hasBalls,
      acceptsCash,
      preferredPosition,
      creator: user.name,
      creatorReputation: user.reputation, 
      creatorLevel: user.level, 
      whatsapp: user.whatsapp,
      isPremium: createAsPremium && user.isPremium, 
      status: 'Open',
      createdAt: new Date().toISOString(),
      players: initialPlayers,
      cancellationRequests: []
    };

    setMatches([newMatch, ...matches]);
    setIsCreateModalOpen(false);
    
    // Reset fields
    setLocationDetail('');
    setMissingPlayers(1);
    setAcceptsCash(false);
    setCreateAsPremium(false);
    setHasBalls(false);
    setPreferredPosition('indifferent');
    
    if (missingPlayers === 1) {
        const randomCount = Math.floor(Math.random() * 15) + 5;
        showToast(`🔔 Falta 1: Notificando a ${randomCount} jugadores de ${finalZone}...`);
    } else {
        showToast(`✅ Partido publicado. Buscando ${missingPlayers} jugadores.`);
    }
  };

  const onRequestDelete = (matchId: number) => {
    setMatchToDelete(matchId);
  };

  const handleLeaveMatch = (match: Match) => {
      setMatchToLeave(match);
  };

  const confirmLeave = () => {
    if (!matchToLeave) return;

    const matchDateTime = new Date(`${matchToLeave.date}T${matchToLeave.time}`);
    const now = new Date();
    const diffInMs = matchDateTime.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours > 3) {
        setMatches(prev => prev.map(m => {
            if (m.id === matchToLeave.id) {
                return { ...m, players: m.players.filter(p => !p.startsWith(user.name)) }; 
            }
            return m;
        }));
        showToast("👋 Has salido del partido correctamente.");
    } else {
        setMatches(prev => prev.map(m => {
            if (m.id === matchToLeave.id) {
                const currentRequests = m.cancellationRequests || [];
                return { ...m, cancellationRequests: [...currentRequests, user.name] };
            }
            return m;
        }));
        showToast("📩 Solicitud enviada al organizador.");
    }
    setMatchToLeave(null);
  };

  const handleResolveCancellation = (match: Match, player: string, approved: boolean) => {
      setMatches(prev => prev.map(m => {
          if (m.id === match.id) {
              const newRequests = (m.cancellationRequests || []).filter(p => p !== player);
              let newPlayers = m.players;

              if (approved) {
                  newPlayers = m.players.filter(p => !p.startsWith(player));
                  showToast(`✅ Has aceptado la salida de ${player}.`);
              } else {
                  showToast(`❌ Has rechazado la salida de ${player}.`);
              }

              return { ...m, players: newPlayers, cancellationRequests: newRequests };
          }
          return m;
      }));
  };

  const confirmDeleteMatch = () => {
    if (matchToDelete !== null) {
      setMatches(matches.filter(m => m.id !== matchToDelete));
      setMatchToDelete(null);
      showToast("🗑️ Partido cancelado y eliminado.");
    }
  };

  const handleJoinRequest = (match: Match) => {
    setMatchToJoin(match);
    setJoinBringBalls(false);
    setFriendsToAdd([]); 
  };

  const handleFriendsCountChange = (count: number) => {
      if (count > friendsToAdd.length) {
          const newFriends = [...friendsToAdd];
          for (let i = friendsToAdd.length; i < count; i++) {
              newFriends.push({ id: Date.now() + i, name: '', level: PADEL_LEVELS[6] });
          }
          setFriendsToAdd(newFriends);
      } 
      else if (count < friendsToAdd.length) {
          setFriendsToAdd(friendsToAdd.slice(0, count));
      }
  };

  const updateFriendData = (index: number, field: 'name' | 'level', value: string) => {
      const updated = [...friendsToAdd];
      updated[index] = { ...updated[index], [field]: value };
      setFriendsToAdd(updated);
  };

  const confirmJoinMatch = (paymentMethod: 'card' | 'cash') => {
    if (!matchToJoin) return;
    
    for (const friend of friendsToAdd) {
        if (!friend.name.trim()) {
            alert("Por favor, introduce el nombre de todos tus amigos.");
            return;
        }
    }
    
    let playersToAdd = [user.name];
    friendsToAdd.forEach(f => {
        playersToAdd.push(`${user.name} (Amigo: ${f.name})`);
    });

    setIsProcessingPayment(true);
    
    setTimeout(() => {
      setMatches(matches.map(m => {
        if (m.id === matchToJoin.id) {
            const updatedBalls = m.hasBalls || joinBringBalls;
            return { ...m, players: [...m.players, ...playersToAdd], hasBalls: updatedBalls };
        }
        return m;
      }));
      setIsProcessingPayment(false);
      setMatchToJoin(null);
      
      const methodText = paymentMethod === 'card' ? "Pago realizado" : "Pago en mano confirmado";
      showToast(`🎉 ¡Apuntado! ${methodText}.`);
    }, 1500);
  };

  const handleRating = (match: Match) => {
      setMatchToRate(match);
      setRatingScore({ respect: 5, levelComparison: 0 });
  };

  const submitRating = () => {
      if (!matchToRate) return;
      setUser(prev => ({
          ...prev,
          matchesPlayed: prev.matchesPlayed + 1,
          reputation: Math.min(5, prev.reputation + 0.05) 
      }));
      setMatches(matches.map(m => m.id === matchToRate.id ? { ...m, isRated: true } : m));
      setMatchToRate(null);
      showToast("🌟 ¡Gracias por tu valoración!");
  };

  // --- MAIN APP RENDERERS ---

  const renderFeed = () => {
    const now = new Date();

    // Filter Logic
    let displayedMatches = matches.filter(m => {
        const matchDate = new Date(`${m.date}T${m.time}`);
        const isFull = m.players.length >= 4;
        
        // Hide if:
        // 1. Status is not Open
        // 2. Is Full (unless user logic requires seeing them, but feed usually shows open spots)
        // 3. Start time has passed
        return m.status === 'Open' && !isFull && matchDate > now;
    });

    // Premium Logic: Tabs for Zone vs All
    if (user.isPremium) {
        if (feedFilter === 'zone') {
            displayedMatches = displayedMatches.filter(m => m.zone === user.notificationZone);
        } else {
            displayedMatches = displayedMatches.filter(m => m.zone !== user.notificationZone);
        }
    }

    // Sort Logic: Premium matches first, then chronological
    const sortedMatches = displayedMatches.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
    });

    return (
      <div className="pb-24 pt-4 px-4">
        {/* Sticky Header with Avatar */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 backdrop-blur-md z-20 py-3 border-b border-transparent transition-all">
            <div className="w-10"></div> {/* Spacer for balance */}
            
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 leading-none">PADEL PUSH</h1>
                <p className="text-[10px] text-gray-400 font-bold tracking-wide uppercase mt-0.5">Valencia</p>
            </div>
            
            {/* User Avatar Mini */}
            <button 
                onClick={() => setCurrentView('profile')}
                className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-sm font-bold text-gray-800 hover:scale-105 transition-transform"
            >
                {user.name.charAt(0).toUpperCase()}
            </button>
        </div>
        
        {/* Premium Filters */}
        {user.isPremium && (
            <div className="flex mb-5 bg-white p-1.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <button 
                    onClick={() => setFeedFilter('zone')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${feedFilter === 'zone' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                >
                    Mi Zona ({user.notificationZone})
                </button>
                <button 
                    onClick={() => setFeedFilter('all')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${feedFilter === 'all' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                >
                    Otras Zonas
                </button>
            </div>
        )}

        {sortedMatches.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Trophy className="w-24 h-24 mx-auto mb-4 text-gray-300" />
            <p className="font-bold text-gray-400 text-lg">No hay partidos.</p>
            {user.isPremium && feedFilter === 'zone' && <p className="text-xs mt-2 text-gray-400 font-medium">Estás al día en tu zona.</p>}
          </div>
        ) : (
          sortedMatches.map(match => (
            <MatchCard 
                key={match.id} 
                match={match} 
                currentUserName={user.name}
                onJoinRequest={handleJoinRequest}
                onDelete={onRequestDelete}
                onLeave={handleLeaveMatch}
                onResolveCancellation={handleResolveCancellation}
            />
          ))
        )}

        {/* FAB: Floating Action Button */}
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed bottom-24 right-5 bg-black text-white w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30"
        >
            <Plus className="w-8 h-8" />
        </button>
      </div>
    );
  };

  const renderActive = () => {
      const myMatches = matches.filter(m => m.players.includes(user.name) || m.creator === user.name);
      
      // Filter out matches that are finished or expired
      const upcoming = myMatches.filter(m => m.status === 'Open');

      return (
          <div className="pb-24 pt-6 px-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 leading-none">
                    MIS PARTIDOS
                </h2>
                <div className="bg-white p-2 rounded-xl shadow-sm">
                    <CalendarCheck className="w-6 h-6 text-black" />
                </div>
              </div>

              {myMatches.length === 0 && (
                  <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                      <p className="font-bold text-sm">Aún no tienes partidos activos.</p>
                  </div>
              )}

              {upcoming.length > 0 && (
                  <div className="mb-6 space-y-4">
                      {upcoming.map(match => (
                        <MatchCard 
                            key={match.id} 
                            match={match} 
                            currentUserName={user.name}
                            onJoinRequest={() => {}} // No join needed
                            onDelete={onRequestDelete}
                            onLeave={handleLeaveMatch}
                            onResolveCancellation={handleResolveCancellation}
                        />
                      ))}
                  </div>
              )}

              {/* History Button */}
              <div className="mt-8">
                  <button 
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="w-full bg-white border border-gray-100 text-gray-900 font-bold py-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center justify-between px-6 hover:bg-gray-50 transition-colors group"
                  >
                      <div className="flex items-center gap-4">
                          <div className="bg-gray-100 p-2.5 rounded-xl group-hover:bg-white transition-colors">
                             <History className="w-5 h-5 text-gray-600" />
                          </div>
                          <span className="text-sm">Ver Historial Completo</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                  </button>
              </div>
          </div>
      );
  };

  const renderProfile = () => (
    <div className="pb-24 pt-6 px-4">
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-white relative mb-4">
            {user.isPremium && (
                <div className="absolute -top-1 -right-1 bg-black text-amber-400 p-2 rounded-full border-4 border-[#f3f4f6]">
                    <Crown className="w-5 h-5 fill-current" />
                </div>
            )}
            🎾
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name || 'Usuario'}</h2>
        <div className="flex items-center gap-2 mt-2">
             <span className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-600 shadow-sm border border-gray-100">
                 {user.matchesPlayed} Partidos
             </span>
             {user.isPhoneVerified && (
                 <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-green-200 flex items-center gap-1">
                     <Check className="w-3 h-3" /> Verificado
                 </span>
             )}
        </div>
      </div>

      {/* 1. Reputation Section */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold flex items-center gap-2 text-gray-900">
                  <ShieldCheck className="w-5 h-5 text-gray-900" />
                  Reputación
              </h3>
              <span className="text-xl font-black text-amber-500 flex items-center">
                  {user.reputation.toFixed(1)} <Star className="w-4 h-4 ml-1 fill-current" />
              </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-amber-400 h-3 rounded-full" style={{ width: `${(user.reputation / 5) * 100}%` }}></div>
          </div>
          <p className="text-xs text-center text-gray-400 font-medium">Basado en valoraciones de respeto y puntualidad.</p>
      </div>

       {/* 2. Card: Player Profile */}
       <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 mb-6 p-6">
        <h3 className="font-bold flex items-center justify-center gap-2 mb-6 text-gray-900 border-b border-gray-50 pb-4">
            <Swords className="w-5 h-5" />
            Perfil de Jugador
        </h3>

        <div className="space-y-5">
            {/* Level Selector */}
            <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">Nivel Aproximado</label>
                <div className="relative">
                    <select 
                        value={user.level} 
                        onChange={(e) => setUser({...user, level: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center"
                    >
                        {PADEL_LEVELS.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">Lado de Juego</label>
                    <div className="relative">
                        <select 
                            value={user.playSide} 
                            onChange={(e) => setUser({...user, playSide: e.target.value as any})}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center"
                        >
                            <option value="right">Derecha</option>
                            <option value="backhand">Revés</option>
                            <option value="indifferent">Indiferente</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">Mano Dominante</label>
                    <div className="relative">
                        <select 
                            value={user.dominantHand} 
                            onChange={(e) => setUser({...user, dominantHand: e.target.value as any})}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center"
                        >
                            <option value="right">Diestro</option>
                            <option value="left">Zurdo</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Card: Personal Data */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 mb-6 p-6">
         <h3 className="font-bold flex items-center justify-center gap-2 mb-6 text-gray-900 border-b border-gray-50 pb-4">
            <UserCircle2 className="w-5 h-5" />
            Datos Personales
        </h3>
        <div className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">Nombre Visible</label>
                <input 
                    type="text" 
                    value={user.name}
                    onChange={e => setUser({...user, name: e.target.value})}
                    className="w-full py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-center"
                    placeholder="Tu nombre"
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">WhatsApp</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={user.whatsapp}
                        onChange={e => setUser({...user, whatsapp: e.target.value})}
                        className="w-full py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-center"
                        placeholder="+34 600 000 000"
                    />
                     {user.isPhoneVerified && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                </div>
            </div>
        </div>
      </div>

      {/* 4. MEMBERSHIP PROMO CARD */}
      <div className={`rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden mb-6 transition-all relative ${user.isPremium ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'}`}>
          {!user.isPremium && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
          )}
          
          <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h3 className={`font-black text-xl flex items-center gap-2 tracking-tight ${user.isPremium ? 'text-white' : 'text-gray-900'}`}>
                          {user.isPremium ? 'ERES PREMIUM' : 'PÁSATE A PREMIUM'}
                          <Crown className={`w-6 h-6 ${user.isPremium ? 'text-amber-400 fill-current' : 'text-amber-500 fill-current'}`} />
                      </h3>
                      <p className={`text-xs mt-1 font-medium ${user.isPremium ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.isPremium ? 'Disfruta de todas las ventajas sin límites.' : 'Saca el máximo partido a tu juego.'}
                      </p>
                  </div>
              </div>

              {/* Comparison List */}
              <div className="space-y-3 mb-8">
                  {/* Feature 1: Alerts */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border ${user.isPremium ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${user.isPremium ? 'bg-amber-400/20 text-amber-400' : 'bg-white text-gray-500 shadow-sm'}`}>
                              <Zap className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                              <p className={`text-sm font-bold ${user.isPremium ? 'text-white' : 'text-gray-900'}`}>Alertas Instantáneas</p>
                              <p className={`text-[10px] ${user.isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Sé el primero en apuntarte</p>
                          </div>
                      </div>
                      {!user.isPremium && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">5 min retraso</span>}
                      {user.isPremium && <Check className="w-5 h-5 text-green-500" />}
                  </div>

                  {/* Feature 2: Zone Filters */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border ${user.isPremium ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${user.isPremium ? 'bg-amber-400/20 text-amber-400' : 'bg-white text-gray-500 shadow-sm'}`}>
                              <MapPinned className="w-4 h-4" />
                          </div>
                          <div>
                              <p className={`text-sm font-bold ${user.isPremium ? 'text-white' : 'text-gray-900'}`}>Filtro por Zonas</p>
                              <p className={`text-[10px] ${user.isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Ve solo lo que te interesa</p>
                          </div>
                      </div>
                      {!user.isPremium && <span className="text-[10px] font-bold text-gray-400">Bloqueado</span>}
                      {user.isPremium && <Check className="w-5 h-5 text-green-500" />}
                  </div>

                  {/* Feature 3: Highlight Matches */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border ${user.isPremium ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${user.isPremium ? 'bg-amber-400/20 text-amber-400' : 'bg-white text-gray-500 shadow-sm'}`}>
                              <Star className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                              <p className={`text-sm font-bold ${user.isPremium ? 'text-white' : 'text-gray-900'}`}>Destacar Partidos</p>
                              <p className={`text-[10px] ${user.isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Más visibilidad = Más jugadores</p>
                          </div>
                      </div>
                      {!user.isPremium && <span className="text-[10px] font-bold text-gray-400">Bloqueado</span>}
                      {user.isPremium && <Check className="w-5 h-5 text-green-500" />}
                  </div>
              </div>

              {/* Action Button */}
              {!user.isPremium ? (
                  <button 
                    onClick={() => setUser({...user, isPremium: true})}
                    className="w-full bg-black text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-amber-200/50 active:scale-95 transition-transform flex items-center justify-center gap-2 border border-gray-800"
                  >
                    SUSCRIBIRSE AHORA (4.99€/mes)
                    <ChevronRight className="w-4 h-4" />
                  </button>
              ) : (
                  <button 
                    onClick={() => setUser({...user, isPremium: false})}
                    className="w-full bg-gray-800 text-gray-400 py-3 rounded-2xl text-xs font-medium hover:text-white transition-colors"
                  >
                    Gestionar Suscripción
                  </button>
              )}
          </div>
      </div>
      
      {/* 5. Card: Alert Settings */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 mb-6 p-6">
        <h3 className="font-bold flex items-center justify-center gap-2 mb-6 text-gray-900 border-b border-gray-50 pb-4">
            <Bell className="w-5 h-5" />
            Configuración de Alertas
        </h3>

        <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-sm font-bold text-gray-700">Recibir Notificaciones</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={user.notificationsEnabled}
                    onChange={e => setUser({...user, notificationsEnabled: e.target.checked})}
                    className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
        </div>
        
        {user.notificationsEnabled && (
            <div className="relative mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-center">Zona Principal</label>
                <div className="relative">
                    <select 
                        value={user.notificationZone}
                        onChange={e => setUser({...user, notificationZone: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-black focus:border-transparent text-center"
                    >
                        {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <div className={`mt-5 flex items-start gap-3 p-4 rounded-2xl border ${user.isPremium ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                    <Zap className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-xs leading-relaxed font-medium">
                        {user.isPremium 
                            ? "⚡ Tienes prioridad Premium. Recibirás alertas instantáneas de nuevos partidos en tu zona." 
                            : "⏰ Recibirás notificaciones con 5 min de retraso. Pásate a Premium para ser el primero."}
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="mb-8">
          <button 
             onClick={() => setIsLogoutModalOpen(true)}
             className="w-full py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-bold text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors flex items-center justify-center gap-2"
          >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
          </button>
      </div>
    </div>
  );

  // --- MODALS ---

  const renderLogoutModal = () => {
    if (!isLogoutModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <LogOut className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">¿Cerrar Sesión?</h3>
                <p className="text-sm text-gray-500 mb-8 font-medium">
                    Tendrás que volver a ingresar tus datos para entrar.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsLogoutModalOpen(false)}
                        className="flex-1 py-3.5 font-bold text-gray-600 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmLogout}
                        className="flex-1 py-3.5 font-bold text-white bg-black rounded-2xl shadow-lg active:scale-95 transition-transform"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderLeaveModal = () => {
    if (!matchToLeave) return null;

    const matchDateTime = new Date(`${matchToLeave.date}T${matchToLeave.time}`);
    const now = new Date();
    const diffInMs = matchDateTime.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const isLateCancel = diffInHours <= 3;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl text-center relative overflow-hidden">
                {isLateCancel && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
                )}
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${isLateCancel ? 'bg-amber-100' : 'bg-red-100'}`}>
                    {isLateCancel ? (
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                    ) : (
                        <LogOut className="w-8 h-8 text-red-600" />
                    )}
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-2">
                    {isLateCancel ? "Cancelación Tardía" : "¿Salir del Partido?"}
                </h3>
                
                <div className="text-sm text-gray-500 mb-6 space-y-3 font-medium">
                    <p>
                        {isLateCancel 
                            ? "Faltan menos de 3 horas para el inicio." 
                            : `Estás a punto de liberar tu plaza en ${matchToLeave.club}.`
                        }
                    </p>
                    {isLateCancel && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs font-medium text-amber-800 text-left">
                            <p className="mb-1">⚠️ <span className="font-bold">Atención:</span> No puedes salirte automáticamente.</p>
                            <p>Se enviará una <span className="font-bold">solicitud al organizador</span> y deberás esperar a que acepte tu baja.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setMatchToLeave(null)}
                        className="flex-1 py-3.5 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                    >
                        Volver
                    </button>
                    <button 
                        onClick={confirmLeave}
                        className={`flex-1 py-3.5 font-bold text-white rounded-2xl shadow-lg active:scale-95 transition-transform ${isLateCancel ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isLateCancel ? "Solicitar Baja" : "Sí, Salir"}
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderCreateModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden animate-slide-up shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0 bg-white z-10">
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <Plus className="w-6 h-6" /> Publicar Partido
          </h2>
          <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto p-5 space-y-5 no-scrollbar pb-20">
          
           {/* Club & Zone */}
           <div className="space-y-3">
              <div className="flex gap-2 items-end">
                 <div className="flex-1">
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Club / Ubicación</label>
                     <select 
                        value={club} onChange={e => setClub(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                     >
                        {CLUBS_VALENCIA.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                 </div>
                 <div className="w-14">
                     <button type="button" onClick={openMaps} className="w-full h-[48px] bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 hover:bg-blue-100 transition-colors">
                        <MapPinned className="w-6 h-6" />
                     </button>
                 </div>
              </div>

              {/* Dynamic Zone/Location Fields */}
              {CLUB_ZONE_MAPPING[club] === 'Manual' && (
                  <div className="grid grid-cols-1 gap-3 animate-fade-in">
                      <select 
                        value={manualZone} onChange={e => setManualZone(e.target.value)}
                        className="w-full p-3.5 bg-yellow-50 border border-yellow-200 rounded-2xl text-sm font-bold text-gray-900"
                      >
                        {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                      <input 
                        type="text" 
                        placeholder="Dirección exacta, Calle, Urbanización..."
                        value={locationDetail}
                        onChange={e => setLocationDetail(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400"
                      />
                  </div>
              )}
           </div>

           {/* Date & Time Row */}
           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Fecha</label>
                 <div className="relative">
                    <input 
                        type="date" 
                        value={date} onChange={e => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-bold"
                    />
                 </div>
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Hora</label>
                 <div className="relative">
                    <input 
                        type="time" 
                        value={time} onChange={e => setTime(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 font-bold"
                    />
                 </div>
              </div>
           </div>

           {/* High Contrast Toggles Section */}
           <div className="space-y-4 py-2">
                {/* Gender Category */}
                <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Categoría</label>
                     <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                        <button 
                            type="button" 
                            onClick={() => setGenderCategory('mixed')}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${genderCategory === 'mixed' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Mixto
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setGenderCategory('male')}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${genderCategory === 'male' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Masculino
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setGenderCategory('female')}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${genderCategory === 'female' ? 'bg-pink-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Femenino
                        </button>
                     </div>
                </div>

                {/* Court & Wall */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Pista</label>
                        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                            <button 
                                type="button" 
                                onClick={() => setCourtType('indoor')}
                                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${courtType === 'indoor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                Indoor
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setCourtType('outdoor')}
                                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${courtType === 'outdoor' ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                Outdoor
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Pared</label>
                        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                             <button 
                                type="button" 
                                onClick={() => setWallType('glass')}
                                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${wallType === 'glass' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                Cristal
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setWallType('wall')}
                                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${wallType === 'wall' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                Muro
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mode */}
                <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Modo de juego</label>
                     <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                         <button 
                             type="button" 
                             onClick={() => setMatchType('friendly')}
                             className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${matchType === 'friendly' ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                         >
                             <Handshake className="w-3.5 h-3.5" /> Amistoso
                         </button>
                         <button 
                             type="button" 
                             onClick={() => setMatchType('competitive')}
                             className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${matchType === 'competitive' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                         >
                             <Swords className="w-3.5 h-3.5" /> Competitivo
                         </button>
                     </div>
                </div>
                
                {/* Position Needed */}
                <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Posición Buscada</label>
                     <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                         <button 
                             type="button" 
                             onClick={() => setPreferredPosition('right')}
                             className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${preferredPosition === 'right' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                         >
                             <PanelRight className="w-3.5 h-3.5" /> Derecha
                         </button>
                         <button 
                             type="button" 
                             onClick={() => setPreferredPosition('indifferent')}
                             className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${preferredPosition === 'indifferent' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                         >
                             <HelpCircle className="w-3.5 h-3.5" /> Indif.
                         </button>
                         <button 
                             type="button" 
                             onClick={() => setPreferredPosition('backhand')}
                             className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${preferredPosition === 'backhand' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                         >
                             <PanelLeft className="w-3.5 h-3.5" /> Revés
                         </button>
                     </div>
                </div>
           </div>

           {/* Level & Slots & Duration - Compact Grid */}
           <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Nivel</label>
                     <select 
                        value={level} onChange={e => setLevel(e.target.value)}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 truncate"
                     >
                        {PADEL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                     </select>
                </div>
                <div className="col-span-1">
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Huecos</label>
                     <div className="flex bg-gray-100 rounded-2xl overflow-hidden h-[48px]">
                         {[1, 2, 3].map(num => (
                             <button
                                key={num}
                                type="button"
                                onClick={() => setMissingPlayers(num)}
                                className={`flex-1 font-bold text-sm transition-colors ${missingPlayers === num ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-200'}`}
                             >
                                 {num}
                             </button>
                         ))}
                     </div>
                </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
                <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Duración</label>
                     <select 
                        value={duration} onChange={e => setDuration(Number(e.target.value))}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900"
                     >
                        {MATCH_DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                     </select>
                </div>
                <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Precio / Pers</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                        <input 
                            type="number" step="0.5"
                            value={price} onChange={e => setPrice(e.target.value)}
                            className="w-full p-3.5 pl-9 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900"
                        />
                     </div>
                </div>
           </div>

           {/* Extras Row (Balls, Beer, Cash) */}
           <div className="flex flex-wrap gap-2 pt-1">
               <button 
                   type="button" 
                   onClick={() => setHasBalls(!hasBalls)}
                   className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${hasBalls ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-400'}`}
               >
                   <CircleDot className="w-4 h-4" /> Tenemos bolas
               </button>
               <button 
                   type="button" 
                   onClick={() => setHasBeer(!hasBeer)}
                   className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${hasBeer ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-400'}`}
               >
                   <Beer className="w-4 h-4" /> Cerveza
               </button>
           </div>
           
           <div className="flex gap-2">
                <button 
                   type="button" 
                   onClick={() => setAcceptsCash(!acceptsCash)}
                   className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${acceptsCash ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                   <Banknote className="w-4 h-4" /> Aceptar Pago en Mano
               </button>
           </div>
           
           {/* Premium Checkbox */}
           <div className={`flex items-center p-4 rounded-2xl border transition-colors ${user.isPremium ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
               <input 
                  type="checkbox" 
                  checked={createAsPremium}
                  onChange={e => setCreateAsPremium(e.target.checked)}
                  disabled={!user.isPremium}
                  className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 border-gray-300"
               />
               <div className="ml-3 flex-1">
                   <div className="flex items-center gap-1">
                       <span className={`text-sm font-bold ${user.isPremium ? 'text-gray-900' : 'text-gray-500'}`}>Destacar Partido (Premium)</span>
                       <Crown className="w-3.5 h-3.5 text-amber-500 fill-current" />
                   </div>
                   {!user.isPremium && <p className="text-[10px] text-gray-500 mt-0.5">Suscríbete para usar esta función.</p>}
               </div>
           </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-white z-20 shrink-0 pb-safe">
            <button 
                onClick={handleCreateMatch}
                className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
                <Zap className="w-5 h-5 fill-current" />
                LANZAR ALERTA
            </button>
        </div>
      </div>
    </div>
  );

  const renderJoinModal = () => {
    if (!matchToJoin) return null;
    const matchPrice = matchToJoin.price * (1 + friendsToAdd.length);
    const availableSlots = 4 - matchToJoin.players.length;
    const maxFriends = availableSlots - 1; 

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
           
           {/* Header */}
           <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-black fill-current" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">¿Te apuntas?</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">{matchToJoin.club}</p>
              <div className="inline-flex items-center gap-1 mt-3 bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full text-xs font-bold text-gray-700">
                  <Clock className="w-3.5 h-3.5" /> {matchToJoin.time}
                  <span className="mx-1">•</span>
                  <Euro className="w-3.5 h-3.5" /> {matchPrice} Total
              </div>
           </div>

           {/* Bring Balls Toggle */}
           {!matchToJoin.hasBalls && (
               <div className="mb-5">
                   <button 
                      onClick={() => setJoinBringBalls(!joinBringBalls)}
                      className={`w-full py-3 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${joinBringBalls ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-400'}`}
                   >
                       <CircleDot className="w-4 h-4" /> {joinBringBalls ? '¡Yo llevo bolas!' : 'No tengo bolas'}
                   </button>
               </div>
           )}

           {/* Add Friend Section - Numeric Selector */}
           {maxFriends > 0 && (
               <div className="mb-6">
                   <label className="text-xs font-bold text-gray-500 uppercase block mb-2 text-center">¿Quiénes jugáis?</label>
                   
                   {/* Selector */}
                   <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-4">
                       <button
                           onClick={() => handleFriendsCountChange(0)}
                           className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${friendsToAdd.length === 0 ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                       >
                           Solo yo
                       </button>
                       {[1, 2].map(count => (
                           <button
                               key={count}
                               onClick={() => handleFriendsCountChange(count)}
                               disabled={count > maxFriends}
                               className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                                   friendsToAdd.length === count 
                                     ? 'bg-black text-white shadow-md' 
                                     : count > maxFriends 
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-gray-600'
                               }`}
                           >
                               +{count}
                           </button>
                       ))}
                   </div>

                   {/* Dynamic Inputs for Friends */}
                   {friendsToAdd.length > 0 && (
                       <div className="space-y-3 animate-fade-in">
                            {friendsToAdd.map((friend, index) => (
                                <div key={friend.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3 text-center">Amigo {index + 1}</h4>
                                    <div className="space-y-3">
                                        {/* Name Input - Centered */}
                                        <input 
                                            type="text"
                                            placeholder={`Nombre del Amigo`}
                                            value={friend.name}
                                            onChange={e => updateFriendData(index, 'name', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-center"
                                        />

                                        {/* Level Input - Centered */}
                                        <div className="relative">
                                            <select 
                                                value={friend.level}
                                                onChange={e => updateFriendData(index, 'level', e.target.value)}
                                                className="w-full px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none appearance-none transition-all text-center"
                                            >
                                                {PADEL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p className="text-[10px] text-gray-400 text-center mt-2 font-medium bg-gray-50 py-1 rounded-lg">
                                Se aplicará un cargo extra de <span className="text-gray-900 font-bold">{matchToJoin.price * friendsToAdd.length}€</span>.
                            </p>
                       </div>
                   )}
               </div>
           )}

           {/* Action Buttons */}
           <div className="space-y-3">
               <button 
                  onClick={() => confirmJoinMatch('card')}
                  disabled={isProcessingPayment}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
               >
                  {isProcessingPayment ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pagar {matchPrice}€ (App)
                      </>
                  )}
               </button>

               {matchToJoin.acceptsCash && (
                   <button 
                      onClick={() => confirmJoinMatch('cash')}
                      disabled={isProcessingPayment}
                      className="w-full bg-emerald-50 text-emerald-700 font-bold py-3.5 rounded-2xl border border-emerald-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                   >
                      <Banknote className="w-4 h-4" />
                      Pagar en Mano
                   </button>
               )}

               <button 
                  onClick={() => setMatchToJoin(null)}
                  className="w-full bg-white text-gray-500 font-bold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
               >
                  Cancelar
               </button>
           </div>

           <p className="text-[10px] text-gray-400 text-center mt-4 font-medium">
               Al unirte aceptas las normas de la comunidad.
           </p>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
      if (matchToDelete === null) return null;
      return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cancelar Partido?</h3>
                  <p className="text-sm text-gray-500 mb-8 font-medium">
                      Esta acción no se puede deshacer. Se eliminará el partido y se notificará a los jugadores.
                  </p>
                  <div className="flex gap-3">
                      <button 
                          onClick={() => setMatchToDelete(null)}
                          className="flex-1 py-3.5 font-bold text-gray-600 bg-gray-100 rounded-2xl"
                      >
                          Volver
                      </button>
                      <button 
                          onClick={confirmDeleteMatch}
                          className="flex-1 py-3.5 font-bold text-white bg-red-600 rounded-2xl shadow-lg active:scale-95 transition-transform"
                      >
                          Sí, Eliminar
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderHistoryModal = () => {
    if (!isHistoryModalOpen) return null;
    
    const myMatches = matches.filter(m => m.players.includes(user.name) || m.creator === user.name);
    let history = myMatches.filter(m => m.status === 'Finished' || m.status === 'Closed');
    
    history.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

    if (historyDateFilter) {
        history = history.filter(m => m.date === historyDateFilter);
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden animate-slide-up shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white z-10">
                    <h2 className="text-lg font-black flex items-center gap-2 tracking-tight">
                        <History className="w-5 h-5" /> Historial de Partidos
                    </h2>
                    <button onClick={() => setIsHistoryModalOpen(false)} className="bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Filter Section */}
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                     <div className="flex items-center gap-3">
                         <div className="relative flex-1">
                             <input 
                                type="date"
                                value={historyDateFilter}
                                onChange={(e) => setHistoryDateFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-black focus:border-transparent outline-none shadow-sm"
                             />
                             <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         </div>
                         {historyDateFilter && (
                             <button 
                                onClick={() => setHistoryDateFilter('')}
                                className="bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-500 shadow-sm"
                             >
                                 Limpiar
                             </button>
                         )}
                     </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-4 space-y-4 no-scrollbar flex-1 bg-gray-50/50">
                    {history.length === 0 ? (
                        <div className="text-center py-16 opacity-40">
                            <History className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                            <p className="font-bold text-gray-400">No hay partidos finalizados.</p>
                            {historyDateFilter && <p className="text-xs mt-2 text-gray-400">Prueba con otra fecha.</p>}
                        </div>
                    ) : (
                        history.map(match => (
                            <MatchCard 
                                key={match.id} 
                                match={match} 
                                currentUserName={user.name}
                                onJoinRequest={() => {}}
                                onRate={handleRating}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderRateModal = () => {
    if (!matchToRate) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative">
                <button 
                    onClick={() => setMatchToRate(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-black text-center mb-1">Valorar Partido</h2>
                <p className="text-xs text-gray-400 text-center mb-8 uppercase tracking-wider font-bold">
                    {matchToRate.club}
                </p>

                <div className="space-y-8">
                    {/* Respect Rating */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 block mb-3 text-center tracking-widest uppercase">Respeto y Puntualidad</label>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRatingScore({ ...ratingScore, respect: star })}
                                    className="transition-transform active:scale-110"
                                >
                                    <Star 
                                        className={`w-9 h-9 ${star <= ratingScore.respect ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'text-gray-200'}`} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level Comparison */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 block mb-3 text-center tracking-widest uppercase">Nivel Real vs Perfil</label>
                        <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-1.5">
                             <button
                                onClick={() => setRatingScore({ ...ratingScore, levelComparison: -1 })}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${ratingScore.levelComparison === -1 ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-200'}`}
                             >
                                 Menos
                             </button>
                             <button
                                onClick={() => setRatingScore({ ...ratingScore, levelComparison: 0 })}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${ratingScore.levelComparison === 0 ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-200'}`}
                             >
                                 Igual
                             </button>
                             <button
                                onClick={() => setRatingScore({ ...ratingScore, levelComparison: 1 })}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${ratingScore.levelComparison === 1 ? 'bg-green-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-200'}`}
                             >
                                 Más
                             </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                            Ayuda a calibrar el nivel de la comunidad.
                        </p>
                    </div>
                </div>

                <button 
                    onClick={submitRating}
                    className="w-full mt-8 bg-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform"
                >
                    ENVIAR VALORACIÓN
                </button>
            </div>
        </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-900 pb-safe">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative">
        
        {/* Toast Notification */}
        {toastMessage && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] animate-slide-down w-[90%] max-w-sm">
                <div className="bg-gray-900/90 backdrop-blur-xl text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                    <div className="bg-green-500 rounded-full p-1 shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-bold leading-tight">{toastMessage}</span>
                </div>
            </div>
        )}

        {/* Main Views */}
        {authView === 'app' ? (
            <>
                {currentView === 'feed' && renderFeed()}
                {currentView === 'active' && renderActive()}
                {currentView === 'profile' && renderProfile()}
                <Navigation currentView={currentView} onNavigate={setCurrentView} />
            </>
        ) : null}

        {/* Auth Screens */}
        {authView === 'welcome' || authView === 'login' || authView === 'register' ? (
            <div className="absolute inset-0 z-50 bg-white">
                {authView === 'welcome' && (
                     <div className="min-h-screen bg-black flex flex-col items-center justify-between p-8 relative overflow-hidden">
                        {/* Animated Background Elements */}
                        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-green-500 rounded-full blur-[120px] opacity-25 animate-pulse"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          
                        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[32px] mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)] animate-slide-up border border-white/10">
                                 <Zap className="w-16 h-16 text-white fill-current" />
                            </div>
                            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2 animate-fade-in drop-shadow-xl">
                                PADEL <span className="text-green-500">PUSH</span>
                            </h1>
                            <p className="text-gray-400 font-medium tracking-wide text-sm">Tu comunidad de pádel definitiva.</p>
                        </div>
          
                        <div className="w-full max-w-xs space-y-4 z-10 animate-slide-up delay-200 mb-8">
                            <button 
                              onClick={() => setAuthView('login')}
                              className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-gray-100 active:scale-95 transition-all text-lg"
                            >
                                INICIAR SESIÓN
                            </button>
                            <button 
                              onClick={() => setAuthView('register')}
                              className="w-full bg-transparent border-2 border-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                            >
                                Registrarme
                            </button>
                        </div>
                    </div>
                )}

                {authView === 'login' && (
                     <div className="min-h-screen bg-[#f3f4f6] flex flex-col p-6">
                        <button onClick={() => setAuthView('welcome')} className="self-start mb-8 p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                            <ArrowRight className="w-6 h-6 rotate-180 text-gray-700" />
                        </button>
         
                        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">¡Hola de nuevo!</h2>
                            <p className="text-gray-500 mb-10 font-medium text-lg">Vamos a jugar.</p>
         
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wide">Email</label>
                                    <input 
                                       type="email" 
                                       value={loginEmail}
                                       onChange={e => setLoginEmail(e.target.value)}
                                       className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300 shadow-sm"
                                       placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wide">Contraseña</label>
                                    <input 
                                       type="password" 
                                       value={loginPassword}
                                       onChange={e => setLoginPassword(e.target.value)}
                                       className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300 shadow-sm"
                                       placeholder="••••••••"
                                    />
                                </div>
         
                                <button 
                                   type="submit"
                                   className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all mt-6 text-lg"
                                >
                                    ENTRAR
                                </button>
                            </form>
                        </div>
                   </div>
                )}

                {authView === 'register' && (
                     <div className="min-h-screen bg-[#f3f4f6] flex flex-col p-6">
                        <button onClick={() => {
                            if (registerStep === 'otp') {
                                setRegisterStep('form');
                            } else {
                                setAuthView('welcome');
                            }
                        }} className="self-start mb-8 p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
           
                        <div className="flex-1 max-w-sm mx-auto w-full">
                            {registerStep === 'form' ? (
                                <>
                                    <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Crear Cuenta</h2>
                                    <p className="text-gray-500 mb-10 font-medium text-lg">Únete a la comunidad.</p>
                
                                    <form onSubmit={handleRegisterStep1} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wide">Nombre</label>
                                            <input 
                                            type="text" 
                                            value={regName}
                                            onChange={e => setRegName(e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
                                            placeholder="Ej. Alex"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wide">Email</label>
                                            <input 
                                            type="email" 
                                            value={regEmail}
                                            onChange={e => setRegEmail(e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
                                            placeholder="tu@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wide">Contraseña</label>
                                            <input 
                                            type="password" 
                                            value={regPassword}
                                            onChange={e => setRegPassword(e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
                                            placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wide">WhatsApp</label>
                                            <input 
                                            type="tel" 
                                            value={regWhatsapp}
                                            onChange={e => setRegWhatsapp(e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
                                            placeholder="+34 600..."
                                            />
                                        </div>
                
                                        <button 
                                        type="submit"
                                        className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-200/50 hover:shadow-2xl active:scale-95 transition-all mt-8 text-lg"
                                        >
                                            CONTINUAR
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="animate-fade-in text-center pt-10">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm">
                                        <Smartphone className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-3">Verifica tu móvil</h2>
                                    <p className="text-gray-500 text-sm mb-10 font-medium">
                                        Te hemos enviado un código a <br /> <span className="font-bold text-gray-900 text-lg">{regWhatsapp}</span>
                                    </p>
                                    
                                    <form onSubmit={handleRegisterFinalize}>
                                        <div className="flex justify-center gap-3 mb-10">
                                            {otpCode.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    className="w-16 h-20 bg-white border-2 border-gray-200 rounded-2xl text-center text-3xl font-black focus:border-black focus:ring-0 outline-none transition-all shadow-sm"
                                                />
                                            ))}
                                        </div>
                                        
                                        <button 
                                            type="submit"
                                            disabled={otpCode.some(d => !d) || isVerifying}
                                            className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 transition-all text-lg"
                                        >
                                            {isVerifying ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                "VERIFICAR"
                                            )}
                                        </button>
                                    </form>
                                    
                                    <p className="text-xs text-gray-400 mt-8 leading-relaxed max-w-[250px] mx-auto">
                                        Necesitamos verificar tu número para enviarte notificaciones push de tus partidos.
                                    </p>
                                </div>
                            )}
                        </div>
                   </div>
                )}
            </div>
        ) : null}

        {/* Modals - Only render when logged in */}
        {authView === 'app' && (
            <>
                {isCreateModalOpen && renderCreateModal()}
                {renderJoinModal()}
                {renderDeleteModal()}
                {renderLeaveModal()}
                {renderLogoutModal()}
                {renderRateModal()}
                {renderHistoryModal()}
            </>
        )}

      </div>
    </div>
  );
};

export default App;
