# 何を作るか決めよう。 開発記録 (RECORD.md)

## プロジェクト概要
- **目的**: 「躊躇してないで、とにかく作ってみよう。」シリーズ第2弾。日頃の困りごとからAIと一緒に作ってみたいツールを発想するWebアシスタント。
- **リポジトリ**: C:\Users\tk030\Desktop\何を作るか決めよう。ツール
- **技術スタック**: Vanilla HTML + CSS + JS (Zero-Dependency)
- **デザインシステム**: プロジェクト統計ツール準拠ダークテーマ

---

## 開発履歴

### 2026-08-17: プロジェクト初期化 ＆ ドキュメント配置（Step 1完了）
- **変更概要**:
  - C:\Users\tk030\Desktop\何を作るか決めよう。ツール を新規作成。
  - ルールファイル一式（.agents/AGENTS.md, .agents/mcp_config.json, .cursorrules, .clauderules, .clinerules, SKILLS.md, .github/copilot-instructions.md）を同期配置。
  - LICENSE (MIT), .gitignore, README.md, 仕様書.md, PROJECT_PLAN.md, RECORD.md を作成・配置。
  - Gitリポジトリを初期化し、初回コミットおよび GitHub Public リポジトリを作成・連携。
- **進捗ステータス**: Step 1 完了。文書配置完了。

### 2026-08-18: シリーズ表記の修正（第2弾への訂正）
- **変更概要**:
  - `README.md` および `RECORD.md` 内のシリーズ表記を「第1弾」から「第2弾」に修正。
- **進捗ステータス**: ドキュメント修正完了。

### 2026-08-19: リポジトリ名変更 ＆ プライベートリポジトリ化
- **変更概要**:
  - GitHubリポジトリ名を `-` から `nani-wo-tsukuru-ka-kimeyou` に変更。
  - リポジトリの可視性を Public から Private に変更。
  - `README.md` 内のリポジトリURLおよびローカルGitリモート設定を同期更新。
- **進捗ステータス**: リポジトリ設定・ドキュメント更新完了。

### 2026-08-19: アプリ基盤実装 ＆ 5ステップウィザード完成（Step 2〜4完了）
- **変更概要**:
  - `仕様書.md`: 5ステップ構成、画面仕様、データ構造、デザイン規定を策定。
  - `css/tokens.css`, `css/base.css`, `css/components.css`, `css/screens.css`: プロジェクト統計ツール準拠のダークテーマおよびモバイル最適化デザインシステムを構築。
  - `js/presets.js`, `js/storage.js`, `js/prompt.js`, `js/app.js`: 状態管理、AI質問プロンプト生成、Antigravity IDE用開発プロンプト生成、ワンタップコピー、トースト通知を実装（全ファイル300行以内を維持）。
  - `index.html`: Zero-Dependencyな5ステップウィザード画面を実装。
  - `browser_subagent` によるブラウザ自動検証（全ステップ遷移、プロンプト生成、クリップボードコピー、モバイル390px表示）を完了。
- **進捗ステータス**: Step 2, Step 3, Step 4 完了。動作検証確認済み。