function GameMenu()
{
    this.menuX = beamerGui.screenWidth - 180;
    this.menuY = 10;
    
    this.menuButtonWidth = 167;
    this.menuButtonHeight = 30;

    this.subButtonWidth = 145;
    this.subButtonHeight = 40;

    this.isOpen = false;

    this.init = function()
    {
        beamerGui.clearClickArea("menu");

        assets.addAsset({key:"gui-menu-main",imgSrc:"img/gui/menu-button.png"});
        assets.addAsset({key:"gui-menu-open",imgSrc:"img/gui/menu-open.png"});

        
        beamerGui.addClickArea(this.menuX, this.menuY, this.menuButtonWidth, this.menuButtonHeight, "menu");

        beamerGui.addClickArea(this.menuX + 20, this.menuY + 40, this.subButtonWidth,this.subButtonHeight, "menu-open-help");

        beamerGui.addClickArea(this.menuX + 20, this.menuY + 80, this.subButtonWidth,this.subButtonHeight, "menu-logout");

        beamerGui.addClickArea(beamerGui.screenWidth - 50, beamerGui.screenHeight - 50, 50, 50, "toggle-click-areas");
                //this.addClickArea(200,200, 50, 50, "toggle-click-areas");

        beamerGui.disableClickArea("menu-logout");
        
        beamerGui.disableClickArea("menu-open-help");

        //this.openMenu();
    }


    this.toggleMenu = function()
    {
        
        if(this.isOpen)
        {
            this.closeMenu();   
        }
        else
        {
            this.openMenu();
        }
    }

        
    this.closeMenu = function()
    {
        this.isOpen = false;
        
        for(var i=0;i<beamerGui.clickArea.length;i++)
        {
            if(beamerGui.clickArea[i].clickKey.substring(0,5) == 'menu-')
            {
                beamerGui.clickArea[i].disabled = true;
            }
        }

    }

    this.openMenu = function()
    {
        this.isOpen = true;

        for(var i=0;i<beamerGui.clickArea.length;i++)
        {
            if(beamerGui.clickArea[i].clickKey.substring(0,5) == 'menu-')
            {
                beamerGui.clickArea[i].disabled = false;
            }
        }

    }

    this.renderMenu = function(context)
    {
       if(!this.isOpen)
       {
            var img = assets.getImg("gui-menu-main").img;
            context.drawImage(img, 0,0,img.width,img.height,this.menuX, this.menuY, img.width, img.height);
       }
       else
       {
            var img = assets.getImg("gui-menu-open").img;
            context.drawImage(img, 0,0,img.width,img.height,this.menuX, this.menuY, img.width, img.height);
       }
    }
}


function BeamerMenu(config)
{
    this.config = config
    this.originX = config.drawX;
    this.originY = config.drawY;
    this.visible = false;
    this.clickAreaSet = false;

    beamerGui.debug("Adding Menu", this.config);

    this.render = function(context)
    {
        if(!this.visible) return;
        
        var drawX = this.originX;
        var drawY = this.originY;
        var drawWidth = this.config.menuWidth;
        var drawHeight = this.config.menuHeight;

        context.globalAlpha = .5;
        context.fillStyle = beamerGui.defaultMenuBackgroundColor;
        context.fillRect(drawX, drawY, drawWidth, drawHeight);
        context.globalAlpha = 1;

        context.font = beamerGui.defaultMenuHeaderFont;
        context.fillStyle = beamerGui.defaultMenuFontColor;
        context.fillText(this.config.menuHeader, drawX + 10, drawY + 15);
        
        var buttonDrawWidth = this.config.menuWidth * .80;
        var buttonDrawHeight = 25;
        drawY+=30;
        drawX+=(this.config.menuWidth - buttonDrawWidth)/2;

        for(var i=0;i<this.config.buttons.length;i++)
        {
            context.fillStyle = beamerGui.defaultButtonColor;
            context.fillRect(drawX, drawY, buttonDrawWidth, buttonDrawHeight);
            context.fillStyle = beamerGui.defaultButtonFontColor;
            context.fillText(this.config.buttons[i].buttonText, drawX + 10, drawY + 15);

            
            if(!this.clickAreaSet)
            {
                beamerGui.addClickArea(drawX, drawY, buttonDrawWidth, buttonDrawHeight, this.config.buttons[i].buttonActionKey);
                
            }
            
            drawY+=30;
        }

        this.clickAreaSet = true;

    }

    this.close = function()
    {
        for(var i=0;i<this.config.buttons.length;i++)
        {
            beamerGui.disableClickArea(this.config.buttons[i].buttonActionKey);         
        }

        this.visible = false;
    }

    this.open = function()
    {
        this.visible = true;

        this.clickAreaSet = false;

        for(var i=0;i<this.config.buttons.length;i++)
        {
            this.config.buttons[i].clickAreaSet = false;         
        }

    }
}





function BeamerMenuItem(config)
{
    this.config = config
    this.menuItemImg = assets.getImg(config.imgKey).img;
    
    this.originX = config.drawX;
    if(this.originX == undefined) this.originX = beamerGui.getScreenWidth() - this.menuItemImg.width;
    this.originY = config.drawY;
    if(this.originY == undefined) this.originY = beamerGui.getScreenHeight() - 30;
    this.visible = true;
    this.clickAreaSet = false;

    beamerGui.debug("Adding Menu Item - " + config.menuItemKey);

    this.render = function(context)
    {
        if(!this.visible) return;
        
        var drawX = this.originX;
        var drawY = this.originY;

        context.drawImage(this.menuItemImg, drawX, drawY);

        if(!this.clickAreaSet)
        {
            beamerGui.addClickArea(drawX, drawY, this.menuItemImg.width, this.menuItemImg.height, this.config.actionKey);
            this.clickAreaSet = true;
        }
    }

    this.close = function()
    {
        beamerGui.disableClickArea("menu-item-clicked-" + this.config.menuItemKey);

        this.visible = false;
    }

    this.open = function()
    {
        this.visible = true;

        this.clickAreaSet = false;
    }
}




function BeamerPanel(config)
{
    this.config = config;
    this.panelKey = config.panelKey;
    this.panelImgKey = config.panelImgKey;
    this.panelMsg = config.msg;
    this.panelImg = assets.getImg(this.panelImgKey).img;
    this.originX = 0;
    this.originY = 80;
    if(config.drawX == "center") this.originX = beamerGui.getScreenCenterX() - this.panelImg.width/2;
    if(config.drawY > 0) this.originY = config.drawY;
    
    this.visible = true;
    this.font = beamerGui.defaultFont;
    this.clickAreaSet = false;
    this.buttons = [];
    this.buttonOptions = [];
    if(this.config.buttons) this.buttonOptions = this.config.buttons;

    beamerGui.debug("Opening Panel - " + this.panelKey);

    this.render = function(context)
    {
        if(!this.visible) return;
        
        var drawX = this.originX;
        var drawY = this.originY;

        context.globalAlpha = .50;
        context.drawImage(this.panelImg, drawX, drawY);
        context.globalAlpha = 1;

        context.font = this.font;
        context.fillStyle = beamerGui.defaultFontColor;
        context.fillText(this.panelMsg, drawX + 20, drawY + 40);

        for(var i=0;i<this.buttons.length;i++)
        {
            this.buttons[i].render(context);
        }

        if(!this.clickAreaSet)
        {
            beamerGui.addClickArea(drawX + 325, drawY + 125, 25,25, "close-panel-" + this.panelKey);

            this.clickAreaSet = true;



            for(var i=0;i<this.buttonOptions.length;i++)
            {
                this.buttonOptions[i].drawX = drawX + 80;
                this.buttonOptions[i].drawY = drawY + 80;
                var b = new BeamerButton(this.buttonOptions[i]);
                this.buttons.push(b);
            }
        }
    }

    this.close = function()
    {
        beamerGui.disableClickArea("close-panel-" + this.panelKey);
        this.visible = false;
    }

}




function BeamerButton(config)
{
    this.config = config
    this.originX = config.drawX;
    this.originY = config.drawY;
    this.visible = true;
    this.clickAreaSet = false;

    beamerGui.debug("Adding Button - " + config.buttonKey);

    this.render = function(context)
    {
        if(!this.visible) return;
        
        var drawX = this.originX;
        var drawY = this.originY;
        var drawWidth = 160;
        var drawHeight = 30;

        context.fillStyle = beamerGui.defaultButtonColor;
        context.fillRect(drawX, drawY, drawWidth, drawHeight);
        context.fillStyle = beamerGui.defaultButtonFontColor;
        context.fillText(this.config.buttonText, drawX + 10, drawY + 15);
        
        if(!this.clickAreaSet)
        {
            beamerGui.addClickArea(drawX, drawY, drawWidth, drawHeight, this.config.buttonActionKey);
            this.clickAreaSet = true;
        }
    }

    this.close = function()
    {
        beamerGui.disableClickArea("menu-item-clicked-" + this.config.menuItemKey);

        this.visible = false;
    }
}



