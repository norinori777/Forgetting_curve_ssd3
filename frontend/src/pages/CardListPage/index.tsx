import { useEffect, useState, type FormEvent } from "react";
import BaseLayout from "../../components/layout/BaseLayout";
import { bulkLabelCards, deleteCard, exportCards, listCards, type CardListItem } from "../../services/api/cards/card";
import { CARD_LABEL_OPTIONS } from "../CardRegistrationPage/cardRegistrationValidation";
import { buildCardListQuery, createInitialCardListFilters, toggleCardListLabel, type CardListFilters } from "./cardListQuery";

type CardListStatus = "loading" | "ready" | "empty" | "error";

export default function CardListPage() {
  const [status, setStatus] = useState<CardListStatus>("loading");
  const [cards, setCards] = useState<CardListItem[]>([]);
  const [message, setMessage] = useState<string>("カード一覧を読み込んでいます。");
  const [filters, setFilters] = useState<CardListFilters>(createInitialCardListFilters);
  const [appliedFilters, setAppliedFilters] = useState<CardListFilters>(createInitialCardListFilters);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [bulkLabels, setBulkLabels] = useState<string[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadCards = async (): Promise<void> => {
      setStatus("loading");
      setMessage("カード一覧を読み込んでいます。");

      const response = await listCards(buildCardListQuery(appliedFilters));

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setMessage(response.error.message);
        return;
      }

      setCards(response.data.items);
      setSelectedCardIds((previous) => previous.filter((cardId) => response.data.items.some((card) => card.cardId === cardId)));

      if (response.data.items.length === 0) {
        setStatus("empty");
        setMessage("検索条件に一致するカードはありません。条件を見直してください。");
        return;
      }

      setStatus("ready");
      setMessage(`${response.data.items.length}件のカードを表示しています。`);
    };

    void loadCards();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, refreshTick]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSelectedCardIds([]);
    setBulkLabels([]);
    setAppliedFilters({ searchText: filters.searchText, labels: [...filters.labels] });
  };

  const handleClearFilters = (): void => {
    const clearedFilters = createInitialCardListFilters();
    setFilters(clearedFilters);
    setSelectedCardIds([]);
    setBulkLabels([]);
    setAppliedFilters(clearedFilters);
  };

  const toggleCardSelection = (cardId: string): void => {
    setSelectedCardIds((previous) =>
      previous.includes(cardId) ? previous.filter((selectedCardId) => selectedCardId !== cardId) : [...previous, cardId]
    );
  };

  const handleToggleBulkLabel = (label: string): void => {
    setBulkLabels((previous) => toggleCardListLabel(previous, label));
  };

  const handleBulkLabelApply = async (): Promise<void> => {
    if (selectedCardIds.length === 0) {
      setMessage("一括付与するカードを選択してください。");
      return;
    }

    if (bulkLabels.length === 0) {
      setMessage("一括付与するカテゴリ・タグを選択してください。");
      return;
    }

    const response = await bulkLabelCards({ cardIds: selectedCardIds, labels: bulkLabels });

    if (!response.ok) {
      setStatus("error");
      setMessage(response.error.message);
      return;
    }

    setMessage(`${response.data.updatedCount}件のカードにラベルを付与しました。`);
    setSelectedCardIds([]);
    setBulkLabels([]);
    setRefreshTick((previous) => previous + 1);
  };

  const handleDeleteCard = async (cardId: string): Promise<void> => {
    if (typeof window !== "undefined" && !window.confirm("このカードを削除しますか？")) {
      return;
    }

    const response = await deleteCard(cardId);

    if (!response.ok) {
      setStatus("error");
      setMessage(response.error.message);
      return;
    }

    setSelectedCardIds((previous) => previous.filter((selectedCardId) => selectedCardId !== cardId));
    setMessage("カードを削除しました。");
    setRefreshTick((previous) => previous + 1);
  };

  const handleExport = async (): Promise<void> => {
    const response = await exportCards({
      search: filters.searchText.trim().length > 0 ? filters.searchText.trim() : undefined,
      labels: filters.labels.length > 0 ? [...filters.labels] : undefined
    });

    if (!response.ok) {
      setStatus("error");
      setMessage(response.error.message);
      return;
    }

    const payload = JSON.stringify(response.data, null, 2);

    if (typeof document !== "undefined") {
      const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `card-export-${response.data.exportedAt.replace(/[:.]/g, "-")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    setMessage("検索条件に一致するカードを JSON でエクスポートしました。");
  };

  return (
    <BaseLayout activePage="cardList">
      <section aria-live="polite">
        <h1 style={{ marginTop: 0 }}>サービスカード一覧</h1>
        <p style={{ marginBottom: 0 }}>タイトル、問い、答え、カテゴリ、タグを検索して管理します。</p>
        <p>{message}</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 16, marginBottom: 16 }}>
          <label htmlFor="card-list-search" style={{ display: "grid", gap: 6 }}>
            <span>検索</span>
            <input
              id="card-list-search"
              value={filters.searchText}
              onChange={(event) => setFilters((prev) => ({ ...prev, searchText: event.target.value }))}
              placeholder="タイトル・問い・答えを検索"
              style={{ border: "1px solid #d0d5dd", borderRadius: 10, padding: "10px 12px" }}
            />
          </label>

          <fieldset style={{ border: "1px solid #eaecf0", borderRadius: 12, padding: 16 }}>
            <legend style={{ padding: "0 6px" }}>カテゴリ・タグ</legend>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {CARD_LABEL_OPTIONS.map((label) => {
                const selected = filters.labels.includes(label);

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, labels: toggleCardListLabel(prev.labels, label) }))}
                    aria-pressed={selected}
                    style={{
                      borderRadius: 999,
                      border: "1px solid",
                      borderColor: selected ? "#175cd3" : "#d0d5dd",
                      background: selected ? "#ecf3ff" : "#fff",
                      padding: "8px 14px",
                      cursor: "pointer"
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="submit" style={{ borderRadius: 10, border: "none", background: "#175cd3", color: "#fff", padding: "10px 16px", fontWeight: 700 }}>
              検索する
            </button>
            <button type="button" onClick={handleClearFilters} style={{ borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "10px 16px" }}>
              条件をクリア
            </button>
            <button type="button" onClick={handleExport} style={{ borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "10px 16px" }}>
              JSON エクスポート
            </button>
          </div>
        </form>

        <section style={{ marginBottom: 16, padding: 16, borderRadius: 16, border: "1px solid #eaecf0", background: "#fff" }}>
          <h2 style={{ marginTop: 0 }}>一括ラベル付与</h2>
          <p style={{ marginTop: 0 }}>選択したカードにまとめてカテゴリ・タグを追加します。</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CARD_LABEL_OPTIONS.map((label) => {
              const selected = bulkLabels.includes(label);

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleToggleBulkLabel(label)}
                  aria-pressed={selected}
                  style={{
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: selected ? "#175cd3" : "#d0d5dd",
                    background: selected ? "#ecf3ff" : "#fff",
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  {label}
                </button>
              );
            })}
            <button type="button" onClick={handleBulkLabelApply} style={{ borderRadius: 10, border: "none", background: "#175cd3", color: "#fff", padding: "10px 16px", fontWeight: 700 }}>
              選択カードに付与
            </button>
          </div>
          <p style={{ marginBottom: 0 }}>選択中: {selectedCardIds.length} 件</p>
        </section>

        {status === "loading" ? <p>読み込み中...</p> : null}

        {status === "error" ? (
          <p role="alert" style={{ color: "#b42318" }}>
            一覧の取得に失敗しました。再読み込みしてください。
          </p>
        ) : null}

        {status === "empty" ? (
          <p>検索条件に一致するカードはありません。</p>
        ) : null}

        {status === "ready" ? (
          <ul>
            {cards.map((card) => (
              <li key={card.cardId}>
                <article>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={selectedCardIds.includes(card.cardId)}
                      onChange={() => toggleCardSelection(card.cardId)}
                    />
                    <span>選択</span>
                  </label>
                  <h2>{card.title}</h2>
                  <p>{card.question}</p>
                  {card.answer ? <p>{card.answer}</p> : null}
                  {card.labels.length > 0 ? <p>{card.labels.join(" / ")}</p> : <p>ラベルなし</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => void handleDeleteCard(card.cardId)} style={{ borderRadius: 10, border: "1px solid #d0d5dd", background: "#fff", padding: "8px 12px" }}>
                      削除
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </BaseLayout>
  );
}
