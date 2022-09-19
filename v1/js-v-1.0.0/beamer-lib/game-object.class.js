
function GameObject(config)
{
    this.config = config;
    this.currentFrame = 1;
    this.currDir = "E";
    this.nextFrameCounter = 0;
    this.currFrame = 0;
    this.maxFramesPerRow = 3;
    this.numTicksBetweenFrames = 10;
    this.dest = {tileX:0,tileY:0};
    this.transparency = 1;
    this.hidden = false;
    this.busy = false;
    this.objIdx = beamerUtils.getNextObjIdx();
    this.objID = 0;
    this.pauseTimer = "";
    this.currActionIdx = -1;
    this.currAction = "";
    this.currActionCounter = 0;
    this.drawOffsetX = 0;
    this.drawOffsetY = 0;
    this.objID = beamerUtils.createGuid();
    this.showTarget = false;
    this.movementOffsetX =0;
    this.movementOffsetY=0;
    this.isAnimated = true;
    this.objType = "unit";

    this.unitStatXOffset = 0;
    this.unitStatYOffset = 0;
    this.displayWidth = 0;
    this.displayHeight = 0;

    this.subRenderFunction = function(){};

    this.init = function()
    {
        //console.log("adding char - " + this.config.imgKey);

        assets.addAsset({key: this.config.imgKey,imgSrc: this.config.imgSrc});
        assets.addAsset({key: "unit-selector",imgSrc: "img/gui/selector.png"});

        this.currDir = this.config["facing-dir"];

        this.dest = {tileX:this.config.tileX, tileY:this.config.tileY};

        if(this.config.usingMap)
        {
            var t = beamerGui.getCurrView().getTile(this.config.tileX, this.config.tileY);
            
            if(this.config.unitID > 0)
            {
                this.objID = this.config.unitID;
            }
                      

            this.displayWidth = beamerGui.getCurrView().getTileSize() * .8;
            this.displayHeight = beamerGui.getCurrView().getTileSize() * .8;

        }
        
    }

    this.setDisplayDim = function(w, h)
    {
        this.displayWidth = w;
        this.displayHeight = h;
    }

    this.getScreenDest = function()
    {
        var out ={x:-1,y:-1};

        var t = beamerGui.getCurrView().getMap().tileMap[this.dest.tileX][this.dest.tileY];

        out.x = t.drawX();
        out.y = t.drawY();

        return out;
    }

    this.remove = function()
    {
        this.hidden = true;
    }

    this.getWaitTime = function()
    {
        return parseInt(this.config.stats.waitTime);
    }

    this.pauseFor = function(seconds)
    {
        this.busy = true;
        this.pauseTimer = setTimeout("play.unpauseUnit('" + this.objID + "')", this.config.waitTime * 1000);
    }

    this.unpause = function()
    {
        this.busy = false;

        this.config.stats.isPlayable = true;
        
        this.config.stats.pauseTill = 0;

        clearTimeout(this.pauseTimer);
    }

    this.isAlive = function()
    {
        return this.config.stats.health == undefined || this.config.stats.health > 0;
    }

    this.isAttackable = function()
    {
        return this.isAlive() && this.objType == "unit";
    }



    this.markAsDone = function()
    {
        this.config.stats.isPlayable = false;
    }

    this.isBusy = function()
    {
        if(this.config.stats.pauseTill != undefined)
        {
            if(parseInt(this.config.stats.pauseTill) > parseInt(beamerGui.getCurrView().getBattleTime()))
            {
                return true;
            }
        }

        if(this.config.stats.isPlayable == false)
        {
            return true;
        }

        return false;
    }

    this.updatePos = function()
    {
        if(this.dest.tileX != this.config.tileX || this.dest.tileY != this.config.tileY)
        {
            var dest = this.getScreenDest();
            
            var destTile = beamerGui.getCurrView().battle.map.getTile(this.dest.tileX,this.dest.tileY);

            var finalX = destTile.drawX();
            var finalY = destTile.drawY();
            

            if(finalX > this.getDrawX() + this.movementOffsetX)
            {
                this.movementOffsetX++;
                this.currDir = "E";
            }

            if(finalX < this.getDrawX() + this.movementOffsetX)
            {
                this.movementOffsetX--;
                this.currDir = "W";
            }

            if(finalY > this.getDrawY() + this.movementOffsetY)
            {
                this.movementOffsetY++;
                this.currDir = "S";
            }

            if(finalY < this.getDrawY() + this.movementOffsetY)
            {
                this.movementOffsetY--;
                this.currDir = "N";
            }            
            

            var destTile = beamerGui.getCurrView().getTile(this.dest.tileX, this.dest.tileY);

            var d = beamerGui.getCurrView().getDistance(this.getDrawX() + this.movementOffsetX, this.getDrawY() + this.movementOffsetY, destTile.drawX(), destTile.drawY());

            if(d < 5)
            {
                this.config.tileX = destTile.getTileX();
                this.config.tileY = destTile.getTileY();
                this.movementOffsetX = 0;
                this.movementOffsetY = 0;
                
            }
        }
        //else
        //{
        //    this.currDir = "";
        //}



        
    }


    this.render  = function (context)
    {
        if(this.hidden) return;

        this.updatePos();

        var tileSize = beamerGui.getCurrView().getTileSize();
        var displayWidth = this.displayWidth;
        var displayHeight = this.displayHeight;
        var mapOriginX = beamerGui.getCurrView().getMapOriginX();
        var mapOriginY = beamerGui.getCurrView().getMapOriginY();
        var drawX = this.getDrawX() + ((tileSize - displayWidth)/2) + this.movementOffsetX;
        var drawY = this.getDrawY() + ((tileSize - displayHeight)/2) + this.movementOffsetY; 

        if(this.objType!= "unit")
        {
            this.drawNonAnimated(context, drawX, drawY, displayWidth, displayHeight);
        }
        else
        {
            if(this.getUserID() == user.userID)
            {
                context.fillStyle = "#001C99";
                context.strokeStyle = "#F4FDFF";
            }
            else
            {
                context.fillStyle = "#9B1D25";
                context.strokeStyle = "#EFF45C";
            }

            if(this.isBusy()) context.globalAlpha = .5;
            
            context.beginPath();
            context.ellipse(drawX + displayWidth/2, drawY + displayHeight * .70, tileSize/4, 8, Math.PI, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            
            this.drawCurrFrame(context, drawX, drawY, displayWidth, displayHeight);
            
            this.subRenderFunction(context, drawX, drawY);

            context.globalAlpha = 1;

            
            if(this.config["draw-dest"])
            {
                if(this.dest.tileX >= 0)
                {
                    var dest = this.getScreenDest();

                    context.strokeStyle = "white";
                    context.beginPath();
                    context.moveTo(drawX, drawY);
                    context.lineTo(dest.x, dest.y);
                    context.stroke();
                }
            }


            if(this.config.userID != user.userID)
            {
                //this.drawUnitHud(context, drawX, drawY, "white","black","white");
                this.drawUnitHud(context, drawX, drawY - 5, "red","black","white");
            }
            else
            {
                this.drawUnitHud(context, drawX, drawY - 5, "green","white","white");
            }

            
            if(this.showTarget)
            {
                var img = assets.getImg("attack-icon").img;
                context.drawImage(img, 0,0,img.width, img.height,this.getDrawX(), this.getDrawY(), play.getTileSize(), play.getTileSize());

                //context.globalAlpha = .25;
                //context.fillStyle = "red";
                //context.fillRect(drawX, drawY, displayWidth, displayHeight);
                //context.globalAlpha = 1;
            }
            
        }


        




    }

    this.drawUnitHud = function(context, drawX, drawY, primaryColor, textColor, secondaryColor)
    {
        var barWidth = 8;
        var barHeight = 8;

        context.fillStyle = secondaryColor;
        context.fillRect(dX + 8, dY - 8, this.config.stats.health * 12 + 2, 5);
        
        var pct = this.getStats().health/5;
        var numBoxes = Math.floor(5 * pct);
        
        if(numBoxes <= 5)
        {
            for(var i=0;i<numBoxes && i < 5;i++)
            {
            
                var dX = drawX + (i * barWidth) + (i * 2);
                var dY = drawY;
                context.fillStyle = "white";
                context.fillRect(dX, dY, barWidth, barHeight);
                context.fillStyle = "green";
                context.fillRect(dX + 1, dY + 1, barWidth-2, barHeight-2);
            }
        }
        else
        {
            barWidth = beamerGui.getCurrView().getTileSize() * .80;
            var pct = (this.getStats().health)/this.getStats().maxHealth;
            var drawWidth = barWidth * pct;
            var dX = drawX;
            var dY = drawY;
            context.fillStyle = "white";
            context.fillRect(dX, dY, drawWidth, barHeight);
            context.fillStyle = "green";
            context.fillRect(dX + 1, dY + 1, drawWidth-2, barHeight-2);
        }

/*
        context.fillStyle = primaryColor;
          
        context.beginPath();
        context.arc(dX, dY, 10, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = textColor;
        context.fillText("1", dX - 4, dY+3);
        */

    }


    this.renderUnitDisplay = function(context, drawX, drawY)
    {

        var img = assets.getImg("unit-display").img;
        context.drawImage(img, drawX, drawY);

        var drawWidth = 84;
        var drawHeight = 84;
        this.drawDisplayFrame(context, drawX + 15, drawY, drawWidth, drawHeight);
        
        context.fillStyle="#333333";
        context.font = "14px Arial";
        context.fillText(this.config.unitName + " (" + this.getUnitID() + ")", drawX + 135, drawY+40);

        var barLength = 85;
        context.fillStyle = "#45F75A";
        var drawWidth = barLength * (this.config.stats.health/this.config.stats.maxHealth);
        if(drawWidth > barLength) drawWidth = barLength;
        context.fillRect(drawX + 137, drawY + 63, drawWidth, 12);

        context.fillStyle = "#645DF4";
        drawWidth = barLength * (this.config.stats.movement/5);
        if(drawWidth > barLength) drawWidth = barLength;
        context.fillRect(drawX + 137, drawY + 77, drawWidth, 12);

        context.fillStyle = "#F20C2A";
        drawWidth = barLength * (this.config.stats.attack/5);
        if(drawWidth > barLength) drawWidth = barLength;
        context.fillRect(drawX + 137, drawY + 91, drawWidth, 12);

        context.fillStyle = "#BF059A";
        drawWidth = barLength * (this.config.stats.attackRange/5);
        if(drawWidth > barLength) drawWidth = barLength;
        context.fillRect(drawX + 137, drawY + 105, drawWidth, 12);





        context.font = "10px Arial";
        context.fillStyle="white";
        context.fillText(this.config.stats.health, drawX + 215, drawY+ 73);

        context.fillText(this.config.stats.movement, drawX +215, drawY+86);

        context.fillText(this.config.stats.attack, drawX + 215, drawY+ 101);
        
        context.fillText(this.config.stats.attackRange, drawX + 215, drawY+115);
        

        context.fillStyle="#333333";
        context.font = "14px Arial";
        context.fillText(this.config.stats.points + " pts", drawX + 15, drawY + 115)


    }



	this.drawDisplayFrame = function(context, drawX, drawY, drawWidth, drawHeight)
    {

      var cropX = 175;
      var cropY = 0;
      var cropWidth = this.config.width;
      var cropHeight = this.config.height;
      var x = drawX;
      var y = drawY;

      var img = assets.getImg(this.config.imgKey).img;

      context.drawImage(img, cropX, cropY, cropWidth, cropHeight, x, y, drawWidth, drawHeight);

      //context.strokeStyle = "black";
      //context.strokeRect(x, y, drawWidth, drawHeight);
    }
    


    this.drawNonAnimated = function(context, drawX, drawY, displayWidth, displayHeight)
    {
        var img = assets.getImg(this.config.imgKey).img;
        var drawWidth = displayWidth;
        var drawHeight = displayHeight;
        var cropX = 0;
        var cropY = 0;
        var cropWidth = img.width;
        var cropHeight = img.height;

        var x = drawX;
        var y = drawY;

        context.drawImage(img, cropX, cropY, cropWidth, cropHeight, x, y, drawWidth, drawHeight);
      
      

    }

	this.drawCurrFrame = function(context, drawX, drawY, displayWidth, displayHeight)
    {
      

      var drawWidth = displayWidth;
      var drawHeight = displayHeight

      var img = assets.getImg(this.config.imgKey).img;
      var cropX = 175 + this.currentFrame * this.config.width;
      var cropY = 0;
      var cropWidth = this.config.width;
      var cropHeight = this.config.height;
      var cropCenterX = drawX + drawWidth/2;
      var cropCenterY = drawY + drawHeight/2;
      var displayCenterX = this.getCenterX();
      var displayCenterY = this.getCenterY();
      var x = drawX;// - (cropCenterX-displayCenterX) + this.getDrawXOffset();
      var y = drawY;// - (cropCenterY-displayCenterY) + this.getDrawYOffset();

       //this.currDir = "N";
      this.maxFramesPerRow = 9;

      if(this.currDir == '')  
      {
          cropY = 0;                    
          this.maxFramesPerRow = this.config.frames[0];
      }

      
      if(this.currDir == 'S') 
      {
          cropY = this.config.height; 
          this.maxFramesPerRow = this.config.frames[1];
      }
      
      if(this.currDir == 'W') 
      {
          cropY = this.config.height * 2;   
          this.maxFramesPerRow = this.config.frames[2];
          
      }

      
      if(this.currDir == 'E') 
      {
          cropY = this.config.height*3; 
          this.maxFramesPerRow = this.config.frames[3];
      }
      


      if(this.currDir == 'N') 
      {
          cropY = this.config.height*4; 
          this.maxFramesPerRow = this.config.frames[4];
      }
      
      
    
      if(this.currAction != "")
      {

          cropY = this.config.height * 7; 
          
          if(this.currDir == 'S') 
          {
              cropY = this.config.height * 5; 
              this.maxFramesPerRow = this.config.frames[5];
          }
          
          
          if(this.currAction.dir == 'W') 
          {
              cropY = this.config.height * 6; 
              this.maxFramesPerRow = this.config.frames[6];
          }

          if(this.currAction.dir == 'E') 
          {
              cropY = this.config.height * 7; 
              this.maxFramesPerRow = this.config.frames[7];
          }

          if(this.currAction.dir == 'S') 
          {
              cropY = this.config.height * 8; 
              this.maxFramesPerRow = this.config.frames[8];
          }

      }


      
      context.drawImage(img, cropX, cropY, cropWidth, cropHeight, x, y, drawWidth, drawHeight);
      
      
      if(play.config.debugGameObj)
      {
        context.globalAlpha = .75;
        context.strokeStyle = "red";
        context.strokeRect(x, y, drawWidth, drawHeight);

        //center of tile to be drawn on
        context.fillStyle = "blue";
        context.fillRect(displayCenterX, displayCenterY, 10,10);

        //center of pre-cropped image
        context.fillStyle = "white";
        context.fillRect(cropCenterX, cropCenterY, 10,10);
        

        var dX = x + drawWidth + 20;
        var dY = y;

        context.fillStyle = "#AAAAAA";
        context.fillRect(dX, dY, 100, 100);

        context.fillStyle = "white";
        context.font = "10px Arial";
        context.fillText("Tile:" + this.config.tileX + "," + this.config.tileY, dX, dY+=20);
        context.fillText("Pos:" + this.getDrawX() + "," + this.getDrawY(), dX, dY+=20);
        context.fillText("ID:" + this.getUnitID(), dX, dY+=20);
        context.fillText("ObjIdx:" + this.getObjIdx(), dX, dY+=20);
        //context.fillText("Frm:" + this.nextFrameCounter, dX, dY+=20);
        //context.fillText("Dir:" + this.currDir, dX, dY+=20);
        //context.fillText("Health:" + this.config.stats.health, dX, dY+=20);

        context.globalAlpha = 1;


      }


      if((this.config.usingFrames) || this.currActionIdx >= 0)
      {
        this.nextFrameCounter++;
        if(this.nextFrameCounter > this.numTicksBetweenFrames)
        {
          this.nextFrameCounter = 0;
          this.currentFrame++;
          if(this.currentFrame >= this.maxFramesPerRow-1)
          {
            this.currentFrame=0;
            
            this.currActionCounter++;

            if(this.currActionCounter > 10)
            {
                this.currAction = "";
            }
          }

        }
      }
      

    }
    



    this.renderHighlight  = function (context)
    {
        var drawX = this.getDrawX(); 
        var drawY = this.getDrawY() - 5; 
        var drawWidth = beamerGui.getCurrView().getTileSize();
        var drawHeight = beamerGui.getCurrView().getTileSize();

        context.drawImage(assets.getImg("unit-selector").img, drawX, drawY, drawWidth, drawHeight);
      
    }    
    

    this.startAttackAnimation = function(dir)
    {
        this.setDir(dir);
        this.currAction = "attack";
        this.currActionCounter = 0;
    }


    this.collisionCheck = function(drawX, drawY)
    {
        if(this.hidden) return false;

        this.boundX = this.getDrawX();
        this.boundY = this.getDrawY();
        this.boundWidth = this.config.width;
        this.boundHeight = this.config.height;

        if(drawX >= this.boundX && drawX <= this.boundX + this.boundWidth 
            && drawY >= this.boundY && drawY <= this.boundY + this.boundWidth)
            {
                return true;
            }

        return false;
    }    

    
    this.setImg = function(imgKey)
    {
        this.config.imgKey = imgKey;
    }

    this.setDir = function(dir)
    {
        this.currDir = dir;
    }

    this.setLocation = function(tileX, tileY)
    {
        this.setTileX(tileX);
        this.setTileY(tileY);
        this.setDest(tileX, tileY);
    }

    this.setTileX = function(tileX) {this.config.tileX = tileX;}
    this.setTileY = function(tileY) {this.config.tileY = tileY;}
    this.setImgKey = function(imgKey) {this.config.imgKey = imgKey;}
    this.setObjType = function(t){this.objType = t;}
    this.getObjType = function(){return this.objType;}
    
    this.setDest = function(tileX, tileY)
    {
        this.dest = {tileX:tileX, tileY:tileY};
        console.log("unit.setDest(" + tileX + "," + tileY + ")");

        this.markAsDone();
    }

    this.getImgKey = function(){ return this.config.imgKey;}
    
    this.setObjIdx = function(idx) {this.objIdx = idx;}

    this.getObjID = function()
    {
        return this.objID;
    }

    this.setObjID = function(objID) {this.objID = objID;}

    this.getObjID = function()
    {
        return this.objID;
    }

    this.getUnitID = function()
    {
        return this.config.unitID;
    }

    this.getUserID = function()
    {
        return this.config.userID;
    }

    this.setUserID = function(uID)
    {
        this.config.userID = uID;
    }

    this.setSubRenderFunction = function(fn)
    {
        this.subRenderFunction = fn;
    }

    this.getData = function()
    {
        var out = this.getStats();
        out.ownerUserID = this.config.userID;
        out.unitName = this.config.unitName;
        out.unitID = this.config.unitID;
        out.userID = this.config.userID;
        out.objIdx = this.objIdx;
        out.tileX = this.getTileX();
        out.tileY = this.getTileY();
        out.imgKey = this.config.imgKey;
        out.imgSrc = this.config.imgSrc;

        return out;
    }

    
    this.getStats = function()
    {
        return this.config.stats;
    }

    this.showAsNonTargettable = function(){ this.showTarget = false;}
    this.showAsTargettable = function(){ this.showTarget = true;}

    
    this.drawY = function(){return this.getDrawY();}
    this.getDrawY = function()
    {
        var t = beamerGui.getCurrView().battle.map.getTile(this.getTileX(), this.getTileY());

        return t.drawY();
    }

    this.getDimensions = function()
    {
        var out = {};
        
        var tile = play.view.map.tileMap[this.getTileX()][this.getTileY()];
        var imgData = assets.getImg(this.getImgKey());
        var objImg = imgData.img;
        ratio = play.view.map.getTileSize() / objImg.width;


        out.tileX = this.getTileX();
        out.tileY = this.getTileY();
        out.drawWidth = objImg.width * ratio;
        out.drawHeight = objImg.height * ratio;
        out.drawX = tile.drawX();
        out.drawY = tile.drawY()- out.drawHeight + play.view.map.getTileSize();
        
        return out;
    }


    this.drawX = function(){return this.getDrawX();}
    this.getDrawX = function()
    {
        var t = beamerGui.getCurrView().battle.map.getTile(this.getTileX(), this.getTileY());

        return t.drawX();
    }
    
    this.setStat = function(statName, statVal)
    {
        this.config.stats[statName] = statVal;
        return;
        
        Object.keys(this.config.stats).forEach(function(key,index) {
            if(this.config.stats[index] == statName)
            {
                
                console.log("State: " + statName + " set to " + statVal);
            }

        });
        
    }

    this.getObjIdx = function(){return this.objIdx;}
    this.setObjIdx = function(idx){this.objIdx = idx;}
    this.getDrawXOffset = function() {return this.drawOffsetX;}
    this.getDrawYOffset = function() {return this.drawOffsetY;}
    this.getCenterX = function() {return this.drawX + (this.tileWidth/2)}
    this.getCenterY = function() {return this.drawY + (this.tileHeight/2)}
    this.getTileX = function(){return this.config.tileX;}
    this.getTileY = function(){return this.config.tileY;}

}
