/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */


var nedb = require('nedb');

var PLACE_DB = "hlc-places.db";
var TEST_PLACE = "test";
var TEST_IDS = [ "001bc50940800000", "001bc50940810000" ];


/**
 * PlaceManager Class
 * Manages the database of places
 * @constructor
 */
function PlaceManager() {
  var self = this;
  this.db = new nedb( { filename: PLACE_DB, autoload: true } );
};


/**
 * Find all IDs associated with the given place, if defined
 * @param {String} place Place to search for.
 * @param {function} callback Function to call on completion.
 */
PlaceManager.prototype.getIDs = function(place, callback) {
  var self = this;
  var placeIDs = [];

  if(place === TEST_PLACE) {
    placeIDs = TEST_IDS;
    callback(placeIDs);
  }
  else {
    this.db.find({ _id: place }, { _id: 0 }, function(err, ids) {
      if(!ids[0]) {
        callback(placeIDs);
        return;
      }
      placeIDs = ids[0].ids;
      callback(placeIDs);
    });
  }
}


/**
 * Add a place to the database
 * @param {String} name Name of the place to add.
 * @param {array} ids Array of ids associated with the place.
 */
PlaceManager.prototype.add = function(name, ids) {
  var self = this;
  var idArray = ids.split(',');
  this.db.update({ _id: name }, { $set: { ids: idArray } }, { upsert: true });
}


/**
 * Remove a place from the database
 * @param {String} name Name of the place to remove.
 */
PlaceManager.prototype.remove = function(name) {
  var self = this;
  this.db.remove({ _id: name });
}


module.exports = PlaceManager;
