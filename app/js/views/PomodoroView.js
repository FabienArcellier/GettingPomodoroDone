/* 
 * PomodoroView.js
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
  app.PomodoroView = Backbone.View.extend({
    el:'#pomodoro',
    //Template declaration
    templatePomodoro: _.template($("#template_pomodoro").html()),
    
    events: {
      'click #pomodoro-play':'pomodoroPlay',
      'click #pomodoro-break': 'pomodoroBreak',
      'click #pomodoro-stop' : 'pomodoroStop'
    },
    initialize: function() {
      var this2 = this;
      this.listenTo(this.model, "change", this.render);
      $(document).bind('keyup', function(e){this2.onKeyUp(e);});
      this.render();
    },
    render: function() {
      var model_json = this.model.toJSON();
      model_json.workingProgress = this.model.workingProgress();
      model_json.breakProgress = this.model.breakProgress();
      model_json.timeRemaining = this.model.formatingTimeRemaining();
      this.$el.html(this.templatePomodoro(model_json));
      
      var btn_play = this.$("#pomodoro-play");
      var btn_break = this.$("#pomodoro-break");

      if (this.model.get('running') === true) {
        btn_play.addClass("disabled");
        btn_break.removeClass("disabled");
      } else {
        btn_play.removeClass("disabled");
        btn_break.addClass("disabled");
      }
      
      return this;
    },
    /**
     * Destructor
     */
    remove: function() {
      $(document).unbind('keyup');
      clearInterval(this.interval);
    },
    onKeyUp: function(e) {
      if(e.which === KEY_SPACE)
      {
        if (this.model.isRunning()) {
          this.pomodoroBreak();
        } else {
          this.pomodoroPlay()
        }
      }
    },
    pomodoroPlay: function(e) {
      this.model.set('running', true);
      var current_date = new Date();
      var time = current_date.getTime();
      this.model.set('pomodoro_last_tracking', time);
      this.model.save();
    },
    pomodoroBreak: function(e) {
      this.model.set('running', false);
      this.model.save();
    },
    pomodoroStop: function() {
      this.model.reset();
    }
  });
});

