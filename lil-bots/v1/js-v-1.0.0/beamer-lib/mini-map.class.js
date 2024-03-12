function MiniMap()
{
    this.drawX = 0;
    this.drawY = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
    this.tileSize = 0;

    this.setDimensions = function(x, y, w, h, mapWidth, mapHeight)
    {
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = w;
        this.drawHeight = h;
        this.tileSize = w/mapWidth;
    }


    this.render = function(context)
    {
        context.globalAlpha = .5;
        
        context.fillStyle = "#333333";
        context.strokeStyle = "white";
        
        beamerGui.drawRoundRect(context, this.drawX, this.drawY, this.drawWidth, this.drawHeight, 5, true, true);
        
        context.strokeStyle = "black";

        var objs = play.view.map.gameObjs;

        for(var i=0;i<objs.length;i++)
        {
            var obj = objs[i];

            if(obj.isAlive())
            {
                var dX = this.drawX + obj.getTileX() * this.tileSize;
                var dY = this.drawY + obj.getTileY() * this.tileSize;

                context.fillStyle = "black";
                if(obj.getUserID() != user.userID)
                {
                    context.fillStyle = "black";
                }
                
                if(obj.getUserID() == user.userID)
                {
                    context.fillStyle = "blue";
                }

                if(obj.getUserID() == -1)
                {
                    context.fillStyle = "white";
                }
                

                context.fillRect(dX, dY, this.tileSize, this.tileSize);
            }
        }

        var mapTileSize = play.view.map.getTileSize();
        var viewWidthTiles = Math.floor(beamerGui.screenWidth/mapTileSize);
        var viewHeightTiles = Math.floor(beamerGui.screenHeight/mapTileSize);
        var viewX = this.drawX - (play.view.map.getOriginX()/mapTileSize) * this.tileSize;
        var viewY = this.drawY - (play.view.map.getOriginY()/mapTileSize) * this.tileSize;
        var viewWidth = viewWidthTiles * this.tileSize;
        var viewHeight = viewHeightTiles * this.tileSize;

        context.fillStyle = "red";
        context.strokeRect(viewX, viewY, viewWidth, viewHeight); 
            
        //context.fillText(viewWidth, this.drawX, this.drawY + 200);

        context.globalAlpha = 1;
    }
}