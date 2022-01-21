// 03
db.restaurants.aggregate([
    {
        $group: {
            _id: {
                "cuisine": "$cuisine",
                "borough": "$borough"
            },
            names: { $push: { name: "$name", restaurant_id: "$restaurant_id" } }
        },
    },
    { $limit: 2 }
])

// 04
db.restaurants.aggregate([
    { $match: { cuisine: "Italian" } },
    {
        $group: {
            _id: {
                "borough": "$borough"
            },
            names: { $push: "$name" }
        }
    }
]).pretty()

// 05
// db.restaurants.aggregate([
//     { $unwind: "$grades" },
//     { $sort : { name : -1 }}
// ]).pretty()

// 05
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { _id: "$name", avg_by_restaurant: { $avg: "$grades.score" } } },
    { $sort: { avg_by_restaurant: -1 } }
]).pretty()

// si on considére la question 04 (regardez si vous avez le courage ...)
// Moyenne des scores par restaurants
db.restaurants.aggregate([
    { $unwind: "$grades" },
    {
        $group: {
            _id: {
                "name": "$name"
            },
            avg: { $avg: "$grades.score" }
        }
    },
    {
        $sort: {
            avg: -1
        }
    },
])

// Moyenne des scores par quartier
db.restaurants.aggregate([
    { $unwind: "$grades" },
    {
        $group: {
            _id: {
                "borough": "$borough"
            },
            avg: { $avg: "$grades.score" }
        }
    },
    {
        $sort: {
            avg: -1
        }
    }
])

// 06 
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $match: { cuisine: "Italian" } },
    {
        $group: {
            _id: {
                "name": "$name"
            },

            avg: { $avg: "$grades.score" },
        },

    },
    { $sort: { avg: - 1 } },
    { $limit: 5 },
    { $out: "top5" }
]).pretty();

// 07 Correction
db.restaurants.aggregate([
    // les restaurants qui ont un score au moins supérieur à 30 identique à un WHERE en MySQL
    { $match: { "grades.score": { $gte: 30 } } },
    {
        $group: {
            _id: "$borough",// agrégation des données par quartier => crée des sous-ensemble
            totalRestaurant: { $sum: 1 }, // fonction agrégation sur les sous-ensembles
            cuisines: { $addToSet: "$cuisine" } // ajouter dans un tableau de manière unique chaque type de restaurants
            // cuisines : { $push : "$cuisne" } // on aurait dans ce cas eu des doublons de type 
        }
    },
    {
        $sort: {
            totalRestaurant: -1
        }
    }
])

// Quelques remarques sur l'agrégation avec MongoDB
db.restaurants.aggregate([
    {
        $group: {
            _id: "$borough",
            totalRestaurant: { $sum: 1 }
        }
    }
]);

// Attention à l'enchainement des pipes
db.restaurants.aggregate([
    {
        $group: {
            _id: "$borough",
            totalRestaurant: { $sum: 1 },
            typeCuisine: { $addToSet: "$cuisine" }
        }
    },
    { $match: { totalRestaurant: { $lte: 51 } } },
    {
        $sort: {
            totalRestaurant: -1
        }
    },
]).pretty()

// Avec le not on récupère uniquement les valeurs qui sont >= 30 sur toutes les notations
db.restaurants.aggregate([
    { $match: { "grades.score": { $gte: 30 } } },
    {
        $group: {
            _id: "$borough",
            totalRestaurant: { $sum: 1 },
            cuisines: { $addToSet: "$cuisine" }
        }
    },
    {
        $sort: {
            totalRestaurant: -1
        }
    }
])



// 09 notre correction rmq on prendra garde de ne pas récupérer les scores null
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $match: { "grades.score": { $exists: true }, "grades.score": { $not: { $lt: 30 } } } },
    {
        $group: {
            _id: {
                "borough": "$borough"
            },
            names: {
                $push: {
                    name: "$name",
                    avg: {
                        $avg: "$grades.score"
                    },
                }
            },
        },
    },
    { $project: { _id: 1, names: 1 } },
    { $sort: { "grades.score": - 1 } }
]).pretty()