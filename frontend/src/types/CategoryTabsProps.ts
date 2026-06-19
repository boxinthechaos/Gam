import type { Category } from "./SearchTypes";

export interface CategoryTabsProps {
    category: Category;
    onChange: (c: Category) => void;
}