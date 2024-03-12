function Map2D(config)
{
    this.config = config;

    this.map = new Array();
    this.tileMap = new Array();
    this.highlightedTile = {tileX:-1, tileY: -1};
    this.readyToRender = false;
    this.gameObjs = [];
    this.params = [];

    this.init = function()
    {
        this.map = new Array(this.config.mapWidth);

        this.tileMap = new Array(this.config.mapWidth);
        
        for(var x = this.config.mapWidth-1;x>= 0;x--)
        {
            this.map[x] = new Array(this.config.mapHeight);

            this.tileMap[x] = new Array(this.config.mapHeight);

            for(var y = 0;y<this.config.mapHeight;y++)
            {
                
                this.map[x][y] = 0;

                var p = this.tileToScreen(x, y);
                
                label = x + "," + y;

                var config = {imgKey: this.config["default-tile-key"]
                                ,imgSrc:this.config["default-tile"]
                                ,tileSize: this.config.tileSize
                            };

                this.tileMap[x][y] = new Tile2D(x, y, p.drawX, p.drawY, config);
                
                this.tileMap[x][y].init();

            }
        }

        this.readyToRender = true;
    }

    this.processAction = function(actionKey)
    {
        var tilesToPan = 3;

        if(actionKey == "map-pan-right")
        {
            this.panX(this.getTileSize() * -1 * tilesToPan);
        }

        if(actionKey == "map-pan-left")
        {
            this.panX(this.getTileSize() * tilesToPan);
        }        


        if(actionKey == "map-pan-up")
        {
            this.panY(this.getTileSize() * tilesToPan);
        }

        if(actionKey == "map-pan-down")
        {
            this.panY(this.getTileSize() * -1 * tilesToPan);
        }        

    }

    this.addGameObj = function(gObj)
    {
        this.gameObjs.push(gObj);
    }

    this.setParam = function(paramName, paramValue)
    {
        this.params[paramName] = paramValue;
    }

    this.getParam = function(paramName)
    {
        return this.params[paramName];
    }

    this.setDimensions = function(w, h)
    {
        this.config.mapWidth = w;

        this.config.mapHeight = h;
        
        this.map = new Array(this.config.mapWidth);

        this.tileMap = new Array(this.config.mapWidth);
        
        for(var x = this.config.mapWidth-1;x>= 0;x--)
        {
            this.map[x] = new Array(this.config.mapHeight);

            this.tileMap[x] = new Array(this.config.mapHeight);

            for(var y = 0;y<this.config.mapHeight;y++)
            {
                
                this.map[x][y] = 0;

                var p = this.tileToScreen(x, y);
                
                label = x + "," + y;

                var config = {imgKey: this.config["default-tile-key"]
                                ,imgSrc:this.config["default-tile"]
                            };

                this.tileMap[x][y] = new Tile2D(x, y, p.drawX, p.drawY, config);
                
                this.tileMap[x][y].init();

            }
        }

    }

    this.render = function(context)
    {
        if(!this.readyToRender) return;
            
        for(var x = 0;x<this.config.mapWidth;x++)
        {
            for(var y = this.config.mapHeight-1;y>=0;y--)
            {
               this.tileMap[x][y].draw(context, this.getOriginX(), this.getOriginY());


                if(x == this.highlightedTile.tileX && y == this.highlightedTile.tileY)
                {
                    this.tileMap[x][y].drawHighlights(context, this.getOriginX(), this.getOriginY());
                }
            }
        }

                
        for(var i=0;i<this.gameObjs.length;i++)
        {
            var gObj = this.gameObjs[i];

            var imgData = assets.getImg(gObj.getImgKey());
            var objImg = imgData.img;
            ratio = this.getTileSize() / objImg.width;

            var tile = this.tileMap[gObj.getTileX()][gObj.getTileY()];
            var drawWidth = objImg.width * ratio;// this.map.getTileSize();
            var drawHeight = objImg.height * ratio;//this.map.getTileSize();
            var drawX = tile.drawX();
            var drawY = tile.drawY()- drawHeight + this.getTileSize();
            
            
            if(gObj.getUserID() == user.userID)
            {
                context.fillStyle = "#5647FF";
                var dX = drawX + this.getTileSize()/2;
                var dY = drawY + this.getTileSize()/2;
                context.beginPath();
                context.ellipse(dX, dY, this.getTileSize()/2, this.getTileSize()/2, Math.PI / 4, 0, 2 * Math.PI);
                context.fill();

            }


            context.drawImage(objImg, drawX, drawY, drawWidth, drawHeight);

            if (typeof gObj.subRenderFunction !== "undefined") gObj.subRenderFunction(context, gObj.config, drawX, drawY);

        }



        if(play.config.debugMap)
        {
            this.renderDebug(context, beamerGui.getScreenWidth() - 150, beamerGui.getScreenHeight() - 400);
        }

    }

    this.renderDebug = function(context, drawX, drawY)
    {
        var drawWidth = 100;
        var drawHeight = 100;

        context.globalAlpha = .5;
        context.fillStyle = "black";
        context.fillRect(drawX, drawY, drawWidth, drawHeight);
        context.globalAlpha = 1;

        context.font = beamerGui.defaultDebugFont;
        context.fillStyle = "white";
        context.fillText("Size:" + this.map.length + "," + this.map[0].length, drawX + 10, drawY+=12);
        context.fillText("Tiles:" + (this.map.length * this.map[0].length), drawX + 10, drawY+=12);
        context.fillText("Objs:" + (this.gameObjs.length), drawX + 10, drawY+=12);
    }

    this.mouseClicked = function(mouseX, mouseY)
    {
        if(!this.readyToRender) return;
        
        var mapMouseX = mouseX;// - this.config.originX;
        var mapMouseY = mouseY;// - this.config.originY;

        for(var x = 0;x<this.config.mapWidth;x++)
        {
            for(var y = 0;y<this.config.mapHeight-1;y++)
            {
                if(this.tileMap[x][y].collisionCheck(mapMouseX, mapMouseY))
                {
                    debug("Tile Clicked: " + this.tileMap[x][y].getTileX() + "," + this.tileMap[x][y].getTileY());
                    
                    this.highlightTile(this.tileMap[x][y].getTileX(), this.tileMap[x][y].getTileY());

                    play.tileClicked(x, y);
                    //tileClicked(x,y);
                }
            }
        }
    }

    this.getTileInfo = function(tileX, tileY)
    {
        var out = {isEmpty: true, isOwned:false, gameObjIdx:-1}

        for(var i=0;i<this.gameObjs.length;i++)
        {
            if(this.gameObjs[i].getTileX() == tileX && this.gameObjs[i].getTileY() == tileY)
            {
                out.isEmpty = false;
                
                out.gameObjIdx = i;

                if(this.gameObjs[i].getUserID() == user.userID)
                {
                    out.isOwned = true;
                }
            }
        }

        return out;
    }

    this.clearShadedTiles = function()
    {

        for(var x = 0;x<this.config.mapWidth;x++)
        {
            for(var y = this.config.mapHeight-1;y>=0;y--)
            {
                this.tileMap[x][y].shadeTile("");
            }
        }
    }

    this.shadeTile = function(tileX, tileY, color)
    {
        if(tileX < 0) return;
        if(tileX >= this.config.mapWidth) return;
        if(tileY < 0) return;
        if(tileY >= this.config.mapHeight) return;
        
        this.tileMap[tileX][tileY].shadeTile(color);
    }

    this.highlightTile = function(tileX, tileY)
    {
        this.highlightedTile = {tileX:tileX, tileY: tileY};
    }


    this.tileToScreen = function(tileX, tileY)
    {
        var drawX = this.config.originX + (tileX * this.config.tileSize/2) + (tileY * this.config.tileSize/2);
        var drawY = this.config.originY + (tileX * this.config.tileSize/4) - (tileY * this.config.tileSize/4);
        
        return {"drawX": drawX, "drawY":drawY   };
    }

    this.screenToTile = function(screenX, screenY)
    {
        
        for(var x = this.config.mapWidth-1;x>= 0;x--)
        {
            for(var y = 0;y<this.config.mapHeight;y++)
            {
                if(this.tileMap[x][y].collisionCheck(screenX,screenY))
                {
                    return {tileX: x, tileY: y};
                }
            }
        }

        return {tileX: -1, tileY: -1};
    }

    this.getTile = function(tileX, tileY)
    {
        if(this.tileMap.length <= 0) return {};
        
        return this.tileMap[tileX][tileY]; 
    }

    this.zoomIn = function()
    {
        this.config.tileSize-=8;

        if(this.config.tileSize < this.config.minTileSize) this.config.tileSize = this.config.minTileSize;

        this.resetTiles();

        console.log("Tilesize set: " + this.config.tileSize);

    }

    this.zoomOut = function()
    {
        this.config.tileSize+=8;

        if(this.config.tileSize > this.config.maxTileSize) this.config.tileSize = this.config.maxTileSize;

        this.resetTiles();
        
        console.log("Tilesize set: " + this.config.tileSize);
    }

    this.resetTiles = function()
    {

        for(var x = 0;x<this.config.mapWidth;x++)
        {
            for(var y = this.config.mapHeight-1;y>=0;y--)
            {
                this.tileMap[x][y].reset();
            }
        }
    }

    this.getTileSize = function() 
    {
        if(this.config !== undefined)
        {
            return this.config.tileSize;
        }
        else
        {
            return 84;
        }
    }

    this.panX = function(amt) {this.config.originX+=amt;}
    this.panY = function(amt) {this.config.originY+=amt;}
    this.getMapWidth = function() {return this.config.mapWidth;}
    this.getMapHeight = function() {return this.config.mapHeight;}
    this.getOriginX = function(){return this.config.originX;}
    this.getOriginY = function(){return this.config.originY;}
}

