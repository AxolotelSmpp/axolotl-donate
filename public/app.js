const products = [
  {
    id: "axolotl",
    name: "Axolotl",
    icon: "🦎",
    price: "0.99 €",
    description: "Pagrindinis Axolotl Network rėmėjo rangas.",
    features: [
      "Užrašas prie vardo ir TAB sąraše: Axolotl",
      "Būsite labiau gerbiamas kitų žaidėjų",
      "Axolotl rinkinukas (/kit axolotl) kas 1 dieną",
      "Gali turėti 4 /sethome",
      "Gali aukcione pardavinėti 4 daiktus vienu metu",
      "Gali turėti 4 rezidencijas",
      "Gauna skelbimo komandą (/skelbti)",
      "Gali prisijungti į pilną serverį",
      "Komanda /craft",
      "Komanda /recipe",
      "Komanda /hat"
    ]
  },

  {
    id: "warden",
    name: "Warden",
    icon: "🛡️",
    price: "1.49 €",
    description: "Galingesnis Warden rangas su papildomomis privilegijomis.",
    features: [
      "Gauna užrašą prie slapyvardžio ir TAB sąraše: Warden",
      "Gauna visas Axolotl paslaugos komandas",
      "Gauna paslaugos rinkinuką (/kit Warden)",
      "Rinkinuką galima atsiimti kas 7 dienas",
      "Gali prisijungti į pilną serverį",
      "Gali turėti 5 namus",
      "Gali rašyti spalvotai bendrame chat'e",

      "Komanda /feed – galimybė sau numalšinti alkį"
    ]
  },

  {
    id: "fox",
    name: "Fox",
    icon: "🦊",
    price: "1.99 €",
    description: "Fox rangas su daugiau komandų ir papildomų privilegijų.",
    features: [
      "Gauna užrašą prie slapyvardžio ir TAB sąraše: Fox",
      "Gauna visas Axolotl ir Warden paslaugų komandas",
      "Gauna paslaugos rinkinuką (/kit fox)",
      "Rinkinuką galima atsiimti kas 7 dienas",
      "Gali prisijungti į pilną serverį",
      "Gali turėti 10 namų",
      "Gali rašyti spalvotas žinutes",

      "Komanda /back – galimybė grįžti į prieš tai buvusią vietą",
      "Komanda /enderchest – galimybė bet kur naudotis pabaigos skrynia",
      "Komanda /ptime – galimybė sau pasikeisti laiką į bet kokį",
      "Komanda /heal – galimybė save pasigydyti",
      "Komanda /sellhand – galimybė parduoti rankoje esantį daiktą",
      "Komanda /pv – gaunate 1 kuprinę savo daiktams"
    ]
  },

  {
    id: "parrot",
    name: "Papūga",
    icon: "🦜",
    price: "2.50 €",
    description: "Aukštesnio lygio paslauga su daugybe papildomų privilegijų.",
    features: [
      "Gauna užrašą prie slapyvardžio ir TAB sąraše: Papūga",
      "Gauna visas Axolotl, Warden ir Fox paslaugų komandas",
      "Gauna paslaugos rinkinuką (/kit Papuga)",
      "Rinkinuką galima atsiimti kas 10 dienų",
      "Gali prisijungti į pilną serverį",
      "Gali turėti 15 namų",
      "Iš serverio išmes už AFK kas 30 minučių (įprastai 5 minutės)",

      "Komanda /fly – galimybė skraidyti",
      "Komanda /itemname – galimybė pervadinti daiktą",
      "Komanda /feed – galimybė numalšinti alkį kitiems",
      "Komanda /heal – galimybė pagydyti kitus",
      "Komanda /nick – galimybė pasikeisti slapyvardžio spalvą",
      "Komanda /anvil – galimybė naudotis priekalu bet kur",
      "Komanda /auto – automatinis daiktų surinkimas",
      "Komanda /repair – galimybė susitaisyti daiktą kas 1 valandą",
      "Komanda /pv – gaunate 2 kuprines savo daiktams",

      "Papūga paslauga gauna Platinum raktų kartu su rinkiniu (/kit Papuga)"
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
  document.getElementById("paypal-button-container");

let selectedProduct = null;
let paypalButtons = null;




function renderProducts() {

  if (!productsContainer) {
    console.error("Nerastas #products elementas.");
    return;
  }

  productsContainer.innerHTML = "";

  products.forEach(function (product, index) {

    const card =
      document.createElement("div");

    card.className = "card";

    if (index === 1) {
      card.classList.add("featured");
    }


    const icon =
      document.createElement("div");

    icon.className = "icon";
    icon.textContent = product.icon;

    const title =
      document.createElement("h2");

    title.textContent = product.name;



    const description =
      document.createElement("p");

    description.textContent =
      product.description;



    const price =
      document.createElement("div");

    price.className = "price";
    price.textContent = product.price;


    const list =
      document.createElement("ul");

    product.features.forEach(function (feature) {

      const item =
        document.createElement("li");

      item.textContent =
        "✓ " + feature;

      list.appendChild(item);
    });


    const descriptionButton =
      document.createElement("button");

    descriptionButton.className =
      "description-btn";

    descriptionButton.type =
      "button";

    descriptionButton.textContent =
      "📖 Aprašymas";


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



function selectProduct(product) {

  selectedProduct = product;

  chosen.textContent =
    product.name;

  chosenPrice.textContent =
    product.price;

  message.innerHTML = "";

  nickInput.value = "";

  document
    .getElementById("shop")
    .classList.add("hidden");

  checkout.classList.remove("hidden");

  loadPayPal();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



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


    if (window.paypal) {

      renderPayPalButtons();

      return;
    }


    const script =
      document.createElement("script");


    script.src =
      "https://www.paypal.com/sdk/js?client-id=" +
      encodeURIComponent(config.clientId) +
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


    document.head.appendChild(script);

  } catch (error) {

    console.error(error);

    paypalContainer.innerHTML =
      "❌ Nepavyko prisijungti prie PayPal.";
  }
}



function renderPayPalButtons() {

  if (
    !window.paypal ||
    !selectedProduct
  ) {
    return;
  }

  paypalContainer.innerHTML = "";


  paypalButtons =
    window.paypal.Buttons({


      createOrder: async function () {

        const nick =
          nickInput.value.trim();


        if (!nick) {

          message.innerHTML =
            "❌ Pirmiausia įrašyk savo Minecraft nick.";

          throw new Error(
            "Minecraft nick missing"
          );
        }


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

              body: JSON.stringify({
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

                  body: JSON.stringify({
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


            nickInput.value = "";

          } catch (error) {

            console.error(error);

            message.innerHTML =
              "❌ Įvyko klaida patvirtinant mokėjimą.";
          }
        },


  

      onCancel:
        function () {

          message.innerHTML =
            "⚠️ PayPal mokėjimas atšauktas.";
        },



      onError:
        function (error) {

          console.error(error);

          message.innerHTML =
            "❌ PayPal klaida. Bandyk dar kartą.";
        }

    });


  paypalButtons.render(
    "#paypal-button-container"
  );
}



function back() {

  checkout.classList.add("hidden");

  document
    .getElementById("shop")
    .classList.remove("hidden");

  selectedProduct = null;

  paypalContainer.innerHTML = "";

  message.innerHTML = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


window.back = back;

renderProducts();
