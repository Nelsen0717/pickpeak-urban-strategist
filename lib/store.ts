import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// New Chapter-based structure for Remake
export type ChapterId =
    | 'prologue'           // ACT 1: 覺醒
    | 'chapter1-migration' // 大遷徙時代
    | 'chapter2-moat'      // 數據護城河
    | 'chapter3-groundforce' // 地面部隊
    | 'chapter4-pickpeak'  // PickPeak 深度體驗
    | 'chapter5-ecosystem' // 生態系佈局
    | 'chapter6-negotiation' // 終極談判
    | 'epilogue';          // 方睿宇宙的未來

export interface AvatarState {
    hair: number;
    face: number;
    suit: number;
    accessory: number;
    gender: 'male' | 'female';
}

// Knowledge items learned during the game
export interface KnowledgeItem {
    id: string;
    category: 'market' | 'company' | 'product' | 'strategy';
    title: string;
    content: string;
    unlockedAt: ChapterId;
}

// Team members player can "recruit" understanding of
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    company: 'funraise' | 'yufeng' | 'xirui' | 'pi';
    specialty: string;
    unlocked: boolean;
}

interface GameStore {
    // Identity
    employeeId: string;
    department: string;

    // Stats
    level: number;
    xp: number;
    hp: number;
    maxHp: number;

    // Progression
    currentChapterId: ChapterId;
    completedChapters: ChapterId[];

    // New: Knowledge & Understanding System
    knowledge: KnowledgeItem[];
    teamMembers: TeamMember[];
    marketInsights: number; // 0-100 understanding score
    companyInsights: number;
    productInsights: number;

    // RPG State
    avatar: AvatarState;
    storyFlags: Record<string, boolean>;
    view: 'hub' | 'chapter' | 'certificate' | 'codex';

    // Inventory & Badges
    inventory: string[];
    badges: string[];

    // Quiz/Learning State
    quizScores: Record<ChapterId, number>;
    totalCorrectAnswers: number;

    // Actions
    setEmployeeId: (id: string) => void;
    setDepartment: (dept: string) => void;
    addXp: (amount: number) => void;
    completeChapter: (id: ChapterId) => void;
    setCurrentChapterId: (id: ChapterId) => void;
    setView: (view: 'hub' | 'chapter' | 'certificate' | 'codex') => void;
    resetProgress: () => void;

    // Knowledge Actions
    unlockKnowledge: (item: KnowledgeItem) => void;
    unlockTeamMember: (id: string) => void;
    updateInsights: (type: 'market' | 'company' | 'product', amount: number) => void;

    // Quiz Actions
    recordQuizScore: (chapterId: ChapterId, score: number) => void;
    addCorrectAnswer: () => void;

    // RPG Actions
    setAvatar: (avatar: AvatarState) => void;
    addItem: (item: string) => void;
    setStoryFlag: (flag: string, value: boolean) => void;
    unlockBadge: (badge: string) => void;

    // HP Actions
    takeDamage: (amount: number) => void;
    heal: (amount: number) => void;
    resetHp: () => void;
}

// Initial team members data - Based on actual FUNRAISE team
const INITIAL_TEAM_MEMBERS: TeamMember[] = [
    // === C-Suite & Leadership ===
    { id: 'mike', name: 'Mike Wu 吳健宇', role: 'CEO', company: 'funraise', specialty: '策略規劃與商業開發', unlocked: true },
    { id: 'jaric', name: 'Jaric Kuo 郭彥良', role: 'CTO', company: 'funraise', specialty: '技術架構與系統開發', unlocked: false },
    { id: 'nelsen', name: 'Nelsen Chen 陳致瑋', role: 'COO', company: 'funraise', specialty: '營運卓越與組織發展', unlocked: true },

    // === Engineering ===
    { id: 'bj', name: 'BJ Lin 林柄錦', role: 'Tech Lead', company: 'funraise', specialty: '後端架構與資料處理', unlocked: false },

    // === Product Management ===
    { id: 'jason', name: 'Jason Chang 張譽騰', role: 'Product Manager', company: 'funraise', specialty: 'PickPeak 產品規劃', unlocked: false },

    // === Experience Design Center (XDC) ===
    { id: 'belinda', name: 'Belinda Huang 黃鈺潔', role: 'Design Lead', company: 'funraise', specialty: '使用者體驗設計', unlocked: false },

    // === Property Intelligence ===
    { id: 'logan', name: 'Logan Tseng 曾凡縉', role: 'PI Director', company: 'pi', specialty: '不動產市場數據分析', unlocked: false },

    // === Business Partners ===
    { id: 'yufeng-appraiser', name: '宇豐睿星估價團隊', role: '估價師', company: 'yufeng', specialty: '資產估值與風險評估', unlocked: false },
    { id: 'yufeng-consultant', name: '宇豐睿星商仲團隊', role: '商用不動產顧問', company: 'yufeng', specialty: '交易撮合與談判', unlocked: false },
    { id: 'xirui-sales', name: '希睿置業代銷團隊', role: '專案經理', company: 'xirui', specialty: '建案行銷與銷售', unlocked: false },
];

const initialState = {
    employeeId: '',
    department: '',
    xp: 0,
    level: 1,
    hp: 100,
    maxHp: 100,
    currentChapterId: 'prologue' as ChapterId,
    completedChapters: [] as ChapterId[],
    knowledge: [] as KnowledgeItem[],
    teamMembers: INITIAL_TEAM_MEMBERS,
    marketInsights: 0,
    companyInsights: 0,
    productInsights: 0,
    avatar: { hair: 1, face: 1, suit: 0, accessory: 0, gender: 'male' as const },
    inventory: [] as string[],
    badges: [] as string[],
    storyFlags: {},
    view: 'chapter' as const,
    quizScores: {} as Record<ChapterId, number>,
    totalCorrectAnswers: 0,
};

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            ...initialState,

            setEmployeeId: (id) => set({ employeeId: id }),
            setDepartment: (dept) => set({ department: dept }),

            addXp: (amount) => set((state) => {
                const newXp = state.xp + amount;
                const newLevel = Math.floor(newXp / 500) + 1; // Level up faster
                return { xp: newXp, level: newLevel };
            }),

            completeChapter: (id) => set((state) => {
                if (state.completedChapters.includes(id)) return {};
                return { completedChapters: [...state.completedChapters, id] };
            }),

            setCurrentChapterId: (id) => set({ currentChapterId: id }),
            setView: (view) => set({ view }),

            // Knowledge Actions
            unlockKnowledge: (item) => set((state) => ({
                knowledge: state.knowledge.some(k => k.id === item.id)
                    ? state.knowledge
                    : [...state.knowledge, item]
            })),

            unlockTeamMember: (id) => set((state) => ({
                teamMembers: state.teamMembers.map(member =>
                    member.id === id ? { ...member, unlocked: true } : member
                )
            })),

            updateInsights: (type, amount) => set((state) => {
                const key = `${type}Insights` as 'marketInsights' | 'companyInsights' | 'productInsights';
                return { [key]: Math.min(100, state[key] + amount) };
            }),

            // Quiz Actions
            recordQuizScore: (chapterId, score) => set((state) => ({
                quizScores: { ...state.quizScores, [chapterId]: score }
            })),

            addCorrectAnswer: () => set((state) => ({
                totalCorrectAnswers: state.totalCorrectAnswers + 1
            })),

            // RPG Actions
            setAvatar: (avatar) => set({ avatar }),

            addItem: (item) => set((state) => ({
                inventory: [...new Set([...state.inventory, item])]
            })),

            setStoryFlag: (flag, value) => set((state) => ({
                storyFlags: { ...state.storyFlags, [flag]: value }
            })),

            unlockBadge: (badge) => set((state) => ({
                badges: [...new Set([...state.badges, badge])]
            })),

            // HP Actions
            takeDamage: (amount) => set((state) => ({
                hp: Math.max(0, state.hp - amount)
            })),

            heal: (amount) => set((state) => ({
                hp: Math.min(state.maxHp, state.hp + amount)
            })),

            resetHp: () => set((state) => ({
                hp: state.maxHp
            })),

            resetProgress: () => set({
                ...initialState,
                teamMembers: INITIAL_TEAM_MEMBERS,
            }),
        }),
        {
            name: 'cre-game-v2-storage',
        }
    )
);

// Helper function to get chapter info
export const CHAPTER_INFO: Record<ChapterId, {
    title: string;
    subtitle: string;
    act: 1 | 2 | 3;
    description: string;
    duration: string;
}> = {
    'prologue': {
        title: '序章：2025 市場風暴',
        subtitle: 'PROLOGUE',
        act: 1,
        description: '歡迎來到方睿科技。在這個歷史性的時刻，商用不動產正迎來前所未有的變革。',
        duration: '5 分鐘'
    },
    'chapter1-migration': {
        title: '第一章：大遷徙時代',
        subtitle: 'THE GREAT MIGRATION',
        act: 1,
        description: '理解為什麼現在是進入商用不動產的最佳時機。',
        duration: '8 分鐘'
    },
    'chapter2-moat': {
        title: '第二章：數據護城河',
        subtitle: 'THE DATA MOAT',
        act: 2,
        description: '探索 FUNRAISE 如何建立無可取代的數據優勢。',
        duration: '8 分鐘'
    },
    'chapter3-groundforce': {
        title: '第三章：地面部隊',
        subtitle: 'GROUND FORCES',
        act: 2,
        description: '認識我們的實戰團隊：宇豐睿星、希睿置業、Property Intelligence。',
        duration: '6 分鐘'
    },
    'chapter4-pickpeak': {
        title: '第四章：PickPeak 深度體驗',
        subtitle: 'PICKPEAK DEEP DIVE',
        act: 2,
        description: '親手操作我們的旗艦產品，為真實客戶找到理想辦公室。',
        duration: '10 分鐘'
    },
    'chapter5-ecosystem': {
        title: '第五章：生態系佈局',
        subtitle: 'ECOSYSTEM STRATEGY',
        act: 3,
        description: '從空間出發的 Total Solution —— 建立合作夥伴網絡。',
        duration: '8 分鐘'
    },
    'chapter6-negotiation': {
        title: '第六章：終極談判',
        subtitle: 'THE FINAL NEGOTIATION',
        act: 3,
        description: '運用所學，在關鍵談判中展現數據的價值。',
        duration: '10 分鐘'
    },
    'epilogue': {
        title: '終章：方睿宇宙的未來',
        subtitle: 'EPILOGUE',
        act: 3,
        description: '歡迎正式加入艦隊。',
        duration: '3 分鐘'
    },
};

// Market data for educational content
export const MARKET_DATA = {
    globalCRE: {
        tam2024: 7.5, // trillion USD
        tam2033: 9.9,
        cagr: 3.25,
    },
    taiwan: {
        officeMarketSize: 1500, // billion TWD
        aiDataCenterInvestment: 240, // billion TWD in 2024-2025
        vacancyRateA: 5.2,
        vacancyRateB: 12.8,
    },
    proptech: {
        globalMarketSize2024: 40.5, // billion USD
        cagr: 16,
    },
    costar: {
        marketCap: 35, // billion USD
        annualRevenue: 2.5, // billion USD
        foundedYear: 1987,
    },
    funraise: {
        founded: '2025-03',
        pickpeakLaunch: '2026-01-13',
        dataPoints: '500萬+',
        buildingsCovered: '3,000+',
    }
};
