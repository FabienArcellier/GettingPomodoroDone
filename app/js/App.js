/* 
 * App.js
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

/*
 * Constants
 */
var REFRESH_PERIOD = 1000;
var SHORT_BREAK = 5;
var LONG_BREAK = 20;
var WORK = 25;
var POMODORO_BY_LONG_BREAK = 4;
var KEY_SPACE = 32;

/*
 * Application initialization
 */
var app = app || {};

$(function(){
  'use strict';
  var app_collection = new app.AppCollection();
  
  // Load the collection and check if a model already exists
  // if not, it creates and register it
  app_collection.fetch();
  var app_model = null;
  if (app_collection.length == 0) {
    app_model = new app.AppModel();
    app_collection.push(app_model);
  } else {
    app_model = app_collection.at(0);
  }
  
  // Load the view
  var appView = new app.AppView({ model: app_model });
  appView.pomodoroView = new app.PomodoroView({model: app_model});
  appView.settingsView = new app.SettingsView();
  appView.render();
  
});
