function Utils()
{
	this.setSlideFrom = function(tX,tY,eX,eY)
	{	
		var sf;
		if(tX == eX && tY < eY)sf = "top";
		if(tX == eX && tY > eY)sf = "bottom";
		
		if(tY == eY && tX < eX)sf = "left";
		if(tY == eY && tX > eX)sf = "right";    
		return sf;
	}	
	
	this.getPosition = function(tileId)
	{
		var n = document.getElementById(tileId);
		for (var lx=0, ly=0; n != null; lx += n.offsetLeft, ly += n.offsetTop, n = n.offsetParent);
		{
			return {x: lx,y: ly};
		}
	}
	
	this.getTile = function(num)
	{
		return document.getElementById('tile'+num);
	}  
	
   	this.shuffle = function(a)
	{
		for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
		return a;
	}
	
	this.getScrambleState = function(startState,scrambleState)
	{
		if(startState != scrambleState)return true;
		else return false;
	}
}