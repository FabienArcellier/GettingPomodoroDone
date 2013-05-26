/* 
 * SettingsCollection.js
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
   * Collection description
   */
  app.SettingsCollection = Backbone.Collection.extend({
    model: app.SettingsModel,
    localStorage: new Backbone.LocalStorage('gpd-SettingsCollection')
    
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
  });
});

