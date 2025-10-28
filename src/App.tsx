import { useState, useEffect, useRef } from "react";
import CocktailDetails from "./components/CocktailDetails.tsx";

type Cocktail = {
    id: number;
    name: string;
    category: string;
    glass: string;
    instructions: string;
    imageUrl: string;
    alcoholic: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function App() {
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [showAlcoholic, setShowAlcoholic] = useState(true);
    const [showNonAlcoholic, setShowNonAlcoholic] = useState(true);
    const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [likedIds, setLikedIds] = useState<number[]>(() => {
        const saved = localStorage.getItem("likedCocktails");
        return saved ? JSON.parse(saved) : [];
    });

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        localStorage.setItem("likedCocktails", JSON.stringify(likedIds));
    }, [likedIds]);

    useEffect(() => {
        loadCocktails(page);
    }, [page]);

    async function loadCocktails(pageNumber: number) {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`https://cocktails.solvro.pl/api/v1/cocktails?page=${pageNumber}`);
            const data = await res.json();
            setLastPage(data.meta.lastPage);
            setCocktails((prev) => [...prev, ...data.data]);
        } catch (error) {
            console.error("Error loading cocktails:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && page < lastPage) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loading, page, lastPage]);

    const toggleLike = (id: number) => {
        setLikedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    if (selectedCocktail) {
        return (
            <CocktailDetails
                cocktail={selectedCocktail}
                onBack={() => setSelectedCocktail(null)}
                liked={likedIds.includes(selectedCocktail.id)}
                onLikeToggle={() => toggleLike(selectedCocktail.id)}
            />
        );
    }

    const filteredCocktails = cocktails.filter((c) => {
        const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
        const matchesAlcohol =
            (showAlcoholic && c.alcoholic) || (showNonAlcoholic && !c.alcoholic);
        const matchesFavorite = !showFavoritesOnly || likedIds.includes(c.id);
        return matchesQuery && matchesAlcohol && matchesFavorite;
    });

    const sortedCocktails = [...filteredCocktails].sort((a, b) => {
        const aLiked = likedIds.includes(a.id);
        const bLiked = likedIds.includes(b.id);
        return aLiked === bLiked ? 0 : aLiked ? -1 : 1;
    });

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                Cocktails App 🍸
            </h1>

            <input
                type="text"
                placeholder="Search cocktail..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-center gap-6 mb-6">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showAlcoholic}
                        onChange={(e) => setShowAlcoholic(e.target.checked)}
                        className="accent-blue-500"
                    />
                    Alcoholic
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showNonAlcoholic}
                        onChange={(e) => setShowNonAlcoholic(e.target.checked)}
                        className="accent-blue-500"
                    />
                    Non-alcoholic
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showFavoritesOnly}
                        onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                        className="accent-pink-500"
                    />
                    Favorites ❤️
                </label>
            </div>

            <ul className="space-y-3">
                {sortedCocktails.map((c) => (
                    <li
                        key={c.id}
                        className="flex items-center gap-3 p-3 bg-white rounded shadow hover:bg-blue-50 transition"
                    >
                        <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div
                            onClick={() => setSelectedCocktail(c)}
                            className="flex-1 cursor-pointer"
                        >
                            <strong className="text-lg text-gray-800">{c.name}</strong>
                            <p className="text-gray-500 text-sm">{c.category}</p>
                        </div>
                        <span
                            className={`px-2 py-1 text-xs rounded-full ${
                                c.alcoholic
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                            }`}
                        >
              {c.alcoholic ? "Alcoholic" : "Non-alcoholic"}
            </span>

                        <button
                            onClick={() => toggleLike(c.id)}
                            className="ml-2 text-xl"
                        >
                            {likedIds.includes(c.id) ? "❤️" : "🤍"}
                        </button>
                    </li>
                ))}
            </ul>
            <div ref={loaderRef} className="h-12 flex items-center justify-center">
                {loading ? <p className="text-gray-500">Loading more...</p> : null}
            </div>
        </div>
    );
}
