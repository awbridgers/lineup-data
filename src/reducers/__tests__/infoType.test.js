import {infoType} from '../infoType.js';

describe('infoType reducer',()=>{
  it('returns the default state',()=>{
    expect(infoType(undefined,{})).toEqual('overview')
  })
  it('changes the infoType',()=>{
    expect(infoType('overview',{
      type: 'CHANGE_INFO_TYPE',
      infoType: 'advanced',
    })).toEqual('advanced')
  })
})
