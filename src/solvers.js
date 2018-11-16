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
  
  for (var i = 0; i < b.rows().length; i++) {
    for (var j = 0; j < b.rows().length; j++) {
      b.togglePiece(i, j);
      if (b.hasAnyRooksConflicts()) {
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
  
  var findSolutions = function(b, counter, i) {
    if (counter === n) {
      solutionCount++;
      return;  
    }
        
    for (var j = 0; j < n; j++) {
      b.togglePiece(i, j);
      if (!b.hasColConflictAt(j)) {
        findSolutions(b, counter + 1, i + 1);
      }
      b.togglePiece(i, j);
    }
  };
  
  var b = new Board({n: n});
  findSolutions(b, 0, 0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution; 
  var counter = 0;
    
  var findSolution = function(b, counter, i) {
    if (counter === n) {
      solution = b.rows().slice();
      return solution;
    }

    for (var j = 0; j < n; j++) {
      b.togglePiece(i, j);
      
      if (!b.hasAnyQueensConflicts()) {
        var sol = findSolution(b, counter + 1, i + 1);
        if (sol !== undefined) {
          return sol;
        }
      } 
      
      b.togglePiece(i, j);
    } 
  };
  
  for (var k = 0; k < n; k++) {
    var b = new Board({n: n});
    b.togglePiece(0, k);
    var solution = findSolution(b, 1, 1);
    if (solution !== undefined) {
      break;
    }
  }
  
  if (solution === undefined) {
    solution = (new Board({n: n})).rows();
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; 
  
  var majorDiagonalTopRowIndexes = function() {
    var obj = {};
    for (var i = 0; i < n; i++) {
      var arr = [];
      
      for (var j = i; j < n; j++) {
        arr.push(j);
      }
      
      obj[i] = arr;
    }
    return obj;
  }();
  
  var minorDiagonalTopRowIndexes = function() {
    var obj = {};
    for (var i = 0; i < n; i++) {
      var arr = [];
      
      for (var j = n - i - 1; j >= 0; j--) {
        arr.push(j);
      }
      
      obj[i] = arr;
    }
    return obj;
  }();  
  
  var findSolutions = function(b, counter, i) {
    if (counter === n) {
      solutionCount++;
      return;  
    }
        
    for (var j = 0; j < n; j++) {
      b.togglePiece(i, j);
      
      if (!b.hasColConflictAt(j)) {
        var majorDiagonalTest = majorDiagonalTopRowIndexes[i].includes(j)
          ? b.hasMajorDiagonalConflictAt.bind(b) : b.hasAnyMajorDiagonalConflicts.bind(b);
          
        var minorDiagonalTest = minorDiagonalTopRowIndexes[i].includes(j) 
          ? b.hasMinorDiagonalConflictAt.bind(b) : b.hasAnyMinorDiagonalConflicts.bind(b);
        
        if (!majorDiagonalTest(j - i) 
          && !minorDiagonalTest(j + i)) {
          findSolutions(b, counter + 1, i + 1);
        }
      }
      b.togglePiece(i, j);
    }
  };
  
  var b = new Board({n: n});
  findSolutions(b, 0, 0);
  
  if (n === 0) {
    solutionCount = 1;
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
