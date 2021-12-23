//  Liste d'Exercices
/**
 * 01. Combien y a t il de restaurants qui font de la cuisine italienne et qui ont eu un score de 10 au moins ?
 */

db.restaurants.find({ cuisine : "Italian", "grades.score" :  10 }).count()


/**
 * Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. Ordonnez les résultats par ordre décroissant sur les noms des restaurants.
 */

db.restaurants.find({ cuisine : "Italian", "grades.score" :  10 }, {"grades.score" : 1, "address.coord" : 1, name: 1, _id: 0}).sort({name : 1}).pretty()


// 03 Quels sont les restaurants qui ont eu un grade A et un score supérieur ou égal à 20 ? Affichez uniquement les noms et ordonnez les par ordre décroissant. Affichez le nombre de résultat.

db.restaurants.find(
    {
        "grades.grade": "A",
        "grades.score": { $gte: 20 }
    },
    {
        _id: 0,
        "grades.grade": 1,
        "grades.score": 1
    }).sort({ name: -1 });


//  04. A l'aide de la méthode distinct trouvez tous les quartiers distincts de NY.
db.restaurants.distinct('borough');

// 05 Trouvez tous les types de restaurants dans le quartiers du Bronx. Vous pouvez là encore utiliser distinct et un deuxième paramètre pour préciser sur quel ensemble vous voulez appliquer cette close.

db.restaurants.distinct('cuisine', { "borough": "Bronx" });