/**
 * Prompt Generation Engine
 */

import { INTENT_OPTIONS, THEME_TAGS } from './presets.js';

export function buildIdeationPrompt(state) {
  const currentIntent = INTENT_OPTIONS.find(opt => opt.id === state.intentId) || INTENT_OPTIONS[0];
  
  const selectedTagLabels = (state.selectedTags || [])
    .map(tagId => {
      const found = THEME_TAGS.find(t => t.id === tagId);
      return found ? found.label : null;
    })
    .filter(Boolean);

  const tagText = selectedTagLabels.length > 0 
    ? selectedTagLabels.join('、') 
    : '特になし（自由な発想でおまかせ）';

  const customText = state.customNote && state.customNote.trim().length > 0
    ? state.customNote.trim()
    : 'なし';

  return `あなたは優秀なAI開発コンサルタントです。
現在、AIを活用した個人開発（Webアプリやミニツール）を行いたいのですが、「何を作ればいいか」を迷っています。
以下の希望や状況を踏まえて、初心者でも作りやすく、完成時の達成感が高い【具体的なツールのアイデアを3〜4個】提案してください。

### 【私の現在の希望・方向性】
- 作り方の気分: ${currentIntent.title}
- 詳細条件: ${currentIntent.promptContext}
- 興味のあるテーマ・ジャンル: ${tagText}
- 気になっていること・補足メモ: ${customText}

### 【提案してほしい項目（各アイデアごと）】
1. **ツール名（仮称）**: キャッチーで分かりやすい名前
2. **ツールの概要（1〜2行）**: 何ができて、誰のどんな不便・欲求を解決するか
3. **主要な機能（箇条書き2〜3個）**: 初心者でも作れるミニマムな機能
4. **おすすめ理由・楽しさ**: 作ることでどんな達成感やメリットがあるか

※外部の有料APIやサーバー構築を必要とせず、ブラウザ（HTML/CSS/JavaScript）だけで動くZero-DependencyなWebツールを優先してください。`;
}

export function buildDevPrompt(state) {
  const title = state.decision?.title || '便利なWebツール';
  const desc = state.decision?.description || 'ユーザーの課題を解決するシンプルなWebアプリケーション';

  return `以下のWebツールの新規開発を開始します。
要件に従って、HTML/CSS/JavaScriptによるZero-Dependency（外部ライブラリ不使用）の実装コードを作成してください。

### 【作成するツール】
- **ツール名**: ${title}
- **概要・機能要件**:
${desc}

### 【開発上の基本方針】
1. **技術スタック**: Pure HTML5 + Vanilla CSS3 + ES6+ JavaScript（単一フォルダで完結）
2. **デザイン**: 見やすく洗練されたモダンUI（ダークテーマ基調、モバイルフレンドリー）
3. **状態管理**: 必要に応じてブラウザの LocalStorage を利用し、リロード時もデータを維持
4. **モジュール分割**: 1ファイルあたり300行以内を目安に分かりやすく整理

まずは、実装計画（implementation_plan.md）とファイル構成を提示してください。`;
}
