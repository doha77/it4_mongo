
// 01. Affichez tous les articles de type journal. Et donnez la quantité total de ces articles (propriété qty). Pensez à faire un script en JS.

db.inventory.find({type: "journal"}, { _id : 0, society: 1, qty : 1});

// total 
let totalQty = 0;
db.inventory.find({type: "journal"}, { _id : 0, society: 1, qty : 1}).forEach( doc => {
    totalQty += doc.qty;
});
print(totalQty);

// Aggregate
db.inventory.aggregate([
    {$match : { type : "journal"}}, // restriction premier pipe
    // aggregate des données
    { $group : { 
        _id : null, // par rapport à quel champ vous regrupez si null tous les champs tout le document
        totalQty : { $sum : "$qty"} ,
        count : { $sum : 1}
    }},
])

// pour le tester dans la console
db.inventory.aggregate([
    {$match : { type : "journal"}}, 
    { $group : { 
        _id : null,
        totalQty : { $sum : "$qty"} ,
        count : { $sum : 1}
    }},
]);

// Total des quantités par société
db.inventory.aggregate([
    { $group : { 
        _id : "$society",
        totalQty : { $sum : "$qty"} ,
        count : { $sum : 1}
    }},
]);

// total des quantités par type de societé
db.inventory.aggregate([
    { $group : { 
        _id : "$type",
        totalQty : { $sum : "$qty"} 
    }},
]);

// 02. Affichez les noms de sociétés depuis 2018 ainsi que leur quantité.
let totalQty = 0;
db.inventory.find({year: {$gte : 2018 }}, { _id : 0, society: 1, qty : 1}).forEach( doc => {
    totalQty += doc.qty;
});
print(totalQty);

// 03. Affichez les types des articles pour les sociétés dont le nom commence par A.
db.inventory.find({society : /^A/}, { _id : 0, type: 1, society : 1}).forEach( doc => {
    const { society, type } = doc;
    print(`Society ${society} type: ${type}`)
});

// 04. Affichez le nom des sociétés dont la quantité d'articles est supérieur à 45.
db.inventory.find({ qty : { $gt : 45} }, { _id : 0, society: 1, qty : 1} ).sort({ qty : 1}).forEach(doc => {
    const { qty, society } = doc;
    print(`Society ${society} quantity: ${qty}`)
})

// 05. Affichez le nom des sociétés dont la quantité d'article(s) est strictement supérieur à 45 et inférieur à 90.

db.inventory.find({
    $and : [
    { qty : { $gt : 45} }, 
    { qty : { $lt : 90}}
    ]
    }, 
    { _id : 0, society: 1, qty : 1} 

).sort({ qty : 1}).forEach(doc => {
    const { qty, society } = doc;
    print(`Society ${society} quantity: ${qty}`)
})