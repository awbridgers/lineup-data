import React from 'react';
import { Header, mapStateToProps, mapDispatchToProps } from '../header.js';
import { shallow } from 'enzyme';
import Dropdown from '../dropDown.js'
import TableLayout from '../../components/tableLayout.js.jsx'
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const props = {
  dataType: 'lineup',
  gameName: '',
  individualGames: {
    game_1: {
      score: {
        wake: 69,
        opp: 42
      }
    }
  },
  path: '',
  dataLoaded: true,
  finderActive: false,
  infoType: 'overview',
  changeDataType: jest.fn(),
  changeGame: jest.fn(),
  changeFinder: jest.fn(),
  changeInfoType: jest.fn()
}

describe('Header container',()=>{
  let wrapper;
  beforeEach(()=>{
    wrapper = shallow(<Header {...props} />)
    jest.clearAllMocks();
  })
  it('renders the header',()=>{
    expect(wrapper.find('.App-header')).toHaveLength(1);
  })
  it('activates the finder when clicked',()=>{
    wrapper.find('.finderButton').simulate('click');
    expect(props.changeFinder).toHaveBeenCalledWith(!props.finderActive)
  })
  it('switches the dataType between lineup and player',()=>{
    wrapper.find('#switchData').simulate('click');
    expect(props.changeDataType).toHaveBeenCalledWith('player');
  })
  it('switches the dataType back to lineup from player',()=>{
    wrapper.setProps({dataType: 'player'});
    wrapper.find('#switchData').simulate('click');
    expect(props.changeDataType).toHaveBeenCalledWith('lineup');
  })
  it('runs the back function',()=>{
    wrapper.setProps({dataType: 'finder'});
    wrapper.find('#back').simulate('click');
    expect(props.changeDataType).toHaveBeenCalledWith('lineup')
  })
  it('changes to advanced data',()=>{
    wrapper.find('#switchType').simulate('click');
    expect(props.changeInfoType).toHaveBeenCalledWith('advanced');
  })
  it('changes back to overview',()=>{
    wrapper.setProps({infoType: 'advanced'});
    wrapper.find('#switchType').simulate('click');
    expect(props.changeInfoType).toHaveBeenCalledWith('overview');
  })
  it('render the correct heading',()=>{
    expect(wrapper.find('.title').find('h1').text()).toEqual('Season Total')
  })
  it('displays the score for individualGames',()=>{
    wrapper.setProps({gameName: 'game_1'});
    expect(wrapper.find('#wakeScore').text()).toEqual(expect.stringContaining('69'));
    expect(wrapper.find('#oppScore').text()).toEqual(expect.stringContaining('42'));
  })
  it('formats the name properly',()=>{
    wrapper.setProps({gameName: 'game_1'});
    expect(wrapper.find('#oppScore').text()).toEqual(expect.stringContaining('game 1'));
  })
  it('sets the correct game as the dropdown',()=>{
    wrapper.setProps({gameName: 'game_1'});
    expect(wrapper.find(Dropdown).props().default).toEqual('game_1')
  })
  it('renders the correct buttons',()=>{
    expect(wrapper.find('#switchType').text()).toEqual('Advanced');
    wrapper.setProps({infoType: 'advanced'});
    expect(wrapper.find('#switchType').text()).toEqual('Overview');
    expect(wrapper.find('#switchData').text()).toEqual('View Players');
    wrapper.setProps({dataType: 'players'});
    expect(wrapper.find('#switchData').text()).toEqual('View Lineups');
    wrapper.setProps({dataType: 'finder'});
    expect(wrapper.find('#back')).toBeDefined();
  })
})

describe('connected Header',()=>{
  it('matches state to props',()=>{
    const state = {
      dataType: 'lineup',
      gameName: 'game',
      router: {
        location: {
          pathname: 'game'
        }
      },
      dataLoaded: true,
      finderActive: false,
      infoType: 'overview',
      individualGames: {
        game1: 'game1',
        game2: 'game2'
      }
    }
    expect(mapStateToProps(state).dataType).toEqual('lineup');
    expect(mapStateToProps(state).gameName).toEqual('game');
    expect(mapStateToProps(state).path).toEqual('game');
    expect(mapStateToProps(state).dataLoaded).toEqual(true);
    expect(mapStateToProps(state).finderActive).toEqual(false);
    expect(mapStateToProps(state).infoType).toEqual('overview');
    expect(mapStateToProps(state).individualGames).toEqual({
      game1: 'game1',
      game2: 'game2'
    })
  })
  it('maps dispatch to props',()=>{
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({});
    mapDispatchToProps(store.dispatch).changeDataType('lineup');
    mapDispatchToProps(store.dispatch).changeGame('game');
    mapDispatchToProps(store.dispatch).changeFinder(true);
    mapDispatchToProps(store.dispatch).changeInfoType('advanced');
    const expectedActions = [
      {
        type: 'CHANGE_DATA_TYPE',
        dataType: 'lineup'
      },
      {
        type: 'SELECT_GAME',
        game: 'game'
      },
      {
        type: 'CHANGE_FINDER_ACTIVE',
        payload: true
      },
      {
        type: 'CHANGE_INFO_TYPE',
        infoType: 'advanced'
      }
    ]
    expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions))
  })
})
