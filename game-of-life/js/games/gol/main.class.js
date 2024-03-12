function Game()
{

    this.config = {
        mapWidth:150
        ,mapHeight: 150
        ,maxMapSize: 1000
        ,originX: 0
        ,originY: 0
        ,tileSize: 5
        ,showGrid:false
    };

    this.lastStartingMap = [];

    this.gameOfLife = {};

    this.paintBrush = "";

    this.mouseTileX = 0;
    this.mouseTileY = 0;

    this.numAlive = 0;

    this.stableLoopCount = 0;

    this.shapes = new Shapes();

    this.context = {};

    this.utils = new BeamerUtils(); //just some stuff that you should do on your own

    var lastFpsTime;

    var calcedFps;

    this.renderLoop = {
        keepRunning: false
        ,loop: {}
        ,targetFps: 60
    };

    
    this.processLoop = {
        keepRunning: false
        ,loop: {}
        ,targetFps: 50
        ,counter: 0
    };

    this.init = function()
    {
        this.context = this.utils.loadGameCanvas();
        
        this.loadMap();

        this.startRendering();


    }

    this.loadMap = function()
    {
        this.stopProcessing();
        
        this.gameOfLife = new GameOfLife(this.config);

        this.gameOfLife.init();
        
        this.gameOfLife.map.mapData = maps["beamer-labs"].mapData;

        this.gameOfLife.map.mapWidth = maps["beamer-labs"].mapWidth;

        this.gameOfLife.map.mapHeight = maps["beamer-labs"].mapHeight;

        this.config.originX = this.utils.getScreenWidth()/2 - ((this.gameOfLife.map.mapWidth * this.gameOfLife.map.tileSize)/2);
        this.config.originY = this.utils.getScreenHeight()/2- ((this.gameOfLife.map.mapHeight * this.gameOfLife.map.tileSize)/2);

        document.getElementById("txt-map-width").value = this.gameOfLife.map.mapWidth;
        document.getElementById("txt-map-height").value = this.gameOfLife.map.mapHeight;

        this.lastStartingMap = this.gameOfLife.cloneMap();

    }

    this.clearMap = function()
    {
        this.stopProcessing();
        
        this.gameOfLife = new GameOfLife(this.config);

        this.gameOfLife.init();
    }

    this.resetMap = function()
    {
        this.stopProcessing();

        this.gameOfLife = new GameOfLife(this.config);
        
        this.gameOfLife.init();

        this.gameOfLife.map.mapData = this.lastStartingMap;
    }

    this.loadShapes = function()
    {
        var centerX = Math.floor(this.gameOfLife.map.mapWidth/2);
        var centerY = Math.floor(this.gameOfLife.map.mapHeight/2);

        //this.gameOfLife.addShape(centerX, centerY, this.shapes.getRect(4,4));
        
        this.gameOfLife.addShape(centerX, centerY, this.shapes.getBullet());
        
    }

    this.addBullet = function()
    {
        var x = this.getRandomBetween(1, this.gameOfLife.map.mapWidth-1);
        var y = this.getRandomBetween(1, this.gameOfLife.map.mapHeight-1);

        this.gameOfLife.addShape(x, y, this.shapes.getBullet());
    }

    
    this.addSquare = function()
    {
        var size = this.getRandomBetween(3, 5);
        var x = this.getRandomBetween(size+1, this.gameOfLife.map.mapWidth-size-1);
        var y = this.getRandomBetween(1, this.gameOfLife.map.mapHeight-size-1);
        

        this.gameOfLife.addShape(x, y, this.shapes.getRect(size,size));
    }

    this.mouseMoved = function(mouseX, mouseY)
    {
        if(mouseX > this.config.originX && mouseX < this.config.originX + this.gameOfLife.getMapWidth()
            && mouseY > this.config.originY && mouseY < this.config.originY + this.gameOfLife.getMapHeight()
        )
        {
            var mapX = mouseX - this.config.originX;
            var mapY = mouseY - this.config.originY;
            
            this.mouseTileX = Math.floor(mapX/this.config.tileSize);
            this.mouseTileY = Math.floor(mapY/this.config.tileSize);

            if(this.mouseIsDown)
            {
                this.gameOfLife.setAlive(this.mouseTileX, this.mouseTileY);
            }
        }
    }
    
    this.mouseIsDown = false;

    this.mouseDown = function(mouseX, mouseY)
    {
        if(mouseX > this.config.originX && mouseX < this.config.originX + this.gameOfLife.getMapWidth()
            && mouseY > this.config.originY && mouseY < this.config.originY + this.gameOfLife.getMapHeight()
        )
        {
            this.mouseIsDown = true;

            var mapX = mouseX - this.config.originX;
            var mapY = mouseY - this.config.originY;
            
            this.mouseTileX = Math.floor(mapX/this.config.tileSize);
            this.mouseTileY = Math.floor(mapY/this.config.tileSize);

            if(this.paintBrush == "")
            {
                this.gameOfLife.toggleAlive(this.mouseTileX, this.mouseTileY);
            }

            if(this.paintBrush == "bullet")
            {
                this.gameOfLife.addShape(this.mouseTileX, this.mouseTileY, this.shapes.getBullet());
            }

            if(this.paintBrush == "square")
            {
                this.gameOfLife.addShape(this.mouseTileX, this.mouseTileY, this.shapes.getRect(3,3));
            }            
        }
    }
    
    this.mouseUp = function(mouseX, mouseY)
    {
            this.mouseIsDown = false;
    }
    
    this.render = function()
    {
        if(!game.renderLoop.keepRunning) return;

        var context = game.context;
        

        context.clearRect(0,0,game.utils.getScreenWidth(), game.utils.getScreenHeight());     
        context.fillStyle = "#222222";
        context.fillRect(0,0,game.utils.getScreenWidth(), game.utils.getScreenHeight());

        game.renderMap(context, game.config.originX, game.config.originY);

        game.renderDebug(context,  game.utils.getScreenWidth() - 100, game.utils.getScreenHeight() - 100)

        game.calcFps();
    }

    this.renderMap = function(context, originX, originY)
    {
        numAlive = 0;

        var drawX = 0;
        var drawY = 0;

        context.strokeStyle = "#777777";
        context.fillStyle = "white";

        drawX = originX;
        drawY = originY;
        drawWidth = this.gameOfLife.map.mapWidth * this.gameOfLife.map.tileSize;
        drawHeight = this.gameOfLife.map.mapHeight * this.gameOfLife.map.tileSize;

        context.strokeRect(drawX, drawY, drawWidth, drawHeight);

        context.strokeText("Loop:" + this.processLoop.counter, drawX, drawY - 15);
        context.strokeText("Num Cells:" + this.numAlive, drawX + 75, drawY - 15);
        context.strokeText("Map Dim:" + this.gameOfLife.map.mapWidth + "x" + this.gameOfLife.map.mapHeight, drawX + 150, drawY - 15);

        //context.strokeText("Ashes At Loop:" + this.stableLoopCount, drawX + 150, drawY - 15);
        for(var x =0;x<this.gameOfLife.map.mapWidth;x++)
        {
            for(var y = 0;y < this.gameOfLife.map.mapHeight;y++)
            {
                drawX = originX + x * this.gameOfLife.map.tileSize;
                drawY = originY + y * this.gameOfLife.map.tileSize;
                
                if(this.config.showGrid)
                {
                    context.strokeRect(drawX, drawY, this.gameOfLife.map.tileSize, this.gameOfLife.map.tileSize);
                }

                if(this.gameOfLife.map.mapData[x][y] > 0)
                {
                    context.fillRect(drawX, drawY, this.gameOfLife.map.tileSize, this.gameOfLife.map.tileSize);
                    numAlive++;
                }

                //context.strokeText(x + "," + y + ":" + this.getNumNeighbors(this.map.mapData, x, y), drawX + 3, drawY + 15);
            }
        }

        context.fillStyle = "yellow";
        drawX = originX + this.mouseTileX * this.gameOfLife.map.tileSize;
        drawY = originY + this.mouseTileY * this.gameOfLife.map.tileSize;
        context.fillRect(drawX, drawY, this.gameOfLife.map.tileSize, this.gameOfLife.map.tileSize);
       

        if(numAlive == this.numAlive && this.stableLoopCount == 0)
        {
            this.stableLoopCount = this.processLoop.counter;
        }

        this.numAlive = numAlive;
    }

    this.renderDebug = function(context, originX, originY)
    {
        var drawX = originX;
        var drawY = originY;
        var debugWidth = 75;
        var debugHeight = 100;

        context.fillStyle = "#777777";
        context.fillRect(drawX, drawY, debugWidth, debugHeight);

        drawX+=5;
        context.fillStyle = "white";
        context.fillText("Debug:", drawX, drawY+=15);
        context.fillText("Speed:" + this.processLoop.targetFps, drawX, drawY+=15);
        context.fillText("Fps:" + Math.round(this.calcedFps,2), drawX, drawY+=15);



    }


    this.process = function()
    {
        game.gameOfLife.step();

        game.processLoop.counter++;

    }


    this.startProcessing = function()
    {
        if(!this.processLoop.keepRunning)
        {
            //game refers to a global variable (in index.html) that is the instance of Game...
            this.processLoop.loop = setInterval("window.requestAnimationFrame(game.process)",this.processLoop.targetFps);
            this.processLoop.keepRunning = true;

            this.lastStartingMap = this.gameOfLife.cloneMap();
        }
    }

    this.stopProcessing = function()
    {
        this.processLoop.keepRunning = false;
        clearInterval(this.processLoop.loop);
    }


    this.startRendering = function()
    {
        if(!this.renderLoop.keepRunning)
        {
            //game refers to a global variable (in index.html) that is the instance of Game...
            this.renderLoop.loop = setInterval("window.requestAnimationFrame(game.render)",1000 / game.renderLoop.targetFps);
            this.renderLoop.keepRunning = true;
        }
    }

    this.stopRendering = function()
    {
        this.renderLoop.keepRunning = false;
        clearInterval(this.renderLoop.loop);
    }

    this.goFaster = function()
    {
        var tmp = this.lastStartingMap;

        this.stopProcessing();
        
        this.processLoop.targetFps-=100;

        if(this.processLoop.targetFps < 1) this.processLoop.targetFps = 1;

        this.startProcessing();

        this.lastStartingMap = tmp;

    }

    this.goSlower = function()
    {
         var tmp = this.lastStartingMap;
         
         this.stopProcessing();

        this.processLoop.targetFps+=100;
        
        this.startProcessing();

        this.lastStartingMap = tmp;
    }

    this.growMap = function()
    {
        
        this.gameOfLife.map.mapWidth+= 10;

        this.gameOfLife.map.mapHeight+=10;

        if(this.gameOfLife.map.mapWidth > this.config.maxMapSize)
        {
            alert("Max Map Sized Reached (" + this.config.maxMapSize + ")");
            this.gameOfLife.map.mapWidth = this.config.maxMapSize;
            this.gameOfLife.map.mapHeight = this.config.maxMapSize;
        }

        this.gameOfLife.init();

    }

    this.shrinkMap = function()
    {
        this.gameOfLife.map.mapWidth-= 10;

        this.gameOfLife.map.mapHeight-=10;


        if(this.gameOfLife.map.mapWidth < 25)
        {
            alert("Min Map Sized Reached (25)");
            this.gameOfLife.map.mapWidth = 25;
            this.gameOfLife.map.mapHeight = 25;
        }

        this.gameOfLife.init();
    }

    

    this.toggleGrid = function()
    {
        if(this.config.showGrid)
        {
            this.config.showGrid = false;
        }
        else
        {
            this.config.showGrid = true;
        }
    }

    this.setPaintBrush = function(brush)
    {
        this.paintBrush = brush;
    }

    this.exportMap = function()
    {
        var out = JSON.stringify(this.gameOfLife.map);

        document.write(out);

    }
    this.calcFps = function()
    {
        if(!this.lastFpsTime) 
        {
            this.lastFpsTime = performance.now();
            this.calcedFps = 0;
            return;
         }

         delta = (performance.now() - this.lastFpsTime)/1000;
         this.lastFpsTime = performance.now() ;
         this.calcedFps = 1/delta;
    }

    
    this.getRandomBetween = function(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

}