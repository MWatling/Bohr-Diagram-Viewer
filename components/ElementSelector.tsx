
import React, { useState } from 'react';

interface ElementSelectorProps {
  onSearch: (query: string) => void;
  error: string | null;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ onSearch, error }) => {
  const [query, setQuery] = useState('Hydrogen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter name, symbol, or atomic #"
          className="w-full px-4 py-2 bg-transparent text-gray-900 dark:text-white border-none focus:ring-0 placeholder-gray-500"
          aria-label="Element search input"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          View
        </button>
      </form>
      {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
};

export default ElementSelector;
