import { lineupData } from '../gameData.js';

describe('lineupData reducer',()=>{
  it('returns the default state',()=>{
    expect(lineupData(undefined,{})).toEqual([]);
  })
  it('adds the lineup data to the reducer',()=>{
    expect(lineupData([],{
      type:'STORE_DATA',
      payload:{
        lineup:['lineupArray'],
        player:['playerArray']
      }
    })).toEqual({
      lineup:['lineupArray'],
      player:['playerArray']
    })
  })
})
