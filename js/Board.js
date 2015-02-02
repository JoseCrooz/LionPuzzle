function Board(level)
{
	this._level = level;
	this.counter = 0;
	this.blinkCount = 0;
	this.tileCount = 15;
	this.slideAmount = 160;
	this.slideFrom;
	this.tileArray;
	this.activeTile;
	this.previousTile;
	this.emptyTile;
	this.isScrambled = false;
	this.isSolved = false;
	this.isPlaying = false;
	this.scrambleTile;
	this.tile = {x:0,y:0};
	this.empty = {x:0,y:0};
	this.emptyId = document.getElementById('tile15');
	this.tween;
	this.worker = new Worker(this,this._level);
	this.utils = new Utils();  
	this.timer;
	this.startState = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

	this.init  = function()
	{
		this.tileArray = new Array();
		this.worker.init();
	}
	
	this.scramble = function(swappable)
	{		        
		var randArray = this.utils.shuffle(swappable);
		this.activeTile = document.getElementById(randArray[0].id);
		
		if(this.previousTile == this.activeTile)
		{
			this.activeTile = document.getElementById(randArray[1].id);
			this.previousTile = this.activeTile;
		}
		else this.previousTile = this.activeTile;

		this.tile.x = this.utils.getPosition(this.activeTile.id).x;
		this.tile.y = this.utils.getPosition(this.activeTile.id).y;
		this.empty.x = this.utils.getPosition('tile15').x;
		this.empty.y = this.utils.getPosition('tile15').y;
		this.slideFrom = this.setSlideFrom();
		this.worker.updateSolveArray(this.activeTile);
		
		this.tween = new Tween(this,this.activeTile,this.tile.x,this.tile.y,this.empty.x,this.empty.y,'scramble',this.slideFrom,null,null);
	}
	
	this.onScrambleComplete = function()
	{
		if(this.counter < this._level)
		{
			this.counter++;
			this.worker.registerTiles();
		}
		else
		{
			if(this.validateScramble())
			{
				//alert("WE'RE GOOD");
				this.isPlaying = true;
				this.isScrambled = true;
				document.getElementById('startScreen').style.top = parseInt(-640)+'px';
				document.getElementById('easyBtn').style.top = parseInt(-640)+'px';
				document.getElementById('normalBtn').style.top = parseInt(-640)+'px';
				document.getElementById('hardBtn').style.top = parseInt(-640)+'px';
				document.getElementById('solveBtn').style.opacity = 1;
			}
			else alert('SCRAMBLE FAILED');
			
		}
	}
	
	//Checks to see if the scramble was successful
	this.validateScramble = function()
	{
		var i = 0;
		var tileArray = this.worker.getTileArray();
		var scrambleState = [];
		for(i; i <= this.tileCount; i++)
		{
			scrambleState.push(tileArray[i].getNum());
			if(i == this.tileCount)
			{
				if(this.utils.getScrambleState(this.startState,scrambleState))return true;
				else return false;
			}
		}
	}

	this.swapTiles = function(t,tpx,tpy,epx,epy,type,sf,dir,ds,e)
	{
		this.tween = new Tween(this.worker,t,tpx,tpy,epx,epy,type,sf,dir,ds);
		this.worker.updateSolveArray(t);
	
		if(e)
		{
			if(sf == 'top' || sf == 'bottom')this.emptyId.style.top = parseInt(ds.y)+'px';
			else if(sf == 'left' || sf == 'right')this.emptyId.style.left = parseInt(ds.x)+'px';	
		}
	}  
	
	this.swapTilesForSolve = function(p,tpx,tpy,epx,epy,type,sf,dir,ds)
	{
		this.tween = new Tween(p,t,tpx,tpy,epx,epy,type,sf,dir,ds);
	}

	this.handleSolveRequest = function()
	{                  
		if(!this.isSolved)this.worker.solvePuzzle();
		else this.handleRestart();
	}

	this.handleWin = function()
	{   
		this.isSolved = true;
		this.isPlaying = false; 
		                                               
		document.getElementById('startScreen').style.opacity = 0.4;
		document.getElementById('startScreen').style.top = parseInt(0)+'px';
		document.getElementById('tile15').style.opacity = 1;
		document.getElementById('solveBtn').innerHTML = 'PLAY AGAIN';
		document.getElementById('marquee').style.opacity = 1;   
		document.getElementById('marquee').style.zIndex = 4000; 
		
		this.worker.restart();	
	}
	
	this.handleCheated = function()
	{                         
		alert('You Cheated.'); 
		
		this.isSolved = true;
		this.isPlaying = false; 
		                                               
		document.getElementById('startScreen').style.opacity = 0.4;
		document.getElementById('startScreen').style.top = parseInt(0)+'px';
		document.getElementById('tile15').style.opacity = 1;
		document.getElementById('solveBtn').innerHTML = 'PLAY AGAIN'; 
		
		this.worker.restart();
	}   

	this.handleRestart = function()
	{
		this.isPlaying = true;
		document.getElementById('startScreen').style.opacity = 0.4;
		document.getElementById('startScreen').style.top = parseInt(0)+'px';
		document.getElementById('startScreen').style.opacity = 0.8;
		document.getElementById('easyBtn').style.top = parseInt(290)+'px';
		document.getElementById('normalBtn').style.top = parseInt(320)+'px';
		document.getElementById('hardBtn').style.top = parseInt(350)+'px';
		document.getElementById('easyBtn').style.opacity = parseInt(1);
		document.getElementById('normalBtn').style.opacity = parseInt(1);
		document.getElementById('hardBtn').style.opacity = parseInt(1);
		document.getElementById('easyBtn').style.cursor = 'pointer';
		document.getElementById('normalBtn').style.cursor = 'pointer';
		document.getElementById('hardBtn').style.cursor = 'pointer';
		document.getElementById('tile15').style.opacity = 0;
		document.getElementById('solveBtn').style.opacity = 0;
		document.getElementById('marquee').style.opacity = 0; 
		document.getElementById('marquee').style.zIndex = 0;
	}
	
	this.setSlideFrom = function()
	{
		var sf;
		
		if(this.tile.x == this.empty.x && this.tile.y < this.empty.y)sf = "top";
		if(this.tile.x == this.empty.x && this.tile.y > this.empty.y)sf = "bottom";
		
		if(this.tile.y == this.empty.y && this.tile.x < this.empty.x)sf = "left";
		if(this.tile.y == this.empty.y && this.tile.x > this.empty.x)sf = "right";
		
		return sf;
	}
}
