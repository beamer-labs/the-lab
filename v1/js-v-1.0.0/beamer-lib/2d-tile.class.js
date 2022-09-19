
function Tile2D(tileX, tileY, dX, dY, config)
{
    this.tile = new GameTile(tileX, tileY, dX, dY, config);

    this.init = function()
    {
        this.tile.init();
    }


    this.getCollisionBounds = function()
    {
        return {
            minX: this.drawX()
            ,minY: this.drawY()
            ,maxX: this.drawX() + this.getTileSize()
            ,maxY: this.drawY() + this.getTileSize()
            ,boundX: this.drawX()
            ,boundY: this.drawY()
            ,boundWidth: this.getTileSize()
            ,boundHeight: this.getTileSize()
        }
    }
    
    this.collisionCheck = function(drawX, drawY)
    {
        var b = this.getCollisionBounds();
        
        return this.tile.collisionCheck(b, drawX, drawY);

    }

    
    this.drawHighlights  = function (context)
    {
        var b = this.getCollisionBounds();
        
        context.fillStyle = "yellow";

        beamerGui.drawRoundRect(context, b.minX + 5, b.minY + 5, b.boundWidth - 10, b.boundHeight - 10, 5, true, true);
     
        
    }




    this.getTileSize = function() {return this.tile.getTileSize();}
    this.shadeTile = function(color){return this.tile.shadeTile(color);}
    this.draw  = function (context, mapOriginX, mapOriginY) {return this.tile.draw(context, mapOriginX, mapOriginY);}
    this.unadjustedX = function(){ return this.tile.unadjustedX();}
    this.unadjustedY = function(){ return  this.tile.unadjustedY();}
    this.drawX = function()  {return this.tile.drawX();}
    this.drawY = function() {return this.tile.drawY();}
    this.centerDrawX = function() {return this.tile.centerDrawX();}
    this.centerDrawY = function() {return this.tile.centerDrawY();}
    this.getTileX = function() {return this.tile.getTileX();}
    this.getTileY = function() {return this.tile.getTileY();}
    this.reset = function() {return this.tile.reset();}
}
