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
    Break: 1
  };
  
  app.AppModel = Backbone.Model.extend({
    defaults: {
      pomodoro_current_id: 1,
      pomodoro_last_tracking: 0,
      pomodoro_time_ellapsed: 0,
      pomodoro_time: WORK*60*1000,
      pomodoro_type: app.PomodoroType.Working,
      running: false
    },
    
    /**
     * Assessors
     * @remark Those methods doesn't change the internal state of the
     * model
     **/
    
    /**
     * Return true if the countdown is active, otherwise false
     */
    isRunning: function() {
      return this.get('running');
    },
    /**
     * Return true if the countdown is over, otherwise return false
     */
    isTimeEllapsed: function()
    {
      var time = this.get('pomodoro_time');
      var time_ellapsed = this.get('pomodoro_time_ellapsed');
      return (time - time_ellapsed) < 0;
    },
    /**
     * Get the time remaining as a string ( XX min XX s)
     * If the countdown is over this method returns 0 min 0s
     * @get
     */
    timeRemaining: function()
    {
      var time = this.get('pomodoro_time');
      var time_ellapsed = this.get('pomodoro_time_ellapsed');
      var time_remaining = (time - time_ellapsed)/1000;
      var minute_left = Math.floor(time_remaining / 60);
      var second_left = Math.floor(time_remaining - (minute_left * 60));
      if (this.isTimeEllapsed()) {
        return "0 min 0 s";
      } else {
        return minute_left + " min " + second_left + " s";
      }
    },
    /**
     * Get the progress of break in percent. The value is defined 
     * between 0 and 100
     * @get
     */
    breakProgress: function() {
      var type = this.get('pomodoro_type');
      var time_ellapsed = this.get('pomodoro_time_ellapsed');
      var time = this.get('pomodoro_time');
      var progress = type == app.PomodoroType.Break ? (time_ellapsed * 100) / time : 100;
      return progress;
    },
    /**
     * Get the progress of working in percent. The value is defined 
     * between 0 and 100
     * @get
     */
    workingProgress: function() {
      var type = this.get('pomodoro_type');
      var time_ellapsed = this.get('pomodoro_time_ellapsed');
      var time = this.get('pomodoro_time');
      var progress = type == app.PomodoroType.Working ? ( time_ellapsed * 100) / time : 100;
      return progress;
    },
    
    /**
     * Commands 
     * @remark Those methods changes the internal state of the object
     * but return no value
     */
    
    /**
     * Move the pomodoro session to the next step
     * if the pomodoro is in working state, move to short break or long break
     * If the pomodoro is in break state, move to next pomodoro and start new working session
     */
    shiftNextStep: function()
    {
      var type = this.get('pomodoro_type');
      var pomodoro_id = this.get('pomodoro_current_id');
      var current_date = new Date();
      var current_time = current_date.getTime();
      var next_values = {};
      if (type === app.PomodoroType.Working)
      {
        var break_time = pomodoro_id % POMODORO_BY_LONG_BREAK == 0 ? LONG_BREAK : SHORT_BREAK;
        next_values = {
          pomodoro_last_tracking: current_time,
          pomodoro_time_ellapsed: 0,
          pomodoro_time: break_time * 60 * 1000,
          pomodoro_type: app.PomodoroType.Break
        }
      }
      else {
        next_values = {
          pomodoro_current_id: ++pomodoro_id,
          pomodoro_last_tracking: current_time,
          pomodoro_time_ellapsed: 0,
          pomodoro_time: WORK * 60 * 1000,
          pomodoro_type: app.PomodoroType.Working
        }
      }
      
      this.save(next_values);
      
      return;
    }
  });
});

