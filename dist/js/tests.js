function db(key){  
    var current;
    try{
        current= JSON.parse(localStorage.getItem(key));
    }catch(e){

    }
    this.arr=current || [];
    this.sync = function(){
      localStorage.setItem(key,JSON.stringify(this.arr));  
    };
}
db.prototype.add=function(data){
    data.id = this.max();
    this.arr.push(data);
    this.sync();
    return data.id;
};
db.prototype.get=function(indx){
    var i=0;
    indx = parseInt(indx,10);
    while(i<this.arr.length){
        if (this.arr[i].id === indx){
            return this.arr[i];
        }
        i++;
    }
    return -1;
};
db.prototype.getAll=function(){
    return this.arr;
};
db.prototype.max=function(){
    //check if we have more than one item
    return this.arr.length > 1 ?
            //if so find the max and add 1
            findMax(this.arr)+1 :
            //otherwise, if we only have one
            this.arr.length > 0 ?
                //use it and add 1
                this.arr[0].id+1 :
                //otherwise start with 0
                0;
};
db.prototype.length=function(){
    return this.arr.length;
};
db.prototype.update=function(id,key,newValue){
    id = parseInt(id,10);
    var i=0;
    while(i<this.arr.length){
        if (this.arr[i].id === id){
            this.arr[i][key]=newValue;
            this.sync();
            break;
        }
        i++;
    }
};
db.prototype["delete"]=function(id){
    id = parseInt(id,10);
    var i=0;
    while(i<this.arr.length){
        if (this.arr[i].id === id){
            this.arr.splice(i,1);
            this.sync();
            break;
        }
        i++;
    }
};

//Resig, care of: http://stackoverflow.com/questions/1379553/how-might-i-find-the-largest-number-contained-in-a-javascript-array
//and the modified a bit
function findMax( array ){
    return Math.max.apply( Math, array.map(function(item){return item.id;}) );
}
