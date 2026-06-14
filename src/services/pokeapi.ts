const BASE_URL = 'https://pokeapi.co/api/v2'

export interface PokemonListItem {
  id: number
  name: string
  spriteUrl: string
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  officialArtworkUrl: string
  types: string[]
  stats: Array<{ name: string; value: number }>
}

function extractId(url: string): number {
  const segments = url.split('/').filter(Boolean)
  return Number(segments[segments.length - 1])
}

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListItem[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error('Falha ao buscar lista de Pokémons')
  const data = await res.json() as { results: Array<{ name: string; url: string }> }
  return data.results.map(({ name, url }) => {
    const id = extractId(url)
    return {
      id,
      name,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    }
  })
}

export async function fetchPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`)
  if (!res.ok) throw new Error(`Falha ao buscar detalhes: ${idOrName}`)
  const d = await res.json()
  return {
    id: d.id,
    name: d.name,
    height: d.height,
    weight: d.weight,
    officialArtworkUrl:
      d.sprites?.other?.['official-artwork']?.front_default ?? d.sprites?.front_default,
    types: d.types.map((t: { type: { name: string } }) => t.type.name),
    stats: d.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
  }
}
