document.addEventListener("DOMContentLoaded",function(){
  obj.init(); 
});

var obj={
  user:{
    name:"admin",
    password:"vetobit"
  },
  init:function(){
    this.authorizationStart(this.user.name,this.user.password,"json/users.json",function(){
      if(obj.authorization){
        obj.getDataFromJson("json/data.json");
      }
    });
  },
  getDataFromJson:function (url){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4 && xhr.status==200){
        obj.data=JSON.parse(xhr.responseText);
      }
    };
    xhr.send(null);
  },
  authorizationStart:function(userName,password,url,func){
    var xhr = new XMLHttpRequest();

    obj.authorization = false;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4 && xhr.status==200){
        JSON.parse(xhr.responseText).map(function(responseUser){
          if(responseUser.userName==userName && responseUser.password==password){
            obj.authorization = true;
            obj.user.privileges = responseUser.privileges;
          }
        });
        obj.authorizationEnd(func);
      }
    };
    xhr.send(null);
  },
  authorizationEnd:function(func){
    func();
  }
};