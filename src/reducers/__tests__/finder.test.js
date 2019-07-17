import { finder, finderActive } from '../finder.js';

describe('finder reducer',()=>{
  it('returns the default state',()=>{
    expect(finder(undefined,{})).toEqual([]);
  })
  it('returns the finder array data',()=>{
    expect(finder([],{
      type: 'ADD_LINEUP_FINDER_INFO',
      payload: ['Random Stuff']
    })).toEqual(['Random Stuff'])
  })
})

describe('finderActive reducer',()=>{
  it('returns the default state',()=>{
    expect(finderActive(undefined,{})).toEqual(false);
  })
  it('changes when finder is active',()=>{
    expect(finderActive(false,{
      type:'CHANGE_FINDER_ACTIVE',
      payload: true
    })).toEqual(true)
  })
})
