/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  var b = new Board({n: n});
  
  var hasAnyConflicts = function(b) {
    return (b.hasAnyColConflicts() || b.hasAnyRowConflicts())
  }
  
  for (var i = 0; i < b.rows().length; i++) {
    for (var j = 0; j < b.rows().length; j++) {
      b.togglePiece(i, j);
      if (hasAnyConflicts(b)) {
        b.togglePiece(i, j);
      }
    }
  }
  
  var solution = b.rows();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var counter = 0;
  
  var hasAnyConflicts = function(b) {
    return (b.hasAnyColConflicts() || b.hasAnyRowConflicts())
  }
  
  var getNext = function(lastI, lastJ) {
    if (lastJ === n - 1) {
      return [lastI + 1, 0];
    } else {
      return [lastI, lastJ + 1];
    }
  };
  
  var findSolutions = function(b, counter, lastI, lastJ) {
    if (counter === n) {
      solutionCount++;
      return;  
    }
    
    [i, k] = getNext(lastI, lastJ);
    var changedRow = false;
    for (var i; i < n; i++) {
      if (changedRow) {
        var k = 0;
      }
      for (var j = k; j < n; j++) {
        b.togglePiece(i, j);
        if (hasAnyConflicts(b)) {
          b.togglePiece(i, j);
        } else {
          findSolutions(b, counter + 1, i, j);
        }
      }
      changedRow = true;
    };
  };
  
  for (var j = 0; j < n; j++) {
    var b = new Board({n: n});
    b.togglePiece(0, j);
    findSolutions(b, 1, 0, j);
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
