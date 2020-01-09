var UPDATE = '9.2.0';
var DESCRIPTION = 'Update lagi biar nyaman ngecrotnya 🤣😂😅<br/>NB: Kalau gagal dipasang ? silahkan hapus dulu aplikasi lamanya';
var UPDATEURL = 'https://firebasestorage.googleapis.com/v0/b/pesan-248ae.appspot.com/o/VideoAnuV'+UPDATE+'.apk?alt=media';
var UPDATENAME = 'VideoAnuV'+UPDATE+'.apk';
var APPDIR = null;
if (APPVERSION !== UPDATE){
	$('.page:first').hide();
	var update = setInterval(function(){
		if (typeof DB !== 'undefined'){
			clearInterval(update);
			BukaDialogUpdate();
		}
	}, 1000);
}
function BukaDialogUpdate(){
	app.dialog.create({
		title: 'Pembaharuan',
		text: 'Pembaharuan tersedia versi ' + UPDATE,
		animate: false,
		buttons: [
			{
				text: 'Nanti',
				onClick: function(){
					if ($('#update').length === 0) $('.page:first .right').append('<a class="link icon-only" id="update"><i class="icon material-icons">system_update_alt</i></a>');
				}
			},
			{
				text: 'Perbaharui',
				onClick: function(){
					BukaUpdate();
				}
			}
		]
	}).open();
}
function BukaUpdate(){
	Izinkan('android.permission.READ_EXTERNAL_STORAGE,android.permission.WRITE_EXTERNAL_STORAGE').then(function(){
		FileManager(function(dir){
			var popup = $('#_update');
			if (popup.length > 0){
				if (!popup.is(':hidden')){
					app.popup.close(popup);
					var open = setInterval(function(){
						if ($(popup).length > 0){
							clearInterval(open);
							app.popup.open(popup);
						}
					}, 200);
					return;
				}
				app.popup.open(popup);
				return;
			}
			app.popup.create({
				content: '\
					<div class="popup" id="_update">\
						<div class="page">\
							<div class="navbar">\
								<div class="navbar-inner sliding">\
									<div class="left">\
										<a class="link" id="keluar">\
											<i class="icon icon-back"></i>\
											<span class="if-not-md">Back</span>\
										</a>\
									</div>\
									<div class="title">Pembaharuan V'+UPDATE+'</div>\
								</div>\
							</div>\
							<div class="page-content">\
								<div class="text-align-center">\
									<div class="gauge demo-gauge" style="margin-top: 20px;"></div>\
								</div>\
								<div class="block">\
									<div>'+DESCRIPTION+'</div>\
									<p class="row">\
										<button class="col button button-fill">Batalkan</button>\
									</p>\
								</div>\
							</div>\
						</div>\
					</div>\
				',
				on: {
					opened: function(){
						if (UNDUH.indexOf('update') === -1){
							navigator.vibrate(100);
							APPDIR = dir;
							MengunduhPembaharuan();
						}
					},
					closed: function(popup){
						var object = $(popup.el);
						if ($('#update').length === 0) $('.page:first .right').append('<a class="link icon-only" id="update"><i class="icon material-icons">system_update_alt</i></a>');
						setTimeout(function(){
							object.appendTo('.safe-areas');
						}, 100);
					}
				}
			}).open();
		});
	});
}
function MengunduhPembaharuan(){
	var obj = $('#_update .button-fill');
	if (obj.text() === 'Buka') return;
	var gauge = app.gauge.create({
		el: '.demo-gauge',
		type: 'circle',
		value: 0,
		size: 250,
		borderColor: '#2196f3',
		borderWidth: 10,
		valueText: '0%',
		valueFontSize: 41,
		valueTextColor: '#2196f3',
		labelText: 'Mengunduh sianu',
	});
	obj.html('Batalkan');
	Unduh({
		url: UPDATEURL,
		dir: APPDIR,
		name: UPDATENAME,
		id: 'update'
	}, function(url){
		cordova.plugins.notification.local.schedule({
			title: 'Berhasil mengunduh sianu',
			text: 'klik untuk memasang',
			id: 1,
			priority: 10,
			json: {
				jenis: 'pasang',
				url: url,
				mime: 'application/vnd.android.package-archive'
			},
			icon: 'res://mipmap/ic_launcher'
		});
		obj.html('Buka');
		gauge.update({
			value: 100,
			valueText: '100%'
		});
	}, function(percent){
		gauge.update({
			value: percent / 100,
			valueText: percent + '%'
		});
	}, function(error){
		if (error.code !== 4){
			MengunduhPembaharuan();
			return;
		}
		gauge.update({
			value: 0 / 100,
			valueText: '0%'
		});
		obj.html('Perbaharui');
	});
}
$(document).on('click', '#_update .button-fill', function(){
	var obj = $(this);
	var text = obj.text();
	if (text === 'Membatalkan') return;
	if (text === 'Batalkan'){
		app.dialog.create({
			title: 'Batalkan',
			text: 'Yakin mau membatalkan unduhan ini ?',
			animate: false,
			buttons: [
				{
					text: 'Tidak'
				},
				{
					text: 'Batalkan',
					onClick: function(){
						UNDUH = UNDUH.filter(function(v){
							return v !== 'update';
						});
						obj.html('Membatalkan');
					}
				}
			]
		}).open();
		return;
	}
	if (text === 'Buka'){
		cordova.plugins.fileOpener2.open(APPDIR + UPDATENAME, 'application/vnd.android.package-archive');
		return;
	}
	obj.html('Batalkan');
	MengunduhPembaharuan();
});
$(document).on('click', '#update', function(){
	if ($('#_update').length > 0) app.popup.open('#_update');
	else BukaDialogUpdate();
});
