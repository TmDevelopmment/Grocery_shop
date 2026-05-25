import { categoriesData } from "../assets/assets";

const FilterPannel = ({
  categories,
  category,
  minPrice,
  maxPrice,
  updateFilters,
  clearFilters,
  hasFilters,
}) => {
  const categoriesWithAll = [
    { slug: "", name: "All Categories" },
    ...categoriesData,
  ];

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Category</h3>
        <div className="space-y-1">
          {categoriesWithAll.map((c: any) => (
            <button
              key={c.slug}
              onClick={() => updateFilters("category", c.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${category === c.slug ? "bg-app-green text-white" : "bg-white text-app-text hover:bg-app-cream"} transition-colors`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-app-green mb-2">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilters("minPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-app-border focus:border-app-green outline-none"
          />
          <span className="text-app-text-light">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white rounded-lg border not-focus:border-app-border focus:border-app-green outline-none"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-app-text-light">
            Clear Filters
          </h3>
          <div className="space-y-1">
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-app-error hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPannel;
