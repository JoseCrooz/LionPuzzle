var board, mouseUtil;

function initGame(level)
{
	document.getElementById('solveBtn').innerHTML = 'SOLVE IT';
	document.getElementById('easyBtn').style.opacity = 0;
	document.getElementById('normalBtn').style.opacity = 0;
	document.getElementById('hardBtn').style.opacity = 0;
	document.getElementById('easyBtn').style.cursor = 'default';
	document.getElementById('normalBtn').style.cursor = 'default';
	document.getElementById('hardBtn').style.cursor = 'default';
	document.getElementById('startScreen').style.opacity = 0;
	
	board = new Board(level);
	board.init();
	mouseUtil = new MouseUtil(board);
}

