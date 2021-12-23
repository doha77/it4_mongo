//  Liste d'Exercices
/**
 * 01. Combien y a t il de restaurants qui font de la cuisine italienne et qui ont eu un score de 10 au moins ?
 */

db.restaurants.find({ cuisine : "Italian", "grades.score" :  10 }).count()


/**
 * Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. Ordonnez les résultats par ordre décroissant sur les noms des restaurants.
 */

db.restaurants.find({ cuisine : "Italian", "grades.score" :  10 }, {"grades.score" : 1, "address.coord" : 1, name: 1, _id: 0}).sort({name : 1}).pretty()