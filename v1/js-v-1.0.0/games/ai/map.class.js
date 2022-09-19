
function Map()
{
	this.mapData = [];
	this.bots = [];

	this.debug = gameConfig.debugMap;
	this.originX = 0;
	this.originY = 0;
	this.tileSize = gameConfig.tileSize;
	this.numStartingFood = gameConfig.numStartingFood;

	this._NOTHING = 0;
	this._BOT = 1;
	this._FOOD = 2;

	this.buildMap = function(w, h)
	{
		this.mapWidth = w;
		this.mapHeight = h;
		for(var x=0;x < this.mapWidth;x++)
		{
			this.mapData[x] = [];
			for(var y=0;y<this.mapHeight;y++)
			{
				this.mapData[x][y] = this._NOTHING;
			}
		}

		for(var i=0;i<this.numStartingFood;i++)
		{
			var x = this.random(1,this.mapWidth-2);
			var y = this.random(1,this.mapHeight-2);


			if(!gameConfig.randomFoodPos)
			{
				this.mapData[8][2] = this._FOOD;
			}
			else
			{
				this.mapData[x][y] = this._FOOD;
			}

		}
	}

	this.addBot = function(b)
	{
		this.bots.push(b);
	}

	this.render = function(context)
	{
		var drawX = 0;
		var drawY = 0;
		context.fillStyle = "white";

		for(var x=0;x < this.mapWidth;x++)
		{

			for(var y=0;y<this.mapHeight;y++)
			{
				drawX = this.originX + x * this.tileSize - 1;
				drawY = this.originY + y * this.tileSize - 1;

				context.fillStyle = "#888888";

				if(this.mapData[x][y] == this._FOOD)
				{
					context.fillStyle = "#5BFF92";
				}
				context.fillRect(drawX, drawY, this.tileSize-2, this.tileSize-2);

				if(this.tileSize >= 32)
				{
					context.fillStyle = "black";
					context.font = "8px Arial";
					context.fillText(x + "," + y, drawX + 2, drawY + 10);
				}

			}
		}



		for(var i=0;i<this.bots.length;i++)
		{
			context.fillStyle = "white";

			var bot = this.bots[i];



			drawX = this.originX + bot.tileX * this.tileSize - 1;
			drawY = this.originY + bot.tileY * this.tileSize - 1;
			context.fillRect(drawX, drawY, this.tileSize-2, this.tileSize-2);

			if(bot.isEating)
			{
				context.fillStyle = "red";
				drawX = this.originX + bot.tileX * this.tileSize;
				drawY = this.originY + bot.tileY * this.tileSize;
				context.fillRect(drawX, drawY, this.tileSize-4, this.tileSize-4);

			}

		}

		if(this.debug)
		{
			drawX = this.originX - 50;
			drawY = this.originY;
			context.fillStyle = "white";
			context.font = "10px Arial";
			context.fillText("id: " + this.bots[0].botID, drawX, drawY+=10);
			context.fillText("age: " + this.bots[0].age, drawX, drawY+=10);
			if(this.bots[0].dna.lives > 0) context.fillText("lives: " + this.bots[0].dna.lives, drawX, drawY+=10);
			context.fillText("health: " + this.bots[0].health, drawX, drawY+=10);
			context.fillText("score: " + this.bots[0].dna.score, drawX, drawY+=10);
			outStr = "";
			for(var i=0;i<this.bots[0].lastOutput.length;i++)
			{
				outStr+=this.bots[0].lastOutput[i];
			}
			context.fillText("out: " + outStr, drawX, drawY+=10);
			context.fillText("idx: " + this.bots[0].currActionIdx, drawX, drawY+=10);
		}


		context.font = "10px Arial";
		context.fillStyle = "white";
		context.fillText("Health:", this.originX, this.originY - 5);
		context.fillStyle = "green";
		var barWidth = 50 * (this.bots[0].health/100);
		context.fillRect(this.originX + 40, this.originY - 10, barWidth, 5);

		context.fillStyle = "white";
		drawX = this.originX + (this.tileSize * this.mapWidth) - 30;
		drawY = this.originY - 15;
		context.font = "12px Arial";
		context.fillText("" + this.bots[0].dna.score, drawX, drawY+=10);

		context.font = "10px Arial";
		if(this.bots[0].dna.lives > 0)
		{
			context.fillText("Lives:", this.originX, this.originY - 20);

			var barSize = 5;

			for(var i=0;i<this.bots[0].dna.lives;i++)
			{
				context.fillStyle = "green";
				drawX = this.originX + (i * (barSize + 1)) + 40;
				drawY = this.originY  - 25;
				context.fillRect(drawX, drawY, barSize, barSize);
			}
		}

		drawX = this.originX - 55;
		drawY = this.originY;
		var miniTileSize = 10;


		var inputIdx = 0;

		for(var x=0;x<3;x++)
		{
			for(var y=0;y<3;y++)
			{
				drawX = this.originX - 55 + (x * miniTileSize);
				drawY = this.originY + (y * miniTileSize);

				context.fillStyle = "#777777";

				if(this.bots[0].lastInputs[inputIdx] > 0)
				{
					context.fillStyle = "yellow";
				}

				context.fillRect(drawX + 1, drawY + 1, miniTileSize-2,miniTileSize-2);

				inputIdx++;


			}
		}

		drawX = this.originX - 55 + (1 * miniTileSize);
		drawY = this.originY + (1 * miniTileSize);
		context.fillStyle = "white";
		context.fillRect(drawX + 1, drawY + 1, miniTileSize-2,miniTileSize-2);


		this.drawBotInsights(context, this.bots[0]);
		


	}

	this.drawBotInsights = function(context, bot)
	{
		
		miniTileSize = 8;		
		drawX = this.originX - 55;
		drawY = this.originY + 50;
		
		context.fillStyle = "white";
		context.font = "10px Arial";
		context.fillText("Action:",  this.originX - 55, this.originY + 45);


		for(var i=0;i<bot.lastOutput.length;i++)
		{
			context.fillStyle = "white";

			if(bot.lastOutput[i] > 0)
			{
				context.fillStyle = "yellow";
			}

			context.fillRect(drawX + 1, drawY + 1, miniTileSize-2,miniTileSize-2);

			drawX+= miniTileSize + 1;
		}
		drawX = this.originX - 55 + (1 * miniTileSize);
		drawY = this.originY + (1 * miniTileSize);
		context.fillStyle = "white";
		context.font = "10px Arial";
		context.fillText(bot.currActionStr,  this.originX - 55, this.originY + 70);

		

	}

	this.setTile = function(tileX, tileY, tileVal)
	{
		this.mapData[tileX][tileY] = tileVal;
	}

	this.peek = function(tileX, tileY)
	{
		if(tileX < 0 || tileY < 0) return 0;

		if(tileX >= this.mapWidth || tileY >= this.mapHeight) return 0;

		return this.mapData[tileX][tileY];
	}

	this.peekAround = function(tileX, tileY)
	{
		var out = [
					 [0,0,0]
					,[0,0,0]
					,[0,0,0]
				];

		out[0][0] = this.peek(tileX - 1, tileY -1);
		out[0][1] = this.peek(tileX, tileY - 1);
		out[0][2] = this.peek(tileX + 1, tileY - 1);

		out[1][0] = this.peek(tileX - 1, tileY);
		out[1][1] = this.peek(tileX, tileY);
		out[1][2] = this.peek(tileX + 1, tileY);

		out[2][0] = this.peek(tileX - 1, tileY + 1);
		out[2][1] = this.peek(tileX, tileY + 1);
		out[2][2] = this.peek(tileX + 1, tileY + 1);

		return out;

	}

	this.getNearest = function(tileX, tileY, findIt)
	{

		var loc = {tileX:-1, tileY: -1, distance: 99999};


		for(var x=0;x < this.mapWidth;x++)
		{
			for(var y=0;y<this.mapHeight;y++)
			{
				if(this.mapData[x][y] == findIt)
				{
					var d = this.distance(tileX, tileY, x, y);
					if(d < loc.distance)
					{
						loc.distance = d;
						loc.tileX = x;
						loc.tileY = y;
					}
				}
			}
		}

		return loc;
	}

	this.has = function(findIt)
	{

		for(var x=0;x < this.mapWidth;x++)
		{
			for(var y=0;y<this.mapHeight;y++)
			{
				if(this.mapData[x][y] == findIt)
				{
					return true;
				}
			}
		}

		return false;
	}



	this.distance = function(x1, y1, x2, y2)
	{
		var a = x1 - x2;
		var b = y1 - y2;

		return Math.sqrt( a*a + b*b );
	}

	this.random = function(min, max)
	{
	  return Math.floor(Math.random() * (max - min + 1) + min)
	}

}
