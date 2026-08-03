'use client';

import { useState } from 'react';
import { PLATE_TEMPLATES } from '@/data/templates';
import { PlateTemplate } from '@/types/roblox';

type ThemeMode = 'native' | 'dark' | 'white';

export default function RbxLavaPage() {
  const [apiKey, setApiKey] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // カラー設定（手動調整用）
  const [darkPicker, setDarkPicker] = useState('#090d16');
  const [whitePicker, setWhitePicker] = useState('#f1f5f9');

  // フォーム状態
  const [gameTitle, setGameTitle] = useState('');
  const [selectedPlate, setSelectedPlate] = useState<PlateTemplate>(PLATE_TEMPLATES[0]);
  const [privacy, setPrivacy] = useState<'Private' | 'Public'>('Private');

  // 実行・ステータス
  const [status, setStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{ universeId?: string; placeId?: string } | null>(null);

  const handleExecuteCreate = async () => {
    setErrorMsg('');
    
    if (!apiKey.trim()) {
      setErrorMsg('APIキーを入力してください。');
      setStatus('error');
      return;
    }
    if (!creatorId.trim()) {
      setErrorMsg('クリエイターIDを入力してください。');
      setStatus('error');
      return;
    }
    if (!gameTitle.trim()) {
      setErrorMsg('ゲームタイトルを入力してください。');
      setStatus('error');
      return;
    }

    setStatus('creating');
    
    // Windows Installer風メッセージ ＆ 火山噴火演出
    setLoadingMsg('Preparing to Create...');

    try {
      await new Promise((r) => setTimeout(r, 800));
      setLoadingMsg(`「${gameTitle}」を作成しています...`);

      await new Promise((r) => setTimeout(r, 1000));
      setLoadingMsg(`「${selectedPlate.name}」テンプレートを展開中...`);

      await new Promise((r) => setTimeout(r, 800));
      setLoadingMsg('Roblox Open Cloudへリクエスト送信中...');

      const res = await fetch('/api/roblox/create-universe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          creatorId,
          title: gameTitle,
          privacy,
          templateId: selectedPlate.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'サーバーエラーが発生しました。');

      setResult({ universeId: data.universeId, placeId: data.placeId });
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || '通信に失敗しました。');
      setStatus('error');
    }
  };

  const containerStyle = 
    theme === 'white' 
      ? 'bg-slate-100 text-slate-900 border-slate-300' 
      : theme === 'dark'
      ? 'text-slate-100 border-slate-800'
      : 'bg-zinc-900 text-zinc-100 border-zinc-700';

  const customBgColor = 
    theme === 'dark' ? { backgroundColor: darkPicker } : theme === 'white' ? { backgroundColor: whitePicker } : {};

  return (
    <div className="min-h-screen p-6 md:p-12 transition-colors duration-300 flex justify-center items-center" style={customBgColor}>
      <div className={`max-w-4xl w-full border rounded-3xl p-8 shadow-2xl space-y-10 backdrop-blur-md ${theme === 'white' ? 'bg-white/80' : 'bg-slate-950/80'} ${containerStyle}`}>
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-slate-700/50">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-orange-500">RbxLava STUDIO</h1>
            <p className="text-xs opacity-70">Universe & Place Automated Generator</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700">
            <span className="text-xs px-2 opacity-60">テーマ:</span>
            {(['native', 'dark', 'white'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  theme === t ? 'bg-orange-600 text-white shadow-md' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {t === 'native' ? 'ネイティブ' : t === 'dark' ? 'ダーク' : 'ホワイト'}
              </button>
            ))}
          </div>
        </div>

        {/* 設定パネル */}
        <div className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-bold flex items-center space-x-2">
            <span>🌋</span>
            <span>システム・デザイン設定 (RbxLava)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-orange-400">ロブロックス認証</h3>
              <div className="space-y-2">
                <label className="text-xs opacity-80">APIキー (Open Cloud)</label>
                <input
                  type="password"
                  placeholder="rbx_ak_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs opacity-80">クリエイター ID</label>
                <input
                  type="text"
                  placeholder="12345678"
                  value={creatorId}
                  onChange={(e) => setCreatorId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-orange-400">背景カラー微調整</h3>
              {theme === 'white' ? (
                <div className="space-y-2 text-xs">
                  <div><span>背景ピッカー</span><input type="color" value={whitePicker} onChange={(e) => setWhitePicker(e.target.value)} className="w-full h-10 bg-slate-900 border border-slate-700 rounded cursor-pointer mt-1" /></div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div><span>背景ピッカー</span><input type="color" value={darkPicker} onChange={(e) => setDarkPicker(e.target.value)} className="w-full h-10 bg-slate-900 border border-slate-700 rounded cursor-pointer mt-1" /></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ゲームタイトル入力 */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-90">1. ゲームタイトル</label>
          <input
            type="text"
            placeholder="例: 爆炎マグマアスレチック"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            disabled={status === 'creating'}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
          />
        </div>

        {/* プレート選択 */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-90">2. ベースプレート選択</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATE_TEMPLATES.map((plate) => (
              <div
                key={plate.id}
                onClick={() => status !== 'creating' && setSelectedPlate(plate)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPlate.id === plate.id
                    ? 'bg-orange-600/20 border-orange-500 text-white shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-2xl mb-2">{plate.icon}</div>
                <h4 className="font-bold mb-1">{plate.name}</h4>
                <p className="text-xs opacity-70">{plate.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 公開設定 */}
        <div className="space-y-2">
          <label className="text-sm font-bold opacity-90">3. 公開設定</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => status !== 'creating' && setPrivacy('Private')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                privacy === 'Private' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900/50 border-slate-800 opacity-60'
              }`}
            >
              <div><div className="font-bold">非公開</div><div className="text-xs opacity-70">自分専用</div></div>
              <span>🔒</span>
            </div>
            <div
              onClick={() => status !== 'creating' && setPrivacy('Public')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                privacy === 'Public' ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-slate-900/50 border-slate-800 opacity-60'
              }`}
            >
              <div><div className="font-bold">公開</div><div className="text-xs opacity-70">全体リリース</div></div>
              <span>🌍</span>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center space-x-3">
            <span>⚠️</span><div><span className="font-bold">エラー: </span><span>{errorMsg}</span></div>
          </div>
        )}

        {/* 成功表示 */}
        {status === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl space-y-2 text-sm">
            <div className="font-bold flex items-center space-x-2"><span>🎉</span><span>ゲームの構築に成功しました！</span></div>
            <div className="text-xs opacity-80 space-y-1">
              <div>Universe ID: <code className="bg-black/40 px-2 py-0.5 rounded">{result?.universeId}</code></div>
              <div>Place ID: <code className="bg-black/40 px-2 py-0.5 rounded">{result?.placeId}</code></div>
            </div>
          </div>
        )}

        {/* 実行ボタン（火山噴火ローディング搭載） */}
        <button
          onClick={handleExecuteCreate}
          disabled={status === 'creating'}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl text-lg flex items-center justify-center space-x-3"
        >
          {status === 'creating' ? (
            <>
              <span className="text-2xl animate-bounce">🌋</span>
              <span>{loadingMsg}</span>
            </>
          ) : (
            <span>RbxLava でゲームを生成する</span>
          )}
        </button>

      </div>
    </div>
  );
}
