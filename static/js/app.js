'use strict';

var app = angular.module('translatr', []);

app.controller('translatrController', function ($scope, $http, $timeout) {
	$scope.locales = {
		'af': 'Afrikaans',
		'ar': 'Arabic',
		'az': 'Azerbaijani',
		'be': 'Belarusian',
		'bg': 'Bulgarian',
		'bn': 'Bengali',
		'bs': 'Bosnian',
		'ca': 'Catalan',
		'ceb': 'Cebuano',
		'cs': 'Czech',
		'cy': 'Welsh',
		'da': 'Danish',
		'de': 'German',
		'el': 'Greek',
		'en': 'English',
		'eo': 'Esperanto',
		'es': 'Spanish',
		'et': 'Estonian',
		'eu': 'Basque',
		'fa': 'Persian',
		'fi': 'Finnish',
		'fr': 'French',
		'ga': 'Irish',
		'gl': 'Galician',
		'gu': 'Gujarati',
		'ha': 'Hausa',
		'hi': 'Hindi',
		'hmn': 'Hmong',
		'hr': 'Croatian',
		'ht': 'Haitian Creole',
		'hu': 'Hungarian',
		'hy': 'Armenian',
		'id': 'Indonesian',
		'ig': 'Igbo',
		'is': 'Icelandic',
		'it': 'Italian',
		'iw': 'Hebrew',
		'ja': 'Japanese',
		'jw': 'Javanese',
		'ka': 'Georgian',
		'kk': 'Kazakh',
		'km': 'Khmer',
		'kn': 'Kannada',
		'ko': 'Korean',
		'la': 'Latin',
		'lo': 'Lao',
		'lt': 'Lithuanian',
		'lv': 'Latvian',
		'mg': 'Malagasy',
		'mi': 'Maori',
		'mk': 'Macedonian',
		'ml': 'Malayalam',
		'mn': 'Mongolian',
		'mr': 'Marathi',
		'ms': 'Malay',
		'mt': 'Maltese',
		'my': 'Myanmar (Burmese)',
		'ne': 'Nepali',
		'nl': 'Dutch',
		'no': 'Norwegian',
		'ny': 'Chichewa',
		'pa': 'Punjabi',
		'pl': 'Polish',
		'pt': 'Portuguese',
		'ro': 'Romanian',
		'ru': 'Russian',
		'si': 'Sinhala',
		'sk': 'Slovak',
		'sl': 'Slovenian',
		'so': 'Somali',
		'sq': 'Albanian',
		'sr': 'Serbian',
		'st': 'Sesotho',
		'su': 'Sundanese',
		'sv': 'Swedish',
		'sw': 'Swahili',
		'ta': 'Tamil',
		'te': 'Telugu',
		'tg': 'Tajik',
		'th': 'Thai',
		'tl': 'Filipino',
		'tr': 'Turkish',
		'uk': 'Ukrainian',
		'ur': 'Urdu',
		'uz': 'Uzbek',
		'vi': 'Vietnamese',
		'yi': 'Yiddish',
		'yo': 'Yoruba',
		'zh': 'Chinese',
		'zh-CN': 'Chinese (Simplified)',
		'zh-TW': 'Chinese (Traditional)',
		'zu': 'Zulu'
		};

		$scope.filteredLocales = {};
		angular.copy($scope.locales, $scope.filteredLocales);
		$scope.settings = {
      selectedLocales: {},
		  isLangUagePanelExpandable: true,
    };

		$('#text').focus();

		$scope.resetInput = function () {
			$scope.userText = '';
			$scope.settings.selectedLocales = {};
		};

		$scope.validateAndTranslate = function () {
			// List of selected locles, send them to backend, `l` to optimize request
			var l = [];

			angular.forEach($scope.settings.selectedLocales, function (value, key) {
				if (value) { l.push(key); }
			});
			$scope.isPositive = false;

			if (!$scope.userText) {
				$scope.errorText = 'Please enter valid text.';
				return;
			}

			if (!l.length) {
				$scope.errorText = 'Please select at leat one language.';
				return;
			}

			$scope.errorText = '';
			$scope.translatedText = {};
			$scope.isFetchingData = true;

			$scope.isPositive = true;
			$scope.errorText = 'Please wait, crunching latest data.';
			$http.post('', {userText: $scope.userText, l: l}).then(function (config) {
				$scope.errorText = '';
				$scope.isFetchingData = false;
				$scope.translatedText = config.data.translatedText;

				$timeout(function () {
					$('body, html').animate({scrollTop: document.getElementById('output').offsetTop}, 'slow');
				}, 0);

			}, //error
				function () {
					$scope.isFetchingData = false;
					$scope.isPositive = false;
					$scope.errorText = 'Something went wrong. Please try again.';
				})
			;
		};

		$scope.highlightTranslatedString = function (locale) {
	        var range;
	        if (document.selection) {
	            range = document.body.createTextRange();
	            range.moveToElementText(document.getElementById('selectedText-' + locale));
	            range.select();
	        } else if (window.getSelection) {
	            range = document.createRange();
	            range.selectNode(document.getElementById('selectedText-' + locale));
	            window.getSelection().addRange(range);
	        }
	    };

	    $scope.selectAll = function (e) {
	    	e.preventDefault();
	    	e.stopPropagation();

	    	angular.forEach($scope.locales, function (v, k) {
          $scope.settings.selectedLocales[k] = !$scope.isSelectAllClicked;
	    	});
	    	$scope.isSelectAllClicked = !$scope.isSelectAllClicked;
	    };

	    $scope.$watch('search', function (newSearchTerm, oldSearchTerm) {
	    	angular.copy($scope.locales, $scope.filteredLocales);
			angular.forEach($scope.locales, function (v, k) {
				newSearchTerm = newSearchTerm && newSearchTerm.toLowerCase();
				if (newSearchTerm && v.toLowerCase().indexOf(newSearchTerm) === -1) {
					delete $scope.filteredLocales[k];
				}
			});
	    });
});

app.$inject = [ '$scope', '$http', '$timeout' ];
