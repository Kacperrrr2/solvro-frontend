import { useState, useEffect } from "react";
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

    async function loadCocktails() {
        setLoading(true);
        const res = await fetch(`https://cocktails.solvro.pl/api/v1/cocktails`);
        const data = await res.json();
        setCocktails(data.data || []);
        setLoading(false);
    }

    useEffect(() => { loadCocktails(); }, []);

    if (selectedCocktail) {
        return (
            <CocktailDetails
                cocktail={selectedCocktail}
                onBack={() => setSelectedCocktail(null)}
            />
        );
    }

    const filteredCocktails = cocktails.filter(c => {
        const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
        const matchesAlcohol =
            (showAlcoholic && c.alcoholic) || (showNonAlcoholic && !c.alcoholic);
        return matchesQuery && matchesAlcohol;
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
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <ul className="space-y-3">
                    {filteredCocktails.map(c => (
                        <li
                            key={c.id}
                            onClick={() => setSelectedCocktail(c)}
                            className="flex items-center gap-3 p-3 bg-white rounded shadow hover:bg-blue-50 cursor-pointer transition"
                        >
                            <img
                                src={c.imageUrl}
                                alt={c.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                                <strong className="text-lg text-gray-800">{c.name}</strong>
                                <p className="text-gray-500 text-sm">{c.category}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${c.alcoholic ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {c.alcoholic ? 'Alcoholic' : 'Non-alcoholic'}
              </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
