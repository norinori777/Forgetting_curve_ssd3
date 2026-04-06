# Research: US1/US2/US3 分割 feature 化

## Decision 1: 分割実行順を US1→US2→US3 に固定する

- Decision: feature実行順は US1 を先行、US2 を中間、US3 を後続に固定する。
- Rationale: 依存関係逆転を避け、レビュー対象を小さく保つことで再作業を減らせるため。
- Alternatives considered:
  - 3 feature並行実行: 初速は上がるが依存衝突とレビュー負荷が増えるため不採用。
  - specのみ並行・実装順次: 仕様間のズレを後段で吸収するコストが高いため不採用。

## Decision 2: 追跡可能性を元要件ID単位の1対1で管理する

- Decision: TraceabilityMapは元要件IDごとに移行先featureを1対1で管理する。
- Rationale: 分割後に「どの要件がどこへ移ったか」を監査可能にし、漏れ検知を自動化しやすくするため。
- Alternatives considered:
  - セクション単位の粗いマッピング: 漏れ検知精度が低いため不採用。
  - 1対多マッピング許容: 重複定義の温床になるため不採用。

## Decision 3: 依存衝突時はプロダクトオーナーが1営業日以内に最終決定する

- Decision: 依存衝突の最終決定者はプロダクトオーナーとし、判断SLAを1営業日以内に設定する。
- Rationale: 判定責任を明確化し、停滞時間を抑制するため。
- Alternatives considered:
  - 全員合議: 合意形成に時間がかかりやすく不採用。
  - 開発者判断: 一貫性より局所最適に偏るリスクがあるため不採用。

## Decision 4: 品質ゲート適用時点を「各featureのPRマージ前」に統一する

- Decision: test/lint/typecheckの3品質ゲートは、各featureのPRマージ前に100%達成を必須とする。
- Rationale: 後続featureへの品質負債持ち越しを防止し、段階実行時の健全性を保つため。
- Alternatives considered:
  - 最終feature完了時に一括判定: 不具合発見が遅くなるため不採用。
  - lint/typecheckのみ先行: テスト抜けが残存するため不採用。

## Decision 5: 本featureでは新規外部インターフェース契約を追加しない

- Decision: 本featureは仕様運用の分割が主目的のため、新規API/CLI契約は作成しない。
- Rationale: 実装インターフェースを追加しない計画変更であり、契約成果物を増やしても管理コストのみ増えるため。
- Alternatives considered:
  - 管理用ダミーAPI契約を定義: 実装対象外でノイズが増えるため不採用。
  - すべての既存契約を再定義: スコープ逸脱のため不採用。
