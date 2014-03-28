(function() {
	'use strict';
	var view = Backbone.View.extend({
		events:{
			'click [data-type=on]':'lightOn',
			'click [data-type=off]':'lightOff',
			'click [data-type=blinkOn]':'blinkOn',
			'click [data-type=blinkOff]':'blinkOff',
			'change [name=pattern]':'onChangePattern'
		},
		el:'#switchbox',
		initialize:function(){
			this.light = new VincluLed(100,100);
			this.interval = 2000;
			this.volume = 0;
			this.$volumeSlider = this.$('[name=volume]');
			this.$intervaleSlider = this.$('[name=interval]');
			this.$patternSelect = this.$('[name=pattern]');
			this.onChangePattern();
			var watchDog = _.bind(function(){
				
				this.onVolumeChange();
				this.onBlinkIntervalChange();
			},this);
			
			this.watchDog = setInterval(watchDog,20);
			$('body').on('unload',_.bind(function(){
				this.lightOff();
			}));
		},
		lightOn:function(){
			this.light.on();
			this.light.setBrightness(this.volume);
		},
		lightOff:function(){
			this.light.off();
		},
		blinkOn:function(){
			var patternClass = VincluLed.patterns[this.pattern];
			var pattern = new patternClass();
			
			this.light.blinkOn(this.interval, pattern);
			
		},
		blinkOff:function(){
			this.light.blinkOff();
			
		},
		onVolumeChange:function(){
		
			var volume = this.$volumeSlider.val();
			this.volume = volume;
			if(this.light.isOn){
				this.light.setBrightness(volume);
			}
		},
		onBlinkIntervalChange:function(event){
		
			var exp = this.$intervaleSlider.val();
			var interval = Math.pow(2,exp) * 1000;
			this.interval = interval;
			if(this.light.pattern){
				this.light.pattern.setInterval(interval);
				
			}
		},
		onChangePattern:function(){
			this.pattern = this.$patternSelect.val();
			if(this.light.pattern){
				this.blinkOn();
				
			}
		}
	});
	$(function(){
		new view();
		
	});
})();