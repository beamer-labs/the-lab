function BeamerUtils()
{
    this.screenWidth = 0;
    this.screenHeight = 0;

    this.loadGameCanvas = function()
    {
        var canvas = document.getElementById("main-game-canvas");

        var context = canvas.getContext("2d");

        //inputHandler.bind();
        
        this.showView("view-game-canvas");

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        screenWidth =  this.getScreenWidth();
        screenHeight = this.getScreenHeight();

       console.log("BeamerUtils.loadGui(): Completed");

       return context;
    }

    

    this.loadView = function(viewDivID) {this.showView(viewDivID);}
    this.showView = function(viewDivID)
    {
        var i;
        var x = document.getElementsByClassName("view");
        for (i = 0; i < x.length; i++) 
        {
            x[i].style.display = "none"; 
        }
        var d = document.getElementById(viewDivID);
        
        if(d)
        {
            document.getElementById(viewDivID).style.display = "block"; 
        }
        else
        {
            debug("Something went wrong...(view:" + viewDivID + " not found)");
        }        

        console.log("gui.showView(" + viewDivID + ")");


    }


    
    this.getScreenWidth = function()
    {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    }

    this.getScreenHeight = function()
    {
        return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    }





}
    
