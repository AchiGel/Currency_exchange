"use strict";

const fromFlagImg = document.querySelector(".from label img");
const toFlagImg = document.querySelector(".to label img");
const fromContainer = document.querySelector(".from");
const toContainer = document.querySelector(".to");
const currency = document.getElementsByTagName("select");
const exchBtn = document.querySelector(".exchange button");
const fromThis = document.querySelector("#from-this");
const toThis = document.querySelector("#to-this");
const exchangeRate = document.querySelector("#exchange-rate");
const fromInput = document.querySelector("#fromInput");
const toInput = document.querySelector("#toInput");
const fromCard = document.querySelector("#from-card");
const toCard = document.querySelector("#to-card");

async function handleCurrencyCard() {
  //--------------------- currencies url ---------------------------//
  const urlCurrency = "https://currency-exchange.p.rapidapi.com/listquotes";
  const optionsCurrency = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "5849cc1259msha2589a602e17f88p165182jsn6474f0650187",
      "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
    },
  };

  //--------------------- currencies url ---------------------------//

  //---------------------- flags url -------------------------------//

  const urlFlags =
    "https://gist.githubusercontent.com/pratikbutani/20ded7151103bb30737e2ab1b336eb02/raw/be1391e25487ded4179b5f1c8eedb81b01226216/country-flag.json";

  //---------------------- flags url -------------------------------//

  try {
    //------------------- fetching currencies data-----------------------------------//
    const responseCurr = await fetch(urlCurrency, optionsCurrency);
    const result = await responseCurr.json();
    await result.forEach((curr) => {
      let currentCurrency = `<option value="${curr}">${curr}</option>`;
      currency[0].innerHTML += currentCurrency;
      currency[1].innerHTML += currentCurrency;
    });

    // let currentOption = currency[0].selectedOptions[0].textContent;
    //------------------- fetching currencies data-----------------------------------//

    //------------------- fetching currency rate --------------------------------//

    async function fetchingCurrencyRate(from, to) {
      const urlRate = `https://currency-exchange.p.rapidapi.com/exchange?from=${from}&to=${to}&q=1.0`;
      const optionsRate = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "5849cc1259msha2589a602e17f88p165182jsn6474f0650187",
          "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
        },
      };

      try {
        const responseRate = await fetch(urlRate, optionsRate);
        const resultRate = await responseRate.text();
        return Number(resultRate).toFixed(2);
      } catch (error) {
        console.log(error);
      }
    }

    //------------------- fetching currency rate --------------------------------//

    //------------------- fetching Flags data ----------------------------------------//

    const responseFlag = await fetch(urlFlags);
    const data = await responseFlag.json();

    //----------------- Changing flags ------------------------------//

    currency[0].addEventListener("change", (event) => {
      let currentOption = event.target.value;

      data.forEach((flagNeeded) => {
        if (currentOption.toLowerCase().startsWith(flagNeeded.code)) {
          fromFlagImg.src = flagNeeded.flag;
        }
      });
      fromThis.textContent = currentOption;
    });

    currency[1].addEventListener("change", async (event) => {
      let currentOption = event.target.value;

      data.forEach((flagNeeded) => {
        if (currentOption.toLowerCase().startsWith(flagNeeded.code)) {
          toFlagImg.src = flagNeeded.flag;
        }
      });

      toThis.textContent = currentOption;

      const rateCurrent = await fetchingCurrencyRate(
        fromThis.textContent,
        toThis.textContent
      );

      if (fromThis.textContent == toThis.textContent) {
        exchangeRate.textContent = "1";
      } else {
        exchangeRate.textContent = rateCurrent;
      }
    });

    //----------------- Changing flags ------------------------------//

    //------------------- fetching Flags data ----------------------------------------//
    //------------------------- handling with input fields value ------------------------//
    fromInput.placeholder = "0";
    toInput.placeholder = "0";

    fromInput.addEventListener("input", (e) => {
      toInput.value = Number(
        e.target.value * Number(exchangeRate.textContent)
      ).toFixed(2);
    });

    toInput.addEventListener("input", (e) => {
      fromInput.value = Number(
        e.target.value / Number(exchangeRate.textContent)
      ).toFixed(2);
    });

    //------------------------- handling with input fields value ------------------------//

    // ---------------------------- swapping fields ---------------------------//

    function swapping() {
      if (fromContainer.contains(fromCard)) {
        fromCard.parentNode.append(toCard);
        toContainer.append(fromCard);
      } else {
        fromContainer.append(fromCard);
        toContainer.append(toCard);
      }
    }

    exchBtn.addEventListener("click", swapping);

    // ---------------------------- swapping fields ---------------------------//
  } catch (error) {
    console.log(error);
  }
}

handleCurrencyCard();
