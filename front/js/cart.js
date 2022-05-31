// requêter l’API pour lui demander l’ensemble des produits

fetch('http://localhost:3000/api/products')
	.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  	})
  	.then(function(products) {

    // Appel de la fonction permettant d'affichier les produits sur l'index possible si l'API est ok sinon erreur   
    showKanap();

 	})
  	.catch(function(err) {
  		console.log(" Êtes vous sur d'avoir fait votre choix ? " + err);
      alert("Les produits de votre panier ne sont plus disponibles dû a une erreur. Veuillez contacter notre administrateur");
    // Une erreur est survenue et est affichée dans la console
});	

// Déclarations variables pour intéragir avec les élements sélectionnées sur la page panier
const cartFull = document.getElementById("cart__items");
const totalArticleInCart = document.getElementById("totalQuantity");
const totalPriceOfArticle = document.getElementById("totalPrice");

// Recuperation des données du localStorage dans la variable cartLocalStorage
let cartLocalStorage = JSON.parse(localStorage.getItem("cart"));

// Fonction asynchrone permettant l'affichage dynamique du tableau récapitulatif des achats dans la page cart
async function showKanap() {

  // Si le panier est vide on ajoute à la page ces éléments
  if (cartLocalStorage === null || cartLocalStorage === 0 || cartLocalStorage.length === 0) {
    const emptyCart = `<h1>Votre panier est vide</h1>`;
    document.querySelector("h1").innerHTML = emptyCart;
    document.getElementById("totalPrice").textContent = '0';
    document.getElementById("totalQuantity").textContent = '0';
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
    console.log(cartLocalStorage);

    
    // fonction modifiant la quantité et la couleur du produit dans le localStorage
    function addKanapLocalStorage() {
      const addArticleInCart = document.querySelectorAll(".cart__item__content__settings__quantity");

      addArticleInCart.forEach((kanap) => {
        kanap.addEventListener("change", (event) => {
          event.preventDefault();
          let kanapFinded = event.target.closest("article");

          if (cartLocalStorage) {
            let indexFind;

            indexFind = cartLocalStorage.findIndex((savedProduct) => {
              return savedProduct.id === kanapFinded.getAttribute("data-id") && savedProduct.color === kanapFinded.getAttribute("data-color");
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

    //appelle de la fonction pour modifier le produit présent dans le localStorage
    addKanapLocalStorage();


    // fonction supprimant un produit du localStorage
    function deleteKanapLocalStorage() {
      const deleteProduct = document.querySelectorAll(".deleteItem");

      deleteProduct.forEach((kanap) => {
        kanap.addEventListener("click", (event) => {
          event.preventDefault();
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

    // appelle de la fonction pour supprimer un produit du panier
    deleteKanapLocalStorage();

    // fonction calculant la quantités des articles présents dans le localStorage
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

    // Calcul du total de la quantité des articles dans le panier
    totalQuantityLocalStorage();

    // fonction asynchrone permettant de calculer le prix total et de l'afficher 
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

    // Calcul total du prix du panier et de l'afficher grâce a une fonction asynchrone
    totalPrice();
  }
}
  

// Etapes du Formulaire


// variable pour différents regex selon les caractères autorisés et vérifier les données 
const nameRegex = /^[A-Z][A-Za-z\é\è\ê\-]+$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const adressRegex = /^[A-Za-z0-9 ]{3,30}$/;


// fonction de vérification des données saisies par le client
function Formulaire() {

  // Variables pour récupérer les éléments et intéragir avec le DOM car on les utilises dans les callbacks après
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
     } else if (validFirstName == '') {
        alert('Veuillez saisir votre prénom avant de passer votre commande !');
        return false;
    } else {
      alert("Les chiffres et caractères spéciaux ne sont pas autorisés pour le PRENOM !");
      return false;
    }
  }

  // Vérification du nom grâce aux fonctions de rappels (callbacks)
  function checkLastName() {
    const validLastName = lastName.value;
    if (nameRegex.test(validLastName)) {
      return true;
    } else if (validLastName == '') {
      alert('Veuillez saisir votre nom avant de passer votre commande !');
      return false;
    } else {
      alert("Les chiffres et caractères spéciaux ne sont pas autorisés pour le NOM !");
      return false;
    }
  }

  // Vérification de la ville grâce aux fonctions de rappels (callbacks)
  function checkCity() {
    const validCity = city.value;
    if (nameRegex.test(validCity)) {
      return true;
    } else if (validCity == '') {
      alert('Veuillez saisir votre ville avant de passer votre commande !');
      return false;
    } else {
      alert("Les chiffres et caractères spéciaux ne sont pas autorisés pour la VILLE !");
      return false;
    }
  }

  // Vérification de l'adresse grâce aux fonctions de rappels (callbacks)
  function checkAddress() {
    const validAddress = address.value;
    if (adressRegex.test(validAddress)) {
      return true;
    } else if (validAddress == '') {
      alert('Veuillez saisir votre adresse avant de passer votre commande !');
      return false;
    } else {
      alert("Les caractères spéciaux ne sont pas autorisés pour ce champ !");
      return false;
    }
  }

  // Vérification de l'Email grâce aux fonctions de rappels (callbacks)
  function checkEmail() {
    const validEmail = email.value;
    if (emailRegex.test(validEmail)) {
      return true;
    } else if (validEmail == '') {
      alert('Veuillez saisir voter email avant de passer votre commande !');
      return false;
    } else {
      alert('Les caractères spéciaux comme @ et . sont obligatoire pour ce champ !');
      return false;
    }
  }

  // Ecoute lorsqu'on clique sur le bouton "Commander" pour envoyer le formulaire s'il est correctement saisit
  sendForm.addEventListener("click", (event) => {
    event.preventDefault();

    // Déclarations de variables pour stocker les infos de verification des fonctions et verifier si tout est ok
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
      // transforme l'objet client en contenu JSON 
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

// Appelle de la fonction formulaire vérifiant tous les paramètres et envoyant un message d'erreur si besoin
Formulaire();