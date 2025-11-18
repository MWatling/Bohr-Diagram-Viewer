import React, { useState, useEffect, useCallback } from 'react';
import { ElementData } from './types';
import { ELEMENTS } from './data/elements';
import BohrDiagram from './components/BohrDiagram';
import ElementSelector from './components/ElementSelector';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(ELEMENTS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const findElement = useCallback((query: string) => {
    setError(null);
    const trimmedQuery = query.trim().toLowerCase();
    
    if (!trimmedQuery) {
        setError("Please enter an element's name, symbol, or atomic number.");
        setSelectedElement(null);
        return;
    }

    const foundElement = ELEMENTS.find(
      (el) =>
        el.name.toLowerCase() === trimmedQuery ||
        el.symbol.toLowerCase() === trimmedQuery ||
        el.atomicNumber.toString() === trimmedQuery
    );

    if (foundElement) {
      setSelectedElement(foundElement);
    } else {
      setError(`Element "${query}" not found. Please check your input.`);
      setSelectedElement(null);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Bohr Diagram Viewer</h1>
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>
      
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center">
        <ElementSelector onSearch={findElement} error={error} />
        
        <div className="w-full flex-grow flex items-center justify-center p-4 mt-6">
            {selectedElement ? (
                <BohrDiagram key={selectedElement.atomicNumber} element={selectedElement} />
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p className="text-lg">Please select an element to view its Bohr diagram.</p>
                </div>
            )}
        </div>
      </main>
      
      <footer className="w-full max-w-4xl text-center text-sm text-gray-500 dark:text-gray-400 mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
        <p>Created with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;