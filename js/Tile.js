function Tile (parameters)
{
	this.name = parameters.name;
	this.id = parameters.id;    
	this.x = parameters.x;
	this.y = parameters.y;
	this.num = parameters.num;
	                  
	this.getName = function()
	{
		return this.name;
	}

	this.getX = function()
	{
		return this.x;
	}

	this.getY = function()
	{
		return this.y;
	}
	
	this.getNum = function()
	{
		return this.num;	
	}
}