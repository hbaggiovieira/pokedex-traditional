import { usePokemonList } from '../hooks/usePokemonList'
import './PokemonList.css'

export function PokemonList() {
  const { pokemon, loading, error } = usePokemonList()

  if (loading) return <p className="status">Carregando Pokémons...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <ul className="pokemon-grid">
      {pokemon.map((p) => (
        <li
          key={p.id}
          className="pokemon-card"
          onClick={() => console.log(`Pokémon selecionado: ${p.name}`)}
        >
          <img src={p.spriteUrl} alt={p.name} width={96} height={96} />
          <span className="pokemon-number">#{String(p.id).padStart(3, '0')}</span>
          <span className="pokemon-name">{p.name}</span>
        </li>
      ))}
    </ul>
  )
}
