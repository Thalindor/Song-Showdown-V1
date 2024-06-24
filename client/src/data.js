const nameList = [
    'John Cena', 'R-Truth', 'Triple H', 'Shawn Michaels', 'Hulk Hogan',
    'Undertaker', 'Micheal Jackson', 'Brock Lesnar', 'Santino Marella', 'Snoop Dogg'
  ]

export const questionList = [];
export const answerList = {};

  for(let i = 0; 5 > i; i++){
    /* Rastgele Soruları Belirleme */
    let randomNumber = Math.floor(Math.random() * nameList.length);
    questionList.push(nameList[randomNumber])
    /* nameList.splice(randomNumber, 1) */
    /*- Rastgele Soruları Belirleme -*/


    
    let answerOptionList = [
      'John Cena', 'R-Truth', 'Triple H', 'Shawn Michaels', 'Hulk Hogan',
      'Undertaker', 'Micheal Jackson', 'Brock Lesnar', 'Santino Marella', 'Snoop Dogg'
    ]

    const indexToRemove = answerOptionList.indexOf(nameList[randomNumber]);
    if (indexToRemove !== -1) {
      answerOptionList.splice(indexToRemove, 1);
    }

    
    const optionList = ['a', 'b', 'c', 'd'];
    const optionRandomNumber = Math.floor(Math.random() * optionList.length);

    /* console.log(answerList[nameList[randomNumber]]) */
    
    answerList[nameList[randomNumber]] = {
      [optionList[optionRandomNumber]]: nameList[randomNumber]
    };

    answerOptionList.splice(randomNumber, 1)
    optionList.splice(optionRandomNumber, 1);
    
    /* */
    
    for (let i = 0; i < 3; i++) {
      const newOptionRandomNumber = Math.floor(Math.random() * optionList.length);
      const answerOptionRandomNumber = Math.floor(Math.random() * answerOptionList.length);
      answerList[nameList[randomNumber]][optionList[newOptionRandomNumber]] = answerOptionList[answerOptionRandomNumber];

      answerOptionList.splice(answerOptionRandomNumber, 1)
      optionList.splice(newOptionRandomNumber, 1);
    }
    
    nameList.splice(randomNumber, 1)
    /* console.log(answerOptionList) */
    
  }

