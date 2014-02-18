// Generated by CoffeeScript 1.6.3
(function() {
  var DefaultHeight, DefaultWidth, OTPlugin, PublisherStreamId, PublisherTypeClass, StringSplitter, SubscriberTypeClass, TBConnection, TBError, TBGenerateDomHelper, TBGetZIndex, TBPublisher, TBSession, TBStream, TBSubscriber, TBSuccess, TBUpdateObjects, VideoContainerClass, getPosition, pdebug, replaceWithVideoStream, streamElements,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  OTPlugin = "OpenTokPlugin";

  PublisherStreamId = "TBPublisher";

  PublisherTypeClass = "OT_publisher";

  SubscriberTypeClass = "OT_subscriber";

  VideoContainerClass = "OT_video-container";

  StringSplitter = "$2#9$";

  DefaultWidth = 264;

  DefaultHeight = 198;

  window.TB = {
    checkSystemRequirements: function() {
      return 1;
    },
    initPublisher: function(one, two, three) {
      return new TBPublisher(one, two, three);
    },
    initSession: function(sid) {
      return new TBSession(sid);
    },
    log: function(message) {
      return pdebug("TB LOG", message);
    },
    off: function(event, handler) {},
    on: function(event, handler) {
      if (event === "exception") {
        console.log("JS: TB Exception Handler added");
        return Cordova.exec(handler, TBError, OTPlugin, "exceptionHandler", []);
      }
    },
    setLogLevel: function(a) {
      return console.log("Log Level Set");
    },
    upgradeSystemRequirements: function() {
      return {};
    },
    updateViews: function() {
      return TBUpdateObjects();
    },
    addEventListener: function(event, handler) {
      return this.on(event, handler);
    },
    removeEventListener: function(type, handler) {
      return this.off(type, handler);
    }
  };

  TBPublisher = (function() {
    function TBPublisher(one, two, three) {
      this.streamDestroyedHandler = __bind(this.streamDestroyedHandler, this);
      this.streamCreatedHandler = __bind(this.streamCreatedHandler, this);
      var height, name, position, publishAudio, publishVideo, width, zIndex, _ref, _ref1, _ref2;
      this.sanitizeInputs(one, two, three);
      pdebug("creating publisher", {});
      position = getPosition(this.domId);
      name = "TBNameHolder";
      publishAudio = "true";
      publishVideo = "true";
      zIndex = TBGetZIndex(document.getElementById(this.domId));
      if (this.properties != null) {
        width = (_ref = this.properties.width) != null ? _ref : position.width;
        height = (_ref1 = this.properties.height) != null ? _ref1 : position.height;
        name = (_ref2 = this.properties.name) != null ? _ref2 : "TBNameHolder";
        if ((this.properties.publishAudio != null) && this.properties.publishAudio === false) {
          publishAudio = "false";
        }
        if ((this.properties.publishVideo != null) && this.properties.publishVideo === false) {
          publishVideo = "false";
        }
      }
      if ((width == null) || width === 0 || (height == null) || height === 0) {
        width = DefaultWidth;
        height = DefaultHeight;
      }
      replaceWithVideoStream(this.domId, PublisherStreamId, {
        width: width,
        height: height
      });
      position = getPosition(this.domId);
      this.userHandlers = {};
      TBUpdateObjects();
      Cordova.exec(this.streamCreatedHandler, TBSuccess, OTPlugin, "addEvent", ["pubStreamCreated"]);
      Cordova.exec(this.streamDestroyedHandler, TBError, OTPlugin, "addEvent", ["pubStreamDestroyed"]);
      Cordova.exec(TBSuccess, TBError, OTPlugin, "initPublisher", [name, position.top, position.left, width, height, zIndex, publishAudio, publishVideo]);
    }

    TBPublisher.prototype.streamCreatedHandler = function(response) {
      var arr, e, stream, _i, _len, _ref;
      pdebug("publisher streamCreatedHandler", response);
      arr = response.split(StringSplitter);
      stream = new TBStream(arr);
      _ref = this.userHandlers["streamCreated"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e({
          streams: [stream.toJSON()],
          stream: stream.toJSON()
        });
      }
      return this;
    };

    TBPublisher.prototype.streamDestroyedHandler = function(response) {
      var e, _i, _len, _ref;
      _ref = this.userHandlers["streamDestroyed"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e({
          streams: [stream.toJSON()],
          stream: stream.toJSON()
        });
      }
      return this;
    };

    TBPublisher.prototype.destroy = function() {
      return Cordova.exec(TBSuccess, TBError, OTPlugin, "destroyPublisher", []);
    };

    TBPublisher.prototype.getImgData = function() {
      return "";
    };

    TBPublisher.prototype.getStyle = function() {
      return {};
    };

    TBPublisher.prototype.off = function(event, handler) {
      pdebug("removing event " + event, this.userHandlers);
      if (this.userHandlers[event] != null) {
        this.userHandlers[event] = this.userHandlers[event].filter(function(item, index) {
          return item !== handler;
        });
      }
      pdebug("removed handlers, resulting handlers:", this.userHandlers);
      return this;
    };

    TBPublisher.prototype.on = function(event, handler) {
      pdebug("adding event handlers", this.userHandlers);
      if (this.userHandlers[event] != null) {
        this.userHandlers[event].push(handler);
      } else {
        this.userHandlers[event] = [handler];
      }
      return this;
    };

    TBPublisher.prototype.publishAudio = function(state) {
      this.publishMedia("publishAudio", state);
      return this;
    };

    TBPublisher.prototype.publishVideo = function(state) {
      this.publishMedia("publishVideo", state);
      return this;
    };

    TBPublisher.prototype.setStyle = function(style, value) {
      return this;
    };

    TBPublisher.prototype.publishMedia = function(media, state) {
      var publishState;
      if (media !== "publishAudio" && media !== "publishVideo") {
        return;
      }
      publishState = "true";
      if ((state != null) && (state === false || state === "false")) {
        publishState = "false";
      }
      pdebug("setting publishstate", {
        media: media,
        publishState: publishState
      });
      return Cordova.exec(TBSuccess, TBError, OTPlugin, media, [publishState]);
    };

    TBPublisher.prototype.sanitizeInputs = function(one, two, three) {
      var position;
      if ((three != null)) {
        this.apiKey = one;
        this.domId = two;
        this.properties = three;
      } else if ((two != null)) {
        if (typeof two === "object") {
          this.properties = two;
          if (document.getElementById(one)) {
            this.domId = one;
          } else {
            this.apiKey = one;
          }
        } else {
          this.apiKey = one;
          this.domId = two;
        }
      } else if ((one != null)) {
        if (typeof one === "object") {
          this.properties = one;
        } else if (document.getElementById(one)) {
          this.domId = one;
        }
      }
      this.apiKey = this.apiKey != null ? this.apiKey : "";
      this.properties = this.properties && typeof (this.properties === "object") ? this.properties : {};
      if (this.domId && document.getElementById(this.domId)) {
        if (!this.properties.width || !this.properties.height) {
          console.log("domId exists but properties width or height is not specified");
          position = getPosition(this.domId);
          console.log(" width: " + position.width + " and height: " + position.height + " for domId " + this.domId + ", and top: " + position.top + ", left: " + position.left);
          if (position.width > 0 && position.height > 0) {
            this.properties.width = position.width;
            this.properties.height = position.height;
          }
        }
      } else {
        this.domId = TBGenerateDomHelper();
      }
      return this.domId = this.domId && document.getElementById(this.domId) ? this.domId : TBGenerateDomHelper();
    };

    TBPublisher.prototype.removeEventListener = function(event, handler) {
      this.off(event, handler);
      return this;
    };

    return TBPublisher;

  })();

  TBSession = (function() {
    TBSession.prototype.connect = function(apiKey, token, properties) {
      if (properties == null) {
        properties = {};
      }
      pdebug("connect", properties);
      this.apiKey = apiKey;
      this.token = token;
      Cordova.exec(this.connectionCreatedHandler, TBError, OTPlugin, "addEvent", ["sessConnectionCreated"]);
      Cordova.exec(this.connectionDestroyedHandler, TBError, OTPlugin, "addEvent", ["sessConnectionDestroyed"]);
      Cordova.exec(this.sessionConnectedHandler, TBError, OTPlugin, "addEvent", ["sessSessionConnected"]);
      Cordova.exec(this.sessionDisconnectedHandler, TBError, OTPlugin, "addEvent", ["sessSessionDisconnected"]);
      Cordova.exec(this.streamCreatedHandler, TBSuccess, OTPlugin, "addEvent", ["sessStreamCreated"]);
      Cordova.exec(this.streamDestroyedHandler, TBError, OTPlugin, "addEvent", ["sessStreamDestroyed"]);
      Cordova.exec(this.streamPropertyChanged, TBError, OTPlugin, "addEvent", ["sessStreamPropertyChanged"]);
      Cordova.exec(this.signalReceived, TBError, OTPlugin, "addEvent", ["signalReceived"]);
      Cordova.exec(TBSuccess, TBError, OTPlugin, "connect", [this.apiKey, this.token]);
    };

    TBSession.prototype.disconnect = function() {
      return Cordova.exec(TBSuccess, TBError, OTPlugin, "disconnect", []);
    };

    TBSession.prototype.forceDisconnect = function(connection) {
      return this;
    };

    TBSession.prototype.forceUnpublish = function(stream) {
      return this;
    };

    TBSession.prototype.getPublisherForStream = function(stream) {
      return this;
    };

    TBSession.prototype.getSubscribersForStream = function(stream) {
      return this;
    };

    TBSession.prototype.off = function(one, two, three) {
      var e, k, v, _i, _len, _ref, _results;
      if (typeof one === "object") {
        for (k in one) {
          v = one[k];
          this.removeEventHandler(k, v);
        }
        return;
      }
      if (typeof one === "string") {
        _ref = one.split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(this.removeEventHandler(e, two));
        }
        return _results;
      }
    };

    TBSession.prototype.on = function(one, two, three) {
      var e, k, v, _i, _len, _ref;
      pdebug("adding event handlers", this.userHandlers);
      if (typeof one === "object") {
        for (k in one) {
          v = one[k];
          this.addEventHandlers(k, v);
        }
        return;
      }
      if (typeof one === "string") {
        _ref = one.split(' ');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          this.addEventHandlers(e, two);
        }
      }
    };

    TBSession.prototype.publish = function(divName, properties) {
      this.publisher = new TBPublisher(divName, properties, this);
      return this.publisher;
    };

    TBSession.prototype.publish = function(publisher) {
      this.publisher = publisher;
      return Cordova.exec(TBSuccess, TBError, OTPlugin, "publish", []);
    };

    TBSession.prototype.signal = function(signal, handler) {
      return this;
    };

    TBSession.prototype.subscribe = function(one, two, three) {
      var domId, subscriber;
      if ((three != null)) {
        subscriber = new TBSubscriber(one, two, three);
        return subscriber;
      }
      if ((two != null)) {
        if (typeof two === "object") {
          domId = TBGenerateDomHelper();
          subscriber = new TBSubscriber(one, domId, two);
          return subscriber;
        } else {
          subscriber = new TBSubscriber(one, two, {});
          return subscriber;
        }
      }
      domId = TBGenerateDomHelper();
      subscriber = new TBSubscriber(one, domId, {});
      return subscriber;
    };

    TBSession.prototype.unpublish = function() {
      var element;
      console.log("JS: Unpublish");
      element = document.getElementById(this.publisher.domId);
      if (element) {
        element.parentNode.removeChild(element);
        TBUpdateObjects();
      }
      return Cordova.exec(TBSuccess, TBError, OTPlugin, "unpublish", []);
    };

    TBSession.prototype.unsubscribe = function(subscriber) {
      var element, elementId;
      console.log("JS: Unsubscribe");
      elementId = subscriber.streamId;
      element = document.getElementById("TBStreamConnection" + elementId);
      console.log("JS: Unsubscribing");
      element = streamElements[elementId];
      if (element) {
        element.parentNode.removeChild(element);
        delete streamElements[streamId];
        TBUpdateObjects();
      }
      return Cordova.exec(TBSuccess, TBError, OTPlugin, "unsubscribe", [subscriber.streamId]);
    };

    function TBSession(sessionId) {
      this.sessionId = sessionId;
      this.sessionDisconnectedHandler = __bind(this.sessionDisconnectedHandler, this);
      this.streamCreatedHandler = __bind(this.streamCreatedHandler, this);
      this.sessionConnectedHandler = __bind(this.sessionConnectedHandler, this);
      this.removeEventHandler = __bind(this.removeEventHandler, this);
      this.addEventHandlers = __bind(this.addEventHandlers, this);
      this.on = __bind(this.on, this);
      this.userHandlers = {};
      Cordova.exec(TBSuccess, TBSuccess, OTPlugin, "initSession", [this.sessionId]);
    }

    TBSession.prototype.cleanUpDom = function() {
      var e, objects, _i, _len, _results;
      objects = document.getElementsByClassName('OT_root');
      _results = [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        e = objects[_i];
        _results.push(e.parentNode.removeChild(e));
      }
      return _results;
    };

    TBSession.prototype.addEventHandlers = function(event, handler) {
      pdebug("adding Event", event);
      if (this.userHandlers[event] != null) {
        return this.userHandlers[event].push(handler);
      } else {
        return this.userHandlers[event] = [handler];
      }
    };

    TBSession.prototype.removeEventHandler = function(event, handler) {
      pdebug("removing event " + event, this.userHandlers);
      if (handler == null) {
        delete this.userHandlers[event];
      } else {
        if (this.userHandlers[event] != null) {
          this.userHandlers[event] = this.userHandlers[event].filter(function(item, index) {
            return item !== handler;
          });
        }
      }
      return this;
    };

    TBSession.prototype.streamDestroyedHandler = function(streamId) {
      var e, element, _i, _len, _ref;
      pdebug("streamDestroyedHandler", streamId);
      element = streamElements[streamId];
      if (element) {
        element.parentNode.removeChild(element);
        delete streamElements[streamId];
        TBUpdateObjects();
      }
      _ref = this.userHandlers["streamDestroyed"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e(event);
      }
      return this;
    };

    TBSession.prototype.sessionConnectedHandler = function(event) {
      var e, _i, _len, _ref;
      pdebug("sessionConnectedHandler", event);
      pdebug("what is apiKey: " + this.apiKey, {});
      pdebug("what is token: " + this.token, {});
      pdebug("what is userHandlers", this.userHandlers);
      this.connection = event.connection;
      _ref = this.userHandlers["sessionConnected"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e(event);
      }
      return this;
    };

    TBSession.prototype.streamCreatedHandler = function(response) {
      var arr, e, stream, _i, _len, _ref;
      pdebug("streamCreatedHandler", response);
      arr = response.split(StringSplitter);
      stream = new TBStream(arr);
      _ref = this.userHandlers["streamCreated"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e({
          streams: [stream.toJSON()],
          stream: stream.toJSON()
        });
      }
      return this;
    };

    TBSession.prototype.sessionDisconnectedHandler = function(event) {
      var e, _i, _len, _ref;
      _ref = this.userHandlers["sessionDisconnected"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e(event);
      }
      return this;
    };

    TBSession.prototype.addEventListener = function(event, handler) {
      this.on(event, handler);
      return this;
    };

    TBSession.prototype.removeEventListener = function(event, handler) {
      this.off(event, handler);
      return this;
    };

    return TBSession;

  })();

  TBSubscriber = (function() {
    TBSubscriber.prototype.getAudioVolume = function() {
      return 0;
    };

    TBSubscriber.prototype.getImgData = function() {
      return "";
    };

    TBSubscriber.prototype.getStyle = function() {
      return {};
    };

    TBSubscriber.prototype.off = function(event, handler) {
      return this;
    };

    TBSubscriber.prototype.on = function(event, handler) {
      return this;
    };

    TBSubscriber.prototype.setAudioVolume = function(value) {
      return this;
    };

    TBSubscriber.prototype.setStyle = function(style, value) {
      return this;
    };

    TBSubscriber.prototype.subscribeToAudio = function(value) {
      return this;
    };

    TBSubscriber.prototype.subscribeToVideo = function(value) {
      return this;
    };

    function TBSubscriber(stream, divName, properties) {
      var divPosition, height, name, obj, position, subscribeToAudio, subscribeToVideo, width, zIndex, _ref, _ref1, _ref2;
      pdebug("creating subscriber", properties);
      this.streamId = stream.streamId;
      console.log("creating a subscriber, replacing div " + divName);
      divPosition = getPosition(divName);
      subscribeToVideo = "true";
      zIndex = TBGetZIndex(document.getElementById(divName));
      if ((properties != null)) {
        width = (_ref = properties.width) != null ? _ref : divPosition.width;
        height = (_ref1 = properties.height) != null ? _ref1 : divPosition.height;
        name = (_ref2 = properties.name) != null ? _ref2 : "";
        subscribeToVideo = "true";
        subscribeToAudio = "true";
        if ((properties.subscribeToVideo != null) && properties.subscribeToVideo === false) {
          subscribeToVideo = "false";
        }
        if ((properties.subscribeToAudio != null) && properties.subscribeToAudio === false) {
          subscribeToAudio = "false";
        }
      }
      if ((width == null) || width === 0 || (height == null) || height === 0) {
        width = DefaultWidth;
        height = DefaultHeight;
      }
      console.log("setting width to " + width + ", and height to " + height);
      obj = replaceWithVideoStream(divName, stream.streamId, {
        width: width,
        height: height
      });
      position = getPosition(obj.id);
      Cordova.exec(TBSuccess, TBError, OTPlugin, "subscribe", [stream.streamId, position.top, position.left, width, height, zIndex, subscribeToAudio, subscribeToVideo]);
    }

    TBSubscriber.prototype.removeEventListener = function(event, listener) {
      return this;
    };

    return TBSubscriber;

  })();

  TBStream = (function() {
    function TBStream(props) {
      pdebug("stream object being created with data:", props);
      this.connection = new TBConnection(props[0]);
      this.streamId = props[1];
      this.name = props[2];
      this.hasAudio = props[3] === "T" ? true : false;
      this.hasVideo = props[4] === "T" ? true : false;
      this.creationTime = props[5];
      this.videoDimensions = {
        width: 0,
        height: 0
      };
    }

    TBStream.prototype.toJSON = function() {
      return {
        streamId: this.streamId,
        name: this.name,
        hasAudio: this.hasAudio,
        hasVideo: this.hasVideo,
        creationTime: this.creationTime,
        connection: this.connection.toJSON()
      };
    };

    return TBStream;

  })();

  TBConnection = (function() {
    function TBConnection(connectionId) {
      this.connectionId = connectionId;
      return;
    }

    TBConnection.prototype.toJSON = function() {
      return {
        connectionId: this.connectionId
      };
    };

    return TBConnection;

  })();

  streamElements = {};

  getPosition = function(divName) {
    var curleft, curtop, height, pubDiv, width;
    pubDiv = document.getElementById(divName);
    if (!pubDiv) {
      return {};
    }
    width = pubDiv.offsetWidth;
    height = pubDiv.offsetHeight;
    curtop = pubDiv.offsetTop;
    curleft = pubDiv.offsetLeft;
    while ((pubDiv = pubDiv.offsetParent)) {
      curleft += pubDiv.offsetLeft;
      curtop += pubDiv.offsetTop;
    }
    return {
      top: curtop,
      left: curleft,
      width: width,
      height: height
    };
  };

  replaceWithVideoStream = function(divName, streamId, properties) {
    var element, internalDiv, typeClass, videoElement;
    typeClass = streamId === PublisherStreamId ? PublisherTypeClass : SubscriberTypeClass;
    element = document.getElementById(divName);
    element.setAttribute("class", "OT_root " + typeClass);
    element.setAttribute("data-streamid", streamId);
    element.style.width = properties.width + "px";
    element.style.height = properties.height + "px";
    element.style.overflow = "hidden";
    element.style['background-color'] = "#000000";
    streamElements[streamId] = element;
    internalDiv = document.createElement("div");
    internalDiv.setAttribute("class", VideoContainerClass);
    internalDiv.style.width = "100%";
    internalDiv.style.height = "100%";
    internalDiv.style.left = "0px";
    internalDiv.style.top = "0px";
    videoElement = document.createElement("video");
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    internalDiv.appendChild(videoElement);
    element.appendChild(internalDiv);
    return element;
  };

  TBError = function(error) {
    return navigator.notification.alert(error);
  };

  TBSuccess = function() {
    return console.log("success");
  };

  TBUpdateObjects = function() {
    var e, id, objects, position, streamId, _i, _len;
    console.log("JS: Objects being updated in TBUpdateObjects");
    objects = document.getElementsByClassName('OT_root');
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      e = objects[_i];
      console.log("JS: Object updated");
      streamId = e.dataset.streamid;
      console.log("JS sessionId: " + streamId);
      id = e.id;
      position = getPosition(id);
      Cordova.exec(TBSuccess, TBError, OTPlugin, "updateView", [streamId, position.top, position.left, position.width, position.height, TBGetZIndex(e)]);
    }
  };

  TBGenerateDomHelper = function() {
    var div, domId;
    domId = "PubSub" + Date.now();
    div = document.createElement('div');
    div.setAttribute('id', domId);
    document.body.appendChild(div);
    return domId;
  };

  TBGetZIndex = function(ele) {
    var val;
    while ((ele != null)) {
      val = document.defaultView.getComputedStyle(ele, null).getPropertyValue('z-index');
      console.log(val);
      if (parseInt(val)) {
        return val;
      }
      ele = ele.offsetParent;
    }
    return 0;
  };

  pdebug = function(msg, data) {
    return console.log("JS Lib: " + msg + " - ", data);
  };

}).call(this);
