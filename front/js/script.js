// requêter l’API avec method get pour lui demander l’ensemble des produits

fetch('http://localhost:3000/api/products')
	.then(function(res) {
    if (res.ok) {
      return res.json();
    }
  	})
  	.then(function(products) {

    //  Appel de la fonction permettant d'affichier les produits sur l'index possible si l'API est ok sinon erreur   
 
    lesKanap(products);

 	})
  	.catch(function(err) {
  		console.log(" Êtes vous sur ?" + err);
    // Une erreur est survenue et est affichée dans la console
});	


    // Afficher les produits sur la page d'accueil 


// Déclaration de la fonction et de comment elle va insérer les éléments dans l'index
function lesKanap(products) {

  // déclaration de la variable blocArticle pour définir les éléments à insérer à partir de l'id items
  let blocProduit = document.getElementById("items");

  // boucle for of pour pour parcourir les éléments du tableau
  for (let produit of products) {
   
// Création du blocArticle pour insérer les éléments correspondant à chaque products du tableau en html permettant un affichage dynamique
// ${article.imageUrl} correspond à une valeur dynamique
    blocProduit.innerHTML += 
  `<a href="./product.html?_id=${produit._id}"> 
    <article>
      <img src="${produit.imageUrl}" alt="${produit.altTxt}">
      <h3 class="productName">${produit.name}</h3>
      <p class="productDescription">${produit.description}</p>
    </article>
  </a>`;

  console.log(produit);

  }
}

