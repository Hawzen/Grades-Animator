let bar;
let t = -1;
let metalImg;

/*
  * Data entry in-game ➕
  * Interface for data showing
      Make font appear on semesters
      Add flags of semesters detailing the semester number
      Make text disspear once the width of the rectangle is small
      Investigate best font to use
      Investigate weather to put a log of subs on the right or not
      Add config for colors
        Apply color config on subs, semesters, text, etc.
  * Different views (semester view, subs view) 
  * Refactor the code
  * General statistics (best sub, worst sub)
  * Hypothetical scenario (based on remaining hours)
  * Grade probability distribution
  * Polynomial interpolation
  * Touch screen support
*/

function preload(){
  metalImg = loadImage("metal.png");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(70);
  bar = new Bar(metalImg);
  bar.addSubject(new Subject("CHEM", "XXX", "B+", 1))
  bar.addSubject(new Subject("MATH", "106", "B", 2))
  bar.addSubject(new Subject("MATH", "106", "B", 2))
  bar.UI.funcs.addSemf();
  bar.addSubject(new Subject("MATH", "106", "F", 2))
  bar.addSubject(new Subject("MATH", "106", "B", 5))
  bar.UI.funcs.addSemf();
  bar.addSubject(new Subject("MATH", "106", "A+", 2))
  bar.addSubject(new Subject("MATH", "106", "F", 2))

}

function draw() {
  background(70);
  if(t >= 1)
    t = -1;
  else
    t += 0.01;
  bar.editWeights([2, 4], [max(abs(t), 0.5), (max(abs(t), 0.2))-0.2]);
  bar.visualize()
}
