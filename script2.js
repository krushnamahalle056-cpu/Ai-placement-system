let a = 39 , b = 20;

let c = a+b;
function add(){
    console.log("addition of two numbers : "+ c)
};

add();

let d = a-b;
function sub(){
    console.log("subtraction of two numbers : " + d);
};

sub();

let R = sub();

if(R==3){
    console.log("something is happen");
}else{
    for(let i=1; i<=d; i++){
        console.log(i+`my name is Krushna`);
    }
}