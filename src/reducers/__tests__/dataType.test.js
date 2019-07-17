import { dataType } from '../dataType.js';

describe('dataType reducer',()=>{
  it('returns the default state',()=>{
    expect(dataType(undefined,{})).toEqual('lineup');
  })
  it('changes the dataType',()=>{
    expect(dataType('lineup',{
      type: 'CHANGE_DATA_TYPE',
      dataType: 'player'
    })).toEqual('player');
  })
})
