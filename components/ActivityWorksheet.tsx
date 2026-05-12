"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVITY_STORAGE_KEY } from "@/data/worksheets";
import { Save, CheckCircle2, Share2, Link2, BookOpen, Star, Download, ChevronDown, ChevronUp } from "lucide-react";

interface ActivityRow { year: string; month: string; content: string; docNumber: string; featured: boolean; }
interface OrgRow { period: string; name: string; role: string; }
interface CompRow { year: string; name: string; organizer: string; result: string; }
interface ActivityData { selfEval: string; activities: ActivityRow[]; orgs: OrgRow[]; competitions: CompRow[]; groupRole: string; other: string; }

const emptyActivity = (): ActivityRow => ({ year: "", month: "", content: "", docNumber: "", featured: false });
const emptyOrg = (): OrgRow => ({ period: "", name: "", role: "" });
const emptyComp = (): CompRow => ({ year: "", name: "", organizer: "", result: "" });
const defaultData = (): ActivityData => ({
  selfEval: "", groupRole: "", other: "",
  activities: Array.from({ length: 10 }, emptyActivity),
  orgs: Array.from({ length: 5 }, emptyOrg),
  competitions: Array.from({ length: 5 }, emptyComp),
});

const sections = [
  { id: "selfEval",     label: "📝 活動報告 自己評価",              sub: "200字以内" },
  { id: "activities",  label: "📋 活動記録",                        sub: "10件まで・◎は特に報告したい3つ" },
  { id: "orgs",        label: "🏫 学校・団体等における主な活動歴",  sub: "部活・委員会・NPOなど" },
  { id: "competitions",label: "🏆 競技・コンクール・懸賞論文等",    sub: "" },
  { id: "groupRole",   label: "👥 団体活動・役割と実績",            sub: "100字以内" },
  { id: "other",       label: "📎 その他",                          sub: "500字以内" },
];

export default function ActivityWorksheet() {
  const [data, setData] = useState<ActivityData>(defaultData());
  const [tabOpen, setTabOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({
          ...defaultData(), ...parsed,
          activities: [...(parsed.activities ?? []), ...Array(10).fill(null).map(emptyActivity)].slice(0, 10),
          orgs: [...(parsed.orgs ?? []), ...Array(5).fill(null).map(emptyOrg)].slice(0, 5),
          competitions: [...(parsed.competitions ?? []), ...Array(5).fill(null).map(emptyComp)].slice(0, 5),
        });
      }
    } catch {}
  }, []);

  const handleSave = () => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(data));
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

  const updateActivity = (i: number, field: keyof ActivityRow, value: string | boolean) => {
    setData((prev) => { const next = [...prev.activities]; next[i] = { ...next[i], [field]: value }; return { ...prev, activities: next }; });
    setSaved(false);
  };
  const updateOrg = (i: number, field: keyof OrgRow, value: string) => {
    setData((prev) => { const next = [...prev.orgs]; next[i] = { ...next[i], [field]: value }; return { ...prev, orgs: next }; });
    setSaved(false);
  };
  const updateComp = (i: number, field: keyof CompRow, value: string) => {
    setData((prev) => { const next = [...prev.competitions]; next[i] = { ...next[i], [field]: value }; return { ...prev, competitions: next }; });
    setSaved(false);
  };
  const toggleSection = (id: string) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  const inputCls = "bg-transparent text-white/80 placeholder-white/15 text-xs focus:outline-none w-full px-2 py-1.5";
  const cellCls = "border-r border-white/8 last:border-r-0";

  const SectionContent = ({ id }: { id: string }) => {
    if (id === "selfEval") return (
      <>
        <textarea value={data.selfEval} onChange={(e) => { setData((p) => ({ ...p, selfEval: e.target.value })); setSaved(false); }}
          placeholder="例）私が最も自己評価する活動は〇〇です。この活動を選んだ理由は..." rows={4} maxLength={200}
          className="w-full px-5 py-4 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        <div className="px-5 pb-3 text-right">
          <span className={`text-[10px] ${data.selfEval.length > 180 ? "text-amber-400" : "text-white/20"}`}>{data.selfEval.length} / 200字</span>
        </div>
      </>
    );
    if (id === "activities") return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls} w-14`}>西暦年</th>
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls} w-10`}>月</th>
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls}`}>活動内容（35字以内）</th>
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls} w-12`}>資料番号</th>
              <th className="text-[9px] text-white/30 font-semibold px-2 py-2 text-center w-8">◎</th>
            </tr>
          </thead>
          <tbody>
            {data.activities.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                <td className={cellCls}><input value={row.year} onChange={(e) => updateActivity(i, "year", e.target.value)} placeholder="2024" className={inputCls} maxLength={4} /></td>
                <td className={cellCls}><input value={row.month} onChange={(e) => updateActivity(i, "month", e.target.value)} placeholder="4" className={inputCls} maxLength={2} /></td>
                <td className={cellCls}><input value={row.content} onChange={(e) => updateActivity(i, "content", e.target.value)} placeholder="活動内容を入力..." className={inputCls} maxLength={35} /></td>
                <td className={cellCls}><input value={row.docNumber} onChange={(e) => updateActivity(i, "docNumber", e.target.value)} placeholder="-" className={`${inputCls} text-center`} maxLength={2} /></td>
                <td className="text-center px-2">
                  <button onClick={() => updateActivity(i, "featured", !row.featured)} className={`w-5 h-5 flex items-center justify-center mx-auto ${row.featured ? "text-amber-400" : "text-white/15"}`}>
                    <Star className={`w-3.5 h-3.5 ${row.featured ? "fill-amber-400" : ""}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    if (id === "orgs") return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls} w-32`}>期間（例: 2022/4〜2025/3）</th>
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls}`}>組織名（20字以内）</th>
              <th className="text-[9px] text-white/30 font-semibold px-2 py-2 text-left w-24">役職（10字以内）</th>
            </tr>
          </thead>
          <tbody>
            {data.orgs.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                <td className={cellCls}><input value={row.period} onChange={(e) => updateOrg(i, "period", e.target.value)} placeholder="2022/4〜2025/3" className={inputCls} /></td>
                <td className={cellCls}><input value={row.name} onChange={(e) => updateOrg(i, "name", e.target.value)} placeholder="組織名" className={inputCls} maxLength={20} /></td>
                <td><input value={row.role} onChange={(e) => updateOrg(i, "role", e.target.value)} placeholder="役職" className={inputCls} maxLength={10} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    if (id === "competitions") return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/2">
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls} w-14`}>西暦年</th>
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls}`}>競技・コンクール名（30字以内）</th>
              <th className={`text-[9px] text-white/30 font-semibold px-2 py-2 text-left ${cellCls} w-28`}>主催機関（30字以内）</th>
              <th className="text-[9px] text-white/30 font-semibold px-2 py-2 text-left w-24">成績・結果（20字以内）</th>
            </tr>
          </thead>
          <tbody>
            {data.competitions.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0 hover:bg-white/2">
                <td className={cellCls}><input value={row.year} onChange={(e) => updateComp(i, "year", e.target.value)} placeholder="2024" className={inputCls} maxLength={4} /></td>
                <td className={cellCls}><input value={row.name} onChange={(e) => updateComp(i, "name", e.target.value)} placeholder="コンクール名" className={inputCls} maxLength={30} /></td>
                <td className={cellCls}><input value={row.organizer} onChange={(e) => updateComp(i, "organizer", e.target.value)} placeholder="主催機関" className={inputCls} maxLength={30} /></td>
                <td><input value={row.result} onChange={(e) => updateComp(i, "result", e.target.value)} placeholder="大賞・優勝等" className={inputCls} maxLength={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    if (id === "groupRole") return (
      <>
        <textarea value={data.groupRole} onChange={(e) => { setData((p) => ({ ...p, groupRole: e.target.value })); setSaved(false); }}
          placeholder="団体内での役割と、その団体での実績を100字以内で..." rows={3} maxLength={100}
          className="w-full px-5 py-4 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        <div className="px-5 pb-3 text-right">
          <span className={`text-[10px] ${data.groupRole.length > 85 ? "text-amber-400" : "text-white/20"}`}>{data.groupRole.length} / 100字</span>
        </div>
      </>
    );
    if (id === "other") return (
      <>
        <textarea value={data.other} onChange={(e) => { setData((p) => ({ ...p, other: e.target.value })); setSaved(false); }}
          placeholder="上記以外で、特に伝えたいことがあれば500字以内で..." rows={5} maxLength={500}
          className="w-full px-5 py-4 bg-transparent text-white/80 placeholder-white/15 text-sm resize-none focus:outline-none leading-relaxed" />
        <div className="px-5 pb-3 text-right">
          <span className={`text-[10px] ${data.other.length > 450 ? "text-amber-400" : "text-white/20"}`}>{data.other.length} / 500字</span>
        </div>
      </>
    );
    return null;
  };

  return (
    <div className="mt-10 border-t border-white/5 pt-10">
      {/* フォーマット タブ（single accordion） */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setTabOpen((p) => !p)}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">フォーマット</p>
              <p className="text-[11px] text-white/30 mt-0.5">活動報告書 Webエントリーページ踏襲版</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/活動報告書_フォーマット.docx"
              download="活動報告書_フォーマット.docx"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] hover:bg-white/10 transition-colors"
            >
              <Download className="w-3 h-3" />
              Word
            </a>
            {tabOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
          </div>
        </button>

        <AnimatePresence>
          {tabOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5">
                {/* 保存・共有ボタン */}
                <div className="flex justify-end gap-2 px-5 py-3 border-b border-white/5 bg-white/2">
                  <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors">
                    {shareState === "copied" ? <Link2 className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    {shareState === "copied" ? "コピー済み" : "共有"}
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
                    {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {saved ? "保存済み" : "保存"}
                  </button>
                </div>

                {/* セクション一覧（アコーディオン） */}
                <div className="divide-y divide-white/5">
                  {sections.map((sec) => (
                    <div key={sec.id}>
                      <button
                        onClick={() => toggleSection(sec.id)}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors"
                      >
                        <div className="text-left">
                          <p className="text-xs font-semibold text-white/70">{sec.label}</p>
                          {sec.sub && <p className="text-[10px] text-white/30 mt-0.5">{sec.sub}</p>}
                        </div>
                        {openSections[sec.id]
                          ? <ChevronUp className="w-3.5 h-3.5 text-white/20 shrink-0" />
                          : <ChevronDown className="w-3.5 h-3.5 text-white/20 shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {openSections[sec.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-white/5 bg-white/1"
                          >
                            <SectionContent id={sec.id} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
