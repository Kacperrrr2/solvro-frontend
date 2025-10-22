type Cocktail = {
    id: number;
    name: string;
    category: string;
    glass: string;
    instructions: string;
    imageUrl: string;
    alcoholic: boolean;
};

type Props = {
    cocktail: Cocktail;
    onBack: () => void;
};

export default function CocktailDetails({ cocktail, onBack }: Props) {
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Back button wyrównany do lewej */}
            <div className="mb-4">
                <button
                    onClick={onBack}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Back
                </button>
            </div>

            {/* Reszta karty wyśrodkowana */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{cocktail.name}</h2>
                <p className="text-gray-600 mb-1"><strong>Category:</strong> {cocktail.category}</p>
                <p className="text-gray-600 mb-1"><strong>Glass:</strong> {cocktail.glass}</p>
                <p className="text-gray-600 mb-3">
                    <strong>Alcoholic:</strong> {cocktail.alcoholic ? "Yes" : "No"}
                </p>

                <img
                    src={cocktail.imageUrl}
                    alt={cocktail.name}
                    className="w-48 h-48 object-cover mx-auto rounded mb-4 border border-gray-200"
                />

                <p className="text-gray-700"><strong>Instructions:</strong> {cocktail.instructions}</p>
            </div>
        </div>
    );
}
