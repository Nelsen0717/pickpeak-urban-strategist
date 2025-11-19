import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LevelId = 'prologue' | 'basics' | 'trends' | 'ecosystem' | 'pickpeak' | 'negotiation';

export interface AvatarState {
  hair: number;
  face: number;
  suit: number;
  accessory: number;
}

interface GameStore {
  // Identity
  employeeId: string;

  // Stats
  level: number; // 1-5
  xp: number;
  hp: number;
  maxHp: number;

  // Progression
  currentLevelId: LevelId;
  badges: string[];
  completedLevels: LevelId[];
  inventory: string[];

  // RPG State
  avatar: AvatarState;
  storyFlags: Record<string, boolean>;
  companionUnlocked: boolean;
  view: 'hub' | 'level';

  // Actions
  setEmployeeId: (id: string) => void;
  addXp: (amount: number) => void;
  unlockBadge: (badge: string) => void;
  completeLevel: (id: LevelId) => void;
  setCurrentLevelId: (id: LevelId) => void;
  setView: (view: 'hub' | 'level') => void;
  resetProgress: () => void;

  // RPG Actions
  setAvatar: (avatar: AvatarState) => void;
  addItem: (item: string) => void;
  setStoryFlag: (flag: string, value: boolean) => void;
  unlockCompanion: () => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  resetHp: () => void;
}

export const useGameStore = create<GameState>()( // Type changed from GameStore to GameState
  persist(
    (set) => ({
      employeeId: '',
      xp: 0,
      level: 1,
      hp: 100, // New initial state
      maxHp: 100, // New initial state
      currentLevelId: 'prologue',
      badges: [],
      completedLevels: [],

      // RPG State
      avatar: { hair: 0, face: 0, suit: 0, accessory: 0 },
      inventory: [],
      storyFlags: {},
      companionUnlocked: false,
      view: 'level', // Start in level view for Prologue

      setEmployeeId: (id) => set({ employeeId: id }),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        // Simple level up logic: every 1000 XP is a level
        const newLevel = Math.floor(newXp / 1000) + 1;
        return { xp: newXp, level: newLevel };
      }),

      unlockBadge: (badge) => set((state) => ({
        badges: [...new Set([...state.badges, badge])]
      })),

      completeLevel: (id) => set((state) => { // Parameter name changed from levelId to id
        if (state.completedLevels.includes(id)) return {};
        return { completedLevels: [...state.completedLevels, id] };
      }),

      setCurrentLevelId: (id) => set({ currentLevelId: id }), // Parameter name changed from levelId to id
      setView: (view) => set({ view }),

      // RPG Actions
      setAvatar: (avatar) => set({ avatar }),
      addItem: (item) => set((state) => ({
        inventory: [...new Set([...state.inventory, item])]
      })),
      setStoryFlag: (flag, value) => set((state) => ({
        storyFlags: { ...state.storyFlags, [flag]: value }
      })),
      unlockCompanion: () => set({ companionUnlocked: true }),

      resetProgress: () => set({
        employeeId: '',
        xp: 0,
        level: 1,
        currentLevelId: 'prologue',
        badges: [],
        completedLevels: [],
        avatar: { hair: 0, face: 0, suit: 0, accessory: 0 },
        inventory: [],
        storyFlags: {},
        companionUnlocked: false,
        view: 'level'
      }),
    }),
    {
      name: 'cre-game-storage',
    }
  )
);
