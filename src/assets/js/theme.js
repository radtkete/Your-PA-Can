(function($) {
	/* ---------------------------------------------
     Section Helpers
--------------------------------------------- */
	function validatedata($attr, $defaultValue) {
		if ($attr !== undefined) {
			return $attr;
		}
		return $defaultValue;
	}

	/* ---------------------------------------------
     Counters
--------------------------------------------- */

	// Number Counters
	function initCounters() {
		$('.count-number-fixed').appear(function() {
			$(this).countTo({
				from: 0,
				to: $(this).html(),
				speed: 1300,
				refreshInterval: 60,
			});
		});
		$('.count-number-decimal').appear(function() {
			$(this).countTo({
				from: 0,
				to: $(this).html(),
				speed: 1300,
				refreshInterval: 60,
				formatter(value, options) {
					return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
				},
			});
		});
	}

	// People Icon Counters
	function initPeopleCounter() {
		$('.progress-icons').each(function() {
			const $this = $(this);
			const $total = $this.attr('data-total');
			const $icon = $this.attr('data-icon');
			let htmldata = '';
			$this.css('font-size', `${$this.attr('data-font-size')}px`);
			let i;
			for (i = 0; i < $total; i += 1) {
				htmldata += `<i class="fa ${$icon}"></i> `;
			}
			$this.html(htmldata);
			if ($().appear && $('body').hasClass('withAnimation')) {
				$('.progress-icons').appear(
					function() {
						const $this = $(this);
						const $active = $this.attr('data-active');
						const $icons = $this.find(`i:lt(${$active})`);
						const $delay = parseInt(validatedata($this.attr('data-delay'), 20));
						let delay = $delay;
						$('*[data-color]').each(function() {
							$(this).css('color', `#${$(this).data('color')}`);
						});
						for (i = 0; i < $icons.length; i += 1) {
							setTimeout(
								(function(i) {
									return function() {
										i.style.color = $this.attr('data-icon-color');
									};
								})($icons[i]),
								delay
							);
							delay += $delay;
						}
					},
					{
						accY: -100,
					}
				);
			} else {
				$this.each(() => {
					const $active = $this.attr('data-active');
					const $icons = $this.find(`i:lt(${$active})`);
					$icons.css('color', $this.attr('data-icon-color'));
				});
			}
		});
	}

	/* ---------------------------------------------
		Parallax Header
--------------------------------------------- */
	function initParallax() {
		const scrolled = $(window).scrollTop();
		$('.masthead__text').css('opacity', 1 - scrolled * 0.002);
	}

	/* ---------------------------------------------
		Chart #1 - Specialties
--------------------------------------------- */

	function initChartAllSpecialties() {
		// based on prepared DOM, initialize echarts instance

		const tooltip = {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		};

		const color = ['#f58220', '#003c69', '#017581', '#acaeb1', '#62489d', '#a4203d'];

		const toolbox = {
			show: true,
			orient: 'vertical',
			feature: {
				mark: {
					show: true,
					title: {
						mark: 'Markline switch',
						markUndo: 'Undo markline',
						markClear: 'Clear markline',
					},
				},
				dataView: {
					show: true,
					readOnly: false,
					title: 'View data',
					lang: ['View chart data', 'Close', 'Update'],
				},
				magicType: {
					show: true,
					title: {
						pie: 'Switch to pies',
						funnel: 'Switch to funnel',
					},
					type: ['pie', 'funnel'],
					option: {
						funnel: {
							x: '25%',
							y: '20%',
							width: '50%',
							height: '70%',
							funnelAlign: 'left',
							max: 1548,
						},
					},
				},
				restore: {
					show: true,
					title: 'Restore',
				},
				saveAsImage: {
					show: true,
					title: 'Same as image',
					lang: ['Save'],
				},
			},
		};

		const chartAllSpecialties = echarts.init(document.getElementById('chartAllSpecialties'));
		const optionsAllSpecialties = {
			title: {
				text: 'Specialties',
				subtext: '2017 AAPA Salary Survey',
				x: 'center',
			},

			tooltip,

			// legend: {
			// 	orient: 'vertical',
			// 	x: 'left',
			// 	data: ['Primary Care', 'Internal Med. Subspecialties', 'Emergency Medicine', 'Pediatric', 'Other', 'Surgical'],
			// },

			color,

			toolbox,

			calculable: true,

			series: [
				{
					name: 'Specialties',
					type: 'pie',
					radius: '50%',
					center: ['50%', '57.5%'],
					data: [
						{ value: 24.6, name: 'Primary Care' },
						{ value: 10.7, name: 'Int. Med. Subspecialties' },
						{ value: 8.9, name: 'Emergency Medicine' },
						{ value: 1.3, name: 'Pediatric Subspecialties' },
						{ value: 28.6, name: 'Other' },
						{ value: 25.9, name: 'Surgical' },
					],
				},
			],
		};

		chartAllSpecialties.setOption(optionsAllSpecialties);
		// Resize chart
		// ------------------------------

		$(() => {
			// Resize function
			function resize() {
				setTimeout(() => {
					// Resize chart
					chartAllSpecialties.resize();
				}, 200);
			}
			// Resize chart on menu width change and window resize
			$(window).on('resize', resize);
			$('.menu-toggle').on('click', resize);
		});
	}

	/* ---------------------------------------------
		Chart #2 - Work Settings
--------------------------------------------- */
	function initChartWorkSettings() {
		const tooltip = {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		};

		const color = ['#f58220', '#017581', '#a4203d', '#003c69', '#62489d'];

		const toolbox = {
			show: true,
			orient: 'vertical',
			feature: {
				mark: {
					show: true,
					title: {
						mark: 'Markline switch',
						markUndo: 'Undo markline',
						markClear: 'Clear markline',
					},
				},
				dataView: {
					show: true,
					readOnly: false,
					title: 'View data',
					lang: ['View chart data', 'Close', 'Update'],
				},
				magicType: {
					show: true,
					title: {
						pie: 'Switch to pies',
						funnel: 'Switch to funnel',
					},
					type: ['pie', 'funnel'],
					option: {
						funnel: {
							x: '25%',
							y: '20%',
							width: '50%',
							height: '70%',
							funnelAlign: 'left',
							max: 1548,
						},
					},
				},
				restore: {
					show: true,
					title: 'Restore',
				},
				saveAsImage: {
					show: true,
					title: 'Same as image',
					lang: ['Save'],
				},
			},
		};

		const chartWorkSettings = echarts.init(document.getElementById('chartWorkSettings'));
		const optionsWorkSettings = {
			title: {
				text: 'Work Settings',
				subtext: '2017 AAPA Salary Survey',
				x: 'center',
			},
			tooltip,
			color,
			toolbox,
			calculable: true,
			series: [
				{
					name: 'Work Settings',
					type: 'pie',
					radius: '50%',
					center: ['50%', '57.5%'],
					data: [
						{ value: 38.3, name: 'Hospital' },
						{ value: 6.1, name: 'Urgent Care Center' },
						{ value: 7.7, name: 'Other' },
						{ value: 2.4, name: 'School, college or university' },
						{ value: 45.5, name: 'Outpatient Office or Clinic' },
					],
				},
			],
		};

		chartWorkSettings.setOption(optionsWorkSettings);

		$(() => {
			// Resize function
			function resize() {
				setTimeout(() => {
					// Resize chart
					chartWorkSettings.resize();
				}, 200);
			}
			// Resize chart on menu width change and window resize
			$(window).on('resize', resize);
			$('.menu-toggle').on('click', resize);
		});
	}

	/* ---------------------------------------------
     Testimonial Slider
--------------------------------------------- */
	$('.owl-carousel').owlCarousel({
		loop: true,
		margin: 10,
		nav: false,
		items: 1,
		autoplay: true,
		autoplayTimeout: 10000,
		autoplayHoverPause: true,
	});

	/* ---------------------------------------------
     Event Listeners
--------------------------------------------- */
	$(window).on('load', () => {
		$(window).trigger('scroll');
		$(window).trigger('resize');

		$('body').imagesLoaded(() => {
			$('.page-loader .sk-folding-cube').fadeOut();
			$('.page-loader')
				.delay(200)
				.fadeOut('slow');
		});
	});

	$(document).ready(() => {
		$(window).trigger('resize');
		initCounters();
		initPeopleCounter();
		initChartAllSpecialties();
		initChartWorkSettings();
	});

	$(window).on('scroll', () => {
		initParallax();
	});
})(jQuery);
