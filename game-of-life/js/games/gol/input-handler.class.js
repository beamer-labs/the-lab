function InputHandler()
{
    this.debug = false;
    this.xDown = -1;
    this.yDown = -1;
    this.xUp = -1;
    this.yUp = -1;
    this.xDiff = 0;
    this.yDiff = 0;
    this.xMove = -1;
    this.yMove = -1;

    this.isDown = false;

    

    this.bind = function()
    {
        var isTouchDevice = 'ontouchstart' in document.documentElement;

        if(isTouchDevice)
        {
          if(inputHandler.debug) console.log("InputHandler: registered as a touch device");
          document.addEventListener('touchstart', inputHandler.handleTouchStart, false);        
          document.addEventListener('touchmove', inputHandler.handleTouchMove, false);
          document.addEventListener('touchend', inputHandler.handleTouchEnd, false);
        }
        else
        {
          if(inputHandler.debug) console.log("InputHandler: registered as a mouse device");
          document.addEventListener('mousedown', inputHandler.handleMouseDown, false);        
          document.addEventListener('mousemove', inputHandler.handleMouseMove, false);
          document.addEventListener('mouseup', inputHandler.handleMouseUp, false);
        }

        window.addEventListener("orientationchange", function() {
          alert(window.orientation);
        }, false);


        console.log("inputHandler.bind(): handlers have been bound");
    }


    this.touchStarted = function(mouseX, mouseY)
    {
      if(inputHandler.debug) console.log("InputHandler: touchStarted(" + mouseX + "," + mouseY + ")");

      inputHandler.xDown = mouseX;
      inputHandler.yDown = mouseY;
      inputHandler.xUp = mouseX;                                  
      inputHandler.yUp = mouseY;

      game.mouseDown(mouseX, mouseY);

      this.isDown = true;
    }

    
    this.touchMoved = function(mouseX, mouseY)
    {

      game.mouseMoved(mouseX, mouseY);

      inputHandler.xMove = mouseX;
      inputHandler.yMove = mouseY;

      if(this.isDown)
      {
        if(inputHandler.debug) console.log("InputHandler: touchMoved(" + mouseX + "," + mouseY + ")");

        inputHandler.xUp = mouseX;                                  
        inputHandler.yUp = mouseY;

        
      }
    }

    
    this.touchEnded = function(mouseX, mouseY)
    {
      if(inputHandler.debug) console.log("InputHandler: touchEnded(" + mouseX + "," + mouseY + ")");
      if(inputHandler.debug) console.log("InputHandler: inputHandler.xDown = " + inputHandler.xDown);
      if(inputHandler.debug) console.log("InputHandler: inputHandler.xUp = " + inputHandler.xUp);

      this.isDown = false;

      game.mouseUp(mouseX, mouseY);


      

      inputHandler.resetAll();  
      
      inputHandler.xDown = -1;
      inputHandler.yDown = -1;
      inputHandler.xUp = -1;
      inputHandler.yUp = -1;


    }








    this.handleMouseDown = function(evt)
    {
        if (evt.which == 1)   //left mouse button
        {
          var mouseX = evt.pageX;
          var mouseY = evt.pageY;
          
          inputHandler.touchStarted(mouseX, mouseY);
        }
    }

    this.handleMouseMove = function(evt)
    {
        var mouseX = evt.pageX;
        var mouseY = evt.pageY;
          
        inputHandler.touchMoved(mouseX, mouseY);
    }

    
    this.handleMouseUp = function(evt)
    {
        var mouseX = evt.pageX;
        var mouseY = evt.pageY;
          
        inputHandler.touchEnded(mouseX, mouseY);
    }



    this.handleTouchStart = function(evt) 
    {      
      if(inputHandler.debug) console.log("InputHandler: handleTouchStart: " + evt.touches[0].clientX + "," + evt.touches[0].clientY)
      
      inputHandler.touchStarted(evt.touches[0].clientX, evt.touches[0].clientY);
      
    }; 


    this.handleTouchMove = function(evt) 
    {      
      if(inputHandler.debug) console.log("InputHandler: handleTouchMove: " + evt.touches[0].clientX + "," + evt.touches[0].clientY)
      inputHandler.touchMoved(evt.touches[0].clientX, evt.touches[0].clientY);
    }; 
    

    this.handleTouchEnd = function(evt) 
    {
        if(inputHandler.debug) console.log("InputHandler: handleTouchEnd")
        inputHandler.touchEnded(0,0);
    }

    this.resetAll = function()
    {
      inputHandler.xDown = -1;
      inputHandler.yDown = -1;
      inputHandler.xUp = -1;
      inputHandler.yUp = -1;
    }

    
}