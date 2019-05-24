import { gameName } from '../gameName.js'

describe('gameName reducer',()=>{
  it('returns the default state',()=>{
    expect(gameName(undefined,{})).toEqual('');
  })
  it('returns the game Name',()=>{
    expect(gameName('',{
      type: 'SELECT_GAME',
      game: 'Wake_Forest'
    })).toEqual('Wake_Forest');
  })
})
