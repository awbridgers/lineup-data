import { individualGames } from '../individualGames.js';

describe('individualGames reducer',()=>{
  it('returns the default state',()=>{
    expect(individualGames(undefined,{})).toEqual({});
  })
  it('adds individual Games',()=>{
    expect(individualGames({},{
      type:'STORE_INDIVIDUAL_GAME',
      game: 'Wake_Forest',
      payload: ['gameData']
    })).toEqual({
      Wake_Forest:['gameData']
    })
  })
})
