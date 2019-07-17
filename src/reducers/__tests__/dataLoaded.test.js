import { dataLoaded } from '../dataLoaded.js'
describe('dataLoaded reducer',()=>{
  it('returns the initial state',()=>{
    expect(dataLoaded(undefined, {})).toEqual(false);
  })
  it('changes on successful load',()=>{
    expect(dataLoaded(false, {type: 'LOAD_SUCCESSFUL'})).toEqual(true);
  })
})
