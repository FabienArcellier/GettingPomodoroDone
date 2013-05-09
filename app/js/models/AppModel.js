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
  
  app.AppModel = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('gpd-app'),
    defaults: {
      pomodoro_current_id: 1,
      pomodoro_last_tracking: 0,
      pomodoro_time_ellapsed: 0,
      pomodoro_time: 25*60*1000,
      pomodoro_type: app.PomodoroType.Working,
      running: false
    },    
    working_progressbar: function() {
      var type = this.get('pomodoro_type');
      var time_ellapsed = this.get('pomodoro_time_ellapsed');
      var time = this.get('pomodoro_time');
      var progress = type == app.PomodoroType.Working ? ( time_ellapsed * 100) / time : 100;
      return progress;
    },
    pomodoro_time_remaining: function()
    {
      var time = this.get('pomodoro_time');
      var time_ellapsed = this.get('pomodoro_time_ellapsed');
      var time_remaining = (time - time_ellapsed)/1000;
      var minute_left = Math.floor(time_remaining / 60);
      var second_left = Math.floor(time_remaining - (minute_left * 60));
      return minute_left + " min " + second_left + " s";
    },
    pause_progressbar: function() {
      var progress = this.pomodoro_type == app.PomodoroType.Pause ? (pomodoro_time_ellapsed * 100) / pomodoro_time : 100;
      return progress;
    }
  });
});

