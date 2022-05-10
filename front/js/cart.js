// requêter l’API pour lui demander l’ensemble des produits

fetch('http://localhost:3000/api/products')
	.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  	})
  	.then(function(products) {

    //  Appel de la fonction products permettant d'affichier les produits sur l'index possible si l'API est ok sinon erreur   
    showKanap();

 	})
  	.catch(function(err) {
  		console.log(" Êtes vous sur d'avoir fait votre choix ? " + err);
    // Une erreur est survenue et est affichée dans la console
});	


const cartFull = document.getElementById("cart__items");
const totalArticleInCart = document.getElementById("totalQuantity");
const totalPriceOfArticle = document.getElementById("totalPrice");

// Recuperation des données du localStorage

let cartLocalStorage = JSON.parse(localStorage.getItem("cart"));

console.log(cartLocalStorage);

// Génération du Html pour chaque produit ajoutés

async function showKanap() {
  if (cartLocalStorage === null) {
    document.querySelector("h1").innerHTML =+ `Vous n'avez pas d'article dans votre panier`;
  } else {
    let productsInCart = "";
    for await (let productInLocalStorage of cartLocalStorage) {
      const res = await fetch(`http://localhost:3000/api/products/${productInLocalStorage.id}`);
      if (res.ok) {
        const resJson = await res.json();
        productsInCart += `<article class="cart__item" data-id=${productInLocalStorage.id} data-color="${productInLocalStorage.color}">
                          <div class="cart__item__img">
                            <img src="${resJson.imageUrl}" alt="${resJson.altTxt}">
                          </div>
                          <div class="cart__item__content">
                            <div class="cart__item__content__description">
                              <h2>${resJson.name}</h2>
                              <p>${productInLocalStorage.color}</p>
                              <p>${resJson.price}€</p>                     
                            </div>
                              <div class="cart__item__content__settings">
                              <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage.quantity}">
                              </div>
                              <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                              </div>
                            </div>
                          </div>
                        </article>`;
      }
    }
    cartFull.insertAdjacentHTML("afterbegin", productsInCart);

    // modification de la quantité dans la page panier

    addKanapLocalStorage();
    function addKanapLocalStorage() {
      const addArticleInCart = document.querySelectorAll(".cart__item__content__settings__quantity");

      addArticleInCart.forEach((kanap) => {
        kanap.addEventListener("change", (event) => {
          let canapFinded = event.target.closest("article");

          if (cartLocalStorage) {
            let indexFind;

            indexFind = cartLocalStorage.findIndex((savedProduct) => {
              return savedProduct.id === canapFinded.getAttribute("data-id") && savedProduct.color === canapFinded.getAttribute("data-color");
            });

            if (parseInt(event.target.value) > 0 && parseInt(event.target.value) <= 100) {
              cartLocalStorage[indexFind].quantity = parseInt(event.target.value);
              localStorage.setItem("cart", JSON.stringify(cartLocalStorage));
            }
            if (kanap) {
              totalQuantityLocalStorage();
              totalPrice();
            }
          }
        });
      });
    }

    // Suppression d'élément dans le panier

    deleteKanapLocalStorage();

    function deleteKanapLocalStorage() {
      const deleteProduct = document.querySelectorAll(".deleteItem");

      deleteProduct.forEach((kanap) => {
        kanap.addEventListener("click", (event) => {
          let KanapFinded = event.target.closest("article");

          if (cartLocalStorage) {
            let indexFind;

            indexFind = cartLocalStorage.findIndex((savedProduct) => {
              return savedProduct.id === KanapFinded.getAttribute("data-id") && savedProduct.color === KanapFinded.getAttribute("data-color");
            });

            cartLocalStorage.splice(indexFind, 1);
            KanapFinded.remove();
            localStorage.setItem("cart", JSON.stringify(cartLocalStorage));
          }
          if (kanap) {
            totalQuantityLocalStorage();
            totalPrice();
          }
        });
      });
    }

    // Calcul du total de la quantité des articles dans le panier

    totalQuantityLocalStorage();

    function totalQuantityLocalStorage() {
      let totalQuantity = [];

      for (let article = 0; article < cartLocalStorage.length; article++) {
        let quantityOfArticleInCart = cartLocalStorage[article].quantity;

        totalQuantity.push(quantityOfArticleInCart);
      }

      const reducer = (addition, currentValue) => addition + currentValue;
      const totalArticle = totalQuantity.reduce(reducer, 0);

      const totalQuantityHTML = `<span id="totalQuantity">${totalArticle}</span>`;
      totalArticleInCart.insertAdjacentHTML("afterbegin", totalQuantityHTML);
      document.getElementById("totalQuantity").textContent = `${totalArticle}`;
    }

    // Calcul total du prix du panier

    totalPrice();

    async function totalPrice() {
      let totalPrice = [];
      for await (let productInLocalStorage of cartLocalStorage) {
        const res = await fetch(`http://localhost:3000/api/products/${productInLocalStorage.id}`);
        if (res.ok) {
          const resJson = await res.json();

          for (let article = 0; cartLocalStorage.length; article++) break;
          {
            let totalPriceOfCart = resJson.price * productInLocalStorage.quantity;
            totalPrice.push(totalPriceOfCart);
          }
        }
      }
      const reducer = (addition, currentValue) => addition + currentValue;
      const totalArticle = totalPrice.reduce(reducer, 0);
      const totalPriceHTML = `<span id="totalPrice">${totalArticle}</span>`;
      totalPriceOfArticle.insertAdjacentHTML("afterbegin", totalPriceHTML);
      document.getElementById("totalPrice").textContent = `${totalArticle}`;
    }
  }
}
  
// Formulaire

  // création objet avec les informations données par le client
class Formulaire { constructor() {
    this.firstName = document.getElementById('firstName').value;
    this.lastName = document.getElementById('lastName').value;
    this.adress = document.getElementById('address').value;
    this.city = document.getElementById('city').value;
    this.email = document.getElementById('email').value;
  }
}

// variable pour différents regex
const nameRegex = /^[A-Za-z-]{2,20}\s$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const adressRegex = /^[0-9A-Za-z- ]{3,30}\s$/;

// Analyse des informations données par le client
function userInputVerification() {
  const userFormulaire = new Formulaire();

  // fonction firstName pour valider l'input saisit
  function firstNameValid() {
    const userFirstName = userFormulaire.firstName;
    const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    if (nameRegex.test(userFirstName)) {
      firstNameErrorMsg.replaceChildren();
      return true;
    }
    firstNameErrorMsg.appendChild(
      document.createTextNode(
        'Les caractères saisies ne sont pas valide'
      )
    );
  }
  // fonction Lastname pour valider l'input saisit
  function lastNameValid() {
    const userLastName = userFormulaire.lastName;
    const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    if (nameRegex.test(userLastName)) {
      lastNameErrorMsg.replaceChildren();
      return true;
    }
    lastNameErrorMsg.appendChild(
      document.createTextNode(
        'Les caractères saisies ne sont pas valide'
      )
    );
  }
  // fonction Adresse pour valider l'input saisit
  function adressValid() {
    const userAdress = userFormulaire.adress;
    const addressErrorMsg = document.getElementById('addressErrorMsg');
    if (adressRegex.test(userAdress)) {
      addressErrorMsg.replaceChildren();
      return true;
    }
    addressErrorMsg.appendChild(
      document.createTextNode("L'adresse comporte des caractères de saisies incorrect.")
    );
  }
  // fonction City pour valider l'input saisit
  function cityValid() {
    const userCity = userFormulaire.city;
    const cityErrorMsg = document.getElementById('cityErrorMsg');
    if (nameRegex.test(userCity)) {
      cityErrorMsg.replaceChildren();
      return true;
    }
    cityErrorMsg.appendChild(
      document.createTextNode(
        'Les caractères saisies ne sont pas valide'
      )
    );
  }
  // fonction Email pour valider l'input saisit
  function emailValid() {
    const userEmail = userFormulaire.email;
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    if (emailRegex.test(userEmail)) {
      emailErrorMsg.replaceChildren();
      return true;
    }
    emailErrorMsg.appendChild(
      document.createTextNode('Adresse mail invalide.')
    );
  }

  // Vérification de tous les champs saisies si l'un deux est incorrect le formulaire n'est pas envoyé
  return (
    (firstNameValid() && lastNameValid() && adressValid() && cityValid() && emailValid()) ||
    console.error('Formulaire invalide.')
  );
}

  // Création du contenu de la rêquete Fetch Post

  function orderId() {
    let purchase = [];
    for (let productPurchase of cartLocalStorage) {
      purchase.push(productPurchase.id);
    }

    // Requête avec method POST via Fetch

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(Formulaire),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((value) => {
        localStorage.clear();
        window.location.href = `../html/confirmation.html?id=${value.orderId}`;
      })
      .catch(function (err) {
        console.error(err);
      });
  }
