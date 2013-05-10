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
    templateNotificationBreak: _.template($('#template_notificationBreak').html()),
    templateNotificationWorking: _.template($('#template_notificationWorking').html()),
    
    /**
     * Internal state
     */
    
    /**
     * Set this attribute at true to request a header refresh
     */
    refreshHeader: true,
    showNotification: false,
    
    events: {
      'click #pomodoro-play':'pomodoroPlay',
      'click #pomodoro-break': 'pomodoroBreak',
      'click #pomodoro-stop' : 'pomodoroStop'
    },
    initialize: function() {
      var this2 = this;
      this.header = this.$("#header");
      this.pomodoro = this.$("#pomodoro");
      
      this.listenTo(this.model, "change", this.render);
      
      this.render();

      $(document).bind('keyup', function(e){this2.onKeyUp(e);});
      $(document).desktopify({title: 'Getting Pomodoro Done', timeout:1 * 60 * 1000});
      $(document).trigger('click');
      this.interval = setInterval(function(){this2.myTick();}, REFRESH_PERIOD);
    },
    /**
     * Destructor
     */
    remove: function() {
      $(document).unbind('keyup');
      clearInterval(this.interval);
    },
    render: function() {
      if (this.refreshHeader == true)
      {
        this.header.html(this.templateHeader());
        this.refreshHeader = false;
      }
      
      var model_json = this.model.toJSON();
      model_json.workingProgress = this.model.workingProgress();
      model_json.breakProgress = this.model.breakProgress();
      model_json.timeRemaining = this.model.formatingTimeRemaining();
      this.pomodoro.html(this.templatePomodoro(model_json));
      
      document.title = this.model.formatingTimeRemaining() + ' - Getting Pomodoro Done';
      
      var btn_play = this.$("#pomodoro-play");
      var btn_break = this.$("#pomodoro-break");

      if (this.model.get('running') === true) {
        btn_play.addClass("disabled");
        btn_break.removeClass("disabled");
      } else {
        btn_play.removeClass("disabled");
        btn_break.addClass("disabled");
      }
      
      var pomodory_type = this.model.get('pomodoro_type');
      
      if (this.showNotification == true)
      {
        if (pomodory_type == app.PomodoroType.Break)
        {
          this.pomodoro.trigger('notify', [ this.templateNotificationBreak(), 'Getting Pomodoro Done' ]);  
        } else {
          this.pomodoro.trigger('notify', [ this.templateNotificationWorking(), 'Getting Pomodoro Done' ]);
        }
        
        this.showNotification = false;
      }


      return this;
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
          
          if (this.model.isTimeEllapsed() === true)
          {
            this.showNotification = true;
            this.model.shiftNextStep();
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
      this.myTick();
      this.model.set('running', false);
      this.model.save();
    },
    pomodoroStop: function() {
      this.model.reset();
    }
  });
});

