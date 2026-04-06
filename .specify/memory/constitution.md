<!--
Sync Impact Report

- Version change: 1.0.0 → 1.0.1
- Modified principles: None (no policy changes)
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (no change in this patch; confirmed aligned)
  - ✅ .specify/templates/spec-template.md (no change in this patch; confirmed aligned)
  - ✅ .specify/templates/tasks-template.md (removed optional-test wording)
  - ✅ .github/agents/speckit.tasks.agent.md
  - N/A .specify/templates/commands/*.md (directory not present)
- Deferred TODOs: None
-->

# Forgetting_curve_ssd3 Constitution

## Core Principles

### 1. プロダクト原則

- 実施言語: 本プロジェクトの仕様策定・開発運用は原則として日本語で実施する
- 学習効果優先: すべての機能は「記憶定着率の改善」に紐づくこと
- 科学的妥当性: 復習間隔ロジックは根拠ある手法（例: SM-2系）を採用し、変更時は理由を明記する
- ユーザー安全性: 進捗データ消失を防ぐ（バックアップ、復元、削除確認）
- シンプル優先: 機能追加は計測結果で正当化できる場合のみ

### 2. 品質ゲート

- テストファースト: 新規機能はテスト先行
- 主要ロジックの必須テスト: 復習日計算、正答率更新、リマインド判定
- 受け入れ条件: 仕様書に受け入れ基準を明記し、満たすまでマージしない
- CI/CD必須: テスト、Lint、型チェックが成功しない限り統合不可

### 3. データとセキュリティ

- 最小収集: 学習に不要な個人情報は収集しない
- 保護: 保存データの暗号化方針
- 監査性: スケジューリング計算の根拠ログを残せる設計にする

### 4. UX/性能基準

- 主要操作の応答時間目標（例: 復習一覧表示は 1 秒以内）
- モバイル前提の操作性
- アクセシビリティ最低基準（キーボード操作、十分なコントラスト）

### 5. 開発運用

- Spec Kit成果物の順守: spec → plan → tasks の順で進める
- MVP範囲を超える機能は仕様化のみで実装しない
- 変更管理: 憲法変更は理由、影響範囲、移行手順を必須化
- バージョニング: 憲法の版数と改訂日を管理

## 追加制約

- 本憲法は、本リポジトリ内の仕様（spec）、計画（plan）、タスク（tasks）、実装、運用に優先する
- 本憲法に対する例外が必要な場合は、例外の理由・影響範囲・代替策を明記したうえで合意を取る
- 技術スタックは、以下とする。
  - フロント: React
  - バックエンド: Node.js
  - アプリケーションサーバ：Express.js
  - DB: PostgreSQL
  - CSS: Tailwind CSS
  - ORM: Prisma
  - TypeScript

## 開発フロー（Spec Kit）

- `/speckit.specify` で spec を作成し、受け入れ基準（Acceptance Scenarios）を必ず含める
- `/speckit.plan` で plan を作成し、Constitution Check を通過させる
- `/speckit.tasks` で tasks を作成し、ユーザーストーリーごとに独立して実装・検証できる粒度にする

## Governance

- 憲法は最上位のルールであり、他のドキュメントや慣行と矛盾する場合は憲法が優先する
- 全てのレビュー/マージ判断は、憲法への適合（Constitution Check）を確認する
- 改訂手順: 憲法を変更する場合、PR に以下を必ず含める
  - 変更理由
  - 影響範囲（どの仕様/計画/実装が影響を受けるか）
  - 移行手順（必要な場合）
- バージョニング: 憲法はセマンティックバージョニング（MAJOR.MINOR.PATCH）で管理する
  - MAJOR: 後方互換性のない統治/原則の削除・再定義
  - MINOR: 新規の原則/セクション追加、もしくは実務影響のある拡張
  - PATCH: 文言明確化、誤字修正、意味を変えない補足

**Version**: 1.0.1 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-04
