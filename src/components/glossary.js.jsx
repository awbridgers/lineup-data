import React from 'react';

export const Glossary = (props)=>(
  <div className = 'glossary'>
    <div>
      <h2>Glossary</h2>
    </div>
    <table className = 'terms'>
      <tbody>
        <tr>
          <th rowSpan = '2'>Poss</th>
          <td>An estimate of the number of possesions.</td>
        </tr>
        <tr>
          <td className = 'eq'>FGA + TO - Off Reb + (0.475 * FTA)</td>
        </tr>
        <tr>
          <th rowSpan = '2'>ORtg</th>
          <td>Offensive Rating - points per 100 possessions</td>
        </tr>
        <tr>
          <td className = 'eq'>Points / Possesions * 100</td>
        </tr>
        <tr>
          <th rowSpan = '2'>DRtg</th>
          <td>Defensive Rating - points allowed per 100 possessions</td>
        </tr>
        <tr>
          <td className = 'eq'>Points Allowed / Possesions * 100</td>
        </tr>
        <tr>
          <th rowSpan = '2'>Orb%</th>
          <td>Offensive Rebounding Percent - Percent of available offensive rebounds grabbed</td>
        </tr>
        <tr>
          <td className = 'eq'>Off Reb / (Off Reb + Opp Def Reb)</td>
        </tr>
        <tr>
          <th rowSpan = '2'>Drb%</th>
          <td>Defensive Rebounding Percent - Percent of available defensive rebounds grabbed</td>
        </tr>
        <tr>
          <td className = 'eq'>Def Reb / (Def Reb + Opp Off Reb)</td>
        </tr>
        <tr>
          <th rowSpan = '2'>Ast%</th>
          <td>Assist Percent - Percent of made shots coming from assists</td>
        </tr>
        <tr>
          <td className = 'eq'>Assists / Field Goals Made</td>
        </tr>
        <tr>
          <th rowSpan = '2'>A/Poss</th>
          <td>Assists per Possession</td>
        </tr>
        <tr>
          <td className = 'eq'>Assists / Possessions</td>
        </tr>
        <tr>
          <th rowSpan = '2'>TOV%</th>
          <td>Turnover Percent - Percent of possessions ending in a turnover</td>
        </tr>
        <tr>
          <td className = 'eq'>Turnovers / Possessions * 100 %</td>
        </tr>
      </tbody>
    </table>
  </div>
)
