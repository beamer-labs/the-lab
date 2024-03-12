function GameOfLife(config)
{
    this.config = config;
      
    this.map = {
        mapWidth:this.config.mapWidth
        ,mapHeight: this.config.mapHeight
        ,tileSize: 5
        ,mapData: []
    }

    this.init = function()
    {
        this.map.mapData = [];

        for(var x =0;x<this.map.mapWidth;x++)
        {
            this.map.mapData[x] = [];

            for(var y = 0;y < this.map.mapHeight;y++)
            {
                this.map.mapData[x][y] = 0
            }
        }
    }

    this.step = function()
    {
        var newMap = this.cloneMap();

        for(var x =0;x<this.map.mapWidth;x++)
        {
            for(var y = 0;y < this.map.mapHeight;y++)
            {
                newMap[x][y] = this.processCellRules(this.map.mapData, x, y);
            }
        }
        this.map.mapData = newMap;
    }

    
    this.cloneMap = function()
    {
        var newMap = [];

        for(var x =0;x<this.map.mapWidth;x++)
        {
            newMap[x] = [];

            for(var y = 0;y < this.map.mapHeight;y++)
            {
                newMap[x][y] = this.map.mapData[x][y];

            }
        }

        return newMap;

    }

    this.addShape = function(x, y, shape)
    {
        for(var drawX = 0;drawX <shape.length;drawX++)
        {
            for(var drawY = 0;drawY < shape[0].length; drawY++)
            {
                this.map.mapData[x + drawX][y + drawY] = shape[drawX][drawY];
            }
        }
    }


    this.processCellRules = function(map, x,y)
    {
        var isAlive = map[x][y];

        var numNeighbors = this.getNumNeighbors(map, x, y);

        if(numNeighbors < 2) isAlive = 0;

        if(isAlive && numNeighbors > 2 && numNeighbors < 4) isAlive = 1;

        if(numNeighbors > 3) isAlive = 0;

        if(!isAlive && numNeighbors == 3) isAlive = 1;

        return isAlive;
    }

    this.getNumNeighbors = function(map, originX,originY)
    {
        var count = 0;

        for(var x = originX -1; x <= originX + 1; x++)
        {
            for(var y = originY -1; y <= originY + 1; y++)
            {
                if(x >= 0 && y >= 0 && x < map.length && y < map[0].length)
                {
                    if(map[x][y] > 0 && !(originX == x && originY == y)) 
                    {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    this.toggleAlive = function(tileX, tileY)
    {
        if(this.map.mapData[tileX][tileY] > 0)
        {
            this.map.mapData[tileX][tileY] = 0;
        }
        else
        {
            this.map.mapData[tileX][tileY] = 1;
        }
    }

    this.setAlive = function(tileX, tileY)
    {
        this.map.mapData[tileX][tileY] = 1;
        
    }


    this.getMap = function()
    {
        return this.cloneMap(); 
    }

    this.getMapWidth = function(){return this.map.mapWidth * this.map.tileSize;}
    this.getMapHeight = function(){return this.map.mapHeight * this.map.tileSize;}
}