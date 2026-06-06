import { useState } from "react";

import { usePlaceSearch } from "../hooks/usePlaceSearch";

import type { Category, Place } from "../types/SearchTypes";

import Navbar from "../components/main-page/Navbar";
import SidePanel from "../components/search/SidePanel";
import MapView from "../components/search/MapView";
import ScheduleBar from "../components/search/ScheduleBar";


export default function SearchPage() {
    const [category, setCategory] = useState<Category>("food");
    const [keyword, setKeyword] = useState<string>("");
    const [added, setAdded] = useState<Place[]>([]);
    const [selected, setSelected] = useState<Place | null>(null);

    const { places, loading } = usePlaceSearch(category, keyword);

    const handleToggleAdd = (place: Place) => {
        setAdded((prev) =>
            prev.some((p) => p.id === place.id)
                ? prev.filter((p) => p.id !== place.id)
                : [...prev, place]
        );
    };

    const handleCategoryChange = (c: Category) => {
        setCategory(c);
        setKeyword("");
        setSelected(null);
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <SidePanel
                    category={category}
                    keyword={keyword}
                    places={places}
                    loading={loading}
                    added={added}
                    onCategoryChange={handleCategoryChange}
                    onKeywordChange={setKeyword}
                    onToggleAdd={handleToggleAdd}
                    onSelect={setSelected}
                />

                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1">
                        <MapView places={places} selected={selected} />
                    </div>
                    <ScheduleBar added={added} />
                </div>
            </div>
        </div>
    );
}