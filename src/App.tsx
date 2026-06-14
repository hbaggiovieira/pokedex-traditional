import { PokemonList } from './components/PokemonList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokédex</h1>
      </header>
      <main className="app-main">
        <PokemonList />
      </main>
    </div>
  )
}

export default App
