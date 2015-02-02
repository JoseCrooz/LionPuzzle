function MouseUtil(board)
{
	var _target;
	var targetPos = {x:0,y:0};
	var emptyPos = {x:0,y:0};
	var dragStart = {x:0,y:0};   
	var originalPos = {x:0,y:0};
	var emptyId = document.getElementById('tile15');
	var startMousePos = {x:0,y:0};
	var wasDragging = false;
	var slideFrom;
	var board = board;
	var direction;  
	var slideAmount = 160;
	var dragFailed;
	
	var utils = new Utils();
	
	handleMouseDown = function(event,target)
	{
		_target = document.getElementById(target.id);
		startMousePos.x = event.clientX + window.scrollX;
		startMousePos.y = event.clientY + window.scrollY;
		originalPos.x = utils.getPosition(_target.id).x;
		originalPos.y = utils.getPosition(_target.id).y;
		targetPos.x = utils.getPosition(_target.id).x;
		targetPos.y = utils.getPosition(_target.id).y;
		emptyPos.y = utils.getPosition(emptyId.id).y;
		emptyPos.x = utils.getPosition(emptyId.id).x;
		dragStart.x = targetPos.x;
		dragStart.y = targetPos.y;        
		
		slideFrom = utils.setSlideFrom(targetPos.x,targetPos.y,emptyPos.x,emptyPos.y);
		wasDragging = false;

		if(slideFrom != undefined)
		{
			_target.addEventListener("mouseup",handleMouseUp,false);	
			_target.addEventListener("mousemove",handleMouseMove,false);	
		}
	}
	
	handleMouseMove = function(event)
	{              
		 
		var draggableBounds = {start:0,end:0};
		var count = 0;
		var currPos;
		var movePos;
		
	    _target.style.zIndex = 1000;
		
		wasDragging = true;
	
		if(slideFrom == 'top')
		{            
			draggableBounds.start = targetPos.y; 
			draggableBounds.end = targetPos.y + slideAmount;                                                        
			if(utils.getPosition(_target.id).y >= draggableBounds.start && utils.getPosition(_target.id).y < draggableBounds.end)
			{
				dragFailed = false;
				_target.style.top = parseInt(targetPos.y+event.clientY-startMousePos.y)+'px';
			}   
			else
			{
				dragFailed = true;
				//destroyListeners();
			}
		}
		else if(slideFrom == 'bottom')
		{
			draggableBounds.start = targetPos.y;
			draggableBounds.end = targetPos.y - slideAmount;
			if(utils.getPosition(_target.id).y <= draggableBounds.start && utils.getPosition(_target.id).y >= draggableBounds.end)
			{
				dragFailed = false;
				_target.style.top = parseInt(targetPos.y+event.clientY-startMousePos.y)+'px';
			}
			else
			{
				dragFailed = true;
				//destroyListeners();
			}
		}
		else if(slideFrom == 'left')
		{
			draggableBounds.start = targetPos.x;
			draggableBounds.end = targetPos.x + slideAmount;
			if(utils.getPosition(_target.id).x >= draggableBounds.start && utils.getPosition(_target.id).x <= draggableBounds.end)
			{
				dragFailed = false;
				_target.style.left = parseInt(targetPos.x+event.clientX-startMousePos.x)+'px';
			} 
			else
			{
				dragFailed = true;
				//destroyListeners();
			}
		}
		else if(slideFrom == 'right')
		{
			draggableBounds.start = targetPos.x;
			draggableBounds.end = targetPos.x - slideAmount;
			if(utils.getPosition(_target.id).x <= draggableBounds.start && utils.getPosition(_target.id).x >= draggableBounds.end)
			{
				dragFailed = false;
				_target.style.left = parseInt(targetPos.x+event.clientX-startMousePos.x)+'px';
			}  
			else 
			{
				dragFailed = true;
				//destroyListeners();
			}
		} 
	}
	
	handleMouseUp = function()
	{	
		destroyMouseListeners();
		
		if(dragFailed)
		{
			//alert(utils.getPosition(_target.id).x+','+originalPos.x);
			if(slideFrom == 'top')if(utils.getPosition(_target.id).y < originalPos.y)_target.style.top = parseInt(originalPos.y)+'px';
			if(slideFrom == 'bottom')if(utils.getPosition(_target.id).y > originalPos.y)_target.style.top = parseInt(originalPos.y)+'px';
			if(slideFrom == 'left')if(utils.getPosition(_target.id).x < originalPos.x)_target.style.left = parseInt(originalPos.x)+'px';
			if(slideFrom == 'right')if(utils.getPosition(_target.id).x > originalPos.x)_target.style.left = parseInt(originalPos.x)+'px';
			dragFailed = false;
		}
		else
		{
			var tPos = {x:utils.getPosition(_target.id).x,y:utils.getPosition(_target.id).y};
	 
			_target.style.zIndex = 0;
			targetPos.x = utils.getPosition(_target.id).x;
			targetPos.y = utils.getPosition(_target.id).y;
			emptyPos.y = utils.getPosition(emptyId.id).y;
			emptyPos.x = utils.getPosition(emptyId.id).x;
			
			if(!wasDragging)
			{
				if(targetPos.x == emptyPos.x)if(targetPos.y-emptyPos.y == 160 || emptyPos.y-targetPos.y == 160)board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'click',slideFrom,null);
				if(targetPos.y == emptyPos.y)if(targetPos.x-emptyPos.x == 160 || emptyPos.x-targetPos.x == 160)board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'click',slideFrom,null);	
			}
			else
			{
				wasDragging = true;
				if(slideFrom=='top')
				{
					if(tPos.y > (dragStart.y+80))
					{
						
						direction = 'forward';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart,true);
					}
					else
					{
						direction = 'back';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart);
					} 
				}
				else if(slideFrom=='bottom')
				{
					if(tPos.y < (emptyPos.y + 80))
					{
						direction = 'forward';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart,true);
					}
					else
					{
						direction = 'back';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart);
					}
					
				}
				else if(slideFrom=='left')
				{
					if(tPos.x > (dragStart.x+80))
					{
						direction = 'forward';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart,true);
					}
					else
					{
						direction = 'back';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart);
					} 
				}
				else if(slideFrom=='right')
				{
					if(tPos.x < (emptyPos.x + 80))
					{
						direction = 'forward';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart,true);
					}
					else
					{
						direction = 'back';
						board.swapTiles(_target,targetPos.x,targetPos.y,emptyPos.x,emptyPos.y,'drag',slideFrom,direction,dragStart);
					}
				}
			}	
		}
	}
	
	destroyMouseListeners = function()
	{
		_target.removeEventListener("mouseup",handleMouseUp,false);
		_target.removeEventListener("mousemove",handleMouseMove,false);	
	}
}
