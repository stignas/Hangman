// html elementai

const displayElement = document.getElementById("display");
const msgElement = document.getElementById("error");
const inputWord = document.getElementById("input-word");
const inputGuess = document.getElementById("input-guess");
const submitWord = document.getElementById("submit-word");
const submitGuess = document.getElementById("submit-guess");
const livesElement = document.getElementById("lives");
const guessesElement = document.getElementById("used-letters");

const hangman = {
  theWord: [],
  displayWord: [],
  guesses: [],
  lives: ["❤️", "❤️", "❤️", "❤️", "❤️"],

  // funkcija resetint zaidima - isvalyt kintamuosius ir atvaizdavimo elementus
  reset() {
    this.theWord = [];
    this.guesses = [];
    this.displayWord = [];
    msgElement.innerText = "";
    displayElement.innerText = "";
    guessesElement.innerText = "";
  },

  // funkcija pagaut ivedama zodi spejimui

  getWord(word) {
    // tikrinam ar ivedamas zodis prasideda ir baigiasi raidemis
    if (/^[a-zA-Z]+$/.test(word.toLowerCase())) {
      // jei tenkinama salyga, raides po viena pushinam i masyva, dar karta patikrindami
      // ar simbolis yra raide
      for (let i = 0; i < word.length; i++) {
        if (/[a-zA-Z]/.test(word[i].toLowerCase())) {
          this.theWord.push(word[i].toLowerCase());
        } else return;
      }
    } else {
      // jei ivesti kiti simboliai, resetinam zaidima ir pranesam apie klaida
      this.reset();
      msgElement.innerText =
        "Galite įvesti tik vieną žodį naudodami tik raides";
    }
  },

  // funkcija patikrint pries pradedant zaidima ar turime zodi spejimui
  isWordEntered() {
    // tikrinam kokia masyvo reiksme (kad nebutu undefined ar null)
    if (
      this.theWord === undefined ||
      this.theWord === null ||
      this.theWord.length < 5
    ) {
      //jei zodzio nera, pranesam apie klaida
      msgElement.innerText = "Neįvestas žodis spėjimui";
      return false; // grazinam rezutata ar "true" - galim test, "false" - nutraukiam
    } else {
      return true;
    }
  },

  // funkcija paslepti spejama zodi atvaizdavimui
  hideWord(word) {
    this.displayWord = [];
    // i nauja masyva vietoj spejamo zodzio sudedam tiek simboliu, kiek yra zodyje
    for (let i = 0; i < word.length; i++) {
      this.displayWord.push("_"); // raide paslepiam po simboliu "_"
    }
    return this.displayWord.join(" ");
  },

  // "ekrano" atnaujinimo funkcija
  updateDisplay(text) {
    text = text.toString();
    displayElement.innerText = text;
  },

  // gyvybiu atnaujinimo funkcija
  updateLives(text) {
    text = text.toString();
    livesElement.innerHTML = text;
  },

  // panaudotu spejimu atnaujinimo funkcija
  updateGuesses(text) {
    text = text.toString();
    guessesElement.innerHTML = text;
  },

  // pacio zaidimo funkcija
  getGuess(char) {
    char = char.toLowerCase(); // pakeiciam spejama raide i mazaja
    msgElement.innerText = ""; // isvalom pranesimo elementa

    if (!this.theWord.includes(char) && !this.guesses.includes(char)) {
      // jeigu spejamos raides nera zodyje ir dar nebuvo speta
      // atimam gyvybe is gyvybiu masyvo ir atnaujinam atvaizdavima
      this.lives.pop();
      this.updateLives(this.lives.join(" "));
    }

    // tikrinam ar ivesta raide, o ne kitas simbolis
    if (char.toLowerCase() === char.toUpperCase()) {
      // pranesam apie klaida, jei yra
      msgElement.innerText = "Įveskite raidę.";
    } else if (this.guesses.includes(char)) {
      // patikrinam ar raide jau buvo speta, jei taip - pranesam apie klaida
      msgElement.innerText = "Šią raidę jau spėjote. Pasirinkite kitą raidę";
    } else {
      // jei ankstesnes salygos tenkinamos, spejima idedam i spejimu masyva
      this.guesses.push(char);
    }

    // praeinam kiekviena spejamo zodzio raide ir palyginam su spejimu
    // jeigu raides sutampa, paslepto zodzio masyve pakeiciam ta elementa spejama raide
    // tokiu budu atverciam atspeta raide
    this.theWord.forEach((v, i) => {
      if (v === char) {
        this.displayWord.splice(i, 1, v);
      }
    });
    // atvaizduojam rezutatus po spejimo
    this.updateGuesses(this.guesses);
    this.updateDisplay(this.displayWord.join(""));
  },
};

// pradziai del visa ko viska nuresetinam
hangman.reset();

// parodom, kiek gyvybiu yra
hangman.updateLives(hangman.lives.join(" "));

// mygtuko funkcija pagaut spejama zodi
submitWord.addEventListener("click", (e) => {
  hangman.reset();
  e.preventDefault();
  hangman.getWord(inputWord.value);
  // ivedus zodi nuresetinam input lauka
  inputWord.value = "";
  // ivesta zodi paslepiam ir parodom ekrane
  hangman.hideWord(hangman.theWord);
  hangman.updateDisplay(hangman.displayWord.join(""));
  // permetam "focus" i spejimo lauka
  inputGuess.focus();
});

// mygtuko funkcija priimt spejimui
submitGuess.addEventListener("click", (e) => {
  e.preventDefault();
  // patikrinam ar turim ivesta spejama zodi,
  // jei viskas ok, tesiam zaidima
  if (hangman.isWordEntered()) {
    // priimam spejima ir prasukam zaidima
    hangman.getGuess(inputGuess.value);
    // resetinam spejimo input'a
    inputGuess.value = "";
    // grazinam "focus" i spejimo lauka
    inputGuess.focus();
    // timeri panaudoju, kad graziau spetu atsinaujint visi rezultatu laukai
    // po paskutinio spejimo laimejimo ir pralaimejimo atveju
    setTimeout(() => {
      // patikrinam ar po spejimo visas spejamas zodis atitinka atvaizduojama zodi "ekrane"
      // po visu sekmingu spejimu rodomas pasleptas zodis turetu but jau pakeistas zodzio raidemis
      if (
        hangman.theWord.join("").toLowerCase() ===
        hangman.displayWord.join("").toLowerCase()
      ) {
        // pranesam apie laimejima, resetinam zaidima ir pranesam, kad galima zaist is naujo,
        // permetam "focus" antnaujo  zodzio ivedimo
        alert("<*> <*> <*> Laimejai!!! <*> <*> <*>");
        hangman.reset();
        msgElement.innerText = "Atspėjai! Įvesk žodį pradėti iš naujo.";
        inputWord.focus();
      }
      // jeigu po spejimo nelieka gyvybiu, poranesam apie pralaimejima,
      // resetinam ir pranesam, kad galima zaist is naujo, permetam "focus" antnaujo  zodzio ivedimo
      else if (hangman.lives.length === 0) {
        alert("<*> <*> <*> Pralaimėjai!!! <*> <*> <*>");
        hangman.reset();
        msgElement.innerText = "Neatspėjai! Įvesk žodį pradėti iš naujo.";
        inputWord.focus();
      }
    }, 100);
  }
});
