"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ACTIVITY_STORAGE_KEY, defaultActivityData,
  ActivityData, ActivityEntry, OrganizationEntry, CompetitionEntry, QualificationEntry,
} from "@/data/worksheets";
import { Save, CheckCircle2, Share2, Link2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── helpers ──────────────────────────────────────────────────────────
const inputCls = "bg-transparent text-white/80 placeholder-white/15 text-xs focus:outline-none w-full px-2 py-1.5";
const thCls = (w?: string) => `text-[9px] text-white/30 font-semibold px-2 py-2 text-left border-r border-white/8 last:border-r-0${w ? ` ${w}` : ""}`;

function CharCount({ val, max, warn }: { val: string; max: number; warn?: number }) {
  const n = val.length;
  const over = n > (warn ?? max * 0.9);
  return <span className={`text-[10px] ${over ? "text-amber-400" : "text-white/20"}`}>{n} / {max}字</span>;
}

// ── section definitions ───────────────────────────────────────────────
const sections = [
  { id: "enrollmentPeriod", label: "📅 入学時期", en: "Enrollment Period", sub: "必須" },
  { id: "academics",        label: "🎓 学歴",     en: "Academic Background", sub: "小学校入学〜高校卒業" },
  { id: "overseas",         label: "✈️ 日本国外の滞在・居住歴", en: "Stay / Residency Outside Japan", sub: "観光旅行を除く" },
  { id: "juniorHighPath",   label: "🔀 中学卒業後の進路",       en: "Path After Junior High", sub: "コース・クラス・カリキュラムの選択理由 200字" },
  { id: "selfEval",         label: "📝 活動報告 自己評価",       en: "Self-Evaluation of Achievements", sub: "最も自己評価した活動と理由 200字" },
  { id: "activities",       label: "📋 活動記録",                en: "List of Achievements", sub: "10件まで・◎は特に報告したい3つ" },
  { id: "optionalMaterials",label: "📎 任意提出資料 200字要約",  en: "Optional Materials Summary", sub: "各資料を200字以内でアピール" },
  { id: "orgs",             label: "🏫 学校その他の団体等における主な活動歴", en: "Record of Activities at School and in Other Organizations", sub: "◎は特記したい3つ" },
  { id: "competitions",     label: "🏆 各種競技・コンクール・懸賞論文等参加歴", en: "Competitions, Contests, Essay Contests, etc.", sub: "◎は特記したい3つ" },
  { id: "groupRole",        label: "👥 団体活動・競技における役割と実績", en: "Group Activities and Competitions", sub: "100字以内" },
  { id: "sports",           label: "⚽ スポーツ競技における特に優れた運動能力", en: "Competitive Sports Abilities / Records", sub: "100字以内（他と重複可）" },
  { id: "qualifications",   label: "📜 資格・検定・段位等の取得", en: "Qualifications, Proficiency Tests, Ranks", sub: "5件まで（活動記録と重複可）" },
  { id: "other",            label: "💬 その他",                  en: "Additional Information", sub: "500字以内" },
];

// ── main component ────────────────────────────────────────────────────
export default function ActivityWorksheet() {
  const [data, setData] = useState<ActivityData>(defaultActivityData());
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初回ロード：Supabase優先、fallback localStorage
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: row } = await supabase
            .from("activity_worksheets")
            .select("data")
            .eq("user_id", user.id)
            .single();
          if (row?.data && Object.keys(row.data).length > 0) {
            setData(row.data as ActivityData);
            return;
          }
        }
      } catch {}
      // fallback: localStorage
      try {
        const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (stored) {
          const p = JSON.parse(stored);
          const def = defaultActivityData();
          setData({
            ...def, ...p,
            academics:         [...(p.academics        ?? []), ...def.academics       ].slice(0, 6),
            overseas:          [...(p.overseas          ?? []), ...def.overseas        ].slice(0, 4),
            activities:        [...(p.activities        ?? []), ...def.activities      ].slice(0, 10),
            optionalMaterials: [...(p.optionalMaterials ?? []), ...def.optionalMaterials].slice(0, 10),
            orgs:              [...(p.orgs              ?? []), ...def.orgs            ].slice(0, 5),
            competitions:      [...(p.competitions      ?? []), ...def.competitions    ].slice(0, 5),
            qualifications:    [...(p.qualifications    ?? []), ...def.qualifications  ].slice(0, 5),
          });
        }
      } catch {}
    })();
  }, []);

  const autoSaveToSupabase = async (current: ActivityData) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("activity_worksheets").upsert(
          { user_id: user.id, data: current, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
  };

  const mut = (fn: (prev: ActivityData) => ActivityData) => {
    setData((prev) => {
      const next = fn(prev);
      // localStorageに即時保存
      try { localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next)); } catch {}
      // Supabaseへ3秒後に自動保存
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        autoSaveToSupabase(next);
      }, 3000);
      return next;
    });
  };

  const handleSave = async () => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(data));
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("activity_worksheets").upsert(
          { user_id: user.id, data, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
      }
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleShare = async () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}/worksheets/activity/view?d=${encoded}`;
    if (navigator.share) await navigator.share({ title: "活動報告書 フォーマット", url });
    else {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    }
  };

  const toggleSection = (id: string) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  // ── section content renderers ─────────────────────────────────────
  function SectionContent({ id }: { id: string }) {
    // 入学時期
    if (id === "enrollmentPeriod") return (
      <div className="px-5 py-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {(["april", "september"] as const).map((v) => (
            <button key={v} onClick={() => mut((p) => ({ ...p, enrollmentPeriod: p.enrollmentPeriod === v ? "" : v }))}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-colors ${data.enrollmentPeriod === v ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-white/10 bg-white/3 text-white/50"}`}>
              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.enrollmentPeriod === v ? "border-blue-400" : "border-white/20"}`}>
                {data.enrollmentPeriod === v && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 block" />}
              </span>
              {v === "april" ? "2024年04月入学（April 2024）" : "2024年09月入学（September 2024）"}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">理由 Reason（必須）入学時期を選んだ理由＋入学までの学習計画</p>
            <CharCount val={data.enrollmentReason} max={200} />
          </div>
          <textarea value={data.enrollmentReason} onChange={(e) => mut((p) => ({ ...p, enrollmentReason: e.target.value }))}
            placeholder="例）4月入学を選んだ理由は..."
            rows={4} maxLength={200}
            className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    );

    // 学歴
    if (id === "academics") return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className={thCls("w-36")}>学校名（20字以内）</th>
              <th className={thCls("w-24")}>所在地</th>
              <th className={thCls("w-16")}>開始年</th>
              <th className={thCls("w-12")}>月</th>
              <th className={thCls("w-16")}>終了年</th>
              <th className={thCls("w-12")}>月</th>
              <th className={thCls()}>在学年月</th>
            </tr>
          </thead>
          <tbody>
            {data.academics.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                <td className="border-r border-white/8"><input value={row.name} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], name: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="例）慶應高等学校" className={inputCls} maxLength={20} /></td>
                <td className="border-r border-white/8"><input value={row.location} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], location: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="例）東京都" className={inputCls} /></td>
                <td className="border-r border-white/8"><input value={row.startYear} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], startYear: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="2019" className={inputCls} maxLength={4} /></td>
                <td className="border-r border-white/8"><input value={row.startMonth} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], startMonth: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="4" className={inputCls} maxLength={2} /></td>
                <td className="border-r border-white/8"><input value={row.endYear} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], endYear: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="2022" className={inputCls} maxLength={4} /></td>
                <td className="border-r border-white/8"><input value={row.endMonth} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], endMonth: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="3" className={inputCls} maxLength={2} /></td>
                <td><input value={row.duration} onChange={(e) => { const next = [...data.academics]; next[i] = { ...next[i], duration: e.target.value }; mut((p) => ({ ...p, academics: next })); }} placeholder="3年/0ヶ月" className={inputCls} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    // 海外滞在
    if (id === "overseas") return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className={thCls("w-28")}>国名（20字以内）</th>
              <th className={thCls("w-20")}>帯同者</th>
              <th className={thCls("w-16")}>開始年</th>
              <th className={thCls("w-12")}>月</th>
              <th className={thCls("w-16")}>終了年</th>
              <th className={thCls("w-12")}>月</th>
              <th className={thCls()}>目的（留学の場合は派遣団体等）</th>
            </tr>
          </thead>
          <tbody>
            {data.overseas.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                <td className="border-r border-white/8"><input value={row.country} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], country: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="例）カナダ" className={inputCls} maxLength={20} /></td>
                <td className="border-r border-white/8"><input value={row.companion} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], companion: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="なし" className={inputCls} /></td>
                <td className="border-r border-white/8"><input value={row.startYear} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], startYear: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="2022" className={inputCls} maxLength={4} /></td>
                <td className="border-r border-white/8"><input value={row.startMonth} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], startMonth: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="9" className={inputCls} maxLength={2} /></td>
                <td className="border-r border-white/8"><input value={row.endYear} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], endYear: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="2023" className={inputCls} maxLength={4} /></td>
                <td className="border-r border-white/8"><input value={row.endMonth} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], endMonth: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="6" className={inputCls} maxLength={2} /></td>
                <td><input value={row.purpose} onChange={(e) => { const next = [...data.overseas]; next[i] = { ...next[i], purpose: e.target.value }; mut((p) => ({ ...p, overseas: next })); }} placeholder="慶應高等学校（留学）" className={inputCls} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    // 中学卒業後の進路
    if (id === "juniorHighPath") return (
      <div className="px-5 py-5">
        <p className="text-[11px] text-white/30 leading-relaxed mb-3 italic">複数のコース・クラス・カリキュラムがある場合、どれを選んだか・その理由を記入。なければ空欄でOK。</p>
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">コース・クラス選択の理由</p>
            <CharCount val={data.juniorHighPath} max={200} />
          </div>
          <textarea value={data.juniorHighPath} onChange={(e) => mut((p) => ({ ...p, juniorHighPath: e.target.value }))}
            placeholder="例）理数科を選んだのは..." rows={4} maxLength={200}
            className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    );

    // 活動報告自己評価
    if (id === "selfEval") return (
      <div className="px-5 py-5">
        <p className="text-[11px] text-white/30 leading-relaxed mb-3 italic">学業を含めたさまざまな活動の中で、最も自己評価した内容とその理由。別添資料がある場合は任意提出資料番号にチェック。</p>
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">自己評価（Self-Evaluation of Achievements）</p>
            <CharCount val={data.selfEval} max={200} />
          </div>
          <textarea value={data.selfEval} onChange={(e) => mut((p) => ({ ...p, selfEval: e.target.value }))}
            placeholder="例）私が最も自己評価する活動は〇〇です。この活動を選んだ理由は..."
            rows={5} maxLength={200}
            className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    );

    // 活動記録
    if (id === "activities") return (
      <div>
        <p className="px-5 pt-4 pb-2 text-[11px] text-white/30 italic">中学校卒業後の取り組みと成果。10件以内。◎は特に報告したい活動や成果等を3つまで。</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className={thCls("w-14")}>西暦年</th>
                <th className={thCls("w-10")}>月</th>
                <th className={thCls("w-12")}>学年</th>
                <th className={thCls("w-10")}>年齢</th>
                <th className={thCls()}>活動内容（35字以内）</th>
                <th className={thCls("w-12")}>資料番号</th>
                <th className="text-[9px] text-white/30 font-semibold px-2 py-2 text-center w-8">◎</th>
              </tr>
            </thead>
            <tbody>
              {data.activities.map((row: ActivityEntry, i: number) => (
                <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                  <td className="border-r border-white/8"><input value={row.year} onChange={(e) => { const next = [...data.activities]; next[i] = { ...next[i], year: e.target.value }; mut((p) => ({ ...p, activities: next })); }} placeholder="2024" className={inputCls} maxLength={4} /></td>
                  <td className="border-r border-white/8"><input value={row.month} onChange={(e) => { const next = [...data.activities]; next[i] = { ...next[i], month: e.target.value }; mut((p) => ({ ...p, activities: next })); }} placeholder="4" className={inputCls} maxLength={2} /></td>
                  <td className="border-r border-white/8"><input value={row.grade} onChange={(e) => { const next = [...data.activities]; next[i] = { ...next[i], grade: e.target.value }; mut((p) => ({ ...p, activities: next })); }} placeholder="高3" className={inputCls} maxLength={4} /></td>
                  <td className="border-r border-white/8"><input value={row.age} onChange={(e) => { const next = [...data.activities]; next[i] = { ...next[i], age: e.target.value }; mut((p) => ({ ...p, activities: next })); }} placeholder="18" className={inputCls} maxLength={3} /></td>
                  <td className="border-r border-white/8"><input value={row.content} onChange={(e) => { const next = [...data.activities]; next[i] = { ...next[i], content: e.target.value }; mut((p) => ({ ...p, activities: next })); }} placeholder="活動内容を入力..." className={inputCls} maxLength={35} /></td>
                  <td className="border-r border-white/8"><input value={row.docNumber} onChange={(e) => { const next = [...data.activities]; next[i] = { ...next[i], docNumber: e.target.value }; mut((p) => ({ ...p, activities: next })); }} placeholder="-" className={`${inputCls} text-center`} maxLength={2} /></td>
                  <td className="text-center px-2">
                    <button onClick={() => { const next = [...data.activities]; next[i] = { ...next[i], featured: !next[i].featured }; mut((p) => ({ ...p, activities: next })); }}
                      className={`w-5 h-5 flex items-center justify-center mx-auto ${row.featured ? "text-amber-400" : "text-white/15"}`}>
                      <Star className={`w-3.5 h-3.5 ${row.featured ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // 任意提出資料
    if (id === "optionalMaterials") return (
      <div className="px-5 py-5 space-y-3">
        <p className="text-[11px] text-white/30 italic">各任意提出資料について、200字以内でその価値を的確にアピールしてください。この200字の出来によって、その資料が教授陣に実際に読まれるかどうかが決まります。</p>
        {data.optionalMaterials.map((mat, i) => (
          <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
            <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
              <p className="text-[10px] font-semibold text-white/40">資料 {mat.number}</p>
              <CharCount val={mat.summary} max={200} />
            </div>
            <textarea value={mat.summary} onChange={(e) => { const next = [...data.optionalMaterials]; next[i] = { ...next[i], summary: e.target.value }; mut((p) => ({ ...p, optionalMaterials: next })); }}
              placeholder={`資料${mat.number}の内容と価値を200字以内で...`}
              rows={3} maxLength={200}
              className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
          </div>
        ))}
      </div>
    );

    // 学校・団体等
    if (id === "orgs") return (
      <div>
        <p className="px-5 pt-4 pb-2 text-[11px] text-white/30 italic">部活・委員会・NPO等。活動記録と重複可。◎は特記したい3つまで。</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className={thCls("w-14")}>開始年</th>
                <th className={thCls("w-10")}>月</th>
                <th className={thCls("w-14")}>終了年</th>
                <th className={thCls("w-10")}>月</th>
                <th className={thCls("w-12")}>学年</th>
                <th className={thCls("w-10")}>年齢</th>
                <th className={thCls()}>組織名（20字以内）</th>
                <th className={thCls("w-20")}>役職（10字）</th>
                <th className={thCls("w-12")}>資料番号</th>
                <th className="text-[9px] text-white/30 font-semibold px-2 py-2 text-center w-8">◎</th>
              </tr>
            </thead>
            <tbody>
              {data.orgs.map((row: OrganizationEntry, i: number) => (
                <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                  <td className="border-r border-white/8"><input value={row.startYear} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], startYear: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="2020" className={inputCls} maxLength={4} /></td>
                  <td className="border-r border-white/8"><input value={row.startMonth} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], startMonth: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="4" className={inputCls} maxLength={2} /></td>
                  <td className="border-r border-white/8"><input value={row.endYear} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], endYear: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="2025" className={inputCls} maxLength={4} /></td>
                  <td className="border-r border-white/8"><input value={row.endMonth} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], endMonth: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="3" className={inputCls} maxLength={2} /></td>
                  <td className="border-r border-white/8"><input value={row.grade} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], grade: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="高1" className={inputCls} maxLength={4} /></td>
                  <td className="border-r border-white/8"><input value={row.age} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], age: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="16" className={inputCls} maxLength={3} /></td>
                  <td className="border-r border-white/8"><input value={row.name} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], name: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="例）慶應高校ボランティア部" className={inputCls} maxLength={20} /></td>
                  <td className="border-r border-white/8"><input value={row.role} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], role: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="部長" className={inputCls} maxLength={10} /></td>
                  <td className="border-r border-white/8"><input value={row.docNumber} onChange={(e) => { const next = [...data.orgs]; next[i] = { ...next[i], docNumber: e.target.value }; mut((p) => ({ ...p, orgs: next })); }} placeholder="-" className={`${inputCls} text-center`} maxLength={2} /></td>
                  <td className="text-center px-2">
                    <button onClick={() => { const next = [...data.orgs]; next[i] = { ...next[i], featured: !next[i].featured }; mut((p) => ({ ...p, orgs: next })); }}
                      className={`w-5 h-5 flex items-center justify-center mx-auto ${row.featured ? "text-amber-400" : "text-white/15"}`}>
                      <Star className={`w-3.5 h-3.5 ${row.featured ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // 競技・コンクール
    if (id === "competitions") return (
      <div>
        <p className="px-5 pt-4 pb-2 text-[11px] text-white/30 italic">活動記録と重複可。◎は特記したい3つまで。</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className={thCls("w-14")}>西暦年</th>
                <th className={thCls("w-10")}>月</th>
                <th className={thCls("w-10")}>年齢</th>
                <th className={thCls()}>競技・コンクール等名称（30字）</th>
                <th className={thCls("w-28")}>主催機関（30字）</th>
                <th className={thCls("w-24")}>成績・結果（20字）</th>
                <th className={thCls("w-12")}>資料番号</th>
                <th className="text-[9px] text-white/30 font-semibold px-2 py-2 text-center w-8">◎</th>
              </tr>
            </thead>
            <tbody>
              {data.competitions.map((row: CompetitionEntry, i: number) => (
                <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                  <td className="border-r border-white/8"><input value={row.year} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], year: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="2024" className={inputCls} maxLength={4} /></td>
                  <td className="border-r border-white/8"><input value={row.month} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], month: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="3" className={inputCls} maxLength={2} /></td>
                  <td className="border-r border-white/8"><input value={row.age} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], age: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="17" className={inputCls} maxLength={3} /></td>
                  <td className="border-r border-white/8"><input value={row.name} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], name: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="コンクール名" className={inputCls} maxLength={30} /></td>
                  <td className="border-r border-white/8"><input value={row.organizer} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], organizer: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="主催機関" className={inputCls} maxLength={30} /></td>
                  <td className="border-r border-white/8"><input value={row.result} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], result: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="大賞・優勝等" className={inputCls} maxLength={20} /></td>
                  <td className="border-r border-white/8"><input value={row.docNumber} onChange={(e) => { const next = [...data.competitions]; next[i] = { ...next[i], docNumber: e.target.value }; mut((p) => ({ ...p, competitions: next })); }} placeholder="-" className={`${inputCls} text-center`} maxLength={2} /></td>
                  <td className="text-center px-2">
                    <button onClick={() => { const next = [...data.competitions]; next[i] = { ...next[i], featured: !next[i].featured }; mut((p) => ({ ...p, competitions: next })); }}
                      className={`w-5 h-5 flex items-center justify-center mx-auto ${row.featured ? "text-amber-400" : "text-white/15"}`}>
                      <Star className={`w-3.5 h-3.5 ${row.featured ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // 団体活動・役割
    if (id === "groupRole") return (
      <div className="px-5 py-5">
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">団体における役割と実績（Group Activities and Competitions）</p>
            <CharCount val={data.groupRole} max={100} warn={85} />
          </div>
          <textarea value={data.groupRole} onChange={(e) => mut((p) => ({ ...p, groupRole: e.target.value }))}
            placeholder="これまでに入力した内容の中で団体活動・競技における役割と実績..." rows={3} maxLength={100}
            className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    );

    // スポーツ
    if (id === "sports") return (
      <div className="px-5 py-5">
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">特に優れた運動能力・内容・記録（Competitive Sports Abilities）</p>
            <CharCount val={data.sports} max={100} warn={85} />
          </div>
          <textarea value={data.sports} onChange={(e) => mut((p) => ({ ...p, sports: e.target.value }))}
            placeholder="スポーツ競技における特に優れた運動能力とその内容・記録..." rows={3} maxLength={100}
            className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    );

    // 資格・検定
    if (id === "qualifications") return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className={thCls("w-14")}>西暦年</th>
              <th className={thCls("w-10")}>月</th>
              <th className={thCls("w-10")}>年齢</th>
              <th className={thCls()}>資格等の名称（30字）</th>
              <th className={thCls("w-24")}>資格級位（20字）</th>
              <th className={thCls("w-28")}>認定機関名（30字）</th>
              <th className={thCls("w-12")}>資料番号</th>
            </tr>
          </thead>
          <tbody>
            {data.qualifications.map((row: QualificationEntry, i: number) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                <td className="border-r border-white/8"><input value={row.year} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], year: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="2023" className={inputCls} maxLength={4} /></td>
                <td className="border-r border-white/8"><input value={row.month} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], month: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="6" className={inputCls} maxLength={2} /></td>
                <td className="border-r border-white/8"><input value={row.age} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], age: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="17" className={inputCls} maxLength={3} /></td>
                <td className="border-r border-white/8"><input value={row.name} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], name: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="実用英語技能検定" className={inputCls} maxLength={30} /></td>
                <td className="border-r border-white/8"><input value={row.level} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], level: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="準1級" className={inputCls} maxLength={20} /></td>
                <td className="border-r border-white/8"><input value={row.organization} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], organization: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="公益財団法人日本英語検定協会" className={inputCls} maxLength={30} /></td>
                <td><input value={row.docNumber} onChange={(e) => { const next = [...data.qualifications]; next[i] = { ...next[i], docNumber: e.target.value }; mut((p) => ({ ...p, qualifications: next })); }} placeholder="-" className={`${inputCls} text-center`} maxLength={2} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    // その他
    if (id === "other") return (
      <div className="px-5 py-5">
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="px-4 py-2 bg-white/4 border-b border-white/8 flex justify-between">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">その他（Additional Information）</p>
            <CharCount val={data.other} max={500} warn={450} />
          </div>
          <textarea value={data.other} onChange={(e) => mut((p) => ({ ...p, other: e.target.value }))}
            placeholder="知っておいてほしいことがあれば500字以内で..." rows={5} maxLength={500}
            className="w-full px-4 py-3 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    );

    return null;
  }

  return (
    <div className="space-y-3">
      {/* 保存・共有ボタン */}
      <div className="flex gap-2 justify-end mb-2">
        <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors">
          {shareState === "copied" ? <Link2 className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          {shareState === "copied" ? "コピー済み" : "共有"}
        </button>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/15 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
          {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? "保存済み" : "保存"}
        </button>
      </div>

      {/* セクションアコーディオン */}
      {sections.map((sec) => (
        <div key={sec.id} className="glass-card rounded-2xl overflow-hidden">
          <button onClick={() => toggleSection(sec.id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
            <div className="text-left">
              <p className="text-sm font-semibold text-white/80">{sec.label}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{sec.en}{sec.sub ? ` — ${sec.sub}` : ""}</p>
            </div>
            {openSections[sec.id]
              ? <ChevronUp className="w-4 h-4 text-white/20 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-white/20 shrink-0" />}
          </button>
          <AnimatePresence>
            {openSections[sec.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-white/5 bg-white/1"
              >
                <SectionContent id={sec.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* 下部保存ボタン */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button onClick={handleShare} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
          <Share2 className="w-4 h-4" />
          フォームを共有する
        </button>
        <button onClick={handleSave} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold shadow-lg shadow-green-500/20 transition-shadow">
          {saved ? <><CheckCircle2 className="w-4 h-4" />保存しました</> : <><Save className="w-4 h-4" />保存する</>}
        </button>
      </div>
    </div>
  );
}
