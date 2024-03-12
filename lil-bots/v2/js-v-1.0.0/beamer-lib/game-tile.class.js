
function GameTile(tileX, tileY, dX, dY, config)
{
    this.config = config;
    this.tileX = tileX;
    this.tileY = tileY;
    this.dY = dX;
    this.dX = dY;
    this.screenX = 0;
    this.screenY = 0;
    this.label = label;
    this.boundX = 0;//originX + dX + tileSize/2 - 10;
    this.boundY = 0;//originY + dY + 10;
    this.boundWidth = play.getTileSize()/4;
    this.boundHeight = play.getTileSize()/4;
    this.tileSize = config.tileSize;
    this.originX = play.getMapOriginX();
    this.originY = play.getMapOriginY();
    this.tileWidth = config.tileSize;
    this.tileHeight = config.tileSize;
    this.shadeColor = "";

    this.init = function()
    {
        if(this.config.imgKey)
        {
            assets.addAsset({key: this.config.imgKey,imgSrc: this.config.imgSrc});
        }
        
        this.label = this.tileX + "," + this.tileY;
    }

    this.shadeTile = function(color)
    {
        this.shadeColor = color;
    }

    this.draw  = function (context, mapOriginX, mapOriginY)
    {
        this.screenX = mapOriginX + (tileX * this.tileSize);// + (tileY * this.tileSize/2);
        this.screenY = mapOriginY + (tileY * this.tileSize);// - (tileY * this.tileSize/4);

        var drawX = this.screenX;
        var drawY = this.screenY;

        
        //var drawX = this.drawX() + mapOriginX;
        //var drawY = this.drawY() + mapOriginY;

        //this.dX = drawX;
        //this.dY = drawY;
        
        //if(this.tileX == 0 && this.tileY == 0)
        //{
        //    console.log(drawX + "," + drawY);     
        //}


        if(this.config.imgKey)
        {
            context.drawImage(assets.getImg(this.config.imgKey).img, this.drawX(), this.drawY(),this.tileSize,this.tileSize);
        }
        else
        {
            context.stokeStyle = "black";
            context.strokeRect(drawX, drawY, this.tileWidth, this.tileHeight);
       
        }


        
        if(play.config.debugGameTiles) 
        {
            context.font = "10px Arial";
            context.fillStyle = "white";
            //context.fillText(this.label, drawX, drawY + this.tileHeight/2);
            context.fillText(this.tileX + "," + this.tileY, drawX, drawY + 15);
            context.fillText(drawX + "," + drawY, drawX, drawY + 30);
        }

        
        if(this.shadeColor != "")
        {
            context.globalAlpha = .50;

            context.fillStyle = this.shadeColor;
            this.roundRect(context, drawX, drawY, this.tileWidth , this.tileHeight , 10, true, true);

            context.globalAlpha = 1;
        }

        context.globalAlpha = .25;
        context.strokeStyle = "white";
        beamerGui.drawRoundRect(context, drawX+2, drawY+2, this.tileWidth-4, this.tileHeight-4, 5, false, true);
        context.globalAlpha = 1;
        
    }



    this.drawHighlights  = function (context)
    {
        this.boundX = this.drawX() + this.tileSize/5;
        this.boundY = this.drawY()+ this.tileSize/6;;
        this.boundWidth = this.tileSize/2;
        this.boundHeight = this.tileSize/4;

        context.fillStyle = "yellow";

        var drawX = this.drawX();
        var drawY = this.drawY();
        //context.strokeRect(drawX, drawY, this.tileWidth, this.tileHeight);
   
        context.beginPath();
        context.moveTo(drawX + this.tileWidth/2, drawY);
        context.lineTo(drawX + this.tileWidth, drawY + this.tileHeight/2);
        context.lineTo(drawX + this.tileWidth/2, drawY + this.tileHeight);
        context.lineTo(drawX, drawY + this.tileHeight/2);
        context.lineTo(drawX + this.tileWidth/2, drawY);
        
        context.fill();
    
        
    }





    this.unadjustedX = function(){ return (this.tileX * this.tileSize);}
    this.unadjustedY = function(){ return  (this.tileY * this.tileSize);}
    
    this.drawX = function()
    {
        return this.screenX;//this.unadjustedX();
    }

    this.drawY = function()
    {
        return this.screenY;//this.unadjustedY();
    }

    this.centerDrawX = function() {return this.drawX() + tileSize/2}
    this.centerDrawY = function() {return this.drawY() + tileHeight/2;}

    this.collisionCheck = function(bounds, drawX, drawY)
    {
        

        if(drawX >= bounds.minX && drawX <= bounds.maxX
            && drawY >= bounds.minY && drawY <= bounds.maxY)
            {
                return true;
            }

        return false;
    }

    this.reset = function()
    {
        this.boundWidth = play.getTileSize();
        this.boundHeight = play.getTileSize();
        this.tileSize = play.getTileSize();
        this.originX = play.getMapOriginX();
        this.originY = play.getMapOriginY();
        this.tileWidth = play.getTileSize();
        this.tileHeight = play.getTileSize();

    }

    
    this.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
          stroke = true;
        }
        if (typeof radius === 'undefined') {
          radius = 5;
        }
        if (typeof radius === 'number') {
          radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
          var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
          for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
          }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
          ctx.fill();
        }
        if (stroke) {
          ctx.stroke();
        }
      
      }



    this.getTileX = function(){ return this.tileX;}
    this.getTileY = function(){ return this.tileY;}
    this.getTileSize = function(){ return this.tileSize;}
}
