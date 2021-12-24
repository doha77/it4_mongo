//  Liste d'Exercices
/**
 * 01. Combien y a t il de restaurants qui font de la cuisine italienne et qui ont eu un score de 10 au moins ?
 */

db.restaurants.find({ cuisine: "Italian", "grades.score": 10 }).count();

/**
 * Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. Ordonnez les résultats par ordre décroissant sur les noms des restaurants.
 */

db.restaurants
  .find(
    { cuisine: "Italian", "grades.score": 10 },
    { "grades.score": 1, "address.coord": 1, name: 1, _id: 0 }
  )
  .sort({ name: 1 })
  .pretty();

// 03 Quels sont les restaurants qui ont eu un grade A et un score supérieur ou égal à 20 ? Affichez uniquement les noms et ordonnez les par ordre décroissant. Affichez le nombre de résultat.

db.restaurants
  .find(
    {
      "grades.grade": "A",
      "grades.score": { $gte: 20 },
    },
    {
      _id: 0,
      "grades.grade": 1,
      "grades.score": 1,
    }
  )
  .sort({ name: -1 });

//  04. A l'aide de la méthode distinct trouvez tous les quartiers distincts de NY.
db.restaurants.distinct("borough");

// 05 Trouvez tous les types de restaurants dans le quartiers du Bronx. Vous pouvez là encore utiliser distinct et un deuxième paramètre pour préciser sur quel ensemble vous voulez appliquer cette close.

db.restaurants.distinct("cuisine", { borough: "Bronx" });

//  06 Trouvez tous les restaurants dans le quartier du Bronx qui ont eu 4 grades.

// $size calculer la taille de votre tableau

db.restaurants
  .find(
    { borough: "Bronx", grades: { $size: 4 } },
    { _id: 0, name: 1, "address.coord": 1 }
  )
  .pretty();

// 07. Sélectionnez les restaurants dont le grade est A ou B dans le Bronx.

db.restaurants
  .find({
    $and: [{ borough: "Bronx" }, { "grades.grade": { $in: ["A", "B"] } }],
  })
  .count();

db.restaurants
  .find({
    $and: [
      { borough: "Bronx" },
      { $or: [{ "grades.grade": "A" }, { "grades.grade": "B" }] },
    ],
  })
  .count();

db.restaurants
  .find({
    borough: "Bronx",
    $or: [{ "grades.grade": "A" }, { "grades.grade": "B" }],
  })
  .count();

// 08. Même question mais, on aimerait récupérer les restaurants qui ont eu à la dernière inspection (elle apparaît théoriquement en premier dans la liste des grades) un A ou B. Vous pouvez utilisez la notion d'indice sur la clé grade :

db.restaurants
  .find(
    {
      $and: [
        {
          $or: [{ "grades.0.grade": "A" }, { "grades.0.grade": "B" }],
        },
        {
          borough: "Bronx",
        },
      ],
    },
    { _id: 0, name: 1, grades: 1 }
  )
  .pretty();

// 09. Sélectionnez maintenant tous les restaurants qui ont le mot "Coffee" ou "coffee" dans la propriété name du document. Puis, même question mais uniquement dans le quartier du Bronx.

db.restaurants.find({ name: /coffee/ }, { _id: 0, name: 1 }).count();
db.restaurants.find({ name: /Coffee/ }, { _id: 0, name: 1 }).count();

db.restaurants.find({ name: /[Cc]offee/ }, { _id: 0, name: 1 }).count();

// On en ajoute un qui permet de voir qu'on les compte tous
db.restaurants.updateOne({ name: /Coffee/ }, [{ $set: { name: "coffee" } }]);

// 10

// (P1) AND (P2 )
// (SP1 OU SP2) AND P2
db.restaurants
  .find(
    {
      $and: [
        { name: { $in: [/Coffee/, /Restaurant/] } },
        { name: { $nin: [/Starbucks/] } },
      ],
    },
    { _id: 0, name: 1 }
  )
  .count();

// voir l'exemple suivant dans la documentation avec qty https://docs.mongodb.com/manual/reference/operator/query/and/
db.restaurants
  .find(
    {
      $and: [
        { $or: [{ name: /Coffee/ }, { name: /Restaurant/ }] },
        { name: { $nin: [/Starbucks/] } },
      ],
    },
    { _id: 0, name: 1 }
  )
  .count();

// name
// SP1 OU (SP2 AND P2) ATTENTION à l'interprétation de la requête suivante
db.restaurants
  .find(
    { $or: [{ name: /Coffee/ }, { name: /Restaurant/ }] },
    { name: { $nin: [/Starbucks/] } }
  )
  .count();

// C'est la meme chose que celle-ci
db.restaurants
  .find({
    $or: [
      { name: /Coffee/i },
      { $and: [{ name: /Restaurant/ }, { name: { $nin: [/Starbucks/] } }] },
    ],
  })
  .count();

// 11

db.restaurants
  .find(
    {
      $and: [
        {
          $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }],
        },
        {
          name: /coffee/i,
        },
        { grades: { $size: 4 } },
      ],
    },
    { _id: 0, name: 1, grades: 1 }
  )
  .pretty();

// 12

db.restaurants.find(
    {
      $and: [
        { $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }] },
        { name: /coffee/i },
        { grades : { $exists : true}},
        { grades: { $size: 4 } }
      ],
    },
    { _id: 0, name: 1, grades: 1 }
  ).forEach((doc) => {
      print(doc.name.toUpperCase());
      // locale pour les dates 
      print(`Last date : ${doc.grades[0].date.toLocaleDateString()}`);
      print(`Last date : ${doc.grades[3].date.toLocaleDateString()}`);
      print(`Borough ${doc.borough}`);
  });

// Rmq
/**
 * On sait que l'on a des restaurants qui ont tous 4 grades, inspirez vous de l'exemple de code suivant pour mettre en page
 */

db.restaurants.find({ name: /[Cc]offee/ }).forEach((doc) => {
  print(doc.name.toUpperCase());
});

// Transformer un champ en coordonnee => créer un index en BD mettre des propriétés sur un champ afin que l'on puisse faire des calculs spécifiques
// Par exemple en MySQL vous pouvez transformer un champ email => index unique 

db.restaurants.createIndex({"address.coord" : "2dsphere"}) ; // calcul géométrique possible sur ce champ


const METERS_PER_MILE = 1609.34; // 1 mile en metre
const coordinate = [-73.961704, 40.662942]; // dans le planc car on est en 2DSphere

db.restaurants.find({ 
    "address.coord": 
    { $nearSphere: 
        { $geometry: { type: "Point", coordinates: coordinate }, 
        $maxDistance: 5 * METERS_PER_MILE }
    } 
}, {borough :1, name : 1, "address.coord" : 1 , _id : 0}).forEach(
    doc => {
        const { name, address, borough} = doc;
        print("----------------------------------")
        print(`Borough : ${borough.toUpperCase()}`)
        print()
        print(`name : ${name.toUpperCase()} coordinate : ${address.coord.join(' ')}`)
    }
)


/**
 * 
1. Affichez la liste des restaurants dont le nom commence et se termine par une voyelle.

2. Affichez la liste des restaurants dont le nom commence et se termine par une même lettre. Vous ferez attention à ne pas récupérer dans votre requête les restaurants n'ayant pas de nom. 
 */

// /^[aeiou].*[aeiou]$/


// 1
db.restaurants.find({ name : /^[aeiou].*[aeiou]$/i }, { name: 1, _id : 0});


// 2
// \w <=> [a-zA-Z_0-9]
db.restaurants.find({ name : /^(\w).*\1$/i }, { name: 1, _id : 0});