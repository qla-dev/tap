<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title> {{ $user->name }} {{ $user->title }}| tap.qla.dev - Digitalne Business Kartice</title>
    <meta name="description" content="{{ $user->about_me ? strip_tags($user->about_me) : 'Digitalna business kartica za ' . $user->name }}">
    <meta name="keywords" content="business, kartica, digital, {{ $user->name }}, {{ $user->title }}">
    <meta property="og:title" content="{{ $user->name }} {{ $user->title }}">
    <meta property="og:description" content="{{ $user->about_me ? strip_tags($user->about_me) : 'Digitalna business kartica za ' . $user->name }}">
    <meta property="og:image" content="{{ $user->profile_image ? asset($user->profile_image) : asset('images/main-img/profile.png') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $user->name }} {{ $user->title }}">
    <meta name="twitter:description" content="{{ $user->about_me ? strip_tags($user->about_me) : 'Digitalna business kartica za ' . $user->name }}">
    <meta name="twitter:image" content="{{ $user->profile_image ? asset($user->profile_image) : asset('images/main-img/profile.png') }}">
    <link rel="icon" href="{{ asset('images/favicon/favicon.svg') }}">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/magnific-popup.css') }}">
    <link rel="stylesheet" href="{{ asset('css/slick.css') }}">
    <link rel="stylesheet" href="{{ asset('css/cursor.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/media-query.css') }}">
</head>
<body>
	<div class="site-content">
		<!-- Preloader start -->
		<div class="preloader">
			<div class="darksoul-layout ">
				<div class="darksoul-grid">
					<div class="item1"></div>
					<div class="item2"></div>
					<div class="item4"></div>
					<div class="item3"></div>
				</div>
			</div>
		</div>
		<!-- Preloader end -->
		<!-- Bg animation start -->
		<div class="area">
			<ul class="circles">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<!-- Bg animation end -->
		<!-- Ceo content start -->
		<section id="ceo-main" class="ceo-content">
			<header class="header">
				<div class="header-content">
					<div class="header-logo">
						<a href="http://qla.dev/"><img src="{{ asset('images/logo-qla.png') }}" alt="logo" width="70"></a>
					</div>

				</div>
			</header>
			<div class="hero-section">
				<div class="bg-orange">
					<img src="{{ $user->cover_image ? asset($user->cover_image) : asset('images/main-img/hero-bg-img.png') }}" alt="bg-img" class="bg-img1" width="450">
					<img src="{{ asset('images/main-img/blue-bg.svg') }}" alt="bg-img" class="bg-img2" >
				</div>
			</div>
			<div class="profile-content">
				<div class="profile-sec">
					<div class="profile-img">
						<div class="oval-frame" style="width:100px;height:100px;background-image:url('{{ $user->profile_image ? asset($user->profile_image) : asset('images/main-img/profile.png') }}');background-size:cover;background-position:center;border-radius:50%;"></div>
					</div>
					<div class="profile-name" style="margin-top: 20px;">
						<h1 class="p-0">{{ $user->name }}</h1>
						<p>{{ $user->title }}</p>
					</div>
				</div>
			</div>
			<div class="social-icon-content container">
				@if(!empty($user->booking))
					<div class="social-icon-content-wrap">
						<a href="{{ $user->booking }}" target="_blank"><i class="fab fa-booking  mx-2"></i></a>
					</div>
				@endif
				@if(!empty($user->airbnb))
					<div class="social-icon-content-wrap">
						<a href="{{ $user->airbnb }}" target="_blank"><i class="fab fa-airbnb  mx-2"></i></a>
					</div>
				@endif
				@if(!empty($user->instagram))
					<div class="social-icon-content-wrap">
						<a href="{{ $user->instagram }}" target="_blank"><i class="fab fa-instagram  mx-2"></i></a>
					</div>
				@endif
				@if(!empty($user->phone_number))
					<div class="social-icon-content-wrap">
						<a href="tel:{{ $user->phone_number }}"><i class="fas fa-phone  mx-2"></i></a>
					</div>
				@endif
				@if(!empty($user->email))
					<div class="social-icon-content-wrap">
						<a href="mailto:{{ $user->email }}"><i class="fas fa-envelope  mx-2"></i></a>
					</div>
				@endif
				@if(!empty($user->google))
					<div class="social-icon-content-wrap">
						<a href="{{ $user->google }}" target="_blank"><i class="fab fa-google  mx-2"></i></a>
					</div>
				@endif
			</div>
			<div class="about-us container mt-30">
				<div class="about-us-wrap">
					<div class="about-title">
						<h2 class="background">O nama</h2>
					</div>
					<div class="about-content mt-10">
						{!! $user->about_me !!}
					</div>
				</div>
			</div>
<!--
			<div class="services-sec container mt-30">
				<div class="about-us-wrap">
					<div class="about-title">
						<h2 class="background">Naše usluge</h2>
					</div>
					<div class="services-content mt-10">
						<img src="{{ asset('images/services/services1.png') }}" alt="services-img" class="w-100">
						<h3 class="mt-15">Web dizajn i razvoj</h3>
						<p class="mt-5">Laoreet sit leo vitae eget convallis. Sodales id in sit maecenas vitae congue semper ullamcorper. Mi sollicitudin sed hac vulputate feugiat viverra sed sagittis in adipiscing tincidunt elementum.</p>	
					</div>
					<div class="services-content mt-10">
						<img src="{{ asset('images/services/services2.png') }}" alt="services-img" class="w-100">
						<h3 class="mt-15">UI/UX Dizajn</h3>
						<p class="mt-5">Eget nam amet hac nisi molestie facilisis amet elementum cras. Morbi vitae vitae risus leo eros adipiscing. Tellus amet id suspendisse interdum gravida molestie aliquam.</p>	
					</div>
					<div class="services-content mt-10">
						<img src="{{ asset('images/services/services3.png') }}" alt="services-img" class="w-100">
						<h3 class="mt-15">Video montaža i produkcija</h3>
						<p class="mt-5">Feugiat massa et vitae justo purus etiam montes pharetra pharetra. Non tincidunt ipsum netus magna tellus enim nunc mauris. Suspendisse quis donec at egestas.</p>	
					</div>
					<div class="services-content mt-10">
						<img src="{{ asset('images/services/services4.png') }}" alt="services-img" class="w-100">
						<h3 class="mt-15">Digitalni marketing</h3>
						<p class="mt-5">Id aliquam turpis donec vulputate etiam. Justo tortor faucibus aenean habitant. Aliquet dui nibh varius velit tincidunt faucibus sem. Ac faucibus in at diam ullamcorper interdum nulla.</p>	
					</div>
				</div>
			</div>

			<div class="appointment-sec container mt-30">
				<div class="appointment-us-wrap">
					<div class="about-title">
						<h2 class="background">Zakažite termin</h2>
					</div>
					<div class="appointment-bottom mt-10">
						<form class="appointment-form">
							<div class="appointment-date">
								<label class="info-person" for="datepicker">DATUM</label>
								<div class="input-wrapper mt-5">
									<span><img src="{{ asset('svg/date-icon.svg') }}" alt="date-icon-icon"></span>
									<input type="text" id="datepicker" class="no-spinners color-black" placeholder="Odaberite datum" required>
								</div>
							</div>
							<div class="appointment-date">
								<label class="info-person" for="datepicker">VRIJEME</label>
								<div class="input-wrapper mt-5">
									<span><img src="{{ asset('svg/time-icon.svg') }}" alt="date-icon-icon"></span>
									<select name="persons" class="custom-select w-100 border-0">
										<option>09:00</option>
										<option>10:00</option>
										<option>11:00</option>
										<option>12:00</option>
										<option>13:00</option>
										<option>14:00</option>
										<option>15:00</option>
										<option>16:00</option>
										<option>17:00</option>
										<option>18:00</option>
										<option>19:00</option>
										<option>20:00</option>
										<option>21:00</option>
										<option>22:00</option>
									</select>
								</div>
							</div>
						</form>
						<div class="view-product mt-20"> 
							<a href="javascript:void(0)">Zakažite termin</a>
						</div>
					</div>
				</div>
			</div>
-->
			<div class="gallery-sec mt-30">
				<div class="gallery-sec-wrap">
					<div class="about-title container">
						<h2 class="background">Galerija</h2>
					</div>
					<div class="gallery-bottom mt-10">
						<div class="gallery-item">
							<div class="gallery-box">
								<div class="gallery-img"> <img src="{{ asset('images/gallery/gallery1.png') }}" alt="gallery" class="w-100"> </div>
								<a href="{{ asset('images/gallery/gallery1.png') }}" class="img-zoom w-100"><div class="gallery-detail text-center"><img src="{{ asset('svg/plus-icon.svg') }}" alt="plus-icon"></div></a>
							</div>
						</div>
						<div class="gallery-item">
							<div class="gallery-box">
								<div class="gallery-img"> <img src="{{ asset('images/gallery/gallery2.png') }}" alt="gallery" class="w-100"> </div>
								<a href="{{ asset('images/gallery/gallery2.png') }}" class="img-zoom w-100"><div class="gallery-detail text-center"><img src="{{ asset('svg/plus-icon.svg') }}" alt="plus-icon"></div></a>
							</div>
						</div>
						<div class="gallery-item">
							<div class="gallery-box">
								<div class="gallery-img"> <img src="{{ asset('images/gallery/gallery3.png') }}" alt="gallery" class="w-100"> </div>
								<a href="{{ asset('images/gallery/gallery3.png') }}" class="img-zoom w-100"><div class="gallery-detail text-center"><img src="{{ asset('svg/plus-icon.svg') }}" alt="plus-icon"></div></a>
							</div>
						</div>
					</div>
				</div>
			</div>
<!--
			<div class="testimonial-sec container mt-30">
				<div class="testimonial-sec-wrap">
					<div class="about-title ">
						<h2 class="background">Iskustva klijenata</h2>
					</div>
					<div class="testimonial-bottom-slider mt-10">
						<div id="testimonial-slider" class="carousel slide">
							<div class="carousel-inner">
								<div class="carousel-item active">
									<div class="testimonial-content">
										<div class="testimonial-content-wrap">
											<div class="testimonial-img">
												<img src="{{ asset('images/main-img/testimonial1.png') }}" alt="testimonial-img">
											</div>
											<div class="client-name">
												<h3 >Cole Rich</h3>
												<p class="mt-5">Klijent</p>
											</div>
											<div class="quotes">
												<img src="{{ asset('svg/quotes-icon.svg') }}" alt="quotes-icon">
											</div>
										</div>
										<div class="rating-sec">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
										</div>
										<div class="rating-para mt-10">
											<p>Lobortis etiam lectus mollis vulputate non egestas. Non aliquet facilisis leo tellus vulputate malesuada et tellus. Maecenas arcu non ultrices non est lorem at risus. Imperdiet vulputate feugiat morbi faucibus vulputate fermentum blandit faucibus vitae.</p>
										</div>
									</div>
								</div>
								<div class="carousel-item">
									<div class="testimonial-content">
										<div class="testimonial-content-wrap">
											<div class="testimonial-img">
												<img src="{{ asset('images/main-img/testimonial1.png') }}" alt="testimonial-img">
											</div>
											<div class="client-name">
												<h3>Cole Rich</h3>
												<p class="mt-5">Klijent</p>
											</div>
											<div class="quotes">
												<img src="{{ asset('svg/quotes-icon.svg') }}" alt="quotes-icon">
											</div>
										</div>
										<div class="rating-sec">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
											<img src="{{ asset('svg/star-icon.svg') }}" alt="star-icon">
										</div>
										<div class="rating-para mt-10 ">
											<p>Lobortis etiam lectus mollis vulputate non egestas. Non aliquet facilisis leo tellus vulputate malesuada et tellus. Maecenas arcu non ultrices non est lorem at risus. Imperdiet vulputate feugiat morbi faucibus vulputate fermentum blandit faucibus vitae.</p>
										</div>
									</div>
								</div>
							</div>
							<button class="carousel-control-prev mt-15" type="button" data-bs-target="#testimonial-slider" data-bs-slide="prev">
								<span class="carousel-control-prev-icon" aria-hidden="true"></span>
							</button>
							<button class="carousel-control-next mt-15" type="button" data-bs-target="#testimonial-slider" data-bs-slide="next">
								<span class="carousel-control-next-icon" aria-hidden="true"></span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="inquiry-sec container mt-30">
				<div class="inquiry-sec-wrap">
					<div class="about-title">
						<h2 class="background">Upiti</h2>
					</div>
					<div class="inquiry-bottom-content">
						<form class="inquiry-form">
							<div>
								<label class="info-person mt-15" for="username">IME</label>
								<div class="input-wrapper-form mt-5">
									<span><img src="{{ asset('images/inquery/person-icon.svg') }}" alt="person-icon"></span>
									<input type="text" id="username" placeholder="Vaše ime" autocomplete="off">
								</div>
							</div>
							<div>
								<label class="info-person mt-15" for="phone-number">Unesite broj telefona</label>
								<div class="input-wrapper-form mt-5">
									<span><img src="{{ asset('images/inquery/call-icon.svg') }}" alt="person-icon"></span>
									<input type="number" id="phone-number" placeholder="Vaš broj telefona" autocomplete="off">
								</div>
							</div>
							<div>
								<label class="info-person mt-15" for="email">Email adresa</label>
								<div class="input-wrapper-form mt-5">
									<span><img src="{{ asset('images/inquery/mail-icon.svg') }}" alt="person-icon"></span>
									<input type="text" id="email" placeholder="Vaša email adresa" autocomplete="off">
								</div>
							</div>
							<div>
								<label class="info-person mt-15" for="email">Vaša poruka</label>
								<div class="input-wrapper-form textarea-txt mt-5">
									<textarea rows="4" cols="50" placeholder="Upišite poruku ovdje..." class="custom-textarea border-0" id="textarea"></textarea>
								</div>
							</div>
						</form>
					</div>
					<div class="view-product mt-20"> 
						<a href="javascript:void(0)">Pošaljite poruku</a>
					</div>
				</div>	
			</div>
-->
			<div class="contact-sec container mt-30">
				<div class="contact-sec-wrap">
					<div class="about-title  ">
						<h2 class="background">Kontaktirajte nas</h2>
						<h3 class="d-none">Skriveno</h3>
					</div>
					<div class="contact-bottom-sec">
						<div class="contact-details mt-10">
							<div class="contact-icon">
								<img src="{{ asset('images/contact/mail-icon.svg') }}" alt="mail-icon">
							</div>
							<div class="contact-content">
								<h4 class="p-0">Email</h4>
								<a href="mailto:{{ $user->email }}"><p class="mt-10">{{ $user->email }}</p></a>
							</div>
						</div>
						@if(!empty($user->phone_number))
						<div class="contact-details mt-10">
							<div class="contact-icon">
								<img src="{{ asset('images/contact/call-icon.svg') }}" alt="call-icon">
							</div>
							<div class="contact-content">
								<h4  class="p-0">Broj telefona</h4>
								<a href="tel:{{ $user->phone_number }}"><p class="mt-10">{{ $user->phone_number }}</p></a>
							</div>
						</div>
						@endif
						@if(!empty($user->office_number))
						<div class="contact-details mt-10">
							<div class="contact-icon">
								<img src="{{ asset('images/contact/office.svg') }}" alt="office-icon">
							</div>
							<div class="contact-content">
								<h4  class="p-0">Broj apartmana</h4>
								<a href="tel:{{ $user->office_number }}"><p class="mt-10">{{ $user->office_number }}</p></a>
							</div>
						</div>
						@endif
						@if(!empty($user->office_address))
						<div class="contact-details mt-10">
							<div class="contact-icon">
								<img src="{{ asset('images/contact/location.svg') }}" alt="location-icon">
							</div>
							<div class="contact-content">
								<h4  class="p-0">Adresa kancelarije</h4>
								<p class="mt-10">{{ $user->office_address }}</p>
							</div>
						</div>
						@endif
						<div class="contact-details mt-10">
							<div class="contact-icon">
								<img src="{{ asset('images/contact/clock.svg') }}" alt="clock-icon">
							</div>
							<div class="contact-content">
								<h4  class="p-0">Radno vrijeme</h4>
								<div class="contact-time-list mt-10">
									@php
										$work_hours = $user->work_hours ?? [
											'Ponedjeljak' => '09:00 - 22:00',
											'Utorak' => '09:00 - 22:00',
											'Srijeda' => '09:00 - 22:00',
											'Četvrtak' => '09:00 - 22:00',
											'Petak' => '09:00 - 22:00',
											'Subota' => '09:00 - 22:00',
											'Nedjelja' => 'Zatvoreno'
										];
									@endphp
									@foreach($work_hours as $day => $hours)
									<div class="contact-list">
										<span class="days-txt">{{ $day }}</span>
										<span class="time-txt">{{ $hours }}</span>
									</div>
									@endforeach
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="map-sec container mt-30">
				<div class="map-img">
					@if(!empty($user->map_location))
						<iframe src="{{ $user->map_location }}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
					@else
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5972.947970483601!2d-74.11083001911878!3d41.53733348863559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd2ec0808761b3%3A0x4c7e057168f91e51!2s121%20Parkview%20St%2C%20Newburgh%2C%20NY%2012550%2C%20USA!5e0!3m2!1sen!2sin!4v1726220356539!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
					@endif
				</div>
			</div>
			<div class="add-to-contact container mt-30">
				<div class="add-to-contact-wrap">
					<a href="javascript:void(0)" class="scan-btn" data-bs-toggle="modal" data-bs-target="#product-modal">
						<img src="{{ asset('images/bottom-sec/scan-icon.svg') }}" alt="scan-icon">
					</a>
					<a href="javascript:void(0)" class="scan-btn" data-bs-toggle="modal" data-bs-target="#share-media-modal">
						<img src="{{ asset('images/bottom-sec/share-icon.svg') }}" alt="share-icon">
					</a>
					<a href="javascript:void(0)" class="add-to-btn">
						<div class="add-to-btn-sec">
							<div class="add-txt">Dodaj u kontakte</div>
							<div class="plus-btn"><img src="{{ asset('images/bottom-sec/plus-icon.svg') }}" alt="plus-icon"></div>
						</div>
					</a>
				</div>		
			</div>
			<div class="footer mt-10" style="margin-bottom: 70px;">
				<p>Želite sličnu Business Kartice za Vaš biznis? Kontaktirajte nas! <a href="http://qla.dev/"><img src="{{ asset('images/logo-qla.png') }}" alt="logo" width="50"></a></p>
			</div>
		</section>
		<!--  Ceo content end -->
		<!--  Scan modal start -->
		<div class="modal fade" id="product-modal" tabindex="-1"  aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div class="scan-content">
							<div class="scanner">
								<img src="{{ asset('images/main-img/scanner-img.png') }}" alt="scanner-img" class="">
							</div>
							<div class="scan-txt mt-20">
								<p>Scan me</p>
							</div>
						</div>
						<div class="qr-btn mt-30">
							<div class="btn1">
								<a href="javascript:void(0)">Download</a>
							</div>
							<div class="btn1">
								<a href="javascript:void(0)">Share</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--  Scan modal end -->
		<!--  Share modal start -->
		<div class="modal fade" id="share-media-modal" tabindex="-1"  aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Podijeli na</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div class="social-media-content">
							<div class="social-media-img">
								<a href="https://www.facebook.com/" target="_blank"><img src="{{ asset('images/social-icon/icon2.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="https://www.instagram.com/" target="_blank"><img src="{{ asset('images/social-icon/icon3.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="https://web.whatsapp.com/" target="_blank"><img src="{{ asset('images/social-icon/icon4.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="https://www.linkedin.com/" target="_blank"><img src="{{ asset('images/social-icon/icon5.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="https://x.com/" target="_blank"><img src="{{ asset('images/social-icon/icon6.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="https://web.telegram.org/a/" target="_blank"><img src="{{ asset('images/social-icon/icon7.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="https://analytics.pinterest.com/login/" target="_blank"><img src="{{ asset('images/social-icon/icon10.svg') }}" alt="social-icon"></a>
							</div>
							<div class="social-media-img">
								<a href="mailto:jordan.smith@mail.com" target="_blank"><img src="{{ asset('images/social-icon/icon9.svg') }}" alt="social-icon"></a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--  Share modal end -->
	</div>
	<script src="{{ asset('js/jquery.min.js') }}"></script>
	<script src="{{ asset('js/bootstrap.bundle.min.js') }}"></script>
	<script src="{{ asset('js/slick.min.js') }}"></script>
	<script src="{{ asset('js/jquery.ui.min.js') }}"></script>
	<script src="{{ asset('js/datepiker.js') }}"></script>
	<script src="{{ asset('js/jquery.magnific-popup.min.js') }}"></script>
	<script src="{{ asset('js/gallery.js') }}"></script>
	<script src="{{ asset('js/cursor.js') }}"></script>
	<script src="{{ asset('js/custom.js') }}"></script>
</body>
</html>