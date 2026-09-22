```js
const products = [
  {
    id: "axolotl",
    name: "Axolotl",
    icon: "🦎",
    price: "0.99 €",
    description:
      "Palaikyk Axolotl Network ir gauk išskirtines privilegijas.",
    features: [
      "Užrašas prieš vardo ir TAB sąraše: Axolotl",
      "Būsite labiau gerbiamas kitų žaidėjų",
      "Axolotl rinkinukas (/kit axolotl) kas 1 dieną",
      "Gali turėti 4 /sethome",
      "Gali aukcione pardavinėti 4 daiktus vienu metu",
      "Gali turėti 4 rezidencijas",
      "Gauna skelbimo komandą (/skelbti)",
      "Gali prisijungti į pilną serverį",
      "Komanda /craft",
      "Komanda /recipe",
      "Komanda /hat ant Axolotl"
    ]
  },

  {
    id: "warden",
    name: "Warden",
    icon: "🛡️",
    price: "1.49 €",
    description:
      "Galingesnis rėmėjo rangas tikriems serverio palaikytojams.",
    features: [
      "Warden statusas",
      "Papildomos privilegijos",
      "Warden išskirtinumas"
    ]
  },

  {
    id: "fox",
    name: "Fox",
    icon: "🦊",
    price: "1.99 €",
    description:
      "Išskirtinis Fox rangas ir daugiau privilegijų.",
    features: [
      "Fox statusas",
      "Fox privilegijos",
      "Išskirtinis rangas"
    ]
  },

  {
    id: "parrot",
    name: "Papūga",
    icon: "🦜",
    price: "2.50 €",
    description:
      "Aukščiausias iš šių rėmėjo rangų.",
    features: [
      "Papūga statusas",
      "Papūgos privilegijos",
      "Aukščiausias rangas"
    ]
  }
];


const productsContainer =
  document.getElementById("products");

const checkout =
  document.getElementById("checkout");

const chosen =
  document.getElementById("chosen");

const chosenPrice =
  document.getElementById("chosenPrice");

const message =
  document.getElementById("message");

const nickInput =
  document.getElementById("nick");

const paypalContainer =
  document.getElementById(
    "paypal-button-container"
  );


let selectedProduct = null;
let paypalButtons = null;


/* =========================
   RANGŲ PANELĖS
========================= */

function renderProducts() {

  if (!productsContainer) {
    console.error(
      "❌ Nerastas #products elementas."
    );

    return;
  }

  productsContainer.innerHTML = "";

  products.forEach(function (product, index) {

    const card =
      document.createElement("div");

    card.className = "card";


    /*
      Antram rangui uždedame
      featured dizainą.
    */

    if (index === 1) {
      card.classList.add("featured");
    }


    /* IKONA */

    const icon =
      document.createElement("div");

    icon.className = "icon";

    icon.textContent =
      product.icon;


    /* PAVADINIMAS */

    const title =
      document.createElement("h2");

    title.textContent =
      product.name;


    /* TRUMPAS APRAŠYMAS */

    const description =
      document.createElement("p");

    description.textContent =
      product.description;


    /* KAINA */

    const price =
      document.createElement("div");

    price.className = "price";

    price.textContent =
      product.price;


    /* =========================
       PRIVILEGIJŲ SĄRAŠAS
    ========================= */

    const list =
      document.createElement("ul");

    product.features.forEach(
      function (feature) {

        const item =
          document.createElement("li");

        item.textContent =
          "✓ " + feature;

        list.appendChild(item);
      }
    );


    /*
      APRAŠYMO MYGTUKAS
    */

    const descriptionButton =
      document.createElement("button");

    descriptionButton.className =
      "description-btn";

    descriptionButton.type =
      "button";

    descriptionButton.textContent =
      "📖 Aprašymas";


    /*
      Paspaudus Aprašymas,
      parodome / paslepiame
      privilegijas.
    */

    descriptionButton.addEventListener(
      "click",
      function () {

        list.classList.toggle("show");


        if (
          list.classList.contains("show")
        ) {

          descriptionButton.textContent =
            "📕 Paslėpti aprašymą";

        } else {

          descriptionButton.textContent =
            "📖 Aprašymas";
        }
      }
    );


    /* =========================
       PASIRINKTI MYGTUKAS
    ========================= */

    const button =
      document.createElement("button");

    button.className = "buy";

    button.type = "button";

    button.textContent =
      "🫧 Pasirinkti";


    button.addEventListener(
      "click",
      function () {

        selectProduct(product);

      }
    );


    /* =========================
       SUDĖLIOJAME PANELĘ
    ========================= */

    card.appendChild(icon);

    card.appendChild(title);

    card.appendChild(description);

    card.appendChild(price);

    card.appendChild(descriptionButton);

    card.appendChild(list);

    card.appendChild(button);


    productsContainer.appendChild(card);

  });
}


/* =========================
   PRODUKTO PASIRINKIMAS
========================= */

function selectProduct(product) {

  selectedProduct =
    product;


  chosen.textContent =
    product.name;


  chosenPrice.textContent =
    product.price;


  message.innerHTML =
    "";


  nickInput.value =
    "";


  document
    .getElementById("shop")
    .classList.add("hidden");


  checkout.classList.remove(
    "hidden"
  );


  loadPayPal();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   PAYPAL ĮKĖLIMAS
========================= */

async function loadPayPal() {

  paypalContainer.innerHTML =
    "⏳ Kraunamas PayPal...";


  try {

    const configResponse =
      await fetch(
        "/api/paypal/config"
      );


    const config =
      await configResponse.json();


    if (!config.clientId) {

      paypalContainer.innerHTML =
        "❌ PayPal Client ID nerastas.";

      return;
    }


    /*
      Jeigu PayPal jau užkrautas,
      mygtukų iš naujo nekrauname.
    */

    if (window.paypal) {

      renderPayPalButtons();

      return;
    }


    const script =
      document.createElement(
        "script"
      );


    script.src =
      "https://www.paypal.com/sdk/js?client-id=" +
      encodeURIComponent(
        config.clientId
      ) +
      "&currency=EUR";


    script.onload =
      function () {

        renderPayPalButtons();

      };


    script.onerror =
      function () {

        paypalContainer.innerHTML =
          "❌ Nepavyko užkrauti PayPal.";

      };


    document.head.appendChild(
      script
    );


  } catch (error) {

    console.error(
      "PayPal config klaida:",
      error
    );


    paypalContainer.innerHTML =
      "❌ Nepavyko prisijungti prie PayPal.";

  }
}


/* =========================
   PAYPAL MYGTUKAI
========================= */

function renderPayPalButtons() {

  if (
    !window.paypal ||
    !selectedProduct
  ) {

    return;
  }


  paypalContainer.innerHTML =
    "";


  paypalButtons =
    window.paypal.Buttons({

      /* =====================
         CREATE ORDER
      ===================== */

      createOrder:
        async function () {

          const nick =
            nickInput.value.trim();


          if (!nick) {

            message.innerHTML =
              "❌ Pirmiausia įrašyk savo Minecraft nick.";

            throw new Error(
              "Minecraft nick missing"
            );
          }


          /*
            Minecraft nick tikrinimas.
            Leidžiamos raidės,
            skaičiai ir _.
          */

          if (
            !/^[A-Za-z0-9_]{3,16}$/.test(
              nick
            )
          ) {

            message.innerHTML =
              "❌ Minecraft nick turi būti 3–16 simbolių.";

            throw new Error(
              "Invalid Minecraft nick"
            );
          }


          const response =
            await fetch(
              "/api/paypal/create-order",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify({

                    productId:
                      selectedProduct.id,

                    minecraftName:
                      nick

                  })
              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            message.innerHTML =
              "❌ " +
              (
                data.error ||
                "Nepavyko sukurti užsakymo."
              );


            throw new Error(
              data.error ||
              "Create order failed"
            );
          }


          return data.id;

        },


      /* =====================
         PAYMENT APPROVED
      ===================== */

      onApprove:
        async function (data) {

          const nick =
            nickInput.value.trim();


          message.innerHTML =
            "⏳ Patvirtinamas PayPal mokėjimas...";


          try {

            const response =
              await fetch(
                "/api/paypal/capture-order",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body:
                    JSON.stringify({

                      orderId:
                        data.orderID,

                      productId:
                        selectedProduct.id,

                      minecraftName:
                        nick

                    })
                }
              );


            const result =
              await response.json();


            if (!response.ok) {

              message.innerHTML =
                "❌ " +
                (
                  result.error ||
                  "Mokėjimo nepavyko patvirtinti."
                );

              return;
            }


            message.innerHTML =
              "✅ Mokėjimas sėkmingas!<br><br>" +

              "Rangas: <strong>" +
              result.order.product +
              "</strong><br>" +

              "Minecraft nick: <strong>" +
              result.order.minecraftName +
              "</strong><br><br>" +

              "🦎 Užsakymas: <strong>" +
              result.order.id +
              "</strong>";


            nickInput.value =
              "";

          } catch (error) {

            console.error(
              error
            );


            message.innerHTML =
              "❌ Įvyko klaida patvirtinant mokėjimą.";

          }

        },


      /* =====================
         PAYMENT CANCEL
      ===================== */

      onCancel:
        function () {

          message.innerHTML =
            "⚠️ PayPal mokėjimas atšauktas.";

        },


      /* =====================
         PAYPAL ERROR
      ===================== */

      onError:
        function (error) {

          console.error(
            error
          );


          message.innerHTML =
            "❌ PayPal klaida. Bandyk dar kartą.";

        }

    });


  paypalButtons.render(
    "#paypal-button-container"
  );
}


/* =========================
   GRĮŽTI ATGAL
========================= */

function back() {

  checkout.classList.add(
    "hidden"
  );


  document
    .getElementById("shop")
    .classList.remove(
      "hidden"
    );


  selectedProduct =
    null;


  paypalContainer.innerHTML =
    "";


  message.innerHTML =
    "";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


window.back =
  back;


/* =========================
   PALEIDŽIAME RANGUS
========================= */

renderProducts();
```
