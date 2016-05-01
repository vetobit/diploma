document.addEventListener("DOMContentLoaded",function(){                                          // при загрузки страницы
  window.location.hash="loginForm";                                                               // выполнить функцию инициализации
});

var obj={                                                                                         // Объявляем главный объект программы
  user:{                                                                                          // Данные о пользователе, который будет собирать модуль программы
    name:"admin",                                                                                 // Имя пользователя
    password:"vetobit"                                                                            // Пароль пользователя
  },
  init:function(){                                                                                // Функция инициализации
    this.authorizationStart(this.user.name,this.user.password,"json/users.json",function(){       // Запуск функции авторизации с параметрами (имя, пароль, путь до файла с пользователями, функция после получения данных об авторизации)
      if(obj.authorization){                                                                      // Если авторизация успешна
        obj.getDataFromJson("json/data.json",function(){obj.view(obj.user.privileges);});                                                    // Выполняем функцию загрузки всех товаров по пути к файлу товаров
      }
    });
  },
  getDataFromJson:function (url,func){                                                                 // Функция получения товаров из файла
    var xhr = new XMLHttpRequest();                                                               // Объявляем новый объект соединения
    xhr.open("GET", url, true);                                                                   // Задаём условия соединения (метод GET, путь до файла с товарами, ассихронная загрузка)
    xhr.onreadystatechange = function(){                                                          // Объявляем функцию после завершения подготовки объекта соединения
      if(xhr.readyState==4 && xhr.status==200){                                                   // Если объект соединения завершил подготовку и статус сервера вернул положительный результат
        obj.data=JSON.parse(xhr.responseText);                                                    // То записываем в объект программы новый массив для хранения товаров и записываем в него данные из файла
        func();
      }
    };
    xhr.send(null);                                                                               // Отправляем пустой запрос на сервер для получения ответа
  },
  authorizationStart:function(userName,password,url,func){                                        // Функция начала авторизации. Принимает (Имя пользователя, пароль, путь до файла с пользователями, функция инициализации)
    var xhr = new XMLHttpRequest();                                                               // Объявляем новый объект соединения

    obj.authorization = false;                                                                    // Записываем в основной объект новую переменную, которая будет хранить ответ авторизации и записываем отрицательный результат
    xhr.open("GET", url, true);                                                                   // Задаём условия соединения (метод GET, путь до файла с пользователями, ассихронная загрузка)
    xhr.onreadystatechange = function(){                                                          // Объявляем функцию после завершения подготовки объекта соединения
      if(xhr.readyState==4 && xhr.status==200){                                                   // Если объект соединения завершил подготовку и статус сервера вернул положительный результат
        JSON.parse(xhr.responseText).map(function(responseUser){                                  // Преобразуем полученные данные в объект и, так как это массив объектов, то перебираем его объекты. Для каждого такого объекта выполняется функция в который он передаётся
          if(responseUser.userName==userName && responseUser.password==password){                 // Если имя и пароль в объекте совпадают с именем и паролем пользователя
            obj.authorization = true;                                                             // Записываем в свойство авторизации основного объекта программы положительный результат
            obj.user.privileges = responseUser.privileges;                                        // Создаём новое свойство в пользователе основного объекта программы, которое будет хранить тип пользователя и записываем значение из объекта
          }
        });
        obj.authorizationEnd(func);                                                               // Вызываем функцию конца авторизации и передаём в неё функцию инициализации
      }
    };
    xhr.send(null);                                                                               // Отправляем пустой запрос на сервер для получения ответа
  },
  authorizationEnd:function(func){                                                                // Функция конца авторизации, которая принимает функцию инициализации
    func();                                                                                       // Вызываем функцию инициализации
  },
  addInData:function(product){
    if(product){
      this.data.push(product);
    }
    console.log(obj.data)   //записать в продукты
    this.view(this.user.privileges);
  },
  addUser:function(user){
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "json/users.json", true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4 && xhr.status==200){
        console.log(JSON.stringify(JSON.parse(xhr.responseText).push(user))); // вместо вывода записать
      }
    };
    xhr.send(null);
  },
  newQuantityInProduct:function(productId,quantity){
    this.data[productId].quantity=quantity;
    this.addInData(false);
    this.view(this.user.privileges);
  },
  addToCard:function(productId){
    if(!this.card){
      this.card=[];
    }
    this.card.push(this.data[productId]);
  },
  view:function(privileges){
    var hashs=[
                "admin",
                "cashier",
                "buyer"
              ],
        table=document.querySelector("#"+hashs[privileges]+" .products"),
        string="";
    table.innerHTML+="<tbody></tbody>";
    for(key in obj.data){
      var product=obj.data[key];
      if(!product.number){
        product.number=0;
      }
      string+="<tr><td class='trProductId'>"+key+"</td><td class='trProductName'>"+product.name+"</td><td class='trProductBarcode'>"+product.barcode+"</td><td class='trProductNumber'>"+product.number+"</td></tr>";
    }
    table.querySelector("tbody").innerHTML=string;
    window.location.hash=hashs[privileges];
  },
  getProduct:function(elem){
    var parent=elem.parentNode,
        product={
          name:parent.querySelector(".productName").value,
          barcode:parent.querySelector(".productBarcode").value,
          number:parent.querySelector(".productNumber").value
        };
    obj.addInData(product);
  }
};