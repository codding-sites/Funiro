/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination, Parallax, Autoplay } from 'swiper/modules';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Базові стилі
import "../../scss/base/swiper.scss";
// Повний набір стилів з scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Повний набір стилів з node_modules
// import 'swiper/css';

// Ініціалізація слайдерів
function initSliders() {
	// Список слайдерів
	// Перевіряємо, чи є слайдер на сторінці
	if (document.querySelector('.slider-main')) { // Вказуємо склас потрібного слайдера
		// Створюємо слайдер
		new Swiper('.slider-main', { // Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation, Pagination, Parallax, Autoplay],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 32,
			autoHeight: true,
			speed: 800,
			parallax: true,
			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,
			//lazy: true,

			// Ефекти
			//effect: 'cube',
			autoplay: {
				disableOnInteraction: false,
				delay: 2500,
			},

			// Пагінація
			pagination: {
				el: '.controls-slider-main .controls-slider-main__dotts',
				clickable: true,
			},

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "вліво/вправо"
			navigation: {
				prevEl: '.main-slider__body .slider-arrows_prev',
				nextEl: '.main-slider__body .slider-arrows_next',
			},
			
			// Брейкпоінти
			breakpoints: {
				320: {
					autoplay: false,
				},
				992: {
					spaceBetween: 20,
					autoplay: true,
					autoplay: {
						disableOnInteraction: false,
						delay: 2500,
					},
				},
			},
			
			// Події
			on: {

			}
		});
	}

	if (document.querySelector('.rooms-slider')) { // Вказуємо склас потрібного слайдера
		// Створюємо слайдер
		new Swiper('.rooms-slider', { // Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation, Pagination, Parallax, Autoplay],
			observer: true,
			observeParents: true,
			slidesPerView: 'auto',
			spaceBetween: 24,
			autoHeight: true,
			speed: 800,
			parallax: true,
			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,
			//lazy: true,

			// Ефекти
			//effect: 'cube',
			autoplay: {
				disableOnInteraction: false,
				delay: 2500,
			},

			// Пагінація
			pagination: {
				el: '.rooms-slider__dotts',
				clickable: true,
			},

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "вліво/вправо"
			navigation: {
				prevEl: '.rooms-slider__arrows .slider-arrows_prev',
				nextEl: '.rooms-slider__arrows .slider-arrows_next',
			},

			// Брейкпоінти
			breakpoints: {
				320: {
					spaceBetween: 15,
					autoplay: false,
				},
				768: {
					autoplay: true,
					autoplay: {
						disableOnInteraction: false,
						delay: 2500,
					},
				},
				992: {
					spaceBetween: 24,
				},
			},
			
			// Події
			on: {

			}
		});
	}

	if (document.querySelector('.tips-slider')) { // Вказуємо склас потрібного слайдера
		// Створюємо слайдер
		new Swiper('.tips-slider', { // Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation, Pagination, Parallax, Autoplay],
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 32,
			autoHeight: true,
			speed: 800,
			//parallax: true,
			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,
			//lazy: true,

			// Ефекти
			//effect: 'cube',
			autoplay: {
				disableOnInteraction: false,
				delay: 2500,
			},

			// Пагінація
			pagination: {
				el: '.tips-slider__dotts',
				clickable: true,
			},

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "вліво/вправо"
			navigation: {
				prevEl: '.tips-slider__arrows .slider-arrows_prev',
				nextEl: '.tips-slider__arrows .slider-arrows_next',
			},
			// Брейкпоінти
			breakpoints: {
				320: {
					slidesPerView: 1.1,
					spaceBetween: 15,
					autoplay: false,
				},
				768: {
					slidesPerView: 2,
					autoplay: true,
					autoplay: {
						disableOnInteraction: false,
						delay: 2500,
					},
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 32,
				},
			},

			// Події
			on: {

			}
		});
	}
}

// Скролл на базі слайдера (за класом swiper scroll для оболонки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск ініціалізації слайдерів
	initSliders();
	// Запуск ініціалізації скролла на базі слайдера (за класом swiper_scroll)
	//initSlidersScroll();
});