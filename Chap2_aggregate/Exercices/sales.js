// 01 on regroupe par agence et on fait le total des prix
db.sales.aggregate(
    [
        {
            $group:
            {
                _id: "$agency",
                totalPrice: { $sum: "$price" } 
            }
        }
    ]
)

// 02
/**
 * On enchaîne les pipes : le groupement + le match + projection
 */
db.sales.aggregate(
    [
        {
            $group:
            {
                _id: "$agency",
                totalPrice: { $sum: "$price" }
            }
        },
        {
            $match: { "totalPrice": { $gte: 950000 } }
        },
        {
            $project: {
                totalPrice: 1, _id: 0
            }
        }
    ]
)

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