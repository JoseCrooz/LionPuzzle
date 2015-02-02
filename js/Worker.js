function Worker(parent,level)
{
	this._level = level;
	this._parent = parent;
	this.tileCount = 15;
	this.isScrambling;
	this.isSolved;
	this.isPlaying;
	this.answerArray; 
	this.registerArray; 
	this.swappableArray; 
	this.tileArray;
	this.solveArray = []; 
	this.currentPosArray; 
	this.empty = {x:0,y:0};
	this.tile = {x:0,y:0};
	this.emptyId = document.getElementById('tile15');
	this.utils = new Utils();
	this.tween;
	this.tileObj;
	               
	this.init = function()
	{                 
		var i = 0;
		var pos = {x:0,y:0};
		this.answerArray = new Array(); 
		this.tileArray = new Array();
	
		for(i; i <= this.tileCount; i++)
		{                      
			pos.x = this.utils.getPosition(document.getElementById('tile'+i).id).x;   
			pos.y = this.utils.getPosition(document.getElementById('tile'+i).id).y;
			this.tileObj = new Tile({name:'tile'+i,id:document.getElementById('tile'+i),x:pos.x,y:pos.y,num:i});
			this.tileArray.push(this.tileObj);
			this.answerArray.push(pos);  
			if(i == this.tileCount)this.registerTiles();
		}
	}
	
	this.registerTiles = function()
	{                
		i = 0;
		
		this.registerArray = [];
		this.empty.x = this.utils.getPosition(this.emptyId.id).x;
		this.empty.y = this.utils.getPosition(this.emptyId.id).y;
		
		for(i; i <= this.tileCount; i++)
		{
			this.registerArray.push(this.utils.getTile(i));
			if(i == this.tileCount)this.gatherSwappable();
		}
	}
	
	this.gatherSwappable = function()
	{
		i = 0;
		this.swappableArray = [];
		
		for(i; i <= this.tileCount; i++)
		{
			this.tile.x = this.utils.getPosition(this.registerArray[i].id).x;
			this.tile.y = this.utils.getPosition(this.registerArray[i].id).y;
			                                                                                                                  
			if(this.tile.x == this.empty.x)if(this.tile.y-this.empty.y == 160 || this.empty.y-this.tile.y == 160)
			{                                     
				this.swappableArray.push(this.registerArray[i]);
			}
			if(this.tile.y == this.empty.y)if(this.tile.x-this.empty.x == 160 || this.empty.x-this.tile.x == 160)
			{                                     
				this.swappableArray.push(this.registerArray[i]);
			}
			
			if(i == this.tileCount)
			{
				this._parent.scramble(this.randomizeArray(this.swappableArray));
			}
		}
	}
	
	this.randomizeArray = function(a){
		for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
		return a;
	}
	
	this.checkBoardState = function()
	{                
		var i = 0;         
		var pos = {x:0,y:0}; 
        this.currentPosArray = [];

		for(i; i <= this.tileCount; i++)
		{            
			pos.x = this.utils.getPosition(document.getElementById('tile'+i).id).x;      
			pos.y = this.utils.getPosition(document.getElementById('tile'+i).id).y;  
			this.currentPosArray.push(pos);  
			if(this.currentPosArray[i].x != this.tileArray[i].getX() || this.currentPosArray[i].y != this.tileArray[i].getY())return;
			if(i == this.tileCount)this._parent.handleWin();
		}
	}
	
	this.updateSolveArray = function(tile)
	{
		this.solveArray.push(tile);
	}
	
	this.solvePuzzle = function()
	{
		var totalMoves = this.solveArray.length; 
		var e = document.getElementById('tile15');
		var target; 
		var targetX;
		var targetY;
		var emptyX;
		var emptyY;
		var direction;                                                                                                  
	    if(totalMoves > 0)
		{               
			target = document.getElementById(this.solveArray[totalMoves-1].id); 
			targetX = this.utils.getPosition(target.id).x;
			targetY = this.utils.getPosition(target.id).y;
			emptyX = this.utils.getPosition(e.id).x;
			emptyY = this.utils.getPosition(e.id).y;
			direction = this.utils.setSlideFrom(targetX,targetY,emptyX,emptyY);                                                                                                                       
			this.tween = new Tween(this,target,targetX,targetY,emptyX,emptyY,'solve',direction,null,null);
			this.solveArray.pop();   
		}
		else this._parent.handleCheated();   
	}  
	
	this.restart = function()
	{
	    this.answerArray = []; 
		this.registerArray = []; 
		this.swappableArray = []; 
		this.tileArray = [];
		this.solveArray = []; 
		this.currentPosArray = []; 
		this.tileArray = []; 
	}
	
   	this.getRegArray = function()
	{
		return this.registerArray;
	}  
	
	this.getTileArray = function()
	{
		return this.tileArray;
	}
}