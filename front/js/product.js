// le lien entre un produit de la page d’accueil et la page Produit
const params = new URLSearchParams(window.location.search);

// permet d'afficher seulement le produit avec l'id correspondant au produit choisit grâce à URLSearchParams
const id = params.get("_id");

// requêter toujours l’API pour lui demander l’ensemble des produits
fetch('http://localhost:3000/api/products')
	.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  	})
  	.then(function(products) {

//  Appel de la fonction permettant d'affichier les produits sur l'index possible si l'API est ok sinon erreur   
    kanap(products);
    addKanap();
    

 	})
  	.catch(function(err) {
  		console.log("Le produit que vous avez choisi n'est pas disponible. Veuillez réessayez ultérieurement !" + err);
    // Une erreur est survenue et est affichée dans la console
});	

    // Insertion des données de l'API dans le DOM (titre, img, nom, prix, description et option couleurs)

// variable productClient est un objet pour savoir le choix des produits du client
let productClient = {};

// id du produit correspondant au choix du client
productClient._id = id;


// declaration de la fonction qui affiche le produit sélectionnée par le client grâce à son id
function kanap(products) {
		
	// variables de tous les paramètres de l'objet productClient	
  const colorOption = document.getElementById("colors");
  const name = document.getElementById("title");
 	const price = document.getElementById("price");
  const description = document.getElementById("description");
  const imageAlt = document.querySelector("article div.item__img");
  

  	// boucle for of pour parcourir les éléments du tableau pour ainsi modifier l'élément choisi
  	for (let choix of products) {

    //si id (définit par l'url) est identique à un _id d'un des produits du tableau, on récupère son indice de tableau qui sert pour les éléments produit à ajouter
    if (id === choix._id) {

      //ajout des éléments de manière dynamique conforme 
      document.title = choix.name; // titre de la page (onglet) 
      imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
      name.textContent = `${choix.name}`;
      price.textContent = `${choix.price}`;
      description.textContent = `${choix.description}`;
      
      //Permet d'éviter les erreurs si le client met une valeur inférieur à 0 ou supérieur à 100
      document.getElementById("quantity").addEventListener('change', (e) => {
        if (e.target.value > 100) e.target.value = 100
        if (e.target.value < 0) e.target.value = 0
      })


      // boucle pour chercher les couleurs pour chaque produit en fonction de sa valeur
      for (let color of choix.colors) {

        // ajout des balises d'option couleur avec leur valeur
        colorOption.innerHTML += `<option value="${color}">${color}</option>`;
      }

  // Affiche dans la console l'objet choisit
	console.log(choix);

    // Conditions pour valider l'ajout du produit dans le panier  
    document.getElementById("addToCart").addEventListener("click", function() {
        if (document.getElementById("quantity").reportValidity() &&
            document.getElementById("colors").reportValidity()) {
            choix.quantity = parseInt(document.getElementById("quantity").value);
            choix.color = document.getElementById("colors").value;
        } 
}
)}
}}

// Ajout du produit choisit avec sa couleur et sa quantité dans le localStorage
function addKanap() {
  const addToCart = document.getElementById("addToCart");

//localStorage

 // Event lors du click sur le bouton "Ajouter au panier! modifiant la couleur et le texte"
  const colorChoice = document.getElementById("colors");
    const quantity = document.getElementById("quantity");
  addToCart.addEventListener("click", (event) => {
    event.preventDefault();


    if (quantity.value > 0 && quantity.value <= 100 && colorChoice.value) {
      alert('Produit ajouté dans le panier avec succes !')
     } else { 
      alert('Produit non ajouté dans le panier car tous les champs ne sont pas remplis')
     }

    // Création d'un objet produit pour le rajouter dans le panier
    let newProduct = {
      id: id,
      color: colorChoice.value,
      quantity: parseInt(quantity.value),
    };

    // Condition quantité pour ajouter le produit dans le localStorage
    if (quantity.value > 0 && quantity.value <= 100 && colorChoice.value) {

      // Récupération des données avec getItem
      let cartLocalStorage = JSON.parse(localStorage.getItem("cart"));

      if (cartLocalStorage) {
        let cartFind = false;

        // boucle pour augmenter quantité si seulement l'id et la couleur du produit est le même
        // entries() car renvoie des tableaux à deux éléments (couleur et quantité) en l'occurence l'array localStorage
        for (let [index, productInCart] of cartLocalStorage.entries()) {
          if (productInCart.color === colorChoice.value && productInCart.id === id) {
            alert('ATTENTION : Le produit précédemment ajouté était le même mais il a quand même été ajouté avec la quantité souhaité. Si vous souhaitez revenir sur votre choix, veuillez consulter votre panier.')
            cartFind = true;

            // Analyse la quantité grâce à parseInt
            if (cartLocalStorage[index].quantity + parseInt(quantity.value) <= 100) {
              cartLocalStorage[index].quantity += parseInt(quantity.value);
            }
          }
        }
        // Si l'objet est trouvé on l'ajoute dans le localStorage avec la clé 'cart'
        if (cartFind) {
          // stringify renvoie la valeur javascript au format json
          localStorage.setItem("cart", JSON.stringify(cartLocalStorage));
        } else {
          cartLocalStorage.push(newProduct);
          localStorage.setItem("cart", JSON.stringify(cartLocalStorage));
        }
      } else {
        // Array pour constituer le panier avec les 3 paramètres pour intégrer les produits choisit
        const arrayPannier = [
          {
            id: id,
            color: colorChoice.value,
            quantity: parseInt(quantity.value),
          },
        ];
        // localStorage pour pouvoir stocker et y accéder.
        localStorage.setItem("cart", JSON.stringify(arrayPannier));
      }
      
    }
    }
  )};





   
