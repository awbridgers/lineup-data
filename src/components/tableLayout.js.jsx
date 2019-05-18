import React from 'react'
import ReactTooltip from 'react-tooltip'
import '../App.css'


const TableLayout = (props)=>(
  <table className = 'lineupTable'>
    {props.type === 'overview' &&
      <tbody>
        <tr>
          <th className = 'lineupHeader'>Lineup</th>
          <th  className = "click" id = "time" onClick = {(e)=>props.sort(e)}>Time</th>
          <th  className = "click" id = "net" onClick = {(e)=>props.sort(e)}>Pts +/-</th>
          <th  className = "click" id = "reb" onClick = {(e)=>props.sort(e)}>Reb +/-</th>
          <th  className = "click" id = "fg%" onClick = {(e)=>props.sort(e)}>FG%</th>
          <th  className = "click" id = "fg%def" onClick = {(e)=>props.sort(e)}>FG% Def</th>
          <th  className = "click" id = "3p%" onClick = {(e)=>props.sort(e)}>3P%</th>
          <th  className = "click" id = "3p%def" onClick = {(e)=>props.sort(e)}>3P% Def</th>
          <th  className = "click" id = "a/t" onClick = {(e)=>props.sort(e)}>A/T</th>
        </tr>
        {props.array.map((x,i) => {
          return (
            <tr key ={i}>
              <td id = 'pre'>{x.lineup.replace(/-/g, '\n')}</td>
              <td>{props.fixTime(x.time)}</td>
              <td>{x.pointsFor-x.pointsAgainst}</td>
              <td>{(x.offRebFor+x.defRebFor) - (x.defRebAgainst + x.offRebAgainst)}</td>
              <td>{Math.round(((x.madeThreesFor + x.madeTwosFor)/x.totalShotsFor)*100)}%</td>
              <td>{Math.round(((x.madeThreesAgainst + x.madeTwosAgainst)/x.totalShotsAgainst)*100)}%</td>
              <td>{Math.round((x.madeThreesFor/x.attemptedThreesFor)*100)}%</td>
              <td>{Math.round((x.madeThreesAgainst/x.attemptedThreesAgainst)*100)}%</td>
              <td>{parseFloat(x.assistsFor/x.turnoversFor).toFixed(2)}</td>
            </tr>
            )
          })
        }
        <tr>
          <td>Total</td>
          <td>{props.fixTime(props.total.time)}</td>
          <td>{props.total.pointsFor - props.total.pointsAgainst}</td>
          <td>{(props.total.offRebFor + props.total.defRebFor) - (props.total.offRebAgainst + props.total.defRebAgainst)}</td>
          <td>{Math.round((props.total.madeThreesFor + props.total.madeTwosFor)/(props.total.totalShotsFor)*100)}%</td>
          <td>{Math.round((props.total.madeThreesAgainst + props.total.madeTwosAgainst)/(props.total.totalShotsAgainst)*100)}%</td>
          <td>{Math.round((props.total.madeThreesFor/props.total.attemptedThreesFor)*100)}%</td>
          <td>{Math.round((props.total.madeThreesAgainst/props.total.attemptedThreesAgainst)*100)}%</td>
          <td>{parseFloat(props.total.assistsFor/props.total.turnoversFor).toFixed(2)}</td>
        </tr>
    </tbody>
  }
  {props.type === 'advanced' &&
    <tbody>
      <tr>
        <th className = 'lineupHeader'>Lineup</th>
        <th  data-tip = 'estimated number of possessions' className = "click" id = "poss" onClick = {(e)=>props.sort(e)}>Poss</th>
        <th  data-tip = 'points/100 poss' className = "click" id = "ortg" onClick = {(e)=>props.sort(e)}>ORtg</th>
        <th  data-tip = 'points allowed/100poss' className = "click" id = "drtg" onClick = {(e)=>props.sort(e)}>DRtg</th>
        <th  data-tip = '% of available rebounds grabbed by offense' className = "click" id = "orb%" onClick = {(e)=>props.sort(e)}>ORb%</th>
        <th  data-tip = '% of available rebounds grabbed by defense' className = "click" id = "drb%" onClick = {(e)=>props.sort(e)}>DRb%</th>
        <th  data-tip = '% of FGM on assists' className = "click" id = "ast%" onClick = {(e)=>props.sort(e)}>AST%</th>
        <th  data-tip = 'assists per possession' className = "click" id = "a/poss" onClick = {(e)=>props.sort(e)}>A/Poss</th>
        <th  data-tip = '% of poss<br />ending with TO' className = "click" id = "tov%" onClick = {(e)=>props.sort(e)}>TOV%</th>
      </tr>
      {props.array.map((x,i) => {
        return (
          <tr key ={i}>
            <td id = 'pre'>{x.lineup.replace(/-/g, '\n')}</td>
            <td>{Math.floor((x.possFor+x.possAgainst)/2)}</td>
            <td>{Math.round((x.pointsFor/((x.possFor+x.possAgainst)/2))*100)}</td>
            <td>{Math.round((x.pointsAgainst/((x.possFor+x.possAgainst)/2))*100)}</td>
            <td>{Math.round((x.offRebFor)/(x.offRebFor + x.defRebAgainst)*100)}%</td>
            <td>{Math.round((x.defRebFor)/(x.defRebFor + x.offRebAgainst)*100)}%</td>
            <td>{Math.round((x.assistsFor/(x.madeTwosFor + x.madeThreesFor))*100)}%</td>
            <td>{parseFloat((x.assistsFor/((x.possFor+x.possAgainst)/2))).toFixed(3)}</td>
            <td>{Math.round((x.turnoversFor/((x.possFor+x.possAgainst)/2))*100)}%</td>
          </tr>
          )
        })
      }
      <tr>
        <td>Total</td>
          <td>{Math.floor((props.total.possFor+props.total.possAgainst)/2)}</td>
          <td>{Math.round((props.total.pointsFor/((props.total.possFor+props.total.possAgainst)/2))*100)}</td>
          <td>{Math.round((props.total.pointsAgainst/((props.total.possFor+props.total.possAgainst)/2))*100)}</td>
          <td>{Math.round((props.total.offRebFor)/(props.total.offRebFor + props.total.defRebAgainst)*100)}%</td>
          <td>{Math.round((props.total.defRebFor)/(props.total.defRebFor + props.total.offRebAgainst)*100)}%</td>
          <td>{Math.round((props.total.assistsFor/(props.total.madeTwosFor + props.total.madeThreesFor))*100)}%</td>
          <td>{parseFloat((props.total.assistsFor/((props.total.possFor+props.total.possAgainst)/2))).toFixed(3)}</td>
          <td>{Math.round((props.total.turnoversFor/((props.total.possFor+props.total.possAgainst)/2))*100)}%</td>
      </tr>
      <ReactTooltip effect = 'solid' delayShow = {1000} multiline = {true}/>
    </tbody>
  }
  </table>
)

export default TableLayout
