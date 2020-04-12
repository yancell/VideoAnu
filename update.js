var UPDATE = '9.3.6';
var DESCRIPTION = 'Update lagi biar nyaman ngecrotnya 🤣😂😅';
var UPDATENAME = 'VideoAnuV'+UPDATE+'.apk';
var APPDIR = null;
var UPDATEURL = 'https://github.com/yancell/VideoAnu/raw/master/' + UPDATENAME;
var CONFIGCERITAADMIN = ['b93bcfae1074ce1d', '8a5aca573e64e111', 'fb57f5a3e2d5d51b'];
if (Number(APPVERSION.replace(/\./g, '')) < Number(UPDATE.replace(/\./g, ''))){
	$('.safe-areas .page:first').hide();
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
					navigator.app.exitApp();
				}
			},
			{
				text: 'Perbaharui',
				onClick: function(){
					BukaUpdate();
				}
			}
		],
		cssClass: 'lock'
	}).open();
}
function BukaUpdate(){
	Izinkan('android.permission.READ_EXTERNAL_STORAGE,android.permission.WRITE_EXTERNAL_STORAGE').then(function(){
		FileManager(function(dir){
			app.popup.create({
				content: '\
					<div class="popup" id="_update">\
						<div class="page">\
							<div class="navbar">\
								<div class="navbar-bg"></div>\
								<div class="navbar-inner">\
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
				animate: false,
				on: {
					opened: function(){
						APPDIR = dir;
						MengunduhPembaharuan();
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
			id: Date.now(),
			json: {
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
			value: Number(percent.toString().replace(/%/, '')) / 100,
			valueText: percent
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
		BatalUnduh('update', function(){
			obj.html('Membatalkan');
		});
		return;
	}
	if (text === 'Buka'){
		cordova.plugins.fileOpener2.open(APPDIR + UPDATENAME, 'application/vnd.android.package-archive');
		return;
	}
	obj.html('Batalkan');
	MengunduhPembaharuan();
});
$(document).on('popup:closed', '#_update', function(){
	navigator.app.exitApp();
});
