import type { Place, Category } from "./SearchTypes";

export interface SidePanelProps {
    category: Category;
    keyword: string;
    places: Place[];
    loading: boolean;
    added: Place[];
    onCategoryChange: (c: Category) => void;
    onKeywordChange: (k: string) => void;
    onToggleAdd: (place: Place) => void;
    onSelect: (place: Place) => void;
}