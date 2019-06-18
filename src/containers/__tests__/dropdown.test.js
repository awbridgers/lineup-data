import React from 'react';
import {Dropdown} from '../dropDown.js';
import { shallow } from 'enzyme';

const props = {
  individualGames: {
    game1: {
      fakeData: 'hello',
      order: 0
    },
    game2: {
      fakeData: 'there',
      order: 1
    },
    game_3: {
      fakeData: 'general kebobi',
      order: 2
    }
  },
  changeGame: jest.fn()
}


describe('Dropdown container',()=>{
  let wrapper;
  beforeEach(()=>{
    wrapper = shallow(<Dropdown {...props} />);
  })
  it('renders the Dropdown',()=>{
    expect(wrapper.find('select')).toBeDefined();
  })
  it('lists all the info in the dropdown',()=>{
    expect(wrapper.find('option')).toHaveLength(6)
  })
  it('changes the game when an option is clicked',()=>{
    wrapper.find('select').simulate('change',{target: {value:'newGame'}});
    expect(props.changeGame).toHaveBeenCalledWith('newGame');
  })
  it('formats the name correctly',()=>{
    expect(wrapper.find('option').last().text()).toEqual('game 3')
  })
})
