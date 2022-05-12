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

// Affichage du tableau récapitulatif des achats dans la page cart

async function showKanap() {
  if (cartLocalStorage === null) {
    document.querySelector("h1").innerHTML =+ `Vous n'avez pas d'article dans votre panier`;
    console.log(cartLocalStorage);
  } else {
    let productsInCart = "";
    for await (let productInLocalStorage of cartLocalStorage) {
      const res = await fetch(`http://localhost:3000/api/products/${productInLocalStorage.id}`);
      if (res.ok) {
        const resJson = await res.json();
        productsInCart += 
        `<article class="cart__item" data-id=${productInLocalStorage.id} data-color="${productInLocalStorage.color}">
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

    // appelle de la fonction pour supprimer un produit du panier
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

    // Calcul total du prix du panier grâce a une fonction asynchrone
    totalPrice();

    async function totalPrice() {
      let totalPrice = [];
      for await (let productInLocalStorage of cartLocalStorage) {
        const res = await fetch(`http://localhost:3000/api/products/${productInLocalStorage.id}`);
        if (res.ok) {
          const resJson = await res.json();

          for (let article = 0; cartLocalStorage.length; article++) 
          
          break;

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


// variable pour différents regex et vérifier les données via les regex
const nameRegex = /^[A-Za-z- ]{2,20}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const adressRegex = /^[0-9A-Za-z- ]{3,30}$/;

// Appelle de la fonction formulaire vérifiant tous les paramètres et envoyant un message d'erreur si besoin
Formulaire();


// fonction de vérification des données saisies par le client
function Formulaire() {

  // Variables pour récupérer les éléments et intéragir avec le DOM
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");
  const errorFirstName = document.getElementById("firstNameErrorMsg");
  const errorLastName = document.getElementById("lastNameErrorMsg");
  const errorAddress = document.getElementById("addressErrorMsg");
  const errorCity = document.getElementById("cityErrorMsg");
  const errorEmail = document.getElementById("emailErrorMsg");
  const sendForm = document.getElementById("order");

  // Vérification du prénom grâce aux fonctions de rappels (callbacks)
  function checkFirstName() {
    const validFirstName = firstName.value;
    if (nameRegex.test(validFirstName)) {
      return true;
    } else {
      errorFirstName.textContent = "Les chiffres et caractères spéciaux ne sont pas autorisés pour ce champ !";
      return false;
    }
  }

  // Vérification du nom grâce aux fonctions de rappels (callbacks)
  function checkLastName() {
    const validLastName = lastName.value;
    if (nameRegex.test(validLastName)) {
      return true;
    } else {
      errorLastName.textContent = "Les chiffres et caractères spéciaux ne sont pas autorisés !";
      return false;
    }
  }

  // Vérification de la ville grâce aux fonctions de rappels (callbacks)
  function checkCity() {
    const validCity = city.value;
    if (nameRegex.test(validCity)) {
      return true;
    } else {
      errorCity.textContent = "Les chiffres et caractères spéciaux ne sont pas autorisés !";
      return false;
    }
  }

  // Vérification de l'adresse grâce aux fonctions de rappels (callbacks)
  function checkAddress() {
    const validAddress = address.value;
    if (adressRegex.test(validAddress)) {
      return true;
    } else {
      errorAddress.textContent = "Les caractères spéciaux ne sont pas autorisés pour ce champ !";
      return false;
    }
  }

  // Vérification de l'Email grâce aux fonctions de rappels (callbacks)
  function checkEmail() {
    const validEmail = email.value;
    if (emailRegex.test(validEmail)) {
      return true;
    } else {
      errorEmail.textContent = "Les caractères spéciaux comme @ et . sont obligatoire pour ce champ !";
      return false;
    }
  }

  // Ecoute lorsqu'on clique sur le bouton "Commander" pour envoyer le formulaire s'il est correctement saisit
  sendForm.addEventListener("click", (event) => {
    event.preventDefault();

    const isFirstNameValid = checkFirstName();
    const isLastNameValid = checkLastName();
    const isCityValid = checkCity();
    const isAddressValid = checkAddress();
    const isEmailValid = checkEmail();

    // Si les données saisies sont corrects on appelle alors la fonction orderId pour insérer les données
    // et les envoyer dans la requête Fetch car on doit cette fois ci les envoyer dnas le back-end
    if (isFirstNameValid && isLastNameValid && isCityValid && isAddressValid && isEmailValid) {
      orderId();
    }
  });

  // Création du contenu pour la rêquete Fetch Post

  // fonction pour mettre les produits du localstorage dans l'array
  function orderId() {
    let purchase = [];
    for (let productPurchase of cartLocalStorage) {
      purchase.push(productPurchase.id);
    }

    // objet contact constituer des données du formulaire pour ensuite les mettres dans le tableau de produits
    const client = {
      products: purchase,
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
    };

    // Requête POST via Fetch pour envoyer les informations au back end 

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(client),
      headers: { "Content-Type": "application/json" },
    })
      // On envoie les données saisies du client et ses produits
      .then((res) => res.json())
      .then((value) => {

        // Permet d'effacer ce qui est stocké dans le localStorage
        localStorage.clear();
        window.location.href = `../html/confirmation.html?id=${value.orderId}`;
      })
      .catch(function (err) {
        console.error(err);
      });
  }
}