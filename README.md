# Grades-Animator
### Animate your grades! try it out https://hawzen.me/candy_bar (desktop recommended!)

![demo](https://i.imgur.com/GtRxDMN.png)

# Guide
### For every subject you want to add write a title, id, grade (A+,A,B+,...,F scheme), hours (weight of class) and hit the plus button on the left
<!-- <br/> -->
### Click 'Add Semester' to start a new semeseter and group the last subjects on their own 
<!-- <br/> -->
### After finishing click 'Animate'
<!-- <br/> -->

## Running locally
### To run this app locally you need to run your own server, you could execute `python -m http.server 8000` from the root of the repo, then go to http://127.0.0.1:8000/ and see the app running

## Automatically add all subjects
### If you're studying in KSU you can follow the following steps to add all your history, or just do it manually (pre-reqs: python, pandas, numpy)
* Sign in Edugate > `Academic` > `Academic history` > Save the page and rename the html file to whatever name you want then place it at the root of this repo
* run `python extract_data.py YOUR_FILE_NAME.html`
* Make sure the output is in the root of the repo. Then run the site locally
