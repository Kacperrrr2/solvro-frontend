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
        <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg text-center">

            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
            >
                ← Back
            </button>

            <h2 className="text-3xl font-bold mb-4 text-gray-800">{cocktail.name}</h2>

            <div className="mb-4 space-y-2 text-gray-700">
                <p><span className="font-semibold">Category:</span> {cocktail.category}</p>
                <p><span className="font-semibold">Glass:</span> {cocktail.glass}</p>
                <p><span className="font-semibold">Alcoholic:</span> {cocktail.alcoholic ? "Yes" : "No"}</p>
            </div>

            <img
                src={cocktail.imageUrl}
                alt={cocktail.name}
                className="w-48 h-48 mx-auto rounded-lg object-cover mb-4 shadow-sm"
            />

            <p className="text-gray-600"><span className="font-semibold">Instructions:</span> {cocktail.instructions}</p>

        </div>
    );
}
