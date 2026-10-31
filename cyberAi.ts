export interface CyberMission {
  title: string;
  targetGame: 'runner' | 'shooter' | 'snake' | 'tile' | 'hockey' | 'pong';
  gameName: string;
  objective: string;
  cyberLore: string;
  rewardCoins: number;
  difficulty: string;
}

export interface GameTactics {
  gameTitle: string;
  headline: string;
  proTips: string[];
  secretGlitch: string;
}

export async function fetchCyberMission(gameId?: string, username?: string): Promise<CyberMission> {
  try {
    const res = await fetch('/api/gemini/mission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, username }),
    });
    const data = await res.json();
    if (data.mission) return data.mission;
  } catch (err) {
    console.error('Failed to load mission from Gemini:', err);
  }

  // Safe fallback
  return {
    title: 'NEON MATRIX BREACH',
    targetGame: (gameId as any) || 'runner',
    gameName: 'Cyber Dash',
    objective: 'Score 1,500 points and dodge all red patrol drones.',
    cyberLore: 'Rogue security subroutines detected in the central neon grid.',
    rewardCoins: 50,
    difficulty: 'HARD',
  };
}

export async function fetchGameTactics(gameTitle: string): Promise<GameTactics> {
  try {
    const res = await fetch('/api/gemini/tactics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameTitle }),
    });
    const data = await res.json();
    if (data.tactics) return data.tactics;
  } catch (err) {
    console.error('Failed to load tactics from Gemini:', err);
  }

  return {
    gameTitle,
    headline: 'Control the angles and maintain forward attack vector.',
    proTips: [
      'Anticipate bounce trajectories by watching boundary collision lines.',
      'Strike moving targets at apex speed to multiply kinetic output.',
      'Conserve your stamina and recovery frames after aggressive strikes.'
    ],
    secretGlitch: 'Angled impact at the perimeter rail activates high-speed ricochet momentum.'
  };
}

export async function fetchAnnouncerQuote(event: string, username: string, game: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini/announcer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, username, game }),
    });
    const data = await res.json();
    if (data.shoutout) return data.shoutout;
  } catch (err) {
    console.error('Failed to load announcer shoutout from Gemini:', err);
  }
  return 'MAXIMUM OVERDRIVE ENGAGED!';
}
