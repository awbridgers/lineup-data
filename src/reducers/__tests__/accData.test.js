import {accData} from '../accData.js'
describe('accData reducer',()=>{
  it('returns the default state',()=>{
    expect(accData(undefined,{})).toEqual([])
  })
})
