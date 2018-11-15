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
    
    var rows = b.rows();
    
    [i, j] = getNext(lastI, lastJ);
    var changedRow = false;
    
    for (var i; i < n; i++) {
      if (changedRow) {
        var j = 0;
      }
      for (var j; j < n; j++) {
        b.togglePiece(i, j);
        
        if (!hasAnyConflicts(b)) {
          findSolutions(b, counter + 1, i + 1, 0);
        }
        
        b.togglePiece(i, j);
      }
      changedRow = true;
    };
  };
  
  for (var j = 0; j < n; j++) {
    var b = new Board({n: n});
    b.togglePiece(0, j);
    findSolutions(b, 1, 1, 0);
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = 0; 
  
  var counter = 0;
  
  //hasAnyMajorDiagonalConflicts
  //hasAnyMinorDiagonalConflicts
  var hasAnyConflicts = function(b) {
    if (b.hasAnyRowConflicts() ||
        b.hasAnyColConflicts() || 
        b.hasAnyMinorDiagonalConflicts() ||
        b.hasAnyMajorDiagonalConflicts()) {
      return true;
    } else {
      return false;
    }
  }
    
  var findSolution = function(b) {
    counter = 1;
    
    for (var i = 1; i < n; i++) {
      for (var j = 0; j < n; j++) {
        b.togglePiece(i, j);
        if (b.hasAnyConflicts()) {
          b.togglePiece(i, j);
        } else {
          i++;
          j = -1;
          counter++;
          if (counter === n) {
            return b.rows();
          }
        }
      } 
    }
  };
  
  
  for (var k = 0; k < n; k++) {
    var b = new Board({n: n});
    b.togglePiece(0, k);
    solution = findSolution(b);
    if (solution !== undefined) {
      break;
    }
  }
  
  if (solution === undefined) {
    solution = 0;
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
