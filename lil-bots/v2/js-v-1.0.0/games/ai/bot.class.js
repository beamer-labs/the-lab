
function Bot(options)
{
	this.map = {};

	this.dna = options.dna;
	this.dna.score = 0;
	this.botID = options.botID;
	this.tileX = options.tileX;
	this.tileY = options.tileY;
	this.health = 100;
	this.movementCost = 1;
	this.age = 0;
	this.lives = 0;
	this.actions = [this._MOVE_N, this._MOVE_E, this._MOVE_S, this._MOVE_W, this._EAT]
	this.scoreForEating = gameConfig.scoreForEating;
	this.scoreForMovingToFood = gameConfig.scoreForMovingToFood;
	this.scoreForMovingAwayFood = gameConfig.scoreForMovingAwayFood;
	this.lastInputs = [];
	this.lastOutput = [];
	this.currOutput = [];
	this.currActionIdx = 0;
	this.currActionTotal = 0;
	this.currActionStr = "";

	this.isEating = false;
	this._MOVE_N = 1;
	this._MOVE_E = 2;
	this._MOVE_S = 3;
	this._MOVE_W = 4;
	this._EAT = 5;

	this.getInputsType1 = function(map)
	{
		//13 inputs
		var out = [];

		var miniMap = this.map.peekAround(this.tileX, this.tileY);

		for(var x =0;x < miniMap.length;x++)
		{
			for(var y=0;y<miniMap[x].length;y++)
			{
				out.push(miniMap[x][y]/100);
			}
		}

		out.push(this.age/100);
		out.push(this.health/100);
		out.push(this.map.has(map._FOOD));

		var foodLoc = map.getNearest(this.tileX, this.tileY, map._FOOD);

		var distanceToFood = map.distance(this.tileX, this.tileY, foodLoc.tileX, foodLoc.tileY);

		out.push(distanceToFood/100);

		return out;
	}


	this.getInputsType2 = function(map)
	{
		var out = [];


		for(var x=0;x < map.mapWidth;x++)
		{
			for(var y=0;y<map.mapHeight;y++)
			{
				out.push(map.mapData[x][y]/100);
			}
		}

		out.push(this.age/100);
		out.push(this.health/100);
		out.push(this.map.has(map._FOOD));

		var foodLoc = map.getNearest(this.tileX, this.tileY, map._FOOD);

		var distanceToFood = map.distance(this.tileX, this.tileY, foodLoc.tileX, foodLoc.tileY);

		out.push(distanceToFood/100);

		return out;
	}


	this.takeAction = function(map)
	{
		this.map = map;
		this.isEating = false;

		if(this.health > 0)
		{
			this.age++;

			this.lastTileX = this.tileX;
			this.lastTileY = this.tileY;
			this.lastHealth = this.health;

			var inputs = this.getInputsType1(map);

			this.lastInputs = inputs;

			this.currActionTotal = 0;
			var output = this.dna.activate(inputs).map(o => Math.round(o));
			this.lastOutput = output;
			this.currOutput = output;
 			this.currActionTotal = parseInt(this.currOutput[0]);
 			this.currActionStr = this.currActionTotal;
			//if(this.currOutput[0] > 0) this.currActionTotal++;
			//if(this.currOutput[1] > 0) this.currActionTotal++;
			//if(this.currOutput[2] > 0) this.currActionTotal++;
			//if(this.currOutput[3] > 0) this.currActionTotal++;
			//if(this.currOutput[4] > 0) this.currActionTotal++;


			if(this.currActionTotal == 1)
			{
				this.processAction(this._MOVE_N, map);
				//this.currActionStr = "N";
			}

			if(this.currActionTotal == 2)
			{
				this.processAction(this._MOVE_E, map);
				//this.currActionStr = "E";
			}

			if(this.currActionTotal == 3)
			{
				this.processAction(this._MOVE_S, map);
				//this.currActionStr = "S";

			}

			if(this.currActionTotal == 4)
			{
				this.processAction(this._MOVE_W, map);
				//this.currActionStr = "W";

			}

			if(this.currActionTotal == 5)
			{
				this.processAction(this._EAT, map);
				//this.currActionStr = "*";

			}


			if(this.currActionTotal == 6)
			{
				this.processAction(this._MOVE_N, map);
				this.processAction(this._MOVE_E, map);
				//this.currActionStr = "*";

			}

			this.health-=gameConfig.healthLostEachRound;

			this.scoreBot(map);

			this.currActionIdx++;

			//console.log(this.tileX + "," + this.tileY);
		}

	}

	this.scoreBot = function(map)
	{
		var foodLoc = map.getNearest(this.lastTileX, this.lastTileY, map._FOOD);

		var distanceBeforeMove = map.distance(this.lastTileX, this.lastTileY, foodLoc.tileX, foodLoc.tileY);
		var distanceAfterMove = map.distance(this.tileX, this.tileY, foodLoc.tileX, foodLoc.tileY);

		if(distanceAfterMove < distanceBeforeMove) this.dna.score += this.scoreForMovingToFood;
		if(distanceAfterMove > distanceBeforeMove) this.dna.score += this.scoreForMovingAwayFood;

		if(this.health > this.lastHealth) this.dna.score+= this.scoreForEating;

		if(this.isEating)
		{
			if(this.health < this.lastHealth)
			{
				this.dna.score+=gameConfig.scoreForEatingEmptySpace;
			}
		}

	}


	this.processAction = function(action, map)
	{
		var newTileX = this.tileX;

		var newTileY = this.tileY;

		var adjScore = 0;

		if(action == this._EAT)
		{
			this.isEating = true;

			if(map.peek(this.tileX, this.tileY) == map._FOOD)
			{
				map.setTile(this.tileX, this.tileY, map._NOTHING);
				this.health+=10;

			}

			/*
			var minX = this.tileX -1;
			var maxX = this.tileX + 1;
			var minY = this.tileY -1;
			var maxY = this.tileY + 1;
			for(var x = minX;x<maxX;x++)
			{
				for(var y = minY;y<maxY;y++)
				{

					if(map.peek(x,y) == map._FOOD)
					{
						map.setTile(x, y, map._NOTHING);
						this.lastHealth = this.health;
						this.health+=10;

					}

				}
			}
			*/
		}


		if(action == this._MOVE_N)
		{
			newTileY++;

			if(newTileY >= map.mapHeight)
			{
				newTileY = 0;
			}
		}

		if(action == this._MOVE_S)
		{
			newTileY--;

			if(newTileY < 0)
			{
				newTileY = map.mapHeight-1;
			}
		}

		if(action == this._MOVE_E)
		{
			newTileX++;

			if(newTileX >= map.mapWidth)
			{
				newTileX = 0;
			}
		}

		if(action == this._MOVE_W)
		{
			newTileX--;

			if(newTileX < 0)
			{
				newTileX = map.mapWidth-1;
			}
		}





		this.tileX = newTileX;
		this.tileY = newTileY;



	}

	this.random = function(min, max)
	{
	  return Math.floor(Math.random() * (max - min + 1) + min)
	}
}
