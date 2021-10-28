let gradeToNumTable = {
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

let gradeArToEnTable = {
  "أ+": "A+",
  "أ": "A",
  "ب+": "B+",
  "ب": "B",
  "ج+": "C+",
  "ج": "C",
  "د+": "D+",
  "د": "D",
  "ه": "F"
}


function gradeToNum(grade){
  if(!(grade in gradeToNumTable)){ // Log into screen rather than console
    console.log(grade)
    console.log(`Grade not understood, use ${Object.keys(gradeToNumTable)}`)
    throw "GradeError";
  }
  return gradeToNumTable[grade]; 
}

function gradeArToEn(grade){
  if(grade in Object.values(gradeArToEnTable))
    return grade;
  if(!(grade in gradeArToEnTable)){ // Log into screen rather than console
    // console.log(grade);
    console.log(`Grade not understood, use ${Object.keys(gradeArToEnTable)}, skipping entry`)
    return null;
  }
  return gradeArToEnTable[grade]; 
}

function initBarWithJson(bar, json_path){
  let json = JSON.parse(data);
  // $.ajax({
  //   url: "data.json",
  //   dataType: 'text',
  //   async: false,
  //   success: function(data) {
  //     console.log(data)
  //     json = JSON.parse(data);
  //   },
  //   error: function(err) {
  //     json = JSON.parse(err["responseText"]);
  //   }
  // });
  
  // json = JSON.parse(json_path)
  let numSubs = Object.keys(json["اسم المقرر"]).length

  let curSemester = 1;
  for(i=0; i < numSubs; i++){
    [subName, id] = json["رمز المقرر"][i].split(" ");
    subDescription = json["اسم المقرر"][i];
    grade = json["التقدير"][i];
    hours = json["الساعات"][i];
    semester = json["الترم"][i];

    grade = gradeArToEn(grade);
    if(grade === null)
      continue;

    if(semester !== curSemester){
      curSemester = semester;
      bar.UI.funcs.addSemf();
    }

    bar.addSubject(new Subject(subName, id, grade, hours));
  }
}
