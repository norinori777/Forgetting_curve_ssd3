# 忘却曲線アプリ開発

## この開発で実施したいこと

- 開発のコンテキストを準備する。
- コンテキストを補助するためのAgent Skillsを登録する。
- 開発範囲を制限しながら、コントロールできる範囲を見極めながら開発をする。
- copilot-agent-builderを使ってみる。
- GitHub Actionを使ったCD/CIを実現する。
- コードレビュー用のAgentを作成してレビューをする。
- 上位設計（全体ユースケース一覧、主要ユーザーフロー、エンティティー、画面一覧と画面遷移図、非機能要件）をGitHub Spec Kitで実施してみる。

## 実施したこと

1. GitHub Spec Kitの初期化

    ```
    uvx --from git+https://github.com/github/spec-kit.git specify init Forgetting_curve
    ```

2. GitHub Copilotに忘却曲線アプリの開発で憲法に定義した方が内容を聞いてみた。

    ```
    結論として、忘却曲線アプリの憲法には「何を作るか」よりも「何を絶対に守るか」を書くのが重要です。  
    現状、constitution.md はテンプレート状態なので、constitution-template.md を埋める形で、以下の内容を入れると実運用しやすいです。

    **記載するとよい項目**

    1. プロダクト原則
    - 実施言語: 本プロジェクトの仕様策定・開発運用は原則として日本語で実施する
    - 学習効果優先: すべての機能は「記憶定着率の改善」に紐づくこと
    - 科学的妥当性: 復習間隔ロジックは根拠ある手法（例: SM-2系）を採用し、変更時は理由を明記
    - ユーザー安全性: 進捗データ消失を防ぐ（バックアップ、復元、削除確認）
    - シンプル優先: 機能追加は計測結果で正当化できる場合のみ

    2. 品質ゲート
    - テストファースト: 新規機能はテスト先行
    - 主要ロジックの必須テスト: 復習日計算、正答率更新、リマインド判定
    - 受け入れ条件: 仕様書に受け入れ基準を明記し、満たすまでマージしない
    - CI/CD必須: テスト、Lint、型チェックが成功しない限り統合不可

    3. データとセキュリティ
    - 最小収集: 学習に不要な個人情報は収集しない
    - 保護: 保存データの暗号化方針
    - 監査性: スケジューリング計算の根拠ログを残せる設計にする

    4. UX/性能基準
    - 主要操作の応答時間目標（例: 復習一覧表示は 1 秒以内）
    - モバイル前提の操作性
    - アクセシビリティ最低基準（キーボード操作、十分なコントラスト）

    5. 開発運用
    - Spec Kit成果物の順守: spec → plan → tasks の順で進める
    - MVP範囲を超える機能は仕様化のみで実装しない。
    - サイクル（spec → plan → tasks）での開発範囲は、以下のいずれかの条件に達したら**必ず分割する**：
      - タスク数が 15 以上になった場合
      - ユーザーストーリーが 3 以上になった場合
      - 実装に予定時間を超える見込みが発生した場合
    - 変更管理: 憲法変更は理由、影響範囲、移行手順を必須化
    - バージョニング: 憲法の版数と改訂日を管理
    ```

3. 技術スタックが確定している場合、憲法（constitution.md）と計画テンプレート（plan-template.md）の## Technical Contextに追記する。

4. UI作成用のSKILLの作成をGitHub Copilotに作成依頼。以下、依頼内容。

    ```
    フロントエンドの開発SKILLとして、以下の内容を入れたAgent SKILLを作成してください。

    - React コンポーネント分割方針
    - props / state / event の命名規則
    - Tailwind の利用方針
    - Storybook の追加基準
    - レスポンシブ設計
    - アクセシビリティ最低基準
    - loading / error / empty state の扱い
    - 既存 UI パターンの再利用方針
    ```

5. 作成し終わった後に、planにUI作成時には、4のSKILLを利用する旨を追記。

6. フロントエンドのディレクトリ構成は、計画テンプレート（plan-template.md）のstructureに追記。

    ```
    ```text
    backend/
    ├── api/          # APIエンドポイント
    ├── services/     # ビジネスロジック
    ├── repositories/ # データアクセス
    ├── domains/       # ドメインモデル
    └── utils/        # ユーティリティ

    frontend/
    ├── .storybook/       # Storybook設定
    ├── public/           # 静的ファイル
    ├── src/
    │   ├── assets/       # 画像などのアセット
    │   ├── contents/     # ページ表示基盤の紐づけ情報を格納
    │   ├── pages/        # ページ(画面)
    │   ├── components/
    │   │   ├── uiParts/      # 汎用UI部品
    │   │   └── uniqueParts/  # 画面固有部品
    │   ├── hooks/        # React hooks
    │   ├── services/
    │   │   └── api/      # API呼び出し
    │   ├── domains/       # DTO/ドメイン型
    │   └── utils/
    │       └── theme/    # テーマ関連
    ├── dist/             # ビルド成果物
    └── storybook-static/ # Storybookビルド成果物
    ```

7. テスト実施用SKILLの作成をGitHub Copilotに依頼。  
以下のAIに以下の依頼でAgent Skillを作成してもらう。

    ```
    テスト実施用のSKILLを作成してください。
    実施したいテスト内容は、以下が必須要件となります。
    フロントエンド用とバックエンド用の２つのSKILLを作成してください。
    ２つの共通するテスト設計は、testing-coreとしてフロントエンド用とバックエンド用から参照できるようにしてください。

    1. 全分岐テスト（Branch coverage）
      - 対象: if/else/switch/early-return/例外分岐を含む関数・メソッド
        - 目標: コアロジックはブランチカバレッジ100%（リポジトリ全体は目安85%）

    2. 境界値テスト（Boundary value）
      - 日時/時刻/値境界（前 / 一致 / 後）
        - 例: `nextReviewAt` が 2026-03-06T23:59:59（前）、2026-03-07T00:00:00（一致）、2026-03-07T00:00:01（後）
          - UTC とローカル（JST 等）の両方で検証する
      - 数値境界
        - `intervalDays` の最小/最大/±1、`recentAccuracy` の 0／50／100 等
      - ページング境界
        - `page=1`, `page=last`, `page>last`, `per_page` の最小/最大/超過
      - バルク操作境界
        - 選択0件、1件、最大多数（例: 1000件）等での挙動とロールバック

    3. 失敗／例外シナリオの網羅
      - 認可エラー、DBタイムアウト、ネットワークエラー、入力バリデーション失敗など各分岐を含める
    ```

8. planとtaskとimplementのagentにてtestのskill agenetを参照することを追記。

    ```
    // plan
    ### Testing Skill Routing (MANDATORY)

    - Always load: `.github/agents/testing.core.agent.md`
    - For tasks touching UI/frontend paths or concerns, also load: `.github/agents/testing.frontend.agent.md`
      - Indicators: frontend/, src/components/, src/pages/, src/hooks/, loading/error/empty, accessibility, storybook
    - For tasks touching backend/API/DB/auth concerns, also load: `.github/agents/testing.backend.agent.md`
      - Indicators: backend/, src/services/, src/repositories/, contracts/, authorization, validation, timeout, transaction, rollback
    - If a story includes both frontend and backend work, load both frontend and backend testing skills.
    - If uncertain, load both in addition to testing-core.
    ```

    ```
    // task
    ### Testing Skill Routing (MANDATORY)

    - Always load: `.github/agents/testing.core.agent.md`
    - Load additionally: `.github/agents/testing.frontend.agent.md` when any of these are true:
      - plan/spec input includes frontend, ui, react, tailwind, storybook, component
      - planned structure includes frontend/, src/components/, src/pages/, src/hooks/
      - UI state handling is in scope (loading/error/empty)
    - Load additionally: `.github/agents/testing.backend.agent.md` when any of these are true:
      - plan/spec input includes backend, api, service, repository, database, auth
      - planned structure includes backend/, src/services/, src/repositories/, contracts/
      - authorization, validation, timeout, transaction, rollback is in scope
    - If both conditions are true, load both frontend and backend testing skills.
    - If uncertain, default to loading both frontend and backend skills in addition to testing-core.
    ```

    ```
    // implement
    ### Testing Skill Routing (MANDATORY)

      - Always load: `.github/agents/testing.core.agent.md`
      - Additionally load: `.github/agents/testing.frontend.agent.md` when current task/files include frontend/UI scope
        - Indicators: frontend/, src/components/, src/pages/, src/hooks/, loading/error/empty, accessibility, storybook
      - Additionally load: `.github/agents/testing.backend.agent.md` when current task/files include backend/API/DB/auth scope
        - Indicators: backend/, src/services/, src/repositories/, contracts/, authorization, validation, timeout, transaction, rollback
      - If both scopes are present, load both frontend and backend testing skills.
      - If uncertain, default to loading both in addition to testing-core.
    ```

9. Lintや型チェックを組み込むHooksを作成する。Hooksは、あることを実施したら動作させるタスクみたいなもの。GitHub Spec Kitでは、hooks.before_implement/hooks.after_implementを読む設計となっている。
speckit.implement.agent.mdには、before_implement_hooksを読み込む実装となっている。

    - extensions.yml
      ```
      hooks:
      before_implement:
        - extension: quality-gate
          enabled: true
          optional: false
          command: quality.gate
          description: Lint and typecheck must pass before implementation
          prompt: Run lint and typecheck for frontend/backend and stop on any failure
      ```
    - quality.gate.agent.md
    - quility.gate.prompt.md

10. コードレビューを組み込むHooksを作成する。hooks.after_implementでコードレビューAgentを動作させるようにする。

    - extensions.yml
      ```
      hooks:
        before_implement:
          - extension: quality-gate
            enabled: true
            optional: false
            command: quality.gate
            description: Lint and typecheck must pass before implementation
            prompt: Run lint and typecheck for frontend/backend and stop on any failure
        after_implement:
          - extension: code-review
            enabled: true
            optional: true
            command: code.review
            description: Comprehensive code review covering constitutional compliance, test coverage, and code quality
            prompt: Analyze PR changes against constitution, test requirements, security, and accessibility standards
      ```
    - code_review_agent.md
    - code_review_prompt.md

11. 全体設計をGitHub Spec Kitで作成してみる。初回は６０％程度の出来で、２～３サイクルまわしてみる。全体設計の親スペックは、全体仕様のため、実装は実施しない。実装は、子スペック側にて実施する。

  ```
  1. 目的  
  このプロダクト全体の上位設計を作成してください。これは個別機能実装の前提になる親スペックです。

  2. スコープ  
  対象はプロダクト全体。個別機能の詳細実装には入らない。  
  MVP範囲を明示し、MVP外は Out of Scope として分離する。

  3. 必須出力  
  全体ユースケース一覧  
  主要ユーザーフロー  
  概念データモデル（エンティティと関連）  
  画面一覧と画面遷移  
  非機能要件（性能、可用性、セキュリティ、監査、運用）  
  制約・前提・未確定事項  
  リスクと検証計画  
  子スペックへの分割方針（候補機能の切り方）

  4. 出力ルール  
  日本語で記述  
  表と箇条書き中心で簡潔に  
  未確定事項は必ず Open Questions に残す  
  測定可能な受け入れ条件を含める

  5. 品質基準  
  各ユースケースが少なくとも1つの画面遷移とデータ更新に紐づくこと  
  非機能要件は数値目標を含むこと  
  MVP判定基準が明記されること

  期待されるアウトプットの形
  1. 親スペック本文  
  背景、目的、範囲、ユースケース、データ、画面遷移、非機能、制約、リスク、未決事項がまとまった文書。

  2. 依存マップ  
  ユースケース x 画面 x データの対応表。  
  どこを変更するとどこに影響するか分かる状態。

  3. 子スペック分割案  
  例として、学習記録登録、復習キュー生成、通知設定、進捗可視化のように、後続サイクルで切れる単位が提示される。

  4. 受け入れ基準  
  親スペックとしての Done 条件。  
  例として、主要ユースケースが画面遷移で閉じる、主要データが責務重複なく定義される、非機能目標が計測可能、など。
  ```

  上記をspecifyする場合、ある程度、こちらがどのようなものを作成するか伝える必要があるが、以下の観点で伝えるとよいらしい。
  
  全体設計で伝える粒度は、結論として「実装詳細手前の判断可能レベル」が最適です。言い換えると、チームが 1 週間単位の実装サイクルに分割できる深さまでです。

  おすすめは 3 層で伝えることです。

  1. Whyレベル（1ページで説明できるレベル）
  - 何の課題を解くか
  - 誰のためか
  - 成功をどう測るか（KPI）
  - やらないこと（Out of Scope）

  2. Whatレベル（親スペックの中心）
  - 主要ユースケース 5〜10 本
  - 主要ユーザーフロー（開始条件、終了条件、例外）
  - 概念データモデル（主要エンティティと関連）
  - 画面一覧と主要画面遷移
  - 非機能要件（性能・可用性・セキュリティ・運用の目標値）

  3. Guardrailレベル（ブレ防止）
  - 重要な業務ルール
  - 制約条件（法規、技術、予算、期限）
  - 未確定事項（Open Questions）
  - 意思決定の優先順位（例: 学習効果 > 機能数）

  逆に、親スペックでやりすぎな粒度は次です。
  - APIの詳細I/F定義
  - DBの物理設計（型、インデックス詳細）
  - コンポーネント設計やCSS実装
  - タスク分解レベルの手順

  判断基準はシンプルです。  
  「この情報で、次の子スペックに安全に分割できるか？」で判定します。  
  できるなら十分、できないなら不足です。

  実務で使える最小セットはこの6点です。
  1. プロダクト目的とMVP定義  
  2. 主要ユースケース一覧  
  3. ユースケース x 画面 x データの対応表  
  4. 主要画面遷移  
  5. 非機能要件の数値目標  
  6. Open Questions一覧

  以下実際の例

    1. 目的  
    忘却曲線に基づく学習支援アプリの上位設計を作成してください。これは個別機能実装の前提になる親スペックです。

    2. 対象ユーザー  
    社会人学習者と学生。主な利用シーンは日々の復習計画作成、実施、進捗確認です。

    3. 解決したい課題  
    復習タイミングの判断が難しく、記憶定着が不安定になる課題を解決する。  
    学習者が次に何をいつ復習すべきかを明確にする。

    4. 成功指標（MVP）  
    復習対象一覧の表示が1秒以内。  
    週次の復習実施率を可視化できる。  
    学習記録から次回復習日が自動計算される。  
    主要フロー完了率（学習登録→復習実施→結果記録）を測定可能にする。

    5. スコープ  
    プロダクト全体を対象とし、個別実装詳細には入らない。  
    MVP範囲とOut of Scopeを明示する。

    6. 必須出力  
    全体ユースケース一覧（5から10本）  
    主要ユーザーフロー（開始条件、終了条件、例外）  
    概念データモデル（主要エンティティと関連）  
    画面一覧と画面遷移  
    非機能要件（性能、可用性、セキュリティ、監査、運用）  
    制約、前提、未確定事項  
    リスクと検証計画  
    子スペックへの分割方針

    7. ガードレール  
    学習効果の改善に直接寄与しない機能はMVP外。  
    不要な個人情報は収集しない。  
    復習間隔ロジックの変更は根拠と影響範囲を記録する。  
    仕様と運用は原則日本語で記述する。

    8. 出力ルール  
    表と箇条書きを中心に簡潔に記述。  
    未確定事項はOpen Questionsとして分離。  
    受け入れ条件は測定可能な形式で記述。

    9. 品質基準  
    各ユースケースが少なくとも1つの画面遷移とデータ更新に紐づくこと。  
    非機能要件に数値目標があること。  
    MVP判定基準が明記されること。

