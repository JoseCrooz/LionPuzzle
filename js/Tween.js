// FYI this has nothing to do with tween.js - https://github.com/sole/tween.js/
/*
* @param tile Reference to target tile;
* @param targetx Target tile's x position;
* @param targety Target tile's y position;
* @param emptyx Empty tile's x position;
* @param emptyy Empty tile's y position;
* @param type The type of tween. 'scramble','click','drag', or 'solve';
* @param direction Position of the target tile relative to the position 
	of the empty tile. 'top','bottom','left', or 'right';
* @param slideto Direction that the target tile is going to be tweened 
	to. 'forward' or 'back';
*/

function Tween(parent,tile,targetx,targety,emptyx,emptyy,type,direction,slideto,dragPoints)
{
	var _parent = parent;
	var _tile = tile;
	var _targetx = targetx;
	var _targety = targety;
	var _emptyx = emptyx;
	var _emptyy = emptyy;
	var _type = type;
	var _dir = direction;
	var _sto = slideto;
	var _dp = dragPoints;
	 
	var emptyTile = document.getElementById('tile15');
	var currentPosition;
	var moveAmount;
	var totalProgress;
	var tweenTimer;
	var padding;
	var ax;
	var utils = new Utils();
	
	doTween = function()
	{
		
		//
		//SCRAMBLE OR CLICK OR SOLVE
		//
		
		if(_type == 'scramble' ||_type == 'click' || _type == 'solve')
		{         
			                
			if(_dir == 'bottom' || _dir == 'right')padding = 4;
			else if(_dir == 'top' || _dir == 'left')padding = 0;

			if(_dir == 'left' || _dir == 'right')
			{
				emptyTile.style.left = parseInt(_targetx)+'px';
				currentPosition = utils.getPosition(_tile.id).x;
				ax = _emptyx;
			}
			else if(_dir == 'top' || _dir == 'bottom')
			{
				emptyTile.style.top = parseInt(_targety)+'px';
				currentPosition = utils.getPosition(_tile.id).y;
				ax = _emptyy;
			}
			
			moveAmount = ax - currentPosition - padding;
			totalProgress = currentPosition+Math.ceil((moveAmount/5));
			if(_dir == 'bottom' || _dir == 'top')_tile.style.top = totalProgress+'px';
			else _tile.style.left = totalProgress+'px';
			
			if(totalProgress == ax)
			{
				clearTimeout(tweenTimer);
				if(_type == 'scramble')_parent.onScrambleComplete();
				else if(_type == 'solve')
				{
					_parent.solvePuzzle();
				}
				else if(_type == 'click')_parent.checkBoardState();
				return;
			}
			else tweenTimer = window.setTimeout(doTween,5);
		}
		
		//
		//DRAG
		//
		else if(_type == 'drag')
		{
			if(_dir == 'left' || _dir == 'right')
			{
				currentPosition = utils.getPosition(_tile.id).x;
				ax = _emptyx;
			}
			else if(_dir == 'top' || _dir == 'bottom')
			{
				currentPosition = utils.getPosition(_tile.id).y;
				ax = _emptyy;
			}
			
			if(_dir == 'bottom' && _sto == 'forward')padding = 4;
			else if(_dir == 'top' && _sto == 'back')padding = 4;
			else if(_dir == 'left' && _sto == 'back')padding = 4;
			else if(_dir == 'right' && _sto == 'forward')padding = 4;
			else padding = 0;
			
			if(_sto == 'forward')
			{
				moveAmount = ax - currentPosition - padding;
				totalProgress = currentPosition+Math.ceil((moveAmount/5));
				if(_dir == 'bottom' || _dir == 'top')_tile.style.top = totalProgress+'px';
				else _tile.style.left = totalProgress+'px';
				
				if(totalProgress == ax)
				{
					_parent.checkBoardState();
					return;
				}
				else tweenTimer = window.setTimeout(doTween,5);
			}
			else if(_sto == 'back')
			{
				if(_dir == 'bottom' || _dir == 'top')ax = _dp.y;
				else if(_dir == 'left' || _dir == 'right')ax = _dp.x;
				if(_dir == 'bottom' || _dir == 'top')moveAmount = _dp.y - currentPosition - padding;
				if(_dir == 'left' || _dir == 'right')moveAmount = _dp.x - currentPosition - padding;
				totalProgress = currentPosition+Math.ceil((moveAmount/5));
				if(_dir == 'bottom' || _dir == 'top')_tile.style.top = totalProgress+'px';
				else _tile.style.left = totalProgress+'px';
				
				if(totalProgress == ax)
				{
					_parent.checkBoardState();
					return;
				}
				else tweenTimer = window.setTimeout(doTween,5);
			}
		} 
	}
	
	doTween();	
}