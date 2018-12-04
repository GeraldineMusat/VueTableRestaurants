window.onload = init;

	  
function init() {
	new Vue({
	  el:"#app",
	  data: {
		restaurants : [],
		cuisine:'',
		page:0,
		pagesize:10,
		nbRestaurants:0,
		name:'',
		nameRecherche:'',
		restID:0
	  },
	  mounted(){
		  
		  console.log("AVANT AFFICHAGE");
		  this.getRestaurantsFromServer();
		  
	  },
	  methods: {
		getRestaurantsFromServer() {
			//let url = "http://localhost:8080/api/restaurants";
			let url = "http://localhost:8080/api/restaurants?page=" + 
					this.page + "&pagesize=" + 
					this.pagesize + "&name=" + this.nameRecherche;
			  
			fetch(url)
                    .then((reponseJSON) => {
                        //console.log("reponse json");
                        return reponseJSON.json();
                    })
                    .then((reponseJS) => {
                        // ici on a une réponse en JS
                        this.restaurants = reponseJS.data;
                        this.nbRestaurants = reponseJS.count;
                    })
                    .catch((err) => {
                        console.log("Une erreur est intervenue " + err);
                    })
		},
		supprimerRestaurant(index) { // Supprimer un restaurant
		  //this.restaurants.splice(index, 1);
		  //this.getRestaurantsFromServer();
		  this.restID = this.restaurants[index]._id;
		  let url = "http://localhost:8080/api/restaurants/" + this.restID;
				//console.log(this.restID);
                fetch(url, {
                        method: "DELETE"
                    })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => { // arrow function préserve le this
                                // Maintenant res est un vrai objet JavaScript
                                console.log("Restaurant inséré");
                                this.getRestaurantsFromServer();

                                // remettre le formulaire à zéro
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
		},
		modifierRest(index) {
			this.name = this.restaurants[index].name;
			console.log(this.nom);
			this.cuisine = this.restaurants[index].cuisine;
			this.restID = this.restaurants[index]._id;
			console.log(this.cuisine);
			console.log(this.restID);
		},
		modifierRestaurants(event) { // Modfier un restaurant
			// REQUETES PUT
			
			console.log(this.name);
			// Pour éviter que la page ne se ré-affiche
			event.preventDefault();

			// Récupération du formulaire. Pas besoin de document.querySelector
			// ou document.getElementById puisque c'est le formulaire qui a généré
			// l'événement
			let form = event.target;
			// Récupération des valeurs des champs du formulaire
			// en prévision d'un envoi multipart en ajax/fetch
			let donneesFormulaire = new FormData(event.target);

			console.log(event.target);

			let url = "http://localhost:8080/api/restaurants/" + this.restID;

			fetch(url, {
				method: 'PUT',
				body: donneesFormulaire,
				mode: 'cors'
			})
			.then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => { // arrow function préserve le this
                                // Maintenant res est un vrai objet JavaScript
                                console.log("Restaurant inséré");
                                this.getRestaurantsFromServer();

                                // remettre le formulaire à zéro
                            });
                    })
				.catch(function (err) {
					console.log(err);
			});

				},
		ajouterRestaurant(event) {
			// eviter le comportement par defaut
			event.preventDefault();

                let form = event.target;
                let donneesFormulaire = new FormData(form);

                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: donneesFormulaire
                    })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => { // arrow function préserve le this
                                // Maintenant res est un vrai objet JavaScript
                                console.log("Restaurant inséré");
                                this.getRestaurantsFromServer();

                                // remettre le formulaire à zéro
                                this.name = "";
                                this.cuisine = "";
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
		    
		},
		getColor(index) {
		  return (index % 2) ? 'lightBlue' : 'pink';
		},
		precedent(event) { // Pour la pagination page precedente
			if(this.page > 0 ){
				this.page = this.page - 1;
				this.getRestaurantsFromServer();
			}
		},
		suivant(event){ // Pour la pagination page suivante 
			let res = Math.round( this.nbRestaurants / this.pagesize ) - 1;
			if (this.page < res) {
				this.page = this.page + 1;
				this.getRestaurantsFromServer();
			}
		},
		onChg(event){ // Pour le slide pour le nombre de restaurants par page 
			//console.log(this.pagesize);
			this.getRestaurantsFromServer();
		},
		chercherRestaurants: _.debounce(function () { // Pour chercher les restaurants, avec un temps alloué pour ecrire
			this.getRestaurantsFromServer();
		}, 300),
		premiere(event){
			this.page = 0;
			this.getRestaurantsFromServer();
		},
		derniere(event){
			let res = this.nbRestaurants / this.pagesize;
			this.page = Math.round(res) - 1;
			this.getRestaurantsFromServer();
		}
	  }
	});
}
