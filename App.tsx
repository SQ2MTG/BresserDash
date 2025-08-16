
import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Panel Stacji Pogodowej</h1>
          <p className="text-lg text-slate-400">Bresser 5-w-1</p>
        </header>
        <main>
          <Dashboard />
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Dane odbierane na żywo z brokera MQTT w sieci lokalnej.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;