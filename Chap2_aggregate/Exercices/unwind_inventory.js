


db.createCollection('inventory');
db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [10, 18, 20] });

// on décompacte les tailles puis on regroupe en fonction de l'item et enfin on calcule la moyenne

// d'abord regardez cette requête pour voir ce qu'elle fait
db.inventory.aggregate( [ 
    { $unwind : "$sizes" }
])

// Puis effectuez celle-ci
db.inventory.aggregate( [ 
    { $unwind : "$sizes" },
    { $group : { _id : "$item", avg_size : { $avg : "$sizes"}}}
] );
