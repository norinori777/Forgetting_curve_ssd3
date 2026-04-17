import { CARD_LABEL_OPTIONS } from "../CardRegistrationPage/cardRegistrationValidation";

export type CardListFilters = {
  searchText: string;
  labels: string[];
};

export const CARD_LIST_DEFAULT_LIMIT = 20;

export const createInitialCardListFilters = (): CardListFilters => ({
  searchText: "",
  labels: []
});

export const normalizeCardListSearchText = (value: string): string => value.trim();

export const toggleCardListLabel = (labels: string[], label: string): string[] => {
  const normalizedLabel = label.trim();

  if (!CARD_LABEL_OPTIONS.includes(normalizedLabel as (typeof CARD_LABEL_OPTIONS)[number])) {
    return labels;
  }

  return labels.includes(normalizedLabel) ? labels.filter((item) => item !== normalizedLabel) : [...labels, normalizedLabel];
};

export const buildCardListQuery = (filters: CardListFilters, cursor?: string): { search?: string; labels?: string[]; cursor?: string; limit: number } => {
  const search = normalizeCardListSearchText(filters.searchText);

  return {
    search: search.length > 0 ? search : undefined,
    labels: filters.labels.length > 0 ? [...filters.labels] : undefined,
    cursor,
    limit: CARD_LIST_DEFAULT_LIMIT
  };
};