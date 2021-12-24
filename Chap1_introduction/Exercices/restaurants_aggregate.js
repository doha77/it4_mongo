/*
 On cherche le nombre de restaurants japonais par quartier
**/
db.restaurants.aggregate([
    {$match : { cuisine : "Japanese"}},
    {$group : {
        _id : "$borough", total : { $sum : 1 }
    }}
]);

/**
{ "_id" : "Brooklyn", "total" : 153 }
{ "_id" : "Staten Island", "total" : 33 }
{ "_id" : "Manhattan", "total" : 438 }
{ "_id" : "Missing", "total" : 2 }
{ "_id" : "Bronx", "total" : 17 }
{ "_id" : "Queens", "total" : 117 }
 */