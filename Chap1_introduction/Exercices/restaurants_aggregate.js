/*
 On cherche le nombre de restaurants japonais par quartier
**/
db.restaurants.aggregate([
    { $match: { cuisine: "Japanese" } },
    {
        $group: {
            _id: "$borough", total: { $sum: 1 }
        }
    }
]);


/**
{ "_id" : "Brooklyn", "total" : 153 }
{ "_id" : "Staten Island", "total" : 33 }
{ "_id" : "Manhattan", "total" : 438 }
{ "_id" : "Missing", "total" : 2 }
{ "_id" : "Bronx", "total" : 17 }
{ "_id" : "Queens", "total" : 117 }
 */

db.restaurants.aggregate([
    // restriction 
    // $match champ et une/des conditions avec des opérateurs Mongo
    { $match: { cuisine: { $in: ["Japanese", "Italian"] } } },
    // grouper par rapport à un champ ici les quartiers attention ce champ est une variable pour Mongo, puis on applique une fonction d'aggrégation sur le groupement. Ici on compte +1 dès que l'on trouve des restaurants Japanese ou Italian
    {
        $group: {
            _id: "$borough", total: { $sum: 1 }
        }
    }
]);

// propre pour la console
db.restaurants.aggregate([
    { $match: { cuisine: { $in: ["Japanese", "Italian"] } } },
    {
        $group: {
            _id: "$borough", total: { $sum: 1 }
        }
    }
]);

// pour vérifier que l'on a le bon nombre recherché de restaurants :
db.restaurants.aggregate([
    { $match: { cuisine: "Italian" } },
    {
        $group: {
            _id: "$borough", total: { $sum: 1 }
        }
    }
]);

db.restaurants.aggregate([
    { $match: { cuisine: "Japanese" } },
    {
        $group: {
            _id: "$borough", total: { $sum: 1 }
        }
    }
]);

// Exercice donnez le nombre de restaurant(s) par type de cuisine à NY

db.restaurants.aggregate([
    {
        $group: {
            _id: "$cuisine", total: { $sum: 1 }
        }
    }
]);

// Exercice donnez le nombre de restaurant(s) dans le quartier de Brooklyn