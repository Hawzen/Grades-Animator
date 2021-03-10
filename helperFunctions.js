let translationTable = {
  "A+"  : 100,
  "A"   : 95,
  "B+"  : 90,
  "B"   : 85,
  "C+"  : 80,
  "C"   : 75,
  "D+"  : 70,
  "D"   : 65,
  "F"   : 60
}

function gradeToNum(grade){
  if(!(grade in translationTable)){ // Log into screen rather than console
    console.log(`Grade not understood, use ${Object.keys(translationTable)}`)
    throw "GradeError";
  }
  return translationTable[grade]; 
}
