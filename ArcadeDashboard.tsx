import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Rocket, 
  Sparkles, 
  Layers, 
  Trophy, 
  Flame, 
  Coins, 
  Award,
  ChevronRight,
  History,
  Users,
  Play,
  Volume2,
  VolumeX,
  Swords,
  ShieldCheck,
  Target,
  ArrowUpRight,
  Bot,
  RefreshCw,
  Lightbulb,
  Crosshair
} from 'lucide-react';
import { GameRecord, Achievement } from '../utils/storage';
import { UserProfile } from '../utils/userProfile';
import { GlobalLeaderboardPlayer, MatchHistoryLog } from '../utils/multiplayerStats';
import { CyberMission, GameTactics, fetchCyberMission, fetchGameTactics } from '../utils/cyberAi';

const AIR_HOCKEY_ART = '/images/neon_air_hockey_art_1793470408465.jpg';
const CYBER_PONG_ART = '/images/cyber_pong_art_1793470408184.jpg';
const CYBER_RUNNER_ART = '/images/cyber_runner_art_1793470409104.jpg';
const SPACE_DEFENDER_ART = '/images/space_defender_art_1793470408835.jpg';
const NEON_SNAKE_ART = '/images/neon_snake_art_1793472659362.jpg';
const QUANTUM_FUSION_ART = '/images/quantum_fusion_art_1793472672340.jpg';

interface ArcadeDashboardProps {
  onSelectGame: (gameId: 'runner' | 'shooter' | 'snake' | 'tile' | 'hockey' | 'pong') => void;
  onOpenMultiplayerLobby: (preferredGame?: 'hockey' | 'pong') => void;
  onQuickMatch: () => void;
  onOpenProfile: () => void;
  profile: UserProfile;
  highScores: Record<string, number>;
  history: GameRecord[];
  achievements: Achievement[];
  globalLeaderboard: GlobalLeaderboardPlayer[];
  recentMatches: MatchHistoryLog[];
  coins: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ArcadeDashboard: React.FC<ArcadeDashboardProps> = ({
  onSelectGame,
  onOpenMultiplayerLobby,
  onQuickMatch,
  onOpenProfile,
  profile,
  highScores,
  history,
  achievements,
  globalLeaderboard,
  recentMatches,
  coins,
  isMuted,
  onToggleMute,
}) => {
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'leaderboard' | 'matches'>('leaderboard');
  
  // Gemini AI Cyber Master States
  const [cyberMission, setCyberMission] = useState<CyberMission | null>(null);
  const [isLoadingMission, setIsLoadingMission] = useState<boolean>(false);
  const [selectedGameForTactics, setSelectedGameForTactics] = useState<string>('Neon Air Hockey');
  const [gameTactics, setGameTactics] = useState<GameTactics | null>(null);
  const [isLoadingTactics, setIsLoadingTactics] = useState<boolean>(false);

  // Load initial Gemini AI data
  useEffect(() => {
    handleGenerateMission();
    handleLoadTactics('Neon Air Hockey');
  }, []);

  const handleGenerateMission = async (targetGameId?: string) => {
    setIsLoadingMission(true);
    try {
      const mission = await fetchCyberMission(targetGameId, profile.username);
      setCyberMission(mission);
    } finally {
      setIsLoadingMission(false);
    }
  };

  const handleLoadTactics = async (gameTitle: string) => {
    setSelectedGameForTactics(gameTitle);
    setIsLoadingTactics(true);
    try {
      const tactics = await fetchGameTactics(gameTitle);
      setGameTactics(tactics);
    } finally {
      setIsLoadingTactics(false);
    }
  };

  const soloGames = [
    {
      id: 'runner' as const,
      title: 'Cyber Dash',
      category: 'Endless Synthwave Runner',
      desc: 'Sprint through high-voltage laser gates, jump over security barricades, and outpace the firewall.',
      icon: Zap,
      image: CYBER_RUNNER_ART,
      highScore: highScores['runner'] || 0,
      badge: 'Speed Demon',
      accentColor: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400',
      btnColor: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
    },
    {
      id: 'shooter' as const,
      title: 'Galaxy Defender',
      category: 'Arcade Space Shooter',
      desc: 'Command your laser interceptor, obliterate waves of alien invaders, and dodge dense asteroid belts.',
      icon: Rocket,
      image: SPACE_DEFENDER_ART,
      highScore: highScores['shooter'] || 0,
      badge: 'Bullet Hell',
      accentColor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400',
      btnColor: 'bg-blue-500 hover:bg-blue-400 text-white',
    },
    {
      id: 'snake' as const,
      title: 'Neon Snake',
      category: 'Vector Grid Arcade',
      desc: 'Guide your luminescent cyber serpent, harvest golden plasma orbs, and activate spectral phasing.',
      icon: Sparkles,
      image: NEON_SNAKE_ART,
      highScore: highScores['snake'] || 0,
      badge: 'Retro Classic',
      accentColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    },
    {
      id: 'tile' as const,
      title: 'Quantum Fusion',
      category: '2048 Energy Synthesis',
      desc: 'Slide and merge identical isotope blocks on a magnetic grid to forge the legendary 2048 singularity.',
      icon: Layers,
      image: QUANTUM_FUSION_ART,
      highScore: highScores['tile'] || 0,
      badge: 'Logic Puzzle',
      accentColor: 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/40 text-fuchsia-400',
      btnColor: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
    },
  ];

  const allGameTitles = [
    'Neon Air Hockey',
    'Cyber Pong',
    'Cyber Dash',
    'Galaxy Defender',
    'Neon Snake',
    'Quantum Fusion'
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-12 arcade-grid-bg">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Clean unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 tracking-wider uppercase">
              <span>6 High-Octane Games</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>1v1 Real-Time Duels</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>AI Cyber Master</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black font-arcade text-white tracking-tight" style={{ textWrap: 'balance' }}>
                NEON ARCADE
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-300 mt-2 leading-relaxed">
                Play instantly solo or battle rivals head-to-head in real time. Choose any game below, create private 1v1 lobbies, and take on daily AI missions powered by Gemini.
              </p>
            </div>

            {/* Primary Action Zone */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onQuickMatch}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black font-arcade text-sm transition-all duration-150 transform active:scale-95 shadow-lg shadow-cyan-400/25 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                Quick Match 1v1
              </button>
              <button
                onClick={() => onOpenMultiplayerLobby()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-arcade text-sm border border-slate-700/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                Browse Lobbies
              </button>
              <a
                href="#solo-games-section"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold font-arcade text-sm border border-amber-500/30 transition-colors whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-current text-amber-400" />
                Jump to Solo Games
              </a>
            </div>
          </div>

          {/* Quick Pilot Card & Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            {/* Interactive Player Profile Tile */}
            <button
              onClick={onOpenProfile}
              className="group text-left flex items-center gap-3.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-200 shadow-md cursor-pointer"
              title="Customize nickname and avatar"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                {profile.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-arcade text-white group-hover:text-cyan-400 text-base transition-colors">
                    {profile.username}
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {profile.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Wins: <strong className="text-emerald-400 font-mono tabular-nums">{profile.stats.wins}</strong></span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>Losses: <strong className="text-rose-400 font-mono tabular-nums">{profile.stats.losses}</strong></span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 ml-2 transition-colors" />
            </button>

            {/* Coins & Audio Mute controls */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-md">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Coins:</span>
                <span className="text-sm font-bold font-mono tabular-nums text-amber-300">{coins}</span>
              </div>

              <button
                onClick={onToggleMute}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
                title={isMuted ? 'Unmute audio' : 'Mute audio'}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Ambient subtle lighting */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* MULTIPLAYER 1v1 DUEL SECTION */}
      <section id="arena-section" className="space-y-5 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              <Swords className="w-4 h-4" />
              <span>Real-Time Multiplayer Duels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-arcade text-white tracking-tight mt-1">
              1v1 MULTIPLAYER ARENA
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Play directly against a smart AI bot or invite a friend via custom room code
            </p>
          </div>

          <button
            onClick={() => onOpenMultiplayerLobby()}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-arcade text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Open Lobby Browser <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* The 2 Major Multiplayer Games with Cinematic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Neon Air Hockey */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-900/95 border-2 border-slate-800 hover:border-cyan-500/60 transition-all duration-300 flex flex-col justify-between shadow-xl">
            {/* Visual Media Showcase with Scrim */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950">
              <img
                src={AIR_HOCKEY_ART}
                alt="Futuristic neon air hockey table"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-cyan-300 block uppercase tracking-wider">Kinetic Impulse Engine</span>
                  <h3 className="text-2xl font-black font-arcade text-white drop-shadow">Neon Air Hockey</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  First to 5
                </span>
              </div>
            </div>

            {/* Description & Features */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Control your mallet with mouse or touch, accelerate the puck with kinetic strikes, rebound off glowing walls, and defend your net in 60 FPS.
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Authoritative physics
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Rail banking
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onSelectGame('hockey')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-arcade text-xs transition-colors whitespace-nowrap shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  PLAY SOLO VS BOT
                </button>
                <button
                  onClick={() => onOpenMultiplayerLobby('hockey')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-arcade text-xs border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  PLAY ONLINE 1v1
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Cyber Pong */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-900/95 border-2 border-slate-800 hover:border-indigo-500/60 transition-all duration-300 flex flex-col justify-between shadow-xl">
            {/* Visual Media Showcase with Scrim */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950">
              <img
                src={CYBER_PONG_ART}
                alt="Neon cyber pong arena"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-indigo-300 block uppercase tracking-wider">Dynamic Velocity Arena</span>
                  <h3 className="text-2xl font-black font-arcade text-white drop-shadow">Cyber Pong</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  First to 5
                </span>
              </div>
            </div>

            {/* Description & Features */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Classic arcade tennis reimagined with accelerating energy spheres, deflection spin angles, and lightning-fast reflex exchanges.
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Sub-ms synchrony
                </span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  Spin curve deflection
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onSelectGame('pong')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black font-arcade text-xs transition-colors whitespace-nowrap shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  PLAY SOLO VS BOT
                </button>
                <button
                  onClick={() => onOpenMultiplayerLobby('pong')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-arcade text-xs border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  PLAY ONLINE 1v1
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GEMINI AI CYBER MASTER / MAINFRAME SECTION */}
      <section id="cyber-ai-section" className="rounded-3xl bg-slate-900/90 border-2 border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <Bot className="w-4 h-4" />
              <span>Gemini AI Arcade Mainframe</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-arcade text-white tracking-tight">
              CYBER AI TACTICAL HUB
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Live coaching, daily arcade operations, and secret pro strategies generated by Gemini AI
            </p>
          </div>

          <button
            onClick={() => handleGenerateMission()}
            disabled={isLoadingMission}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold font-arcade transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMission ? 'animate-spin' : ''}`} />
            Re-Roll Mission
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* Active Cyber Mission Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-cyan-500/30 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                  {cyberMission?.difficulty || 'ACTIVE MISSION'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  +{cyberMission?.rewardCoins || 50} Coins
                </span>
              </div>

              <h3 className="text-xl font-black font-arcade text-white">
                {isLoadingMission ? 'DECODING MAINFRAME PROTOCOL...' : cyberMission?.title || 'OVERDRIVE VELOCITY'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {isLoadingMission ? 'Generating dynamic mission objectives...' : cyberMission?.objective}
              </p>

              {cyberMission?.cyberLore && (
                <p className="text-[11px] text-cyan-400/80 font-mono italic">
                  "{cyberMission.cyberLore}"
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (cyberMission?.targetGame) {
                    onSelectGame(cyberMission.targetGame);
                  } else {
                    onSelectGame('runner');
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-arcade text-xs tracking-wider transition-all duration-150 transform active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
                DEPLOY TO MISSION NOW ({cyberMission?.gameName || 'Cyber Dash'})
              </button>
            </div>
          </div>

          {/* Tactical Game Coach Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-indigo-500/30 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  AI Tactical Coach
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Target: <strong className="text-white">{selectedGameForTactics}</strong>
                </span>
              </div>

              {/* Game Selector Chips */}
              <div className="flex flex-wrap gap-1.5">
                {allGameTitles.map((title) => (
                  <button
                    key={title}
                    onClick={() => handleLoadTactics(title)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-arcade font-bold transition-colors cursor-pointer ${
                      selectedGameForTactics === title
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>

              {isLoadingTactics ? (
                <p className="text-xs text-slate-400 py-3 font-mono animate-pulse">
                  Querying Gemini 3.8 Flash for advanced strategy heuristics...
                </p>
              ) : (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-indigo-300 italic">
                    "{gameTactics?.headline}"
                  </p>
                  <ul className="space-y-1.5">
                    {gameTactics?.proTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-mono font-bold">0{idx + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  {gameTactics?.secretGlitch && (
                    <div className="mt-2 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200 font-mono">
                      <strong className="text-cyan-300">Secret:</strong> {gameTactics.secretGlitch}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const gameMap: Record<string, 'hockey' | 'pong' | 'runner' | 'shooter' | 'snake' | 'tile'> = {
                    'Neon Air Hockey': 'hockey',
                    'Cyber Pong': 'pong',
                    'Cyber Dash': 'runner',
                    'Galaxy Defender': 'shooter',
                    'Neon Snake': 'snake',
                    'Quantum Fusion': 'tile',
                  };
                  const id = gameMap[selectedGameForTactics] || 'hockey';
                  onSelectGame(id);
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-arcade text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                Practice {selectedGameForTactics} Tactics
              </button>
            </div>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* SOLO ARCADE CHALLENGES SECTION */}
      <section id="solo-games-section" className="space-y-5 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
              <Flame className="w-4 h-4" />
              <span>High-Score Retro Action</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-arcade text-white tracking-tight mt-1">
              SOLO ARCADE GAMES
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Classic fast-paced arcade challenges. Beat your personal records and climb the hall of fame.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hidden sm:inline-block">
            4 Standalone Games
          </span>
        </div>

        {/* 4 Solo Games with Full Cinematic Art Posters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {soloGames.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="group relative overflow-hidden rounded-3xl bg-slate-900/95 border-2 border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Visual Media Showcase with Scrim */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                  <img
                    src={game.image}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono font-bold text-slate-200">
                      {game.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-xs font-mono font-bold text-cyan-300 shadow">
                      High Score: {game.highScore}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-medium text-slate-300 block">{game.category}</span>
                      <h3 className="text-2xl font-black font-arcade text-white drop-shadow flex items-center gap-2">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        {game.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description & Buttons */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {game.desc}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => onSelectGame(game.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black font-arcade text-xs transition-all duration-150 transform active:scale-95 shadow-md cursor-pointer ${game.btnColor}`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      PLAY NOW
                    </button>
                    <button
                      onClick={() => handleLoadTactics(game.title)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-arcade text-xs border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      AI Pro Tips
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GLOBAL LEADERBOARD & RECENT MATCHES SECTION */}
      <section id="leaderboard-section" className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
              <Trophy className="w-4 h-4" />
              <span>Official Standings &amp; Match Log</span>
            </div>
            <h3 className="text-xl font-black font-arcade text-white tracking-tight mt-1">
              PILOT LEADERBOARD
            </h3>
          </div>

          {/* Clean Segmented Tab Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveLeaderboardTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-arcade transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLeaderboardTab === 'leaderboard'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Global Standings
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('matches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-arcade transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeLeaderboardTab === 'matches'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recent Duels ({recentMatches.length})
            </button>
          </div>
        </div>

        {activeLeaderboardTab === 'leaderboard' ? (
          globalLeaderboard.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Connecting to live leaderboard records...
            </div>
          ) : (
            <div className="space-y-2">
              {globalLeaderboard.map((player, idx) => (
                <div
                  key={player.username}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    player.username === profile.username
                      ? 'bg-cyan-950/40 border-cyan-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-arcade text-xs ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-950'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-lg">{player.avatar}</span>
                    <div>
                      <span className="font-bold font-arcade text-white block">{player.username}</span>
                      <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {player.matches} matches · {player.goals} goals scored
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Wins</span>
                      <span className="font-bold font-mono text-emerald-400 tabular-nums text-sm">{player.wins}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Winrate</span>
                      <span className="font-bold font-mono text-amber-400 tabular-nums text-sm">{player.winrate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          recentMatches.length === 0 ? (
            <div className="text-center py-12 space-y-2 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              <Swords className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs text-slate-400">No recent PvP duels completed.</p>
              <p className="text-[11px] text-slate-500">Play Air Hockey or Cyber Pong to generate the match report!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {recentMatches.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{m.gameType === 'hockey' ? '🏒' : '🏓'}</span>
                    <div>
                      <span className="font-bold font-arcade text-white block">
                        {m.p1} <span className="text-cyan-400 font-mono tabular-nums">{m.score1}</span> - <span className="text-indigo-400 font-mono tabular-nums">{m.score2}</span> {m.p2}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Winner: <strong className="text-emerald-400 font-medium">{m.winner}</strong> · <span className="font-mono tabular-nums">{m.time}</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* ACHIEVEMENTS & SOLO HISTORY */}
      <div id="trophies-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-20">
        {/* Achievements Showcase */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-arcade text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> TROPHIES &amp; ACHIEVEMENTS
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-400">{unlockedCount} / {achievements.length} unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 ${
                  ach.unlocked
                    ? 'bg-slate-950/80 border-indigo-500/40 text-slate-200'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${ach.unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold font-arcade text-white truncate">{ach.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solo Recent Runs */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-arcade text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" /> SOLO RUN HISTORY
            </h3>
            <span className="text-xs text-slate-400">Recent Scores</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No solo arcade runs recorded yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {history.slice(0, 6).map((rec) => {
                const gameName =
                  rec.gameId === 'runner'
                    ? 'Cyber Dash'
                    : rec.gameId === 'shooter'
                    ? 'Galaxy Defender'
                    : rec.gameId === 'snake'
                    ? 'Neon Snake'
                    : 'Quantum Fusion';

                return (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div>
                      <span className="font-bold font-arcade text-slate-200 block">{gameName}</span>
                      <span className="text-[10px] text-slate-500 font-mono tabular-nums">{rec.date}</span>
                    </div>
                    <span className="text-sm font-bold font-mono tabular-nums text-cyan-400">{rec.score} pts</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
