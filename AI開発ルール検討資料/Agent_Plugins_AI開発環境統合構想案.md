# Agent Plugins 1.0.0 仕様に基づくAI開発環境統合構想案

本資料は、これまでに構築された「AI開発コンテキスト管理MCP」「V3 Knowledge Management MCP」「開発用Skills（プロトコル全18条等）」を、オープン標準仕様「Agent Plugins 1.0.0」に基づいて1つのポータブルなパッケージへ統合・体系化するための構想および技術仕様案をまとめたものです。

---

## 1. 基本コンセプトと全体像

### 1.1 コアコンセプト
**「Agent Plugins を外箱（共通コンテナ）とし、AI開発に必要な知識・手順・道具をひとまとめにして任意のAI開発環境へ持ち込めるパッケージにする」**

```text
                    Agent Plugin（共通配布パッケージ）
                 ┌───────────────────────────────────┐
                 │                                   │
                 │   Skills（手順・プロトコル）      │
                 │   ├─ プロトコル全18条遵守         │
                 │   ├─ 要件定義・設計               │
                 │   ├─ TDD開発・マイクロコミット    │
                 │   ├─ テスト・自律検証             │
                 │   └─ プロジェクト引き継ぎ         │
                 │                                   │
                 │   MCP Servers（道具・状態管理）   │
                 │   ├─ Context Management MCP       │
                 │   │   (動的タスク・トークン最適化)│
                 │   └─ V3 Knowledge Management MCP  │
                 │       (永続知識ベース・検索)      │
                 │                                   │
                 └─────────────────┬─────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ↓                    ↓                    ↓
         Antigravity             Cursor               VS Code / Codex
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   ↓
                       標準化されたAI開発環境
```

### 1.2 構成要素と役割分担

| 構成要素 | 役割 | 具体例 |
| :--- | :--- | :--- |
| **Agent Plugin** | 全体を配布・展開する「外箱（コンテナ）」 | `plugin.json`, `mcp.json` |
| **Skills** | AIに「どう仕事をさせるか」を指示する「手順」 | 要件定義、TDD開発、プロトコル全18条 |
| **Context Management MCP** | 現在進行中の開発ステータスを追跡する「状態管理」 | タスク状態保存、トークン最適化要約 |
| **V3 Knowledge MCP** | 蓄積されたノウハウ・過去事例を管理する「知識ベース」 | ナレッジ検索、設計パターン参照 |
| **MCP (全体)** | AIから外部機能やデータストアを呼び出す「道具」 | stdio / JSON-RPC 通信ツール |

---

## 2. Agent Plugins 1.0.0 一次情報と標準仕様

### 2.1 公式一次情報
1. **Agent Plugins 公式サイト**: [https://agent-plugins.org/](https://agent-plugins.org/)
   - AIエージェントを拡張する再利用可能なコンポーネントをパッケージ化するためのオープン仕様。
2. **公式GitHubリポジトリ**: [https://github.com/agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec)
   - 仕様策定の正本（バージョン 1.0.0）。
3. **公式仕様書**: [https://agent-plugins.org/specification](https://agent-plugins.org/specification)
   - プラグイン構造および設定スキーマの正式定義。

### 2.2 標準ディレクトリ構造
Agent Plugins 1.0.0 では、主に **Agent Skills** と **MCP Servers** の2種類が標準化対象となっています。

```text
ai-dev-environment-plugin/
├── plugin.json              # プラグインのメタデータ（ID、バージョン、説明、作者等）
├── mcp.json                 # MCPサーバーの起動・接続定義（stdio / sse）
├── skills/                  # 各種Agent Skills（SKILL.md を含むディレクトリ群）
│   ├── senior-protocol/
│   │   └── SKILL.md
│   ├── context-workflow/
│   │   └── SKILL.md
│   ├── requirements-design/
│   │   └── SKILL.md
│   └── handoff-management/
│       └── SKILL.md
├── mcp-servers/             # MCPサーバー本体（Python / Node.js スクリプト群）
│   ├── context-management/
│   └── knowledge-v3/
└── README.md                # プラグイン利用ガイド・ドキュメント
```

### 2.3 設定ファイル仕様の例

#### `plugin.json`
```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.json",
  "name": "ai-dev-environment",
  "version": "1.0.0",
  "description": "AI開発に必要なプロトコル・Skills・コンテキスト管理MCPを統合した標準環境パッケージ",
  "author": "tk030",
  "skills": "./skills",
  "mcp": "./mcp.json"
}
```

#### `mcp.json`
```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.json",
  "mcpServers": {
    "context-management": {
      "command": "node",
      "args": ["./mcp-servers/context-management/dist/index.js"]
    },
    "knowledge-v3": {
      "command": "python",
      "args": ["./mcp-servers/knowledge-v3/server.py"]
    }
  }
}
```

---

## 3. 有効性評価（技術・運用分析）

### 3.1 メリット
1. **初期化コストの大幅削減**: 新規プロジェクト作成時に個別の設定ファイル（`.cursorrules`, 各種MCP設定, Skillsコピー）を転記・設定する手間が不要となり、プラグイン指定のみで即座に開発を開始可能。
2. **手順（Skills）と道具（MCP）のバージョン整合性**: ツールの更新とプロトコル（手順書）の更新を単一リポジトリ内でセットでバージョン管理可能。
3. **クライアント非依存の再利用性**: Agent Plugins 1.0.0 準拠により、Antigravity、Cursor、Codex、VS Code 等の対応環境間で同一の開発体験を維持可能。
4. **コンテキスト品質の担保**: トークン最適化とハンドオフ機能が最初から有効化されるため、モデル切り替え時のコンテキスト消失を防止。

### 3.2 既存資産の改修要否
* **コアロジック（プログラム本体）**: 改修不要（100%流用可能）。
* **対応が必要な部分**: 
  - `plugin.json` および `mcp.json` のマニフェスト作成
  - パス指定の相対化（実行環境依存の排除）
  - ディレクトリ配置の標準化

---

## 4. 将来の導入・移行計画

### 4.1 リポジトリ分離設計
個別アプリケーションのリポジトリ（例: 「何を作るか決めよう。ツール」）と、共通AI開発環境リポジトリを分離して管理します。

```text
GitHub: tk030-lotto/ai-dev-environment (Private)
ローカル: C:\Users\tk030\Desktop\ai-dev-environment
```

### 4.2 段階的導入ステップ
1. **フェーズ1（専用リポジトリの初期化）**
   - GitHub上に `ai-dev-environment`（Private）を作成し、標準テンプレートを配置。
2. **フェーズ2（既存資産の集約とマニフェスト定義）**
   - 既存のMCPソースおよびSkillsを配置し、`plugin.json` / `mcp.json` を整備。
3. **フェーズ3（検証と実運用）**
   - 独立ワークスペースで動作確認を行い、以降の新規プロジェクトにおける標準環境として採用。

---
*作成日: 2026-08-18*
*作成元: AI開発環境統合検討タスク*
