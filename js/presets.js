/**
 * Presets and Configuration Data
 */

export const INTENT_OPTIONS = [
  {
    id: 'quick',
    number: '01',
    title: '小さく作ってすぐ完成させたい',
    desc: '1〜2時間で作れるシンプルな単機能ツール、計算機、変換器など',
    promptContext: '作成期間目安: 1〜2時間以内。単機能で完結し、外部APIや複雑なDBを必要としないシンプルなHTML/CSS/JavaScript製のWebツールまたはスクリプト。'
  },
  {
    id: 'work',
    number: '02',
    title: '普段の作業や生活を便利にしたい',
    desc: 'ファイルの整理、定型文・メール作成、集計・データ整形ツールなど',
    promptContext: '目的: 日常やデスクワークの効率化。手作業や繰り返しの面倒を削減する実用的なユーティリティツール。'
  },
  {
    id: 'ai',
    number: '03',
    title: 'AIのすごさを体感できるものを作りたい',
    desc: 'AIプロンプト作成、文章の要約・推敲、アイデア生成アシスタントなど',
    promptContext: '特徴: AIとの対話やプロンプト連携を活用し、「AIと一緒に作る面白さ」を実感できるWebアプリケーション。'
  },
  {
    id: 'management',
    number: '04',
    title: '自分専用の管理・記録ツールが欲しい',
    desc: 'タスク管理、習慣トラッカー、メモ・ログ保存、シンプルなダッシュボードなど',
    promptContext: '用途: 自分のデータやタスクをブラウザのLocalStorage等に保存・可視化できる個人向けパーソナルダッシュボード/管理ツール。'
  },
  {
    id: 'random',
    number: '05',
    title: '完全におまかせで面白いものがいい',
    desc: 'ユニークで少し意外性のある、作っていて達成感のあるアイデア',
    promptContext: '方向性: 初心者でも作れる難易度でありながら、完成した時に人に自慢したくなるようなユニークで実用的なツール。'
  }
];

export const THEME_TAGS = [
  { id: 'text', label: 'テキスト・文章' },
  { id: 'file', label: 'ファイル・データ' },
  { id: 'task', label: 'タスク・予定' },
  { id: 'image', label: '画像・デザイン' },
  { id: 'daily', label: '日常・生活習慣' },
  { id: 'calculator', label: '計算・変換' },
  { id: 'all', label: '完全おまかせ' }
];
