import { App, mapStateToProps, mapDispatchToProps } from '../App.js';
import {shallow} from 'enzyme';
import React from 'react';
import DataTable  from '../containers/dataTable.jsx'
import Finder  from '../containers/finder.jsx';
import {testLineup, roster} from '../lineupClass.js'

let testLineup1 = new testLineup(1,1)
let testLineup2 = new testLineup(2,2)
testLineup2.lineup  = 'player 3-player 4'

const props = {
  changeDataType: jest.fn(),
  addLineupFinderInfo: jest.fn(),
  changeFinder: jest.fn(),
  lineups: [testLineup1, testLineup2 ],
  dataType: 'lineup',
  dataLoaded: true,
  finderActive: false,
  gameName: '',
  individualGames: {
    game1: {
      lineup: [testLineup1]
    },
    game2: {
      lineup:[testLineup2]
    }
  }
}



describe('App component',()=>{
  let wrapper;
  beforeEach(()=>{
    wrapper = shallow(<App {...props}/>)
    jest.clearAllMocks();
  })
  it('renders',()=>{
    expect(wrapper.find('div.App')).toHaveLength(1)
  })
  it('renders DataTable if dataLoaded is true',()=>{
    expect(wrapper.find(DataTable)).toHaveLength(1)
  })
  it('does not render DataTable if dataLoaded is false',()=>{
    wrapper.setProps({dataLoaded: false});
    expect(wrapper.find(DataTable).exists()).toEqual(false)
  })
  it('does not render the finder when finderActive is false',()=>{
    expect(wrapper.find(Finder).exists()).toEqual(false)
  })
  it('does render a finder when finderActive is true',()=>{
    wrapper.setProps({finderActive: true});
    expect(wrapper.find(Finder).exists()).toEqual(true)
  })
  it('updates the names for the finder',()=>{
    wrapper.instance().handleInput({target:{
      value: 'John Cena',
      name: 'player1'
    }})
    expect(wrapper.state('player1')).toEqual('John Cena')
  })
  it('runs the lineupFinder function for totals',()=>{
    window.alert = jest.fn();
    wrapper.instance().checkRoster = jest.fn((array)=>true)
    wrapper.setState({player1: 'player 1', player2: 'player 2'})
    wrapper.instance().lineupFinder();
    expect(props.addLineupFinderInfo).toHaveBeenCalledWith([testLineup1])
    expect(props.changeFinder).toHaveBeenCalled();
    expect(props.changeDataType).toHaveBeenCalledWith('finder')
  })
  it('runs the lineupFinder for individual games',()=>{
    window.alert = jest.fn();
    wrapper.instance().checkRoster = jest.fn((array)=>true)
    wrapper.setProps({gameName: 'game2'});
    wrapper.setState({player3: 'player 3', player4: 'player 4'})
    wrapper.instance().lineupFinder();
    expect(props.addLineupFinderInfo).toHaveBeenCalledWith([testLineup2])
    expect(props.changeFinder).toHaveBeenCalled();
    expect(props.changeDataType).toHaveBeenCalledWith('finder')
  })
  it('doesnt return anything for finder if lineup is not in array',()=>{
    window.alert = jest.fn();
    wrapper.instance().checkRoster = jest.fn((array)=>true)
    wrapper.setState({player1: 'John Cena', player2: 'player 2'})
    wrapper.instance().lineupFinder();
    expect(props.addLineupFinderInfo).toHaveBeenCalledWith([])
    expect(props.changeFinder).toHaveBeenCalled();
    expect(props.changeDataType).toHaveBeenCalledWith('finder')
  })
  it('alerts the user that a player is not on the roster',()=>{
    wrapper.setState({player1: 'John Cena', player2: 'player 2'})
    window.alert = jest.fn();
    wrapper.instance().lineupFinder();
    expect(window.alert).toHaveBeenCalled();
  })
  it('checks if player is apart of the roster',()=>{
    expect(wrapper.instance().checkRoster([roster[0]])).toEqual(true);
    expect(wrapper.instance().checkRoster(['John Cena'])).toEqual(false);
  })
})

describe('connected App',()=>{
  it('matches state to props',()=>{
    const store = {
      lineupData:{
        lineup: ['lineupData']
      },
      dataType: 'lineup',
      dataLoaded: true,
      finderActive: false,
      gameName: 'game1',
      individualGames:{
        game1: 'game1'
      }
    }
    expect(mapStateToProps(store).lineups).toEqual(['lineupData']);
    expect(mapStateToProps(store).dataType).toEqual('lineup');
    expect(mapStateToProps(store).dataLoaded).toEqual(true);
    expect(mapStateToProps(store).finderActive).toEqual(false);
    expect(mapStateToProps(store).individualGames).toEqual({game1: 'game1'});
  })
  it('maps dispatch to props',()=>{
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).changeDataType('data');
    mapDispatchToProps(dispatch).addLineupFinderInfo(['array']);
    mapDispatchToProps(dispatch).changeFinder(true);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: 'CHANGE_DATA_TYPE',
      dataType: 'data'
    })
    expect(dispatch.mock.calls[1][0]).toEqual({
      type: 'ADD_LINEUP_FINDER_INFO',
      payload: ['array']
    })
    expect(dispatch.mock.calls[2][0]).toEqual({
      type: 'CHANGE_FINDER_ACTIVE',
      payload: true
    })
  })
})
