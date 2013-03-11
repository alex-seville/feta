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
    this.arr.push(data);
    this.sync();
    return this.arr.length-1;
};
db.prototype.get=function(indx){
    return this.arr[indx];
};
db.prototype.length=function(){
    return this.arr.length;
};
