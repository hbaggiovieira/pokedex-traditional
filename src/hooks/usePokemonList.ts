import { useState, useEffect } from 'react'
import { fetchPokemonList, PokemonListItem } from '../services/pokeapi'

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchPokemonList()
      .then(setPokemon)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { pokemon, loading, error }
}
