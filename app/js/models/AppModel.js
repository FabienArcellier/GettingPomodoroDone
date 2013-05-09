/* 
 * AppModel.js
 * 
 * Copyright (c) 2013, Fabien Arcellier <fabien.arcellier@gmail.com>. 
 * All rights reserved.
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
   * Model description
   */
  app.PomodoroType =  {
    Working: 0,
    Pause: 1
  };
  
  app.AppModel = Backbone.View.extend({
    defaults: {
      pomodoro : {
        current_id: 0,
        last_tracking: 0,
        time_ellapsed: 0,
        time: 0,
        type: 0
      },
      running: false
    },    
    working_progressbar: function() {
      var pomodoro = this.defaults.pomodoro;
      var progress = pomodoro.type === app.PomodoroType.Working ? pomodoro.time_ellapsed / pomodoro.time : 100;
      return progress;
    },
    pause_progressbar: function() {
      var pomodoro = this.defaults.pomodoro;
      var progress = pomodoro.type === app.PomodoroType.Pause ? pomodoro.time_ellapsed / pomodoro.time : 100;
      return progress;
    }
  });
});

