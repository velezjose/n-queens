// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

    */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.rows()[rowIndex];

      return _.filter(row, num => num === 1).length > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rows = this.rows();

      // debugger;
      // return _.filter(rows, function(row, rowIndex) {
      //   return this.hasRowConflictAt(rowIndex) === true;
      // }).length > 0;
      return _.filter(rows, (row, rowIndex) => this.hasRowConflictAt(rowIndex) === true).length > 0;

    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var col = _.pluck(this.rows(), colIndex);

      return _.filter(col, num => num === 1).length > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var cols = [];

      for (let i = 0; i < this.rows().length; i++) {
        var col = _.pluck(this.rows(), i);
        cols.push(col);
      }

      return _.filter(cols, (col, colIndex) => this.hasColConflictAt(colIndex) === true).length > 0;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, rows) {
      var majorDiagonal = [];
      var rows = rows || this.rows();

      _.each(rows, row => {
        if (row[majorDiagonalColumnIndexAtFirstRow] !== undefined) {
          majorDiagonal.push(row[majorDiagonalColumnIndexAtFirstRow]);
        }
        majorDiagonalColumnIndexAtFirstRow++;
      });

      return _.filter(majorDiagonal, num => num === 1).length > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var majorDiagonals = [];

      for (let i = 0; i < this.rows().length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      
      var rowsCopy = this.rows().slice();
      var rowsCopyLength = rowsCopy.length;

      for (let j = 0; j < rowsCopyLength - 1; j++) {
        rowsCopy.shift();
        if (this.hasMajorDiagonalConflictAt(0, rowsCopy)) {
          return true;
        }
      }

      return false;
    },


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, rows) {
      var rows = rows || this.rows();
      var minorDiagonal = [];

      _.each(rows, row => {
        if (row[minorDiagonalColumnIndexAtFirstRow] !== undefined) {
          minorDiagonal.push(row[minorDiagonalColumnIndexAtFirstRow]);
        }
        minorDiagonalColumnIndexAtFirstRow--;
      });

      return _.filter(minorDiagonal, num => num === 1).length > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var boardCopy = this.rows().slice();
      for (var i = 0; i < boardCopy.length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      
      boardCopy.shift();
      var boardCopyLength = boardCopy.length;
      
      for (var j = 0; j < boardCopyLength; j++) {
        if (this.hasMinorDiagonalConflictAt(boardCopyLength, boardCopy)) {
          return true;
        }
        boardCopy.shift();
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
