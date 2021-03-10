class Subject {
  constructor(name, id, grade, hrs, semester = null) {
    this.info = {
      name: name,
      id: id,
      grade: grade,
      hrs: hrs,
      semester: semester
    };
    this.points = gradeToNum(grade) * hrs;
    this.loss = 100 * hrs - this.points;
    this.pointsProp = this.points / (this.loss + this.points);
    //this.segment; // The proportion of rectangle it occupies
  }
}


class Bar {
  // Definitions
  // Rectangle: Is the outer box of the bar
  // Block: is a segment of the recantgle that consists of two parts
  //  Loss part, Points part. Which are both rectangles inside the block
  constructor(lossImg, bWProp = 0.8, bHProp = 0.3) {
    // Prop -> proportional to screen. size -> pixel number
    this.bProp = {
      w: bWProp,
      h: bHProp
    };
    this.bSizes = {
      w: bWProp * width,
      h: bHProp * height
    };
    this.topLeft = createVector( // Top left point of the rectangle
      (1 - this.bProp.w) / 2 * width,
      height * 0.38196601125 * 0.75
    );

    /* points -> Sum of all points (computed in calcSegments)
       list -> An ordered list of all Subjects
       weights -> An ordered list of all weights of all subjects (same ordering as list)
       semesters -> A list of indices refering to ends of each semester excluding the last end
         e.g. semesters=[3, 6], semesters: 1:list.slice(0,3) 2:list.slice(3,6) 3:list.slice(6,)
       segmentWidths -> An ordered list of the width of each subjects (same ordering as list)
    */
    this.subs = {
      points: 0,
      list: [],
      weights: [],
      semesters: ["tail"]
    };
    this.subs.semesters[-1] = -1;
    this.segmentWidths = [];

    this.UI = this.UI(); // Instantiates all UI elements
    this.config = {
      view: 'subs',
      info:{
        subs:{},
        sems:{}
      },
      colors:{
        loss: "crimson",
        text: {
          subs: "white",
          sems: "black"
        },
        rectColors:{ 
          subs:{},
          sems:{tail:"rgb(100, 50, 10)"}
        } // Filled at runtime
      }
    } // view: subs or semesters
    this.lossImg = lossImg; // Used in background of blocks
  }

  addSubject(sub, weight = 1) {
    let index = this.subs.list.length;
    this.subs.list.push(sub);
    this.subs.weights.push(weight);
    this.segmentWidths.push(0); // Push 0 to keep index consistent

    // Config data
    this.config.colors.rectColors.subs[index] = this.generateColorSub(index);
    this.config.info.subs[index] =  [`${sub.info.name} ${sub.info.id}`, sub.info.grade, sub.info.hrs].join("\n");
  }

  editWeights(indices, weights) {
    // weights   -> [0, 0, 0]
    // editWeights( [1, 3], [0.5, 0.3])
    // weights   -> [0.5, 0, 0.3]

    indices.forEach((index, i) =>
      this.subs.weights[index] = weights[i]
    );
  }

  calcSegments() {
    // Calculates sum of weighted points.
    this.subs.points = 0;
    this.subs.list.forEach((sub, i) =>
      this.subs.points += sub.points * this.subs.weights[i]
    )

    // Calculates all segment proportions, and updates them in their respective subjects (in subject.segment)
    // Then, updates this.segmentSizes with each subject's real width in the rectangle
    this.subs.list.forEach((sub, i) => {
      sub.segment = (sub.points * this.subs.weights[i]) / this.subs.points;
      this.segmentWidths[i] = sub.segment * this.bSizes.w;
    })
  }

  visualize() {
    // Drawing rectangle
    push()
    strokeWeight(1.2);
    stroke('black');
    fill(this.config.colors.loss);
    rect(this.topLeft.x, this.topLeft.y, this.bSizes.w, this.bSizes.h)
    //image(this.lossImg, topLeft.x, topLeft.y, this.bSizes.w, this.bSizes.h, 0, 0, this.bSizes.w * 5, this.bSizes.h * 5);
    pop()

    // Segmentation and drawing blocks
    this.visualize_blocks(this.config.view);

    // Drawing semesters
    this.visualize_semesters();
  }

  visualize_blocks(view) {
    // Call calcSegments first
    this.calcSegments()

    // draw blocks
    push()
    // textFont(inconsolata); TODO: Load another font
    textAlign(CENTER, CENTER);
    let lossHeight, p;
    switch(this.config.view){
      case "subs":
          let current;
          p = createVector(this.topLeft.x, this.topLeft.y);
          for (let i = 0; i < this.subs.list.length; i++) {
            this.fill("subs", i);
            current = this.subs.list[i];

            lossHeight = (1 - current.pointsProp) * this.bSizes.h;
            rect(p.x, p.y + lossHeight, this.segmentWidths[i], this.bSizes.h - lossHeight);

            if(this.segmentWidths[i] > 30){
              fill(this.config.colors.text.subs);
              let info = this.config.info.subs[i];
              text(info, p.x, p.y + lossHeight, this.segmentWidths[i], this.bSizes.h - lossHeight)
            }
            p = createVector(p.x + this.segmentWidths[i], p.y);
          }
          break;
      case "sems":
          p = createVector(this.topLeft.x, this.topLeft.y);
          let indices, curWidth;
          this.subs.semesters.forEach((semester, i) => {
            p.x += this.sumWidths(this.subs.semesters[i-1]);
            indices = this.semestersIndex(semester);
            if(indices[0] == this.subs.semesters[i-1]) // Check for empty tail
              curWidth = 0;
            else
              curWidth = this.total(this.segmentWidths, indices[0], indices[1]);        

            this.fill("sems", i, semester=="tail");

            lossHeight = this.sumLoss(indices[0], indices[1]);
            rect(p.x, p.y + lossHeight, curWidth, this.bSizes.h - lossHeight);
            if(curWidth > 30){
              fill(this.config.colors.text.sems);
              text(`Semester #${i+1}`, p.x, p.y + lossHeight, curWidth, this.bSizes.h - lossHeight);
            }
            p.x = this.topLeft.x;
          });
    }
    pop()
  }

  visualize_semesters() {
    let slicedList, curWidth, botLeft;
    this.subs.semesters.forEach((semester, i) => {
      if(semester != "tail"){
        curWidth = this.sumWidths(this.subs.semesters[i]);
        botLeft = p5.Vector.add(this.topLeft, createVector(curWidth, this.bSizes.h));
        line(botLeft.x, botLeft.y, botLeft.x, 100);
      }
    });
  }

  UI() {
    let funcs = {}; // UI Functions
    let ui = {}; // UI Elements

    // Functions
    funcs.addf = () => {
      this.addSubject(new Subject(
        ui.name.value(),
        ui.id.value(),
        ui.grade.value(),
        ui.hrs.value()));
      
      ui.name.value("");
      ui.id.value("");
      ui.grade.value("");
      ui.hrs.value("")
    };

    funcs.addSemf = () => {
      let len = this.subs.semesters.length;
      if (len > 0 &&
          this.subs.semesters[len - 2] == this.subs.list.length - 1) // Check for duplicate
        return;
      this.subs.semesters[len - 1] = this.subs.list.length - 1;
      this.subs.semesters.push("tail");
      
      // Config data
      this.config.colors.rectColors.sems[len-1] = this.generateColorSem(len-1);
      this.config.info.sems[len] = `Semester #${len}`;
    }
    
    funcs.chngView = () => {
      let v = this.config.view;
      switch(v){
          case "subs":
            this.config.view = "sems"; break;
          case "sems": 
            this.config.view = "subs"; break;
      }
    }

    // Elements
    let interpolation = constrain(1.233333 - width * height / 4800000, 1.1, 1.2);
    let botLeft = createVector(this.topLeft.x, // Aprox bottom left of rectangle
      this.topLeft.y + this.bSizes.h * interpolation);

    ui.add = createButton("➕");
    ui.add.position(botLeft.x, botLeft.y);
    ui.add.mousePressed(funcs.addf);

    let offset = 0;
    for (let temp of [
        ["name", "Title (CSC)"],
        ["id", "ID (212)"],
        ["grade", "Grade (A+\A\B+)"],
        ["hrs", "Hours (2)"]
      ]) {
      let field = temp[0],
        name = temp[1];
      ui[field] = createInput("");
      ui[field].attribute("placeholder", name);
      ui[field].position(botLeft.x + ui.add.width + offset, botLeft.y);
      ui[field].style("width", ((this.bSizes.w - ui.add.width) / 4 - 10) + "px");
      offset += (this.bSizes.w - ui.add.width) / 4;
    }

    ui.addSem = createButton("New semester");
    ui.addSem.position(botLeft.x, botLeft.y + ui.add.height * interpolation);
    ui.addSem.mousePressed(funcs.addSemf);
    
    ui.chngView = createButton("Change view");
    ui.chngView.position(botLeft.x + ui.addSem.width, botLeft.y + ui.add.height * interpolation);
    ui.chngView.mousePressed(funcs.chngView);
    
    ui.table = createDiv("");
    ui.table.style("box-shadow", "box-shadow: 0 0 20px rgba(0,0,0,2)");
    ui.table.style("background", "grey");
    ui.table.style("overflow-x", "hidden");
    ui.table.style("overflow-y", "scroll");
    ui.table.style("font-family", "monospace");
    ui.table.style("font-size", "20px");
    ui.table.position(botLeft.x, botLeft.y + ui.add.height * interpolation * 3);
    
    return {ui: ui, funcs: funcs};
  }

  // Helper functions
  
  semestersIndex(semester) { // Inclusive
    let semIndex = this.subs.semesters.indexOf(semester);
    let segLen =  this.segmentWidths.length;
    // Returns the starting and ending indices of subs belonging to semester
    switch (this.subs.semesters.length) {
      case 1:
        return [0, segLen - 1];
      case semIndex + 1:
        if(segLen - 1 == this.subs.semesters[semIndex - 1])  
          return [segLen - 1, segLen - 1];
        return [this.subs.semesters[semIndex - 1] + 1, segLen - 1];
      default:
        return [this.subs.semesters[semIndex - 1] + 1, semester];
    }
  }
  
  sliceSemesters(semester) { // Inclusive
    let indices = this.semesterIndex(semester);
    return this.subs.list.slice(indices[0], indices[1] + 1);  
  }
  
  total(inputList, start, end){ // Inclusive
    return inputList.slice(start, end+1).reduce((acc, w) => acc + w);
  }
  
  sumWidths(index){ // Inclusive
    if(index == -1)  return 0;
    return this.total(this.segmentWidths, 0, index);
  }
  
  sumLoss(start, end){ // Inclusive
    let total = end - start + 1;
    for(let i = start; i < end + 1; i++)
      total += -this.subs.list[i].pointsProp
    return total / (end - start + 1) * this.bSizes.h;
  }
  
  generateColor(i, rgb, threshold=50){ // rgb in the form: [r, g, b]
    let r, g, b;
    r = rgb[0] - threshold + i * 10 % threshold;
    g = rgb[1] - threshold + i * 20 % threshold;
    b = rgb[2] - threshold + i * 30 % threshold;
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  generateColorSem(i, threshold=50){
    return this.generateColor(i, [251, 235, 216]);
  }
  
  generateColorSub(i, threshold=70){
    return this.generateColor(i, [150, 123, 120]);
  }
  
  fill(type, i, tail=false){
    switch(type){
      case "sems":
        if(!tail)
          fill(this.config.colors.rectColors.sems[i]);
        else
          fill(this.config.colors.rectColors.sems.tail);
        break;
      case "subs":
        fill(this.config.colors.rectColors.subs[i]);
    }
  }
}