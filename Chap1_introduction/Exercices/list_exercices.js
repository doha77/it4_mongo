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

//  06 Trouvez tous les restaurants dans le quartier du Bronx qui ont eu 4 grades.

// $size calculer la taille de votre tableau 

db.restaurants.find( 
    { borough: "Bronx", "grades" : { $size : 4 } },  
    { _id : 0, name : 1, "address.coord" : 1} 
).pretty();

// 07. Sélectionnez les restaurants dont le grade est A ou B dans le Bronx.

db.restaurants.find({
    $and: [
        { "borough": "Bronx" },
        { "grades.grade": { $in: ["A", "B"] } }
    ]
}).count()

db.restaurants.find({
    $and: [
        { "borough": "Bronx" },
        { $or: [{ "grades.grade": "A" }, { "grades.grade": "B" }] }
    ]
}).count()

db.restaurants.find({"borough": "Bronx" , "$or": [{ "grades.grade": "A" }, { "grades.grade": "B" }] }).count()


// 08. Même question mais, on aimerait récupérer les restaurants qui ont eu à la dernière inspection (elle apparaît théoriquement en premier dans la liste des grades) un A ou B. Vous pouvez utilisez la notion d'indice sur la clé grade :

db.restaurants.find({
    $and: [
        {
            $or: [{ "grades.0.grade": "A" }, { "grades.0.grade": "B" }]
        },
        {
            "borough": "Bronx"
        }
    ]
},
    { "_id": 0, "name": 1, grades: 1 }
).pretty();


// 09. Sélectionnez maintenant tous les restaurants qui ont le mot "Coffee" ou "coffee" dans la propriété name du document. Puis, même question mais uniquement dans le quartier du Bronx.

db.restaurants.find({ name: /coffee/ }, { _id: 0, name: 1 }).count()
db.restaurants.find({ name: /Coffee/ }, { _id: 0, name: 1 }).count()

db.restaurants.find({ name: /[Cc]offee/ }, { _id: 0, name: 1 }).count()

// On en ajoute un qui permet de voir qu'on les compte tous
db.restaurants.updateOne(
    { 'name': /Coffee/ },
    [
        { $set: { name: "coffee" } }
    ]
);

// 10 


// (P1) AND (P2 )
// (SP1 OU SP2) AND P2
db.restaurants.find({
    $and: [
        { "name": { $in: [/Coffee/, /Restaurant/] } },
        { "name": { $nin: [/Starbucks/] } } 
    ]
}, { "_id": 0, "name": 1 }).count()

// voir l'exemple suivant dans la documentation avec qty https://docs.mongodb.com/manual/reference/operator/query/and/
db.restaurants.find({
    $and: [
        { $or  : [{name : /Coffee/}, { name : /Restaurant/ }] },
        { "name": { $nin: [/Starbucks/] } } 
    ]
}, { "_id": 0, "name": 1 }).count()


// name
// SP1 OU (SP2 AND P2) ATTENTION à l'interprétation de la requête suivante 
db.restaurants.find(
    {$or: [{ "name": /Coffee/ }, { "name": /Restaurant/ }]},
    { "name": { $nin: [/Starbucks/] } } 
    ).count();

// C'est la meme chose que celle-ci 
db.restaurants.find({
    $or : [
        { "name": /Coffee/i }, 
        { $and : [
            { "name": /Restaurant/ },
            { "name": { $nin: [/Starbucks/] } } 
        ]}
    ]
}).count();


// 11

db.restaurants.find({
    $and: [
        {
            $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }]
        },
        {
            name: /coffee/i
        },
        { "grades": { "$size": 4 } }
    ]
},
    { "_id": 0, "name": 1, grades: 1 }
).pretty()

// 12

// Rmq
/**
 * On sait que l'on a des restaurants qui ont tous 4 grades, inspirez vous de l'exemple de code suivant pour mettre en page
 */

db.restaurants.find( {name : /[Cc]offee/ } ).forEach( doc => {
    print(doc.name.toUpperCase())
})