function Data()
{
    this.config = {rootUrl:config.rootUrl};

    this.debugAjax = false;
    this.numRunningAjax = 0;
    this.dataLoop = "";
    this.loopSpeedSecs = 3000;
    this.loopUrl = "";
    this.loopData = "";
    this.loadingDivID = "";
    
    this.save = function(key,value){this.saveData(key,value);}

    this.saveData = function(key, value)
    {
        localStorage.setItem(key, JSON.stringify(value));
    }

    this.get = function(key) {return this.getData(key);}
    this.getData = function(key)
    {
        var val = localStorage.getItem(key);

        if(this.isJsonString(val))
        {      
          return JSON.parse(val)
        }
        else
        {
          return val;
        }
    }

    this.clearAllData = function()
    {
        localStorage.clear();
    }

    this.generateGuid = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
  
      this.ajaxOff = function()
      {
          //place holder
      }
    
      this.addUserAuth = function(data)
      {
        data.userGuid = user.userGuid;
        data.authToken = user.authToken;

        return data;
      }



      this.stopLooping = function()
      {
        if(dataHandler.dataLoop) clearInterval(dataHandler.dataLoop);
      }

      this.startDataLooop = function(url, data)
      {
        dataHandler.loopUrl = url;

        dataHandler.loopData = data;

        if(dataHandler.dataLoop) clearInterval(dataHandler.dataLoop);

        dataHandler.dataLoop = setInterval("window.requestAnimationFrame(dataHandler.nextDataUpdate)",dataHandler.loopSpeedSecs);

      }

      this.nextDataUpdate = function()
      {
          if(dataHandler.debugAjax)console.log("nextDataUpdate()...");
        
          var requestUrl = this.config.rootUrl + dataHandler.loopUrl;

          var data = dataHandler.loopData;

          data = dataHandler.addUserAuth(data);

          if(dataHandler.debugAjax) console.log("data.nextDataUpdate(): sending", data, requestUrl);

          dataHandler.startAjax();

          $.ajax({
            type: "GET",
            url: requestUrl,
            data:data,
            complete: function () {
                dataHandler.ajaxOff();
            },
          success: function(data) {
            
                  if(data.error.errorMsg != "")
                  {
                    console.error(data.error.errorMsg);
                  }

                  play.syncData(data.data);

                  dataHandler.endAjax();
           
                }
            ,error: function(jqXHR, exception) {
              console.error("AJAX Issue:" + jqXHR.responseText);
                }
          });




      }

      

      this.startAjax = function()
      {
        this.numRunningAjax++;

        var d = document.getElementById("ajax-ind-img");
        
        if(d != undefined) 
        {
          d.style.visibility = "visible";
        }
      }


      this.endAjax = function()
      {
        this.numRunningAjax--;
        
        if(this.numRunningAjax <= 0) this.numRunningAjax = 0;

        
        var d = document.getElementById("ajax-ind-img");
        
        if(d != undefined) 
        {
          d.style.visibility = "hidden";
        }


        //document.getElementById("div-ajax-indicator").innerHTML = "Request: " + dataHandler.numRunningAjax;
      }


      this.loadDiv = function(url, data, divID)
      {
        if(dataHandler.loadingDivID != "")
        {
          console.error(dataHandler.loadingDivID + " is waiting to be loaded");
          return;
        }
        else
        {
          dataHandler.loadingDivID = divID;
        }


        var requestUrl = this.config.rootUrl + url;

        data = this.addUserAuth(data);

        if(dataHandler.debugAjax) console.log("data.loadDiv(): sending", data, url);

        dataHandler.startAjax();

        $.ajax({
          type: "GET",
          url: requestUrl,
          data:data,
          complete: function () {
              dataHandler.ajaxOff();
          },
         success: function(dataPacket) {
                

                document.getElementById(dataHandler.loadingDivID).innerHTML = dataPacket;

                dataHandler.loadingDivID = "";
                
                dataHandler.endAjax();
          
              }
          ,error: function(jqXHR, exception) {
             console.error("AJAX Issue:" + jqXHR.responseText);
              }
        });

      }


      this.sendDataAndCallBack = function(url, data, callBack)
      {
        var requestUrl = this.config.rootUrl + url;

        data = this.addUserAuth(data);

        if(dataHandler.debugAjax) console.log("data.sendDataAndCallBack(): sending", data, url);

        dataHandler.startAjax();

        $.ajax({
          type: "GET",
          url: requestUrl,
          data:data,
          complete: function () {
              dataHandler.ajaxOff();
          },
         success: function(dataPacket) {
          
                if(dataHandler.debugAjax) console.log("data.sendDataAndCallBack(): returned", dataPacket);

                if(dataPacket.hadError)
                {
                  console.warn("WARNING: " + dataPacket.error.errorMsg);
                  beamerGui.growl(dataPacket.error.errorMsg, 3);
                }

                if(dataPacket.userAlerts.length > 0)
                {
                  beamerGui.growl(dataPacket.userAlerts[0], 3);
                }


                callBack(dataPacket.data);


                dataHandler.endAjax();
          
              }
          ,error: function(jqXHR, exception) {
             console.error("AJAX Issue:" + jqXHR.responseText);
              }
        });

      }


      
      this.postDataAndCallBack = function(url, data, callBack)
      {
        var requestUrl = this.config.rootUrl + url;

        data = this.addUserAuth(data);

        if(dataHandler.debugAjax) console.log("data.sendDataAndCallBack(): sending", data, url);

        dataHandler.startAjax();

        $.ajax({
          type: "POST",
          url: requestUrl,
          data:data,
          complete: function () {
              dataHandler.ajaxOff();
          },
         success: function(dataPacket) {
          
                if(dataHandler.debugAjax) console.log("data.sendDataAndCallBack(): returned", dataPacket);

                if(dataPacket.error.errorMsg != "")
                {
                  console.warn("WARNING: " + dataPacket.error.errorMsg);
                  //gui.growl(dataPacket.error.errorMsg, 3);
                }

                if(dataPacket.userAlerts.length > 0)
                {
                  gui.growl(dataPacket.userAlerts[0], 3);
                }


                callBack(dataPacket.data);


                dataHandler.endAjax();
          
              }
          ,error: function(jqXHR, exception) {
             console.error("AJAX Issue:" + jqXHR.responseText);
              }
        });

      }



      this.sendData = function(url, data)
      {
        var requestUrl = this.config.rootUrl + url;

        if(dataHandler.debugAjax) console.log("data.sendData(): sending", data);

        dataHandler.startAjax();

        data = this.addUserAuth(data);

        $.ajax({
          type: "GET",
          url: requestUrl,
          data:data,
          complete: function () {
              dataHandler.ajaxOff();
          },
         success: function(data) {
                  
                if(dataHandler.debugAjax) console.log(data);

                if(data.error.errorMsg != "")
                {
                  console.error(data.error.errorMsg);
                }
           
                 dataHandler.endAjax();
              }
          ,error: function(jqXHR, exception) {
             console.error("AJAX Issue:" + jqXHR.responseText);
              }
        });

      }


      this.isJsonString = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


    this.render = function(context, drawX, drawY)
    {
      for(var i=0;i<this.numRunningAjax+1;i++)
      {
        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#000000";
        context.fillRect(drawX - (i *8), drawY, 5,10);
        //context.strokeRect(drawX - (i *8), drawY, 5,10);
      }

    }


}