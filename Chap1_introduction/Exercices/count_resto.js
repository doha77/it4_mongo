
let count  = 0;
db.restaurants.find({borough : "Brooklyn"}).forEach( doc => { count++});

print(`Nombre de restaurants dans Brooklyn :${count}`);