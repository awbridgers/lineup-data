import React from 'react'
import {DataTable, mapStateToProps, mapDispatchToProps} from '../dataTable.jsx';
import { shallow } from 'enzyme'
import lineupClass, {testLineup} from '../../lineupClass.js';

const testLineup1 = new testLineup(2,1);
const testLineup2 = new testLineup(3,4);
const testLineup3 = new testLineup(4,7);

const props = {
  changeSortType : jest.fn(),
  changeGame: jest.fn(),
  lineupTotal: [testLineup2,testLineup1,testLineup3],
  playerTotal: [new lineupClass('test player')],
  finderArray: [new lineupClass('1-2-3')],
  gameName: '',
  dataType: 'lineup',
  sortType: {
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
  },
  individualGames: {
    gameName: {
      lineup: [new lineupClass('game player1-game player2')],
      player: [new lineupClass('game player1')]
    }
  },
  infoType: 'overview',
  accLineupTotal: [new lineupClass('acc player1-acc player2')],
  accPlayerTotal: [new lineupClass('acc player')]
}
//give the fake lineups some possessions so they show up

props.playerTotal[0].possFor +=1;
props.playerTotal[0].possAgainst +=1;
props.accPlayerTotal[0].possFor +=1;
props.accPlayerTotal[0].possAgainst +=1;
props.accLineupTotal[0].possFor +=1;
props.accLineupTotal[0].possAgainst +=1;

const store = props;

describe('dataTable container',()=>{
  let wrapper;
  beforeEach(()=>{
    wrapper = shallow(<DataTable {...props} />)
  })
  it('renders the dataTable',()=>{
    expect(wrapper).toBeDefined();
  })
  it('renders the correct version of the dataTable for totals',()=>{
    expect(wrapper.find('TableLayout').props().array).toContain(testLineup2)
    wrapper.setProps({dataType: 'player'})
    expect(wrapper.find('TableLayout').props().array).toEqual(props.playerTotal)
    wrapper.setProps({dataType:'finder'});
    expect(wrapper.find('TableLayout').props().array).toEqual(props.finderArray)
  })
  it('renders the correct version for dataTable for individualGames',()=>{
    const game = props.individualGames.gameName
    wrapper.setProps({gameName: 'gameName'});
    expect(wrapper.find('TableLayout').props().array).toEqual(game.lineup)
    wrapper.setProps({dataType: 'player'});
    expect(wrapper.find('TableLayout').props().array).toEqual(game.player);
    wrapper.setProps({dataType: 'finder'})
    expect(wrapper.find('TableLayout').props().array).toEqual(props.finderArray);
  })
  it('renders the correct version of dataTbale for acc totals',()=>{
    wrapper.setProps({gameName: 'Acc-Totals'})
    expect(wrapper.find('TableLayout').props().array).toEqual(props.accLineupTotal)
    wrapper.setProps({dataType: 'player'});
    expect(wrapper.find('TableLayout').props().array).toEqual(props.accPlayerTotal)
    wrapper.setProps({dataType: 'finder'});
    expect(wrapper.find('TableLayout').props().array).toEqual(props.finderArray);
  })
  it('runs sorts the arrays for net',()=>{
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup1, testLineup2, testLineup3]);
  })
  it('runs the sort function for time',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'time',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup3,testLineup2,testLineup1]);
  })
  it('runs the sort function for points for',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'pf',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup3,testLineup2,testLineup1
    ])
  })
  it('runs the sort function for pointsAgainst',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'pa',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup3,testLineup2,testLineup1
    ])
  })
  it('runs the sort function for rebound net',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'reb',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup1, testLineup2, testLineup3
    ])
  })
  it('runs the sort function for ortg',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'ortg',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup1,testLineup2,testLineup3
    ])
  })
  it('runs the sort function for drtg',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'drtg',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup1, testLineup2, testLineup3
    ])
  })
  it('runs the sort function for fg%',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'fg%',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup3, testLineup2, testLineup1]);
  })
  it('runs the sort function for fg%def',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'fg%def',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('runs the sort function for 3p%',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: '3p%',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup3, testLineup2, testLineup1]);
  })
  it('runs the sort function for 3p%def',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: '3p%def',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('runs the sort function for a/t',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'a/t',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup3, testLineup2, testLineup1]);
  })
  it('runs the sort function for poss',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'poss',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup3, testLineup2, testLineup1]);
  })
  it('runs the sort function for orb%',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'orb%',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('runs the sort function for drb%',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'drb%',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('runs the sort function for ast%',()=>{
    testLineup1.assistsFor = 1;
    testLineup2.assistsFor = 1;
    testLineup3.assistsFor = 1;
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'ast%',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('runs the sort function for a/poss',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'a/poss',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('runs the sort function for tov%',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'tov%',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup3, testLineup2, testLineup1])
  })
  it('defaults to net points for sort',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: '',reverse: false}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup1, testLineup2, testLineup3])
  })
  it('reverse the sort when reverse is true',()=>{
    wrapper.setProps({sortType:{...props.sortType, lineup: {sortType: 'net',reverse: true}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
    testLineup3, testLineup2, testLineup1])
    wrapper.setProps({sortType:{...props.sortType, player: {sortType: 'net',reverse: true}}});
    wrapper.setProps({playerTotal:[testLineup1,testLineup2], dataType: 'player'})
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup2,testLineup1])
  })
  it('fixes the time correctly',()=>{
    expect(wrapper.instance().fixTime(5)).toEqual('0:05');
    expect(wrapper.instance().fixTime(55)).toEqual('0:55');
    expect(wrapper.instance().fixTime(69)).toEqual('1:09');
    expect(wrapper.instance().fixTime(3669)).toEqual('61:09');
  })
  it('returns the total stats',()=>{
    const testArray = [new testLineup(1,1),new testLineup(1,1)]
    expect(wrapper.instance().totalStats(testArray)).toMatchObject({
      time:2,
      pointsFor: 2,
      pointsAgainst: 2,
      defRebFor: 2,
      defRebAgainst: 2,
      offRebFor: 2,
      offRebAgainst: 2,
      madeTwosFor: 2,
      madeTwosAgainst: 2,
      attemptedTwosFor: 20,
      attemptedTwosAgainst: 20,
      madeThreesFor: 2,
      madeThreesAgainst: 2,
      attemptedThreesFor: 20,
      attemptedThreesAgainst: 20,
      assistsFor: 2,
      assistsAgainst: 2,
      turnoversFor: 10,
      turnoversAgainst:10,
      ftaFor: 2,
      ftaAgainst: 2,
      possFor: 2,
      possAgainst: 2,
      totalShotsAgainst: 40,
      totalShotsFor: 40
    })
  })
  it('runs the sortClick function',()=>{
    wrapper.instance().sortClick({target:{id: 'pf'}});
    expect(props.changeSortType).toHaveBeenCalledWith('net','pf','lineup');
  })
  it('sorts the finder array',()=>{
    wrapper.setProps({finderArray: props.lineupTotal, dataType: 'finder'});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup1, testLineup2, testLineup3
    ])
    wrapper.setProps({sortType: {...props.sortType, finder: {sortType: 'net', reverse: true}}});
    expect(wrapper.find('TableLayout').props().array).toEqual([
      testLineup3, testLineup2, testLineup1
    ])
  })
})

describe('connected dataTable component',()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  })
  it('connects the state to props',()=>{
    const store = {
      lineupData: {
        lineup: [testLineup1],
        player: 'playerTotal'
      },
      finder: ['test','finder'],
      gameName: '',
      dataType: 'lineup',
      sort:'sort Test',
      individualGames: 'individualGames',
      infoType: 'overview',
      accData:{
        lineup: [testLineup1],
        player: 'accPlayer'
      }
    }
    expect(mapStateToProps(store).lineupTotal).toEqual([testLineup1]);
    expect(mapStateToProps(store).playerTotal).toEqual('playerTotal');
    expect(mapStateToProps(store).finderArray).toEqual(['test','finder']);
    expect(mapStateToProps(store).gameName).toEqual('');
    expect(mapStateToProps(store).dataType).toEqual('lineup');
    expect(mapStateToProps(store).sortType).toEqual('sort Test');
    expect(mapStateToProps(store).individualGames).toEqual('individualGames');
    expect(mapStateToProps(store).infoType).toEqual('overview');
    expect(mapStateToProps(store).accLineupTotal).toEqual([testLineup1]);
    expect(mapStateToProps(store).accPlayerTotal).toEqual('accPlayer');
  })
  it('matches dispatch to props',()=>{
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).changeSortType('prevSort','newSort','sortBy');
    mapDispatchToProps(dispatch).changeGame('game');
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: 'CHANGE_SORT_TYPE',
      prevSort: 'prevSort',
      newSort: 'newSort',
      array: 'sortBy'
    })
  })
})
