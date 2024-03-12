function ViewLogin()
{
    this.showing = "login";
    
    this.clickAreaSet = false;

    this.init = function()
    {
        playGui.hideHeader();

        playGui.hideFooter();

        this.loadVars();
        
        this.showLogin();
        
        
    }

    this.showLogin = function()
    {
        this.showing = "login";

        playGui.clearClickables();

        
        var d = document.getElementById("div-new-user");
        d.style.visibility = "visible";
        var w =  (playGui.screenWidth *.80);
        d.style.width = w + "px";
        //d.style.border = "1px solid white";
        d.style.top = "50px";
        d.style.left = (playGui.screenWidth *.10) + "px";
    }

    
    this.showRegister = function()
    {
        this.showing = "register";
        
        playGui.clearClickables();

        playGui.addClickArea(this.loginButtonX, this.loginButtonY + 115, 100, 40, "register");

        playGui.addClickArea(this.loginButtonX, this.loginButtonY + 160, 100, 40, "show-login");

        var d = document.getElementById("div-new-user-register");
        d.style.visibility = "visible";
        var w =  (playGui.screenWidth *.80);
        d.style.width = w + "px";
        d.style.top = "50px";
        d.style.left = (playGui.screenWidth *.10) + "px";
    }

    this.loadVars = function()
    {
        this.currentMsg = "Waiting on you...";

        this.loginButtonX = playGui.screenWidth/2 - 50;
        this.loginButtonY = 220;
    }




    this.processAction = function(actionKey)
    {

        if(actionKey == "login")
        {
            user.login();
            
        }

        if(actionKey == "register")
        {
            user.register();
            
        }

    }

    this.setCurrentMsg = function(msg)
    {
        this.currentMsg = msg;
    }

    this.renderUnderGui = function(context)
    {
        context.fillStyle = "#474747";
        context.fillRect(0,0,playGui.screenWidth, 30);

        if(this.showing == "login")
        {
            var loginPanelImg = assets.getImg("gui-panel-login").img;
            
            var drawX = playGui.screenWidth/2 - loginPanelImg.width/2;
            var drawY = 50;
            context.drawImage(loginPanelImg, drawX, drawY);

            if(!this.clickAreaSet)
            {
                playGui.addClickArea( drawX + 5, drawY + 81, 80, 25, "login");
                playGui.addClickArea(drawX + 110, drawY + 81, 80, 25, "show-register");

                var d = document.getElementById("login-username");
                d.style.top = (drawY -15) + "px";
                d.style.left = (drawX - 40) + "px";

                var d = document.getElementById("login-password");
                d.style.top = (drawY + 3) + "px";
                d.style.left = (drawX - 40) + "px";

                
            }
            this.clickAreaSet = true;

            context.fillStyle = playGui.getMainColor();
            context.font = "16px Arial";
            context.fillText(this.currentMsg, drawX + 30, drawY + 150);
        }

        if(this.showing == "register")
        {
            var regPanelImg = assets.getImg("gui-panel-register").img;
            
            var drawX = playGui.screenWidth/2 - regPanelImg.width/2;
            var drawY = 50;
            context.drawImage(regPanelImg, drawX, drawY);
            
            
            if(!this.clickAreaSet)
            {
                playGui.addClickArea( drawX + 5, drawY + 125, 80, 25, "show-login");
                playGui.addClickArea(drawX + 110, drawY + 125, 80, 25, "register");

                var d = document.getElementById("reg-username");
                d.style.top = (drawY -15) + "px";
                d.style.left = (drawX) + "px";

                var d = document.getElementById("reg-password");
                d.style.top = (drawY + 3) + "px";
                d.style.left = (drawX) + "px";

                
                var d = document.getElementById("reg-email");
                d.style.top = (drawY + 23) + "px";
                d.style.left = (drawX) + "px";


                var d = document.getElementById("reg-mobile");
                d.style.top = (drawY + 42) + "px";
                d.style.left = (drawX) + "px";                
                
            }

            this.clickAreaSet = true;


            context.fillStyle = "#F9E5A5";
            context.font = "16px Arial";
            context.fillText(this.currentMsg, drawX + 50, drawY + 200);

        }

        context.fillStyle = "#474747";
        context.fillRect(0,playGui.screenHeight - 30,playGui.screenWidth, 30);
    }

    this.renderOnTopOfGui  = function(context) {}



    this.tileClicked = function(tileX, tileY)
    {

    }

    
    this.mouseClicked = function(mouseX, mouseY)
    {
        
    }
}


        