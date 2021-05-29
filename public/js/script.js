
const questionBank=[
    {
        question:"1)I feel very low of myself",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"2)I feel irritated about myself",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"3)I feel quite helpless about myself",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"4)It becomes difficult for me to wind down.",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"5)I often experience trembling and dryness in mouth",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"6)I often feel negative about myself.",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"7)I find it difficult to start my day.",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"8)I am unable to control about myself",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"9)I feel nervous",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    },
    {
        question:"10)My nervous energy impacts my daily life.",
        a:"Most Often",
        b:"Frequently",
        c:"Sometimes",
        d:"Not at all"
    }
]

const question=document.querySelector('#ques');
const opt1=document.querySelector('#option1');
const opt2=document.querySelector('#option2');
const opt3=document.querySelector('#option3');
const opt4=document.querySelector('#option4');
const button=document.querySelector('#btn');
const answers=document.querySelectorAll('.answer');
const result=document.querySelector('#result');
const remark=document.querySelector('#remark')
const input=document.getElementById('score');
const end=document.getElementById('end');


let count=0;
let score=0;
const display=()=>{
    const questionList=questionBank[count];
    question.innerHTML=questionList.question;
    opt1.innerHTML=questionList.a;
    opt2.innerHTML=questionList.b;
    opt3.innerHTML=questionList.c;
    opt4.innerHTML=questionList.d;
}

display();
// let flag=true;

const checkAnswer=()=>{
    let answer;
    // for(let i=0;i<answers.length;i++){

    //     if(answers[i].checked){
    //         answer=answers[i].id;
    //         break;
    //     }
    //     else{
    //         flag=false
    //     }
    // }
    answers.forEach((choice)=>{
        if(choice.checked){
            answer=choice.id;
        }
        // else{
        //     flag=false
        // }
    });
    return answer;
}

const deselectAll=()=>{
    answers.forEach((choice)=>{
        choice.checked=false
    })
}

button.addEventListener('click',()=>{
    const check=checkAnswer();
    
    // if(flag===false)
    // {
    //     event.preventDefault();
    //     alert("select dropdown option");
    //     checkAnswer();
    // } 

    // else{
        if(check==='ans1'){
        score++;
    };
    if(check==='ans2'){
        score=score+2;
    };
    if(check==='ans3'){
        score=score+3;
    };
    if(check==='ans4'){
        score=score+4;
    };

    count++;
    // }
    if(count==10)
    {
        button.classList.add('displayNone');
        end.classList.remove('displayNone')
    }
    
    
    
    deselectAll();
    if(count<questionBank.length){
        display();
    }
    else{
        
        input.value=score

        result.innerHTML=
        `<h3>You scored ${score}/40 </h3>`;

        if(score>=1 && score<=5){
            remark.innerHTML=
            'Extreme depression';
        
        }
        if(score>=6 && score<=10){
            remark.innerHTML=
        'Mild mood disturbance';
        }
        if(score>=11 && score<=15){
            remark.innerHTML=
            'Severe Depression';
        
        }
        if(score>=16 && score<=20){
            remark.innerHTML=
        'Moderate depression';
        }
        if(score>=21 && score<=30){
            remark.innerHTML=
        'Borderline clinical depression';
        }
        if(score>=30){
            remark.innerHTML=
        'These ups and downs are considered normal';
        }
        showScore.classList.remove('scoreArea');
    }
})