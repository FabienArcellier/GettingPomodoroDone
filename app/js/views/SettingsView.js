/* 
 * SettingsView.js
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
  app.SettingsView = Backbone.View.extend({
    el:'#settings',
    // models
    modelSettings: {},
    modelApp: {},
    
    //Template declaration#settings
    templateSettings: _.template($("#template_settings").html()),
    
    events: {
      "click #settings_save" : "onSettingsSave",
      "click #settings_cancel" : "onSettingsCancel"
    },
    initialize: function(options) {
      this.modelSettings = options.modelSettings;
      this.modelApp = options.modelApp;
      
      this.$el.hide();
      this.render();
      
      this.listenTo(this.modelSettings, "change", this.render);
    },
    render: function() {
      this.$el.html(this.templateSettings(this.modelSettings.toJSON()));
      return this;
    },
    
    // Events handler
    onSettingsSave: function(e) {
      var settings = {};
      settings.workingTime = this.$("#settings_workingTime").val();
      settings.shortBreakTime = this.$("#settings_shortBreakTime").val();
      settings.longBreakTime = this.$("#settings_longBreakTime").val();
      settings.iteration = this.$("#settings_iteration").val();
      
      this.modelSettings.save(settings);
      this.modelApp.save({app_mode: app.AppMode.Pomodoro});
      app.router.navigate();
    },
    onSettingsCancel: function(e) {
      this.modelApp.save({app_mode: app.AppMode.Pomodoro});
      app.router.navigate();
    }
  });
});

