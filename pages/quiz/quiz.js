const quesContainer = document.querySelector('.container');

const timerElement = document.getElementById('timer');
const quizDuration = 10 * 60; // the quiz duration in sec.

const baseUrl = "https://quiz-api-mg7a.onrender.com";

let remainingTime = quizDuration;
let intervalId;

const obj = {};
const getQueryObj = function(url=location.href) {
    const newUrl = url.split('?')[1];
    const arr = newUrl.split('&');
    for(let i = 0; i < arr.length; i++){
        const [key, val] = arr[i].split('=');
        obj[key] = val;
    }
    return obj;
};

getQueryObj();

document.querySelector('.title').innerHTML = obj.quiz;

const link = baseUrl + "/quiz/" + obj.quiz;

function quesHtml(quesObj, index) {

    const correctA = ['a', 'b', 'c', 'd'];

    return `
    <div class="ques">
        <h2 class="ques-title" data-ques=${index}>Q${index}. ${quesObj.ques}</h2>
        <div class="options">
            <input class="option" data-index="0" type="button" value="a. ${quesObj.options[0]}">
            <input class="option" data-index="1" type="button" value="b. ${quesObj.options[1]}">
            <input class="option" data-index="2" type="button" value="c. ${quesObj.options[2]}">
            <input class="option" data-index="3" type="button" value="d. ${quesObj.options[3]}">
        </div>
        <div class='hidden explain' id='explain'>
          <h3>Explanation:</h3>
          <p>Correct Answer: ${correctA[quesObj.correctAnswer]}</p>
          <p>${quesObj.explanation}</p>
        </div>
    </div>
    `;
}

function removePrevClickedOption(parent) {
  const children = [...parent.children];

  for (let ele of children) {
    ele.classList.remove('clicked');
  }

}

function getResult(obj, arr) {
  let correctAns = 0;
  let incorrectAns = 0;

  for(let i = 0; i < arr.length; i++) {
    if(!obj[i+1]) continue;

    if (obj[i+1] != arr[i].correctAnswer) {
      incorrectAns++;
    } else {
      correctAns++;
    }
}
  return {
    correctAns: correctAns,
    incorrectAns: incorrectAns,
    totalAttempted: correctAns + incorrectAns
  }
}

const fetchQuizData = function (link) {
   fetch(link)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); 
  })
  .then(result => {
    const arr = result.data;
    for(let i = 0; i < arr.length; i++) {
        quesContainer.insertAdjacentHTML('beforeend', quesHtml(arr[i], i+1));
    }

    ///////////////////////////////////////////////////////////////////////////
    // timer logic

    // const timerElement = document.getElementById('timer');
    // const quizDuration = 180; // the quiz duration in sec.

    // let remainingTime = quizDuration;
    // let timeInterval;

    // function to update and display the timer.

    function clearTimer() {
      clearInterval(intervalId);
      timerElement.innerHTML = "Time Left: 00:00";
    }

    function updateTimer() {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;

      timerElement.innerHTML = `Time Left: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if(remainingTime === 0) {
        clearTimer();

        document.querySelector('#submit').click();
      }

      remainingTime--;
    }

    // Call the updateTimer function initially to set the initial time
    updateTimer();

    // Start the timer interval
    intervalId = setInterval(updateTimer, 1000);


    ///////////////////////////////////////////////////////////////////////////
    quesContainer.insertAdjacentHTML('beforeend', `<div class="center submit-quiz"><button id="submit" class ="btn submit">Submit</button></div>`);

    const inputField = document.querySelectorAll('.options');
    
    console.log(inputField);

    const ansObj = {};

    for(let j = 0; j < inputField.length; j++) {
        inputField[j].addEventListener('click', function(e) {
            const clickedOption = e.target.dataset.index;
            const isOptionClicked = e.target.classList.contains('option');
            
            if (!isOptionClicked) return;

            const parentEle = inputField[j].closest('.ques'); 
            const quesNum = parentEle.querySelector('h2').dataset.ques;
            console.log(quesNum);

            console.log(`ques ${quesNum} option ${clickedOption} is clicked`);

            ansObj[quesNum] = clickedOption;

            console.log(ansObj);

            removePrevClickedOption(e.target.parentElement);

            e.target.classList.add('clicked');
            
        });
    }

    document.querySelector('#submit').addEventListener('click', function(e) {
      e.target.classList.add('disabled');
      clearTimer();

      const quesList = document.querySelectorAll('.ques');
      const optionsList = document.querySelectorAll('.options');

      for (let i = 0; i < quesList.length; i++) {
        let selected = parseInt(ansObj[i+1]);
        let correct = arr[i].correctAnswer;
        let options = quesList[i].querySelectorAll('.option');

        optionsList[i].classList.add('disabled');

        if (!selected && selected !== 0) {
          // add class green on the correct option
          options[correct].classList.add('green');
          continue;
        }

        if (selected === correct) {
          // Add class green on the selected option
          options[correct].classList.add('green');
        } else {
          // add class red on the selected option
          options[correct].classList.add('green');
          // add class green on the correct option
          options[selected].classList.add('red');
        }
      }

      const {correctAns, incorrectAns, totalAttempted} = getResult(ansObj, arr);  
      const explanations = document.querySelectorAll('#explain');
      explanations.forEach(explanation => {
          explanation.classList.remove('hidden'); // Hide explanations on submit
      });
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result');
      resultDiv.innerHTML = `
          <p class='reslt'>Total Attempted:👍${totalAttempted}</p>
          <p class='reslt'>Correct answer:✅${correctAns}</p>
          <p class='reslt'>Wrong answer:❌${incorrectAns}</p>
          <p class='reslt'>Total Score: ${correctAns * 2}</p>
      `;
      document.body.insertBefore(resultDiv, quesContainer); 
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}
fetchQuizData(link);





/*
// allow user to select an option
// allow user to submit the quiz
// show result on result page
// work on mongodb to store ques on db
// enhance node api to fetch data from db not from hardcoded data
// work on other topics
// build admin page for CRUD operation on ques

const quesContainer = document.querySelector('.container');

const obj = {};
const getQueryObj = function(url=location.href) {
    const newUrl = url.split('?')[1];
    const arr = newUrl.split('&');
    for(let i = 0; i < arr.length; i++){
        const [key, val] = arr[i].split('=');
        obj[key] = val;
    }
    return obj;
};

getQueryObj();

// putting the value inside the heading which is inside the quiz.html 
// whatever i click on the topic it goes to heading h1 and print it.using above function.
document.querySelector('.title').innerHTML = obj.quiz;


// make the api request for obj.quiz
const link = "http://localhost:3000/quiz/" + obj.quiz;

function quesHtml(quesObj, index) {
    return `
    <div class="ques">
        <h2 class="ques-title" data-ques=${index}>Q${index}. ${quesObj.ques}</h2>
        <div class="options">
            <input class="option" data-index="0" type="button" value="a. ${quesObj.options[0]}">
            <input class="option" data-index="1" type="button" value="b. ${quesObj.options[1]}">
            <input class="option" data-index="2" type="button" value="c. ${quesObj.options[2]}">
            <input class="option" data-index="3" type="button" value="d. ${quesObj.options[3]}">
        </div>
        <div class='hidden explain' id='explain'>
          <h3>Explanation:</h3>
          <p>${quesObj.explanation}</p>
        </div>
    </div>
    `;
}

function removePrevClickedOption(parent) {
  const children = [...parent.children];

  for (let ele of children) {
    ele.classList.remove('clicked');
  }

}

function getResult(obj, arr) {
  let correctAns = 0;
  let incorrectAns = 0;

  for(let i = 0; i < arr.length; i++) {
    if(!obj[i+1]) continue;

    if (obj[i+1] != arr[i].correctAnswer) {
      incorrectAns++;
    } else {
      correctAns++;
    }
}
  return {
    correctAns: correctAns,
    incorrectAns: incorrectAns,
    totalAttempted: correctAns + incorrectAns
  }
}


// By handling the error.
const fetchQuizData = function (link) {
   fetch(link)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // console.log(response);
    return response.json(); // Assuming the response is in JSON format
  })
  .then(result => {
    // Now you can work with the data
    const arr = result.data;
    console.log(arr);
    

    for(let i = 0; i < arr.length; i++) {
        // document.querySelector('.explain').classList.add('hidden');
        quesContainer.insertAdjacentHTML('beforeend', quesHtml(arr[i], i+1));
    }
    quesContainer.insertAdjacentHTML('beforeend', `<button id="submit" class ="btn submit">Submit</button>`);

    const inputField = document.querySelectorAll('.options');
    
    console.log(inputField);

    const ansObj = {};

    for(let j = 0; j < inputField.length; j++) {
        inputField[j].addEventListener('click', function(e) {
            const clickedOption = e.target.dataset.index;
            const isOptionClicked = e.target.classList.contains('option');
            
            if (!isOptionClicked) return;

            const parentEle = inputField[j].closest('.ques'); // Find the just nearest parent element of option.
            const quesNum = parentEle.querySelector('h2').dataset.ques;// Get the question of selected option.
            console.log(quesNum);

            console.log(`ques ${quesNum} option ${clickedOption} is clicked`);

            ansObj[quesNum] = clickedOption;

            console.log(ansObj);

            // e.target.style.backgroundColor = 'red';

            // remove all clicked for this ques
            removePrevClickedOption(e.target.parentElement);

            e.target.classList.add('clicked');
            
        });
    }

    document.querySelector('#submit').addEventListener('click', function(e) {
      e.target.disabled = true;
       // Disable the submit button
      e.target.classList.add('disabled');
      // Disable options
      
      const quesList = document.querySelectorAll('.ques');
      const optionsList = document.querySelectorAll('.options');

      for (let i = 0; i < quesList.length; i++) {
        let selected = parseInt(ansObj[i+1]);
        let correct = arr[i].correctAnswer;
        let options = quesList[i].querySelectorAll('.option');

        optionsList[i].classList.add('disabled');

        if (!selected && selected !== 0) {
          // add class green on the correct option
          options[correct].classList.add('green');
          continue;
        }

        if (selected === correct) {
          // Add class green on the selected option
          options[correct].classList.add('green');
        } else {
          // add class red on the selected option
          options[correct].classList.add('green');
          // add class green on the correct option
          options[selected].classList.add('red');
        }
      }

      const {correctAns, incorrectAns, totalAttempted} = getResult(ansObj, arr);  
      const explanations = document.querySelectorAll('#explain');
      explanations.forEach(explanation => {
          explanation.classList.remove('hidden'); // Hide explanations on submit
      });

      // Method-1 to create result div
      // const res = `
      //   <div class="result">
      //       <p>Total Attempted: ${totalAttempted}</p>
      //       <p>Correct answer:✅ ${correctAns}</p>
      //       <p>Wrong answer:❌ ${incorrectAns}</p>
      //   </div>
      // `;
       // e.target.insertAdjacentHTML("afterend", res);
      // var heading = document.querySelector('.title');
      // var nextSibling = heading.nextElementSibling;
      // nextSibling.append = e.target.insertAdjacentHTML("afterend", res);
      // document.body.insertBefore(res, document.body.firstChild);

      // method-2 Create the result div
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result');
      resultDiv.innerHTML = `
          <p class='reslt'>Total Attempted:👍${totalAttempted}</p>
          <p class='reslt'>Correct answer:✅${correctAns}</p>
          <p class='reslt'>Wrong answer:❌${incorrectAns}</p>
          <p class='reslt'>Total Score: ${correctAns * 2}</p>
      `;

      // Insert the result div at the top of the body
      document.body.insertBefore(resultDiv, document.body.firstChild);

      
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}

fetchQuizData(link);
*/
    