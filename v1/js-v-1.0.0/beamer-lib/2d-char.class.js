
function Char2D(config)
{
    this.gameObj = new GameObject(config);

    this.init = function()
    {
        this.gameObj.init();

        this.gameObj.unitStatXOffset = 10;
        this.gameObj.unitStatYOffset = play.getTileSize()-5;

        var tileX = this.gameObj.getTileX();
        var tileY = this.gameObj.getTileY();

        if(tileX >= 0)
        {
            var t = playGui.getCurrView().getTile(tileX, tileY);
        
            this.gameObj.drawY = t.drawY();
    
            this.gameObj.drawX =  t.drawX();
    
        }
        else
        {
            this.gameObj.drawY = 0;
    
            this.gameObj.drawX = 0;

        }

    }

    this.setStat = function(statName, statVal)
    {
        this.gameObj.setStat(statName, statVal);
    }

    this.getDrawY = function()
    {
        return this.gameObj.drawX;
    }
    
    this.getDrawX = function()
    {
        return this.gameObj.drawY;
    }

    this.getCenterX = function() 
    {
        return this.gameObj.drawX + (play.map.config.tileSize/2);
    }

    this.getCenterY = function() 
    {
        return this.gameObj.drawY + (play.map.config.tileSize/2);
    }

    this.isUsingMap = function(s)
    {
        this.gameObj.config.usingMap = s;
    }

    this.setDest = function(tileX, tileY) {this.gameObj.setDest(tileX, tileY);}
    this.collisionCheck = function(drawX, drawY) {return this.gameObj.collisionCheck(drawX, drawY);}
    this.getStats = function(){return this.gameObj.getStats();}
    this.getData = function(){return this.gameObj.getData();}
    this.isAlive = function(){ return this.gameObj.isAlive();}
    this.getCenterX = function() {return this.gameObj.getCenterX();}
    this.getCenterY = function() {return this.gameObj.getCenterY();}
    this.getTileX = function(){return this.gameObj.getTileX();}
    this.getTileY = function(){return this.gameObj.getTileY();}
    this.getObjType = function(){return this.gameObj.getObjType();}
    
    this.isBusy = function(){ return this.gameObj.isBusy();}
    this.getUserID = function(){return this.gameObj.getUserID();}
    this.getObjIdx = function(){return this.gameObj.getObjIdx();}
    this.setObjIdx = function(idx){return this.gameObj.setObjIdx(idx);}

    this.render = function(context){return this.gameObj.render(context);}
    this.renderHighlight = function(context){return this.gameObj.renderHighlight(context);}
    
    this.drawDisplayFrame = function(context, drawX, drawY, drawWidth, drawHeight) {return this.gameObj.drawDisplayFrame(context, drawX, drawY, drawWidth, drawHeight);}

    this.unpause = function(){ return this.gameObj.unpause();}
    this.setObjID = function(objID) {return this.gameObj.setObjID(objID);}
    this.getObjID = function(objID) {return this.gameObj.getObjID();}
    this.getUnitID =function(){return this.gameObj.getUnitID();}
    
    this.markAsDone = function(){this.gameObj.markAsDone();}
    this.startActionSeq = function(actionKey,dir) {return this.gameObj.startActionSeq(actionKey, dir);}
    this.remove = function() {return this.gameObj.remove();}

    this.isAttackable = function(){ return this.gameObj.isAttackable();}
    this.showAsNonTargettable = function(){return this.gameObj.showAsNonTargettable();}
    this.showAsTargettable = function(){return this.gameObj.showAsTargettable();}
    this.setImg = function(imgKey){return this.gameObj.setImg(imgKey);}
    this.setDir = function(d){return this.gameObj.setDir(d);}
    this.drawCurrFrame = function(context, drawX, drawY, displayWidth, displayHeight) {return this.gameObj.drawCurrFrame(context, drawX, drawY, displayWidth, displayHeight);}
    
    this.startAttackAnimation = function(dir){this.gameObj.startAttackAnimation(dir);}
}
