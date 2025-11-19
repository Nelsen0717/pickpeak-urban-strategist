'use client';

import React from 'react';
import { useGameStore, LevelId } from '@/lib/store';
import DialogueOverlay from './DialogueOverlay';

interface LevelBriefingProps {
    levelId: LevelId;
    onComplete: () => void;
}

export default function LevelBriefing({ levelId, onComplete }: LevelBriefingProps) {
    const getLines = (id: LevelId) => {
        switch (id) {
            case 'basics':
                return [
                    { speaker: 'Mike', text: 'Raiser，歡迎來到第一站。', expression: 'happy' },
                    { speaker: 'Mike', text: '在商用不動產的世界，我們看重的是「收益」與「增值潛力」。', expression: 'neutral' },
                    { speaker: 'Mike', text: '你的首要任務是學會區分哪些資產屬於我們的戰場。', expression: 'serious' },
                    { speaker: 'Mike', text: '試著將眼前的資產分類。記住，商用資產通常伴隨著商業活動與現金流。', expression: 'neutral' },
                ];
            case 'trends':
                return [
                    { speaker: 'Mike', text: '做得好。現在我們進入深水區。', expression: 'happy' },
                    { speaker: 'Mike', text: '2024 年的市場數據出現了異常的能量波動。', expression: 'serious' },
                    { speaker: 'Mike', text: 'AI 產業的爆發正在重塑地圖。數據中心、高規格廠辦的需求正在吞噬市場。', expression: 'serious' },
                    { speaker: 'Mike', text: '啟動全息地圖，找出這些熱點。我們需要知道資金流向哪裡。', expression: 'neutral' },
                ];
            case 'ecosystem':
                return [
                    { speaker: 'Mike', text: '數據收集完畢。但光有資產是不夠的。', expression: 'neutral' },
                    { speaker: 'Mike', text: '方睿集團 (Funraise) 的核心競爭力，在於我們能提供全生命週期的服務。', expression: 'happy' },
                    { speaker: 'Mike', text: '這就是「Ziroom Model」。從收購到運營，每一個環節都環環相扣。', expression: 'serious' },
                    { speaker: 'Mike', text: '試著將這些服務模組重新排列，構建出一個完美的價值閉環。', expression: 'neutral' },
                ];
            case 'pickpeak':
                return [
                    { speaker: 'Mike', text: '緊急任務！客戶 "Titan Tech" 發出了選址需求。', expression: 'serious' },
                    { speaker: 'Mike', text: '他們需要一個能容納 500 人研發團隊的總部，且必須符合 ESG 標準。', expression: 'neutral' },
                    { speaker: 'Mike', text: '這是測試你使用 PickPeak 決策中樞的最佳機會。', expression: 'happy' },
                    { speaker: 'Mike', text: '不要只看表面數據。深入分析租戶結構與交易歷史，找出那個唯一的「完美標的」。', expression: 'serious' },
                ];
            case 'negotiation':
                return [
                    { speaker: 'Mike', text: '這是最後一戰了，Raiser。', expression: 'serious' },
                    { speaker: 'Mike', text: 'Titan Tech 的 CEO 非常精明，他對租金與條件有很多疑慮。', expression: 'neutral' },
                    { speaker: 'Mike', text: '帶上你的裝備。用數據說服他，用專業贏得信任。', expression: 'happy' },
                    { speaker: 'Mike', text: '全艦隊都在看著你。祝你好運。', expression: 'serious' },
                ];
            default:
                return [];
        }
    };

    // @ts-ignore
    const lines = getLines(levelId);

    if (lines.length === 0) {
        onComplete();
        return null;
    }

    return <DialogueOverlay lines={lines} onComplete={onComplete} />;
}
