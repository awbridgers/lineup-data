import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import Routing from './routing.jsx'
import {HashRouter as Router, Route} from 'react-router-dom';
import Games from "./games.js";
import Acc from './acc.jsx'
import DataTable from './dataTable.jsx';

describe('<Routing>',() =>{
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Routing />, div);
  })
  it('renders all the information for TOTALS correctly',()=>{
    const tree = renderer.create(<Router><App/></Router>).toJSON();
    expect(tree).toMatchSnapshot();
  })
  it('renders all the information for ACC correctly',()=>{
    const tree = renderer.create(<Router><Acc/></Router>).toJSON();
    expect(tree).toMatchSnapshot();
  })
  it('renders all the information for GAMES correctly',()=>{
    const tree = renderer.create(<Router><Games gameName = 'NC_A&T'/></Router>).toJSON();
    expect(tree).toMatchSnapshot();
  })
})

describe('<DataTable/>' , ()=>{
  const testArrayLineup = [{lineup: 'Test Lineup', time: 150, pointsFor: 5, pointsAgainst:4,
    reboundsFor: 10, reboundsAgainst:8, possFor: 100, possAgainst: 100}]
  const wrapper = shallow(<DataTable dataType = {[]} dataArray = {[]}
      playerArray = {[]} finderArray = {[]} sort = {()=>{}} />);
  it('renders lineupData correctly',()=>{
    wrapper.setProps({dataType: 'lineup', dataArray: testArrayLineup});
    expect(wrapper).toMatchSnapshot();
  })
  it('renders playerData correctly', ()=>{
    wrapper.setProps({dataType: 'player', playerArray: testArrayLineup});
    expect(wrapper).toMatchSnapshot();
  })
  it('renders finderData correctly', ()=>{
    wrapper.setProps({dataType: 'finder', finderArray: testArrayLineup})
    expect(wrapper).toMatchSnapshot();
  })
})
