function Help()
{
    this.isVisible = false;
    this.helpText = "";
    this.helpTopic = "";
    this.helpIdx = 1;
    this.originX = 100;
    this.originY = 100;
    this.helpBoxWidth = 200;
    this.helpBoxHeight = 200;
    this.nextButtonWidth = 70;
    this.nextButtonHeight = 25;

    this.help = [
            {"topic":"lobby"
                ,"item": [
                    {"help_text":"Turn help on and off here","options":{"action":"highlight-clickarea","clickAction":"menu"}}
                    ,{"help_text":"Go to the world map, buy land and attack other people","options":{"action":"highlight-clickarea","clickAction":"open-lobby"}}
                    ,{"help_text":"Clicking a square allows you to buy that area (if you have enough coin)","options":{"action":"highlight-area","x":100,"y":100,"width":100,"height":100}}
                    ,{"help_text":"Configure your army, buy units and equip items.","options":{"action":"highlight-clickarea","clickAction":"open-army"}}
                    ,{"help_text":"Go to battle, use your army to attack other players.","options":{"action":"highlight-clickarea","clickAction":"create-battle"}}                ]
            }
        
    ];


    this.showHelpTopic = function(topic)
    {
        this.isVisible = true;
        dataHandler.saveData("help-is-on", true);

        if(topic != this.helpTopic)
        {
            this.helpTopic = topic;
            this.helpIdx = 0;
        }
        else
        {
            this.getNext();
        }

        
        this.resetLocation();

    }

    this.closeHelp = function()
    {
        this.isVisible = false;
        playGui.clearClickArea("get-prior-help");
        playGui.clearClickArea("get-next-help");
        playGui.clearClickArea("close-help");

        dataHandler.saveData("help-is-on", false);

    }

    this.resetLocation = function()
    {
        if(!this.isVisible) return;
        
        this.helpBoxWidth = 200;
        this.helpBoxHeight = 200;
        this.originX = playGui.getScreenWidth() / 2 - this.helpBoxWidth / 2;
        this.originY = playGui.getScreenHeight() /2 - this.helpBoxHeight / 2;

        playGui.addClickArea(this.originX + 5, this.originY + this.helpBoxHeight + 10, this.nextButtonWidth, this.nextButtonHeight, "get-prior-help");
        playGui.addClickArea(this.originX + this.helpBoxWidth, this.originY + this.helpBoxHeight +10, this.nextButtonWidth, this.nextButtonHeight, "get-next-help");
        playGui.addClickArea(this.originX + this.helpBoxWidth + 30, this.originY, 50, 30, "close-help");

    }

    this.getNext = function()
    {
        this.helpIdx++;

        var help = this.getHelp(this.helpTopic);

        if(this.helpIdx >= help.item.length)
        {
            this.helpIdx = 0;
            this.closeHelp();
        }

        this.resetLocation();
    }

    
    this.getPrior = function()
    {
        this.helpIdx--;

        if(this.helpIdx <= 0)
        {
            this.helpIdx = 0;
        }
        this.resetLocation();
    }


    this.getHelp = function(topicName)
    {
        for(var i=0;i<this.help.length;i++)
        {
            if(this.help[i].topic == topicName)
            {
                return this.help[i];
            }
        }
    }


    this.render = function(context)
    {
        if(!this.isVisible) return;
        
        var img = assets.getImg("gui-panel-background-next-buttons").img;
        context.drawImage(img, 0,0, img.width, img.height, this.originX, this.originY, img.width, img.height);

        context.fillStyle = "#333";
        var help = this.getHelp(this.helpTopic);
        var item = help.item[this.helpIdx];
        var msg = help.item[this.helpIdx].help_text;
        playGui.wrapTextAndRender(context,msg, this.originX + 15, this.originY + 40, 20, this.helpBoxWidth - 10) 

        if(item.options.action == "highlight-area")
        {
            context.strokeStyle = "blue";
            context.lineWidth = 5;
            x = item.options.x;
            y = item.options.y;
            w = item.options.width;
            h = item.options.height;

           

        }


        if(item.options.action == "highlight-clickarea")
        {
            var click = playGui.getClickArea(item.options.clickAction);

            context.strokeStyle = "blue";
            context.lineWidth = 5;
            x = click.minX - 10;
            y = click.minY - 10;
            w = click.width + 20;
            h = click.height + 20;
            playGui.drawRoundRect(context, x, y, w, h, 5, false, true);

            var img = assets.getImg("gui-hand-pointer").img;
            context.drawImage(img, x, y);

            context.lineWidth = 1;
            connect = true;
        }

        return;

        context.fillRect(this.originX, this.originY, this.helpBoxWidth, this.helpBoxHeight);
        context.fillStyle = "white";
        
        

        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        var connect = false;

        if(item.options.action == "highlight-area")
        {
            context.strokeStyle = "blue";
            context.lineWidth = 5;
            x = item.options.x;
            y = item.options.y;
            w = item.options.width;
            h = item.options.height;

            playGui.drawRoundRect(context, x, y, w, h, 5, false, true);
            context.lineWidth = 1;
            connect = true;
        }


        if(item.options.action == "highlight-clickarea")
        {
            var click = playGui.getClickArea(item.options.clickAction);

            context.strokeStyle = "blue";
            context.lineWidth = 5;
            x = click.minX - 10;
            y = click.minY - 10;
            w = click.width + 20;
            h = click.height + 20;
            playGui.drawRoundRect(context, x, y, w, h, 5, false, true);

            context.lineWidth = 1;
            connect = true;
        }


        if(connect)
        {
            context.lineWidth = 5;
            
            if(y > this.originY)
            {
                context.beginPath();
                context.moveTo(x + w/2, y);
                context.lineTo(this.originX  + this.helpBoxWidth/ 2, this.originY + this.helpBoxHeight);
                context.stroke();
            }

            if(y < this.originY)
            {
                context.beginPath();
                context.moveTo(x + w/2, y + w);
                context.lineTo(this.originX  + this.helpBoxWidth/ 2, this.originY);
                context.stroke();
            }


            context.lineWidth = 1;            
        }
        var img = assets.getImg("arrow-left-2").img;
        context.drawImage(img, 0,0, img.width, img.height, this.originX + 5, this.originY + this.helpBoxHeight - 40, 50,50);

        var img2 = assets.getImg("arrow-right-2").img;
        context.drawImage(img2, 0,0, img.width, img.height, this.originX + this.helpBoxWidth - this.nextButtonWidth - 5, this.originY + this.helpBoxHeight - 40, 50,50);

        


    }
}