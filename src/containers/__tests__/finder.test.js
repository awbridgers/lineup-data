import React from 'react';
import {Finder} from '../finder.jsx';
import { shallow } from 'enzyme';

const props = {
  cancelFinder: jest.fn(),
  handleInput: jest.fn(),
  onClick: jest.fn()
}

describe('Finder container',()=>{
  let wrapper;
  beforeEach(()=>{
    wrapper = shallow(<Finder {...props}/>)
  })
  it('renders the finder componenet',()=>{
    expect(wrapper.find('.finder')).toHaveLength(1)
  })
  it('renders 5 input boxes',()=>{
    expect(wrapper.find('input')).toHaveLength(5);
  })
  it('runs the cancel function',()=>{
    wrapper.find('button').last().simulate('click');
    expect(props.cancelFinder).toHaveBeenCalled();
  })
  it('runs the submit function',()=>{
    wrapper.find('button').first().simulate('click');
    expect(props.onClick).toHaveBeenCalled()
  })
  it('runs the handle input function',()=>{
    wrapper.find('input').first().simulate('change',{target:{value: 'test'}});
    expect(props.handleInput).toHaveBeenCalled();
  })
})
