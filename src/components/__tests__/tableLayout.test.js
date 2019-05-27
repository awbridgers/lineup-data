import TableLayout from '../tableLayout.js.jsx';
import React from 'react'
import lineupClass from '../../lineupClass.js'
import { shallow } from 'enzyme';

const props = {
  type: 'overview',
  array: [new lineupClass('Player1-Player2')],
  total: jest.fn(),
  fixTime: jest.fn(),
  sort: jest.fn()
}

describe('TableLayout componenet',()=>{
  let wrapper;
  beforeEach(()=>{
    jest.clearAllMocks();
    wrapper = shallow(<TableLayout {...props}/>)
  })
  it('renders without crashing',()=>{
    expect(wrapper.find('lineupTable')).toBeDefined();
  })
  it('runs the sort function on overview',()=>{
    const event = {id: 'id'}
    wrapper.find('th').at(1).simulate('click', event);
    wrapper.find('th').at(2).simulate('click', event);
    wrapper.find('th').at(3).simulate('click', event);
    wrapper.find('th').at(4).simulate('click', event);
    wrapper.find('th').at(5).simulate('click', event);
    wrapper.find('th').at(6).simulate('click', event);
    wrapper.find('th').at(7).simulate('click', event);
    wrapper.find('th').at(8).simulate('click', event);
    expect(props.sort).toHaveBeenCalledTimes(8);
  })
  it('runs the sort function on advanced',()=>{
    wrapper.setProps({type: 'advanced'});
    const event = {id: 'id'}
    wrapper.find('th').at(1).simulate('click', event);
    wrapper.find('th').at(2).simulate('click', event);
    wrapper.find('th').at(3).simulate('click', event);
    wrapper.find('th').at(4).simulate('click', event);
    wrapper.find('th').at(5).simulate('click', event);
    wrapper.find('th').at(6).simulate('click', event);
    wrapper.find('th').at(7).simulate('click', event);
    wrapper.find('th').at(8).simulate('click', event);
    expect(props.sort).toHaveBeenCalledTimes(8);
  })
  it('dispalys overview',()=>{
    expect(wrapper.find('th').at(1).text()).toEqual('Time')
  })
  it('displays advanced',()=>{
    wrapper.setProps({type: 'advanced'});
    expect(wrapper.find('th').at(1).text()).toEqual('Poss')
  })
  it('displays overview stats',()=>{
    expect(wrapper.find('td').at(0).text()).toEqual('Player1\nPlayer2');
  })
})
