var gameConfig = {
	numWorlds: 50
	,numStartingFood: 1
	,randomFoodPos: false
	,healthLostEachRound: 1
	,maxLoopsPerGen: 200
	,keepPercent: .2
	,mutationRate: 0.75
	,mutationAmount: 3
	,scoreForEating:5
	,scoreForEatingEmptySpace:-2
	,scoreForMovingToFood: 1
	,scoreForMovingAwayFood:-2
	,mapSize:10
	,tileSize: 12
	,gameSpeed:10
	,debugMap: false
	};


function ViewEntrance()
{
	this.numWorlds = gameConfig.numWorlds;
	this.worlds = [];

	this.neat = {};


	this.maps = [];
	this.bots = [];
	this.keepPlaying = false;
	this.playLoop = {};
	this.loopCount = 0;
	this.maxLoops = gameConfig.maxLoopsPerGen;

	this.keepRendering = false;

    this.init = function()
    {
        this.setupMenu();



		this.neat = new Neat(13, 1, null, {
		    popsize: this.numWorlds,
		    elitism:  Math.round(gameConfig.keepPercent * this.numWorlds),
		    mutationRate: gameConfig.mutationRate,
		    mutationAmount: gameConfig.mutationAmount
		  }
		);

 		this.startGeneration();
    }


    this.setupMenu = function()
    {

        var menuOptions = {
            "menuHeader": "Debug Menu"
            ,"menuTriggerKey":"debug-menu"
            ,"menuWidth": 150
            ,"menuHeight":200
            ,"drawX": beamerGui.getScreenWidth() - 200
            ,"drawY": beamerGui.getScreenHeight() - 250
            , "buttons": [
                {"buttonText":"slow down", "buttonActionKey":"slow-down"}
                ,{"buttonText":"speed up", "buttonActionKey":"speed-up"}
                ,{"buttonText":"pause", "buttonActionKey":"toggle-pause"}
                ,{"buttonText":"one step", "buttonActionKey":"one-step"}
            ]
        };

        beamerGui.addMenu(menuOptions);

        beamerGui.addToBottomMenu({"actionKey":"toggle-debug","imgKey":"gui-icon-settings"});

    }

	this.startGeneration = function()
	{
		this.setupWorlds(this.numWorlds);

		this.keepRendering = true;

		this.loopCount = 0;

		this.startPlaying();


	}


	this.setupWorlds = function(numWorlds)
	{
		gameConfig.worldDisplayWidth = gameConfig.tileSize * gameConfig.mapSize + 50;
		gameConfig.worldDisplayHeight = gameConfig.tileSize * gameConfig.mapSize;
		this.worlds = [];

		var numCols = Math.floor(beamerGui.screenWidth / gameConfig.worldDisplayWidth)-1;

		var drawX = 70;
		var drawY = 125;

		for(var i=0;i<numWorlds;i++)
		{

			if(i > 0 && i%numCols == 0)
			{
				drawX = 70;
				drawY+= gameConfig.worldDisplayHeight + 40;
			}

			var w = new World(drawX, drawY, this.neat.population[i], i);
			w.init();
			this.worlds.push(w);

			drawX+=gameConfig.worldDisplayWidth + 10;

		}
	}

	this.process = function()
	{
		_self = play.view;

		for(var i=0;i<_self.worlds.length;i++)
		{
			_self.worlds[i].process();
		}

		_self.loopCount++;

		if(_self.loopCount >= _self.maxLoops)
		{
			_self.stopPlaying();

			//beamerGui.growl("Ending Cycle");

			_self.endCycle();
		}
	}

	this.endCycle = function()
	{
		this.neat.sort();

		var newGeneration = []

		for (var i = 0; i < this.neat.elitism; i++)
		{

		      newGeneration.push(this.neat.population[i])
    	}

		for (var i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      		newGeneration.push(this.neat.getOffspring())
    	}


		for (var i = 0; i < this.neat.popsize; i++)
		{
		    if(this.neat.population[i].lives !== undefined && i < this.neat.elitism)
		    {
				newGeneration[i].lives++;
			}
			else
			{
				newGeneration[i].lives = 1;
			}
    	}


    	this.neat.population = newGeneration
	    this.neat.mutate()
	    this.neat.generation++

    	this.startGeneration();


	}


	this.changeSpeed = function()
	{
		this.keepPlaying = false;
		clearInterval(this.playLoop);

		this.startPlaying();
	}


	this.startPlaying = function()
	{
		if(!this.keepPlaying)
		{
			this.playLoop = setInterval("window.requestAnimationFrame(play.view.process)",gameConfig.gameSpeed);
			this.keepPlaying = true;
		}
	}

	this.stopPlaying = function()
	{
		this.keepPlaying = false;
		clearInterval(this.playLoop);
	}

    this.processAction = function(actionKey)
    {

    }

    this.render = function(context)
    {
		if(!this.keepRendering) return;

		context.fillStyle = "#777777";
		context.fillRect(0,0,beamerGui.screenWidth, 75);

		for(var i=0;i<this.worlds.length;i++)
		{
			this.worlds[i].render(context);
		}

		var drawX = 20;
		var drawY = 20;
		context.fillStyle = "white";
		context.font = "12px Arial";
		context.fillText("Generation: " + this.neat.generation, drawX, drawY+=15);
		context.fillText("Cycle: " + this.loopCount, drawX, drawY+=15);


    }

}


