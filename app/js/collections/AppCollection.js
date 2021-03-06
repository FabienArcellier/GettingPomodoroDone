/* 
 * AppCollection.js
 * 
 * Copyright (c) 2013, Fabien Arcellier <fabien.arcellier@gmail.com>. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */

var app = app || {};


$(function(){
  'use strict';
  
  /**
   * This collection is done for using Backbone.LocalStorage.
   * It contains only one model.
   */
  app.AppCollection = Backbone.Collection.extend({
    model: app.AppModel,
    localStorage: new Backbone.LocalStorage('gpd-AppCollection'),
    settingsModel: {},
    
    initialize: function(models, options) {
      this.settingsModel = options.settingsModel;
    },
    
    /**
     * Assessors
     * @remark Those methods doesn't change the internal state of the
     * collection
     **/
    
    
    /**
     * Commands 
     * @remark Those methods changes the internal state of the collection
     * but return no value
     */
    createItem: function() {
      return new this.model({}, {settingsModel: this.settingsModel});
    },
    
    fetch: function(options) {
      var callback_success = false;
      if (options) {
        callback_success = options.success;
      } else {
        options = {};
      }

      var collection = this;   
      options.success = function() {
        collection.each(function(model){
          model.setSettings(collection.settingsModel);
        });
        
        if (callback_success) {
          callback_success();
        }
      };
      
      // Call the parent
      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });
});

