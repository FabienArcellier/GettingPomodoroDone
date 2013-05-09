/* 
 * AppView.js
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
   * View description
   */
  app.AppView = Backbone.View.extend({
    el: $("#app"),
    //Template declaration
    templateHeader: _.template($("#template_header").html()),
    templatePomodoro: _.template($("#template_pomodoro").html()),
    
    events: {
      'click #pomodoro-play':'pomodoroPlay',
      'click #pomodoro-pause': 'pomodoroPause'
    },
    initialize: function() {
      var this2 = this;
      this.header = this.$("#header");
      this.pomodoro = this.$("#pomodoro");
      
      this.listenTo(this.model, "change", this.render);
      
      this.render();
      
      setInterval(function(){this2.myTick();}, REFRESH_PERIOD);
    },
    render: function() {
      this.header.html(this.templateHeader());
      var model_json = this.model.toJSON();
      model_json.working_progressbar = this.model.working_progressbar();
      model_json.pomodoro_time_remaining = this.model.pomodoro_time_remaining();
      this.pomodoro.html(this.templatePomodoro(model_json));

      Holder.run();
      return this;
    },
    /**
     * Method trigged every second to update the pomodoro state
     * of application.
     */
    myTick: function () {
      if (this.model.get('running') === true)
      {
          var current_date = new Date();
          var current_time = current_date.getTime();
          var last_time_picked = this.model.get('pomodoro_last_tracking');
          var time_ellapsed = this.model.get('pomodoro_time_ellapsed');
          time_ellapsed += current_time - last_time_picked;
          this.model.save({pomodoro_last_tracking: current_time, pomodoro_time_ellapsed: time_ellapsed});
      }
    },
    pomodoroPlay: function(e) {
      this.model.set('running', true);
      var current_date = new Date();
      var time = current_date.getTime();
      this.model.set('pomodoro_last_tracking', time);
    },
    pomodoroPause: function(e) {
      this.myTick();
      this.model.set('running', false);
    }
    
    
  });
});

