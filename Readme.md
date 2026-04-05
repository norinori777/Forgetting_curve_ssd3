# 忘却曲線アプリ開発

## この開発で実施したいこと

- 開発のコンテキストを準備する。
- コンテキストを補助するためのAgent Skillsを登録する。
- 開発範囲を制限しながら、コントロールできる範囲を見極めながら開発をする。
- copilot-agent-builderを使ってみる。
- GitHub Actionを使ったCD/CIを実現する。
- コードレビュー用のAgentを作成してレビューをする。

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

