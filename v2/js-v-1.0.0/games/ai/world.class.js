
function World(originX, originY, dna, botID)
{
	this.originX = originX;
	this.originY = originY;
	this.dna = dna;
	this.botID = botID;

	this.map = {};
	this.bots = [];

	this.init = function()
	{
		var m = new Map();
		m.buildMap(gameConfig.mapSize,gameConfig.mapSize);
		m.originX = this.originX;
		m.originY = this.originY;

		var b = new Bot({tileX:5, tileY:5, dna:this.dna, botID:this.botID});

		this.map = m;
		this.map.addBot(b);
	}

	this.render = function(context)
	{
		this.map.render(context);
	}

	this.process = function()
	{
		for(var i=0;i<this.map.bots.length;i++)
		{
			this.map.bots[i].takeAction(this.map);
		}
	}
}
