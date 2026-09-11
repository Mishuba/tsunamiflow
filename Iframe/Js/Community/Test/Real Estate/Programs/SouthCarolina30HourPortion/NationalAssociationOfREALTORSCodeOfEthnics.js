class Exam {
constructor(Question, Answer, Logic) {
this.Question = Question,
this.Answer = Answer,
this.Logic = Logic;
}
};

var exam1 = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);
var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);
var exam = new Exam(

);

var exam = new Exam(

);

var exam = new Exam(

);
var exam = new Exam(

);

var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);

var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);
var exam = new Exam(

);

var hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions = new Array(

);


var TestQuestion = document.getElementById("Question");
var Answer1 = document.getElementById("A");
var Answer2 = document.getElementById("B");
var Answer3 = document.getElementById("C");
var Answer4 = document.getElementById("D");

var AnswerKey = new Array   (
Answer1, 
Answer2, 
Answer3, 
Answer4
    );
var RandomAnswer;

let Result = document.getElementById("Result");
let Explanation = document.getElementById("Explanation");

var RandomQuestion;

var WrongAnswer1;
var WrongAnswer2;
var WrongAnswer3;
var RandomWA1;
var RandomWA2;
var RandomWA3;
var CurrentExam;

function UnitExamNationalAssociationOfREALTORSCodeOfEthnics() {
RandomAnswer = Math.floor((Math.random() * AnswerKey.length));
RandomQuestion = Math.floor((Math.random() * Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions.length));
CurrentExam = Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions[RandomQuestion];
ChooseSpot = AnswerKey[RandomAnswer];
RandomWA1 = Math.floor((Math.random() * Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions.length));
RandomWA2 = Math.floor((Math.random() * Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions.length));
RandomWA3 = Math.floor((Math.random() * Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions.length));
WrongAnswer1 = Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions[RandomWA1];
WrongAnswer2 = Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions[RandomWA2];
WrongAnswer3 = Hr30UnitNationalAssociationOfREALTORSCodeOfEthnicsQuestions[RandomWA3];
if (ChooseSpot == Answer1) {
TestQuestion.innerHTML = "Question: " + CurrentExam.Question;
ChooseSpot.innerHTML = "A.) " + CurrentExam.Answer;
Answer2.innerHTML = "B.) " + WrongAnswer1.Answer;
Answer3.innerHTML = "C.) " + WrongAnswer2.Answer;
Answer4.innerHTML = "D.) " + WrongAnswer3.Answer;
Result.innerHTML = "Result: " + "";
Explanation.innerHTML = "Explanation: " 
} else if (ChooseSpot == Answer2) {
TestQuestion.innerHTML = "Question: " + CurrentExam.Question;
Answer1.innerHTML = "A.) " + WrongAnswer1.Answer;
ChooseSpot.innerHTML = "B.) " + CurrentExam.Answer;
Answer3.innerHTML = "C.) " + WrongAnswer2.Answer;
Answer4.innerHTML = "D.) " + WrongAnswer3.Answer;
Result.innerHTML = "Result: " + "";
Explanation.innerHTML = "Explanation: " 
} else if (ChooseSpot == Answer3) {
TestQuestion.innerHTML = "Question: " + CurrentExam.Question;
Answer1.innerHTML = "A.) " + WrongAnswer1.Answer;
Answer2.innerHTML = "B.) " + WrongAnswer2.Answer;
ChooseSpot.innerHTML = "C.) " + CurrentExam.Answer;
Answer4.innerHTML = "D.) " + WrongAnswer3.Answer;
Result.innerHTML = "Result: " + "";
Explanation.innerHTML = "Explanation: "
} else if (ChooseSpot == Answer4) {
TestQuestion.innerHTML = "Question: " + CurrentExam.Question;
Answer1.innerHTML = "A.) " + WrongAnswer1.Answer;
Answer2.innerHTML = "B.) " + WrongAnswer2.Answer;
Answer3.innerHTML = "C.) " + WrongAnswer3.Answer;
ChooseSpot.innerHTML = "D.) " + CurrentExam.Answer;
Result.innerHTML = "Result: " + "";
Explanation.innerHTML = "Explanation: " 
} else {
TestQuestion.innerHTML = "Question: " + CurrentExam.Question;
Answer1.innerHTML = "A.) " + "";
Answer2.innerHTML = "B.) " + "";
Answer3.innerHTML = "C.) " + "";
Answer4.innerHTML = "D.) " + "";
Result.innerHTML = "Result: " + "It did not work bro.";
Explanation.innerHTML = "Explanation: " + ""
}
};

function SubmitAnswer() {
let TheAnswer = prompt(Answer1.innerHTML + "<br>" + Answer2.innerHTML + "<br>" + Answer3.innerHTML + "<br>" + Answer4.innerHTML);
        if (TheAnswer == ChooseSpot.innerHTML.substring(0,1)) {
        Result.innerHTML = "Result: " + TheAnswer + " - " + CurrentExam.Answer + " is correct";
        Explanation.innerHTML = "Explanation: " + CurrentExam.Logic
    } else {
        Result.innerHTML = "Result: " + TheAnswer + " is incorrect";
        Explanation.innerHTML = "Explanation: " + CurrentExam.Logic
    }
};