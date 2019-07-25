import React, { Component } from 'react';
import '../App.css';
import { connect } from 'react-redux'
import { chooseGame, changeGlossaryActive } from '../actions/index.js'



export class Dropdown extends Component {

  handleSelect = (event) =>{
    let selection = event.target.value;
    if(this.props.glossary){
      this.props.changeGlossaryActive(false);
    }
    this.props.changeGame(selection)
  }

  render(){
    let gameArray = Object.keys(this.props.individualGames).sort((a,b)=>this.props.individualGames[a].order - this.props.individualGames[b].order)
    return (
      <select className = "select" value = 'select' onChange = {this.handleSelect}>
        <option disabled hidden value = "select"> -- select a game -- </option>
        <option value = "">Season Total</option>
        <option  value = "Acc-Totals">ACC Totals</option>
        {gameArray.map((x,i)=> {
          return (
            <option key = {i} value = {x}>{x.replace(/_/g, ' ')}</option>
          )
        })}
      </select>
    )
  }
}
export const mapStateToProps = state => ({
  individualGames: state.individualGames,
  glossary: state.glossary,
})
export const mapDispatchToProps = dispatch =>({
  changeGame: (game)=> dispatch(chooseGame(game)),
  changeGlossaryActive: (active)=> dispatch(changeGlossaryActive(active)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
