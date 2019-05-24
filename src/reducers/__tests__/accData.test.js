import {accData} from '../accData.js'
describe('accData reducer',()=>{
  it('returns the default state',()=>{
    expect(accData(undefined,{})).toEqual([])
  })
  it('stores the data',()=>{
    expect(accData([],{
      type: 'STORE_DATA',
      payload: {
        accLineup: ['accLineup'],
        accPlayer: ['accPlayer'],
      }
    })).toEqual({
      lineup: ['accLineup'],
      player: ['accPlayer']
    })
  })
})
