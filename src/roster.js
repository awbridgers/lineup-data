import lineupClass from './lineupClass.js'
let roster = [
  "Brandon Childress",
  "Isaiah Mucius",
  "Sharone Wright",
  "Torry Johnson",
  "Jaylen Hoard",
  "Andrien White",
  "Michael Wynn",
  "Jamie Lewis",
  "Chaundee Brown",
  "Blake Buchanan",
  "Olivier Sarr",
  "Ikenna Smart",
  "Sunday Okeke",
  "Anthony Bilas",
  "Aaron Spivey",

];
let classArray = [];
roster.forEach((name)=>{
  classArray.push(new lineupClass(name))
});

export const rosterClass = classArray;

export default roster;
