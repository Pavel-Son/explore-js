(function(global) {
  var museeka = global.museeka
    , exploreApi = new museeka.Explore()
    , Route = global.Route
    , PlayerUI = museeka.PlayerUI
    , loader;
  
  function explorePath(obj, j) {
    return Array.prototype.slice.call(obj)
      .join(j || '')
      .replace(/^explore\//, '/');
  }


  museeka.views.explore = {

    showExplorePage: function() {
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getAll(function(explore) {
        loader.remove();
        museeka.views.explore.clear('#content');
        $('#explore-header-template').tmpl().appendTo('#content');
        museeka.views.explore.showGenres(explore.genres);
        museeka.views.explore.showThemes(explore.themes);
        museeka.views.explore.showCounties(explore.continents);
        museeka.views.explore.showInstruments(explore.InstrumentsTypes);
      });
    },

    showGenres: function(genres) {
      $('#explore-genres-template').tmpl({genres: genres}).appendTo('#content');
    },

    showThemes: function(themes) {
      $('#explore-themes-template').tmpl({themes: themes}).appendTo('#content');
    },

    showInstruments: function(instruments) {
      $('#explore-instruments-template').tmpl({instruments: instruments}).appendTo('#content');
    },

    showCounties: function(continents) {
      $('#explore-countries-template').tmpl({continents: continents}).appendTo('#content');
    },

    showMoods: function() {
      
    },

    showGenresPage: function () {
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getGenres(function(genres) {
        loader.remove();
        $('#explore-list-header-template').tmpl().appendTo('#content');
        museeka.views.explore.showGenres(genres);
        $('.header h1').text(l('Genres'));
        $('.genres h2').remove();
      });
    },

    showThemesPage: function() {
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getThemes(function(themes) {
        loader.remove();
        $('#explore-list-header-template').tmpl().appendTo('#content');
        museeka.views.explore.showThemes(themes);
        $('.header h1').text(l('Themes'));
        $('.themes h2').remove();
      });
    },

    showInstrumentsPage: function() {
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getInstrumentsType(function(instruments) {
        loader.remove();
        $('#explore-list-header-template').tmpl().appendTo('#content');
        museeka.views.explore.showInstruments(instruments);
        $('.header h1').text(l('Instruments'));
        $('.instruments h2').remove();
      });
    },

    showCountriesPage: function() {
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getContinents(function(continents) {
        loader.remove();
        $('#explore-list-header-template').tmpl().appendTo('#content');
        museeka.views.explore.showCounties(continents);
        $('.header h1').text(l('Country'));
        $('.continents h2').remove();
      });
    },


    showList: function(path, fn) {
      var self = this;
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getList(path, function(result) {
        loader.remove();
        $('#explore-list-template').tmpl({list: result}).appendTo('#content');
        museeka.views.explore.setBreadcrumbs(result);
        museeka.views.explore.updateLinks(result);
        $('a.a').removeClass('a');
        $('a.tab-all').addClass('a');
        if (result.tracks.length > 0) {
          $('#tracks-table-template').tmpl({
            tracks: result.tracks,
            columns: ['status', 'title', 'options', 'artist', 'album', 'duration']
          }).appendTo('#content .playlist');
          $('#content .playlist').addClass('draggable');
        }        
        
        museeka.viewHelpers.attachAlbumArt('large', '#content .album img', result.albums, function(album) {
          return album.id;
        });

        museeka.Lines.config('explore-artists', {
          selector: '#content .artists',
          lines: 2,
          items: $('#content .artists ul li')
        });

        museeka.Lines.update('explore-artists');

        museeka.Lines.config('explore-albums', {
          selector: '#content .albums',
          lines: 1,
          items: $('#content .albums ul li')
        });

        museeka.Lines.update('explore-albums');

        museeka.views.explore.removeTracks();
        museeka.views.explore.updateViewMoreLinks(result);
        PlayerUI.updateNowPlaying();
      });
    },

    clear: function(selector) {
      $(selector).empty();
    },

    list: function() {
      var listPath = '/featured/' + explorePath(arguments, '/');
      museeka.views.explore.showList(listPath);
    },

    latestAlbums: function() {
      museeka.views.explore.clear('#content');
      exploreApi.getLatestReleases(function(releases) {
        $('#latest-albums-template').tmpl({albums: releases.albums}).appendTo('#content');
        
        museeka.viewHelpers.attachAlbumArt('large', '#content .album img', releases.albums, function(album) {
          return album.id;
        });
        PlayerUI.updateNowPlaying();
      });
    },

    showMenu: function(items, e, elem) {
      var menu
        , css = {};
      menu = $('#explore-context-menu-template').tmpl({items: items});
      css.left = e.layerX;
      css.top = e.layerY;
      elem.append(menu);
      menu.css(css).fadeIn(300);
    },

    setBreadcrumbs: function(list) {
      var breadcrumbs;
      breadcrumbs = list.parent.replace(/\/featured/, 'explore');
      breadcrumbs = breadcrumbs.replace(/\//g, ' > ');
      $('#content .header .where').html(breadcrumbs);
    },

    showArtists: function(path) {
      var self = this;
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getList(path, function(result) {
        loader.remove();

        $('#explore-artists-template').tmpl({
          list: result
        }).appendTo('#content');

        $('a.a').removeClass('a');
        $('a.tab-artists').addClass('a');
        museeka.views.explore.setBreadcrumbs(result);
        museeka.views.explore.updateLinks(result);
      });
    },

    showAlbums: function(path) {
      var self = this;
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');
      exploreApi.getList(path, function(result) {
        loader.remove();

        $('#explore-albums-template').tmpl({
          list: result
        }).appendTo('#content');

        $('a.a').removeClass('a');
        $('a.tab-albums').addClass('a');
        museeka.views.explore.setBreadcrumbs(result);
        museeka.views.explore.updateLinks(result);

        museeka.viewHelpers.attachAlbumArt('large', '#content .album img', result.albums, function(album) {
          return album.id;
        });
        PlayerUI.updateNowPlaying();

      });
    },

    showTracks: function(path) {
      var self = this;
      museeka.views.explore.clear('#content');
      loader = $('#loader').tmpl().appendTo('#content');

      exploreApi.getList(path, function(result) {
        loader.remove();

        $('#explore-tracks-template').tmpl({
          list: result
        }).appendTo('#content');

        if (result.tracks.length > 0) {
          $('#tracks-table-template').tmpl({
            tracks: result.tracks,
            columns: ['status', 'title', 'options', 'artist', 'album', 'duration']
          }).appendTo('#content .playlist');
          $('#content .playlist').addClass('draggable');
        }

        $('a.a').removeClass('a');
        $('a.tab-tracks').addClass('a');
        museeka.views.explore.setBreadcrumbs(result);
        museeka.views.explore.updateLinks(result);
        PlayerUI.updateNowPlaying();

      });
    },

    updateLinks: function(result) {
      $('a.disable').removeClass('disable');
      if (result.albums.length == 0) {
        $('a.tab-albums').addClass('disable');
      }
      if (result.artists.length == 0) {
        $('a.tab-artists').addClass('disable');
      }
      if (result.tracks.length == 0) {
        $('a.tab-tracks').addClass('disable');
      }
    },

    // Show only 10 tracks
    removeTracks: function() {
     $('div.tracks .playlist tbody tr:eq(10)').nextAll('tr').hide();
    },

    updateViewMoreLinks: function(result) {
      var totalArtists
        , totalAlbums
        , totalTracks
        , showArtists
        , showAlbums
        , showTracks;

      totalArtists = result.artists.length;
      totalAlbums = result.albums.length;
      totalTracks = result.tracks.length;

      showArtists = $('div.artists li:visible').size();
      showAlbums = $('div.albums li:visible').size();
      showTracks = $('div.tracks tbody tr:visible').size();

      if (showArtists == totalArtists) {
        $('.artists a.view-more').hide();
      }

      if (showAlbums == totalAlbums) {
        $('.albums a.view-more').hide();
      }

      if (showTracks == totalTracks) {
        $('.tracks a.view-more').hide();
      }

    }

  };

  $('a.explore-instruments').live('click', function(e) {
    var $this = $(this)
     , data;
    e.preventDefault();
    $('div#explore-context-menu').remove();
    data = $this.parent().tmplItem().data;
    exploreApi.getInstrumentsByType(data.path, function(instruments) {
      museeka.views.explore.showMenu(instruments, e, $(e.target).parent());
    });
  });

  $('.continent').live('mouseenter', function(e) {
    $('.continent').attr('fill', '#D5D5D5');
    var $this = $(this);
    $this.attr('fill', '#312F30');
  });

  $('.continent').live('mouseleave', function(e) {
    var $this = $(this);
    $this.attr('fill', '#D5D5D5');
  });

  $('.continent').live('click', function(e) {
    var $this = $(this)
      , data
    $('div#explore-context-menu').remove();
    data = $this.tmplItem().data;
    exploreApi.getCountiesByContinent(data.path, function(countries) {
      museeka.views.explore.showMenu(countries, e, $('div.continents'));
    })
  });

  // Hide context menu
  $(document).click(function(e) {
    if (!$(e.target).parents('#explore-context-menu').size()) {
      $('#explore-context-menu').fadeOut(300, function() {
        $(this).remove();
      })
    }
  });
}(window));
