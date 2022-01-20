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
