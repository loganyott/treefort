import { List } from 'immutable'

export const partitionList = (items, size) => {
  if (items === undefined) {
    return List()
  }

  return items.groupBy((items, i) => Math.floor(i/size))
}

export const getPerformers = (performers, searchTerm, fort) => {
  if (performers.size === 0 || performers === undefined) {
    return List()
  }

  // Sort by fort, then by tier, then order in tier.
  let perfList = performers
                  .filter(p => p.get('forts', List()).includes(fort))
                  .sortBy(p => p.get('tier'))
                  .sortBy(p => p.get('sort_order_within_tier'))


  if (searchTerm.length > 0) {
    if (searchTerm.substring(0, 3) === 'g: ') {
      const genre = searchTerm.length >= 3 ? searchTerm.substring(3) : ''
      const allPerformers = performers
                              .filter(p => p.get('forts', List()).includes(fort))
                              // .filter(p => p.get('genres', List()).includes(genre))
                              .sortBy(p => p.get('tier'))
                              .sortBy(p => p.get('sort_order_within_tier'))

      perfList = allPerformers.filter(p => p.get('genres').map(g => g.toLowerCase()).includes(genre.toLowerCase()))
      return perfList
    }
    
    return perfList.filter((p) => p.get('name').toLowerCase().includes(searchTerm.toLowerCase()))
  }

  return perfList
}

export const splitLineup = (perfList, typeA, typeB, typeC, perRow) => {
  if (perfList === undefined || perfList.size === 0) {
    return {}
  }

  return {
    'typeA': partitionList(perfList.filter(p => p.get('forts', List()).includes(`${typeA}`)), perRow),
    'typeB': partitionList(perfList.filter(p => p.get('forts', List()).includes(typeB)), perRow),
    'typeC': partitionList(perfList.filter(p => p.get('forts', List()).includes(typeC)), perRow)
  } 
}
