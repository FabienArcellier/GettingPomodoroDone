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
    templateNotificationBreak: _.template($('#template_notificationBreak').html()),
    templateNotificationWorking: _.template($('#template_notificationWorking').html()),
    
    /**
     * Sub views
     */
    pomodoroView: null,
    settingView: null,
    
    /**
     * Internal state
     */
    settingsBtn: null,
    pomodoroBtn: null,
    
    /**
     * Set this attribute at true to request a header refresh
     */
    refreshHeader: true,
    showNotification: false,
    
    events: {
      'click #header-settings': 'displaySettings',
      'click #header-pomodoro': 'displayPomodoro'
    },
    initialize: function() {
      var this2 = this;
      this.header = this.$("#header");
      this.pomodoro = this.$("#pomodoro");
      this.listenTo(this.model, "change", this.render);

      $(document).desktopify({title: 'Getting Pomodoro Done', timeout: 1 * 60 *1000});
      $(document).trigger('click');
      this.interval = setInterval(function(){this2.myTick();}, REFRESH_PERIOD);
    },
    /**
     * Destructor
     */
    remove: function() {
      this.pomodoroView.remove();
      this.settingsView.remove();
    },
    render: function() {
      document.title = this.model.formatingTimeRemaining() + ' - Getting Pomodoro Done';
      if (this.refreshHeader == true)
      {
        this.header.html(this.templateHeader());
        this.refreshHeader = false;
      }
      
      this.pomodoroBtn = $("#header-pomodoro");
      this.settingsBtn = $("#header-settings");
      
      var pomodoro_type = this.model.get('pomodoro_type');
      if (this.showNotification == true)
      {
        if (pomodoro_type == app.PomodoroType.Break)
        {
          this.pomodoro.trigger('notify', [ this.templateNotificationBreak()]);  
        } else {
          this.pomodoro.trigger('notify', [ this.templateNotificationWorking()]);
        }
        
        this.showNotification = false;
      }
      
      if (this.model.get('app_mode') == app.AppMode.Settings) {
        this.settingsBtn.hide();
        this.pomodoroBtn.show();
        this.pomodoroView.$el.hide();
        this.settingsView.$el.show();
      } else {
        this.settingsBtn.show();
        this.pomodoroBtn.hide();
        this.pomodoroView.$el.show();
        this.settingsView.$el.hide();
      }
     

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
          
          if (this.model.isTimeEllapsed() === true)
          {
            this.showNotification = true;
            this.model.shiftNextStep();
          }
      }
    },
    displaySettings: function() {
      app.router.navigate('#settings');
      this.model.save({app_mode: app.AppMode.Settings});
    },
    displayPomodoro: function() {
      app.router.navigate();
      this.model.save({app_mode: app.AppMode.Pomodoro});
    }
  });
});

