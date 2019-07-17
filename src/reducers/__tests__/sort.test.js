import { sort } from '../sort.js';

describe('sort reducer',()=>{
  it('returns the default state',()=>{
    expect(sort(undefined,{})).toEqual({
      lineup:{
      sortType: 'net',
      reverse: false
    },
    player:{
      sortType: 'net',
      reverse: false
    },
    finder:{
      sortType: 'net',
      reverse: false
    }
    });
  })
  it('reverse the array if prev sort is the same as new sort',()=>{
    expect(sort(undefined,{
      type:'CHANGE_SORT_TYPE',
      prevSort: 'net',
      newSort: 'net',
      array: 'player'
    })).toEqual({
      lineup:{
        sortType: 'net',
        reverse: false
      },
      player:{
        sortType: 'net',
        reverse: true
      },
      finder:{
        sortType: 'net',
        reverse: false
      }
    })
  })
  it('changes the sort type if the sorts are not the same',()=>{
    expect(sort(undefined,{
      type:'CHANGE_SORT_TYPE',
      newSort: 'ortg',
      prevSort: 'net',
      array: 'lineup'
    })).toEqual({
      lineup:{
        sortType: 'ortg',
        reverse: false
      },
      player:{
        sortType: 'net',
        reverse: false
      },
      finder:{
        sortType: 'net',
        reverse: false
      }
    })
  })
})
