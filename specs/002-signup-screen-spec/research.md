# Phase 0 Research: アカウント登録画面（UC-01）

## Decision 1: メール一意判定は trim + lowercase 正規化値で実施

- Decision: メールアドレスは前後空白を除去し小文字化した値を一意判定キーとして扱う
- Rationale: 同一実体メールの表記揺れ（大文字小文字、余分空白）による重複登録を防止できる
- Alternatives considered:
  - 完全一致判定: 表記揺れで重複登録を許してしまうため不採用
  - ドメインのみ小文字化: ローカル部の混乱を残すため不採用

## Decision 2: 登録直後セッションは24時間有効

- Decision: 登録成功時に24時間有効のセッションを開始する
- Rationale: 初回利用時の離脱を抑えつつ、長期固定セッションのリスクを抑える
- Alternatives considered:
  - セッションCookieのみ: 利便性が低く初回継続率を下げる可能性
  - 7日間有効: セキュリティ上の露出期間が増える

## Decision 3: レート制限は email(normalized)+IP で 5 req/min

- Decision: 登録APIに対し、メール正規化値とIPの組み合わせで1分5回まで許可する
- Rationale: 攻撃耐性と正規ユーザーの操作許容のバランスがよい
- Alternatives considered:
  - IPのみ制限: NAT環境で誤検知が増える
  - 3 req/min: 正常利用の誤ブロックリスクが高い
  - 制限なし: 悪用耐性が不足

## Decision 4: 登録処理はアカウント作成+セッション開始を原子的に扱う

- Decision: セッション開始に失敗した場合はアカウント作成をロールバックし、登録全体を失敗扱いにする
- Rationale: 部分成功を禁止し、データ整合性とサポート容易性を担保する
- Alternatives considered:
  - アカウントのみ作成してログイン誘導: 仕様の部分成功禁止に反する
  - バックグラウンド再試行: 状態追跡が複雑化し失敗時説明が難しい

## Decision 5: パスワード要件は 8-64文字、文字種強制なし

- Decision: 最小8文字、最大64文字とし、文字種の強制は行わない
- Rationale: 過剰な複雑性ルールによる弱いパスワード誘発を避け、利用者体験と安全性を両立する
- Alternatives considered:
  - 文字種強制あり: 使い回しや単純変形を誘発しやすい
  - 上限なし: 運用上の制約管理が難しい

## Decision 6: SC-001 の判定期間は週次（直近7日）・母数100件以上

- Decision: SC-001 は直近7日間の週次集計で評価し、母数が100件以上の期間のみ判定対象とする
- Rationale: 日次より統計が安定し、月次より改善サイクルを早く回せる
- Alternatives considered:
  - 日次: ばらつきが大きく判定が不安定
  - 月次: 改善フィードバックが遅い

## Decision 7: SC-001 の除外条件は利用者の明示キャンセルのみ

- Decision: SC-001 の母数からは利用者の明示キャンセルのみ除外し、それ以外は母数に含める
- Rationale: システム品質の改善対象を適切に観測しつつ、恣意的な除外を防止できる
- Alternatives considered:
  - 除外なし: 利用者操作都合が過剰に混入し改善判断が難化
  - ネットワーク断も除外: 都合の良い除外が増え比較可能性が落ちる

## Testing Best Practices Applied

- Decision: testing.core / testing.frontend / testing.backend の3指針を同時適用する
- Rationale: 登録機能はUI状態遷移とAPI失敗分岐の両方が重要で、片側のみでは品質保証が不足する
- Alternatives considered:
  - frontendのみ: DB/認可/トランザクション失敗を十分に検証できない
  - backendのみ: 画面状態遷移やアクセシビリティを担保できない

## Resolved Clarifications

本featureの NEEDS CLARIFICATION は 0 件。未解決項目は存在しない。
