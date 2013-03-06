define('aura/ext/mediator', function () {
  'use strict';

  return {
    name: 'mediator',

    require: {
      paths: {
        // eventemitter: 'components/eventemitter2/lib/eventemitter2',
        monologue:  'components/monologue/lib/monologue',
        underscore: 'components/underscore/underscore'
      },
      shim: {
        underscore: {
          exports: '_'
        }
      }
    },

    initialize: function (app) {
      var _ = require('underscore');
      var Emitter = require('monologue');

      var mediator = new Emitter(app.config.mediator);

      app.core.mediator = mediator;

      app.sandbox.on = function (name, listener) {
        this._subscriptions = this._subscriptions || [];
        var sub = mediator.on(name, listener);
        this._subscriptions.push({
          subscription: sub,
          name: name,
          listener: listener
        });
        return sub;
      };

      app.sandbox.off = function (name, listener) {
        if(!this._subscriptions) { return; }
        if (typeof name === 'string') {
          this._subscriptions = _.reject(this._subscriptions, function (evt) {
            return (evt.name === name && evt.listener === listener);
          });
        }
        mediator.off(name, listener);
      };

      app.sandbox.emit = function (name, data) {
        mediator.emit(name, data);
      };

      app.sandbox.stopListening = function () {
        if (!this._subscriptions) { return; }
        _.each(this._subscriptions, function (sub) {
          sub.subscription.unsubscribe();
        });
        this._subscriptions = {};
      };

      app.core.mediator.on('aura.sandbox.stop', function (sandbox) {
        sandbox.stopListening();
      });
    }
  };
});
