(function(global) {
  var Explore = function() {}
    , museeka = global.museeka
    , explorePath = '/explore'
    , exploreListsUrls = false
    , helpers = museeka.helpers

  Explore.prototype = {

    getAll: function(callback) {
      var self = this
        , result = {};
      self.getListsUrls(function(urls) {
        helpers.parallelize([
          function(cb) {
            self.getGenres(function(genres) {
              result.genres = genres;
              cb();
            });
          },
          function(cb) {
            self.getThemes(function(themes) {
              result.themes = themes;
              cb();
            });
          },
          function(cb) {
            self.getInstrumentsType(function(types) {
              result.InstrumentsTypes = types;
              cb();
            });
          },
          function(cb) {
            self.getMoods(function(moods) {
              result.moods = moods;
              cb();
            });
          },
          function(cb) {
            self.getContinents(function(continents) {
              result.continents = continents;
              cb();
            });
          }
        ],
        function() {
          callback(result);
        });
      });
    },

    getLatestReleases: function(fn) {
      var self = this
        , path
        , releases = {}
        , tracks = []
        , albums = []
        , artists = []
        , i
        , albums_ids;
      self.getListsUrls(function(urls) {
        path = urls.latest_releases;
        $.post(explorePath, {path: path}, function(json) {
          if (json.tracks.hasOwnProperty('order')) {
            for (i in json.tracks.order) {
              tracks.push(json.tracks[json.tracks.order[i]]);
            }
          }
          releases.tracks = tracks;

          if (json.albums.hasOwnProperty('order')) {
            for (i in json.albums.order) {
              albums.push(json.albums[json.albums.order[i]]);
            }
          }
          releases.albums = albums;

          if (json.artists.hasOwnProperty('order')) {
            for (i in json.artists.order) {
              artists.push(json.artists[json.artists.order[i]]);
            }
          }
          releases.artists = artists;
          fn(releases);
        });
      });
    },

    getGenres: function(fn) {
      var self = this
        , path
        , genres = []
        , i;
      self.getListsUrls(function(urls) {
        path = urls.genres;
        $.post(explorePath, {path: path}, function(json) {
          for (i in json.order) {
            genres.push(json[json.order[i]]);
          }
          fn(genres);
        });
      });
    },

    getThemes: function(fn) {
      var self = this
        , path
        , themes = []
        , i;
      self.getListsUrls(function(urls) {
        path = urls.themes;
        $.post(explorePath, {path: path}, function(json) {
          for (i in json.order) {
            themes.push(json[json.order[i]]);
          }
          fn(themes);
        });
      });
    },

    getMoods: function(fn) {
      var self = this
        , path
        , moods = []
        , i;
      self.getListsUrls(function(urls) {
        path = urls.moods;
        $.post(explorePath, {path: path}, function(json) {
          for (i in json.order) {
            moods.push(json[json.order[i]]);
          }
          fn(moods);
        });
      });
    },

    getContinents: function(fn) {
      var self = this
        , path
        , continents = []
        , i;
      self.getListsUrls(function(urls) {
        path = urls.countries;
        $.post(explorePath, {path: path}, function(json) {
          for (i in json.order) {
            continents.push(json[json.order[i]]);
          }
          fn(continents);
        });
      });
    },

    getCountiesByContinent: function(path, fn) {
      var self = this
        , countries = []
        , i;
      $.post(explorePath, {path: path}, function(json) {
        for (var i in json.order) {
          countries.push(json[json.order[i]]);
        }
        fn(countries);
      });
    },

    getInstrumentsType: function(fn) {
      var self = this
        , path
        , instruments = []
        , i;
      self.getListsUrls(function(urls) {
        path = urls.instruments;
        $.post(explorePath, {path: path}, function(json) {
          for (i in json.order) {
            instruments.push(json[json.order[i]]);
          }
          fn(instruments);
        });
      });
    },

    getInstrumentsByType: function(path, fn) {
      var self = this
        , instruments = []
        , i;
      $.post(explorePath, {path: path}, function(json) {
        for (var i in json.order) {
          instruments.push(json[json.order[i]]);
        }
        fn(instruments);
      });
    },
    
    getList: function(path, fn) {
      var tracks = []
        , albums = []
        , artists = []
        , result = {}
        , i;
      
      $.post(explorePath, {path: path}, function(json) {
          result.title = json.title;
          result.path = json.path;
          result.parent = json.parent;

          if (json.tracks.hasOwnProperty('order')) {
            for (i in json.tracks.order) {
              tracks.push(json.tracks[json.tracks.order[i]]);
            }
          }
          result.tracks = tracks;

          if (json.albums.hasOwnProperty('order')) {
            for (i in json.albums.order) {
              albums.push(json.albums[json.albums.order[i]]);
            }
          }
          result.albums = albums;

          if (json.artists.hasOwnProperty('order')) {
            for (i in json.artists.order) {
              artists.push(json.artists[json.artists.order[i]]);
            }
          }
          result.artists = artists;

        fn(result);

      });
    },

    getListsUrls: function(fn) {
      var self = this
        , i
        , path = window.displayOptions.listsRoot
        , urls = {};
      if (exploreListsUrls) {
        return fn(exploreListsUrls);
      }
      $.post(explorePath, {path: path}, function(json) {
        for (i in json) {
          if (json[i].hasOwnProperty('path')) {
            urls[json[i].name] = json[i].path;
          }
        }
        exploreListsUrls = urls;
        fn(exploreListsUrls);
      });
    }
  }

  MicroEvent.mixin(Explore);
  global.museeka.Explore = Explore;
}(window));
