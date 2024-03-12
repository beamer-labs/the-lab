function BeamerUtils()
{
    this.numGenObjs = 0;

    this.color = [];
    
    this.initGameEngine = function()
    {
        gameEngine.showFps = false;
        
        gameEngine.showDebug = false;

        gameEngine.addCanvas("main-game-canvas");

        gameEngine.startRendering();

        gameEngine.clearAllObjects();

        inputHandler.bind();

        this.usingServer = true;

        play.config["connect-to-server"] = true;

    }

   this.loadGameCanvas = function()
    {
        beamerGui.loadGui();

        beamerGui.startRendering();
 
    }

    
    this.createGuid = function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
      
      
      
    this.getNextObjIdx = function() {this.numGenObjs++; return this.numGenObjs;}

    this.getDefaultMenuOptions = function()
    {
      var menuOptions = {
        "menuHeader": ""
        ,"menuTriggerKey":"menu"
        ,"menuWidth": 150
        ,"menuHeight":200
        ,"drawX": beamerGui.getScreenWidth() - 200
        ,"drawY": beamerGui.getScreenHeight() - 250
        , "buttons": [
            {"buttonText":"next", "buttonActionKey":"next"}
        ]
      };

      return menuOptions;
    }

}