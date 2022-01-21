





db.restaurants.mapReduce(
    function(){
        // this la collection compter le nombre de A par collection
        const countGradeA = this.grades.filter( g => g.grade == 'A').length
        emit(this.cuisine, countGradeA);
    },
    function (k, v){ return Array.sum(v)},
    { out : "numberA"}
);