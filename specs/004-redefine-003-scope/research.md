# Research: 003スコープ再定義（分割必須条件適合）

## Decision 1: 003の上限制約を固定する

- Decision: 003 feature はユーザーストーリー2件以下、タスク14件以下を必須とする。
- Rationale: 憲法の分割必須条件（3ストーリー以上、15タスク以上）を運用上で確実に回避するため。
- Alternatives considered:
  - ストーリーのみ上限化: タスク肥大化を防げず不採用。
  - タスクのみ上限化: ストーリー過多による依存複雑化を防げず不採用。

## Decision 2: 003の責務を統制領域へ限定する

- Decision: 003のin-scopeを「方針定義・依存定義・移管管理」に限定し、実装タスクは後続featureへ移管する。
- Rationale: 003の役割をガバナンスに固定し、再肥大化の再発を防止するため。
- Alternatives considered:
  - 003内で一部実装を許容: 境界が再び曖昧化するため不採用。
  - 完全方針文書のみ: 移管追跡まで担保できず不採用。

## Decision 3: 依存と移管の判定手順を先に固定する

- Decision: 後続featureの開始前に「依存循環なし」「移管漏れなし」を必須チェックとする。
- Rationale: 実装着手後の手戻りを減らし、順序合意（1営業日以内）を実現するため。
- Alternatives considered:
  - 実装後チェック: 発見が遅く修正コスト増のため不採用。
  - 移管漏れは後続featureで解消: 追跡整合性が崩れるため不採用。

## Decision 4: 要件移管は元要件ID 1対1で管理する

- Decision: RequirementHandoverMap は元要件IDごとに単一の移管先featureを持つ。
- Rationale: 追跡可能性を機械的に検証可能にし、重複割当を排除するため。
- Alternatives considered:
  - 1対多許容: 責務重複と衝突リスクが高いため不採用。
  - 粗粒度マッピング: 漏れ検知が困難なため不採用。

## Decision 5: 本featureでは新規外部契約を定義しない

- Decision: API/CLIなどの新規外部契約は作成しない。
- Rationale: スコープが仕様運用統制に限定され、公開インターフェース変更を含まないため。
- Alternatives considered:
  - 管理用契約を仮定義: 実装対象外でノイズが増えるため不採用。
