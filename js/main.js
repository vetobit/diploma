document.addEventListener("DOMContentLoaded",function(){
  obj.init(); 
});

var obj={
  init:function(){
    this.getFromJson("json/data.json","data");
  },
  getFromJson:function (url,array){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4 && xhr.status==200){
        obj[array]=JSON.parse(xhr.responseText);
      }
    }
    xhr.send(null);
  }
};